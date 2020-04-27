function parseLinks(links) {
  return Object.fromEntries(
    links.split(',')
      .map((link) => link.split(';'))
      .map((linkPairs) => linkPairs.map((part) => part.trim()))
      .map(([link, rel]) => ([rel.replace(/(?:rel)|"|=/ig, ''), link.replace(/<|>/g, '')]))
      .filter(([rel]) => rel !== 'first' && rel !== 'last')
  );
}

function addChoices(inquirer, choices, links, message) {
  choices.push(new inquirer.Separator());

  if (links.next) {
    choices.push({ name: 'Próxima página', value: 'next' });
  }

  if (links.prev) {
    choices.push({ name: 'Página anterior', value: 'prev' });
  }

  choices.push({ name: message, value: 'back' });

  choices.push(new inquirer.Separator());
}

module.exports = {
  parseLinks,
  addChoices,
};
