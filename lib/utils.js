function parseLinks(links) {
  return Object.fromEntries(
    links.split(',')
      .map((link) => link.split(';'))
      .map((linkPairs) => linkPairs.map((part) => part.trim()))
      .map(([link, rel]) => ([rel.replace(/(?:rel)|"|=/ig, ''), link.replace(/<|>/g, '')]))
      .filter(([rel]) => rel !== 'first' && rel !== 'last')
  );
}

module.exports = {
  parseLinks,
};
