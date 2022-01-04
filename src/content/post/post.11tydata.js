module.exports = {
  layout: "layouts/post.njk",
  permalink: "/post/{{ page.date | date: '%Y/%m' }}/{{ page.fileSlug }}/",
};
