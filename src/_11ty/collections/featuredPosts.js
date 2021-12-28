// Okay yes it's just the newest 3 posts.
// But we could make a different rule later if we wanted!
module.exports = (collection) => {
    return collection
        .getFilteredByGlob("./src/post/**/*.md")
        .sort((a, b) => b.date - a.date)
        .slice(0, 3)
};