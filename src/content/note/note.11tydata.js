module.exports = {
  layout: "layouts/note.njk",
  permalink: "/note/{{ page.date | date: '%Y/%m' }}/{{ page.fileSlug }}/",
};
