module.exports = function (collection) {
  let byTag = new Map();

  collection.forEach((article) => {
    const articleTags = article.data.tags;

    if (article.data.tags === undefined) {
      console.error(`No tags for ${article.data.title}`);
      return;
    }

    article.data.tags.forEach(articleTag => {
      if (byTag.get(articleTag) === undefined) {
          byTag.set(articleTag, new Array());
      }

      byTag.get(articleTag).push(article);
    });
  });

  return byTag;
};
