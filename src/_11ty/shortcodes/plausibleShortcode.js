module.exports = () => {
  let analyticsWanted = process.env.INCLUDE_ANALYTICS;

  if (analyticsWanted) {
    return `<script async defer data-domain="randomgeekery.org"
      src="https://plausible.io/js/plausible.js">
    </script>`;
  }

  return "";
};
