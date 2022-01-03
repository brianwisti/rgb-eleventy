"use strict";

import Alpine from 'alpine';
import JSDB from '@small-tech/jsdb';
import fg from 'fast-glob';
import fs from 'fs-plus';
import path from 'path';
import * as zlib from 'zlib';


const AddedRedirects = [
  '/bookmarks/tags',
  '/feed.xml',
  '/notes',
  '/posts/tags',
  '/tags',
  '/hashtags',
  '/wp/category',
  '/wp/tag',
];

const HackAttempts = [
  '/\\',
  '/.',
  '//',
  '/~',
  '/1ndex.php',
  '/1index.php',
  '/2index.php',
  '/3index.php',
  '/BACKUP',
  '/Back',
  '/Blog',
  '/Old',
  '/Public',
  '/WORDPRESS',
  '/WP',
  '/WordPress',
  '/admin',
  '/alfa.php',
  '/alfindex.php',
  '/app/',
  '/asas',
  '/bac',
  '/bak',
  '/bc',
  '/blog/wp',
  '/blogs/',
  '/bk',
  '/bug-bounty',
  '/cache',
  '/cgi-bin',
  '/cms',
  '/cool.php',
  '/data',
  '/defau1t.php',
  '/default.php',
  '/demo',
  '/e/',
  '/en/bug-bounty',
  '/environment',
  '/files',
  '/index.',
  '/index.',
  '/index3.',
  '/info.',
  '/js/app.js',
  '/livereload',
  '/member',
  '/mt',
  '/old',
  '/phpinfo.php',
  '/plugin',
  '/plus',
  '/pmd',
  '/public/assets',
  '/randomgeekery.',
  '/randomgeekery_',
  '/s_e',
  '/search',
  '/security-policy',
  '/sftp-config.json',
  '/shop/',
  '/simplewind',
  '/sit',
  '/source',
  '/sqlbuddy',
  '/templ',
  '/tools',
  '/uc',
  '/uploads',
  '/vendor',
  '/wp2',
  '/old/',
  '/new/',
  '/wb/wp-login.php',
  '/web.',
  '/web/wp-login.php',
  '/wordpress/',
  '/wp-',
  '/wp/dup',
  '/wp/feed',
  '/wp/installer',
  '/wp/wp',
  '/wpindex.php',
  '/www',
  '/xmlrpc',
];

const LogDir = "~/Dropbox/logs/randomgeekery.org";

const tallyEntries = (acc, entry) => {
  acc[entry] = acc[entry] ? acc[entry] + 1 : 1;
  return acc;
};

class LogFileProcessor {
  constructor (logFile, logParser) {
    this.logFile = logFile;
    this.name = path.basename(this.logFile, '.gz');
    this.logParser = logParser;
    this.entries = this.loadEntries();
  }

  loadEntries () {
      const buffer = fs.readFileSync(this.logFile);
      const lines = zlib.gunzipSync(buffer).toString().split('\n');

      return lines
        .filter((line) => line.length > 0)
        .map((line) => this.logParser.parseLine(line));
  }

  getUserAgents () {
    return this.entries
      .map((entry) => entry['RequestHeader User-agent'])
      .reduce(tallyEntries, {});
  }

  getMissingUrls () {
    return this.entries
      .filter((entry) => entry.status == '404')
      .map((entry) => entry.request.split(' ')[1])
      .filter((entry) => AddedRedirects.filter((redirect) => entry.startsWith(redirect)).length == 0)
      .filter((entry) => HackAttempts.filter((attempt) => entry.startsWith(attempt)).length == 0)
      .reduce(tallyEntries, {});
  }

  getReferers () {
    return this.entries
      .map((entry) => entry['RequestHeader Referer'])
      .reduce(tallyEntries, {});
  }
}

class SiteDB {
  constructor (dbName = 'db') {
    this.dbName = dbName;
    this.db = JSDB.open('db');

    this.ensureTables();
  }

  ensureTables () {
    console.log('Ensuring tables');
    if (! this.db.logEntries ) {
      this.db.logEntries = [];
    }
  }
}

class SiteLogProcessor {
  constructor (logDir) {
    this.logDir = logDir;
    this.alpine = new Alpine();
    this.logProcessors = this.loadLogProcessors();
  }

  getMissingUrls () {
    return this.logProcessors
      .map((logProcessor) => logProcessor.getMissingUrls())
      .reduce((acc, processorEntries) => {
        Object.entries(processorEntries).forEach(([entry, count]) => {
          acc[entry] = acc[entry] ? acc[entry] + count : count;
        });

        return acc;
      }, {}
      );
  }

  getReferers () {
    return this.logProcessors
      .map((logProcessor) => logProcessor.getReferers())
      .reduce((acc, processorEntries) => {
        Object.entries(processorEntries).forEach(([entry, count]) => {
          acc[entry] = acc[entry] ? acc[entry] + count : count;
        });

        return acc;
      }, {}
      );
  }

  getUserAgents () {
    return this.logProcessors
      .map((logProcessor) => logProcessor.getUserAgents())
      .reduce((acc, processorEntries) => {
        Object.entries(processorEntries).forEach(([entry, count]) => {
          acc[entry] = acc[entry] ? acc[entry] + count : count;
        });

        return acc;
      }, {}
      );
  }

  loadLogProcessors () {
    const normalizedLogDir = fs.normalize(this.logDir);
    const logFiles = fg.sync(`${normalizedLogDir}/**/access*.gz`);

    return logFiles.map((logFile) => new LogFileProcessor(logFile, this.alpine));
  }



}

async function main() {
  const logProcessor = new SiteLogProcessor(LogDir);
  console.log("Missing URLs");
  console.log(logProcessor.getMissingUrls());
}

main();
