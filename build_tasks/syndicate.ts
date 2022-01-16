// Create syndication links for new articles that don't already have them.
// Most of this will probably get rolled out into a separate module,
// but it's needed here first.

import path from "path";
import fg from "fast-glob";
import * as fs from "fs-extra";
import axios from "axios";
import matter from "gray-matter";
import { login } from "masto";
import TwitterApi from "twitter-api-v2";

const CONTENT_ROOT = "src/content";
const ROOT_URL = "https://randomgeekery.org";
const TWITTER_USERNAME = "brianwisti";

interface Metadata {
  [key: string]: any;
}

interface Article {
  section: string;
  title: string;
  date: Date;
  permalink: string;
  tags: string[];
  description?: string;
  posseRecord: Metadata;
}

type ArticleList = Article[];

function getEnvVariable(name: string): string {
  const value = process.env[name];

  if (value === undefined) {
    throw `Missing environment variable '${name}`;
  }

  return value;
}

// Fairly specific to how I do tags on my site
function asSyndicationTag(tag: string) {
  return (
    "#" +
    tag
      .split(/\W/)
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join("")
  );
}

function composeAnnouncement(article: Article): string {
  const opener =
    article.description === undefined
      ? `I wrote a ${article.section}:`
      : article.description;

  const syndicationTags = article.tags
    .slice(0, 3)
    .map((tag) => asSyndicationTag(tag));
  syndicationTags.push("#Blog");
  const articleUrl = getArticleURL(article);
  const announcement = `${opener}

${article.title}

${syndicationTags.join(" ")}

${articleUrl}
`;
  return announcement;
}

function getArticleURL(article: Article, rootUrl: string = ROOT_URL) {
  return `${rootUrl}${article.permalink}`;
}

async function getArticles(
  posseRecords: Metadata,
  contentRoot: string = CONTENT_ROOT
): Promise<ArticleList> {
  const contentGlob = path.join(contentRoot, "{post,note}/**/*.md");
  const contentPaths = await fg(contentGlob);

  let articles = contentPaths.map((contentPath) => {
    const contentText = fs.readFileSync(contentPath, {
      encoding: "utf8",
      flag: "r",
    });
    const { data } = matter(contentText);
    const { title, tags, date, description } = data;
    const permalink =
      path.dirname(contentPath.replace("src/content", "")) + "/";
    const section = permalink.split("/")[1];
    const posseRecord =
      posseRecords[permalink] === undefined ? {} : posseRecords[permalink];

    return {
      title,
      date,
      tags,
      description,
      permalink,
      section,
      posseRecord,
    };
  });

  articles.sort((a: Article, b: Article) =>
    a.date.valueOf() < b.date.valueOf() ? 1 : -1
  );
  return articles;
}

function getLatestSyndicatedArticle(articles: ArticleList): Article {
  // articles are already sorted in reverse order of date,
  // so the first syndicated article in the list is what we want
  const syndicatedArticles = articles.filter(
    (a: Article) => Object.entries(a.posseRecord).length > 0
  );

  if (syndicatedArticles.length === 0) {
    throw "Where did all our posseData go?";
  }

  return syndicatedArticles[0];
}

function getUnsyndicatedArticles(articles: ArticleList): ArticleList {
  // Look for *new* unsyndicated articles, because I wasn't tweeting in 2005.
  const latestSyndicationDate = getLatestSyndicatedArticle(articles).date;
  console.log(
    `latest syndicated article has date: ${latestSyndicationDate} (${latestSyndicationDate.valueOf()})`
  );

  const unsyndicated = articles.filter(
    (article) =>
      article.date.valueOf() > latestSyndicationDate.valueOf() &&
      Object.entries(article.posseRecord).length === 0
  );

  return unsyndicated;
}

async function isPublished(article: Article): Promise<boolean> {
  const url = getArticleURL(article);

  return axios
    .head(url)
    .then(function (response) {
      return true;
    })
    .catch(function (error) {
      if (error.response && error.response.status === 404) {
        return false;
      }

      throw error;
    });
}

async function syndicateToMastodon(announcementText: string): Promise<string> {
  const instanceUrl = getEnvVariable("MASTO_URL");
  const accessToken = getEnvVariable("MASTO_TOKEN");

  const masto = await login({
    url: instanceUrl,
    accessToken: accessToken,
  });
  console.log(masto);

  const status = await masto.statuses.create({
    status: announcementText,
    visibility: "public",
  });
  console.log(status);

  return status.uri;
}

async function syndicateToTwitter(announcementText: string): Promise<string> {
  const appKey = getEnvVariable("TWITTER_API_KEY");
  const appSecret = getEnvVariable("TWITTER_API_SECRET");
  const accessSecret = getEnvVariable("TWITTER_ACCESS_SECRET");
  const accessToken = getEnvVariable("TWITTER_ACCESS_TOKEN");

  const twitterClient = new TwitterApi({
    appKey,
    appSecret,
    accessToken,
    accessSecret,
  });
  const rwClient = twitterClient.readWrite;
  const status = await rwClient.v1.tweet(announcementText);
  const idStr = status.id_str;

  return `https://twitter.com/${TWITTER_USERNAME}/status/${idStr}`;
}

async function main() {
  // First we gather the SyndicatedArticles we already know about.
  let posseRecords = require("../src/_data/posse.json");
  const articles = await getArticles(posseRecords, CONTENT_ROOT);

  // next we find the newest unsyndicated post or note
  const unsyndicatedArticles = getUnsyndicatedArticles(articles);

  if (unsyndicatedArticles.length == 0) {
    console.log("No syndication needed");
    return;
  }

  const newestArticle = unsyndicatedArticles[0];
  console.log(newestArticle.date.valueOf());
  console.log(
    `newest article has date: ${
      newestArticle.date
    } (${newestArticle.date.valueOf()})`
  );

  // then we make sure that post or note has been published to the site

  if (!(await isPublished(newestArticle))) {
    console.log(`${newestArticle.permalink} is not published yet!`);
    return;
  }
  const announcement = composeAnnouncement(newestArticle);
  console.log(announcement);

  // if not, make a toot!
  const tootUrl = syndicateToMastodon(announcement);
  console.log(`TOOT: ${tootUrl}`);

  // and a tweet!
  const tweetUrl = syndicateToTwitter(announcement);
  console.log(`TWEET: ${tweetUrl}`);

  // and remember it!
  posseRecords[newestArticle.permalink] = {
    mastodon: tootUrl,
    twitter: tweetUrl,
  };
  console.log(posseRecords[newestArticle.permalink]);

  const posseRecordsJson = JSON.stringify(posseRecords, null, 2);
  fs.writeFileSync("src/_data/posse.json", posseRecordsJson);
}

main();
