function parseLinks(links) {
  return Object.fromEntries(
    links.split(',')
      .map((link) => link.split(';'))
      .map((linkPairs) => linkPairs.map((part) => part.trim()))
      .map(([link, rel]) => ([rel.replace(/(?:rel)|"|=/ig, ''), link.replace(/<|>/g, '')]))
      .filter(([rel]) => rel !== 'first' && rel !== 'last'),
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

function displayChoicesList(
  inquirer, goBack, dependencies,
  log, message, name,
  choices, links, url,
  run, resolve) {
  return inquirer.prompt({
    type: 'list',
    message,
    name,
    choices,
  })
    .then(({ [name]: key }) => {
      if (key === 'back') return goBack();
      if (key === 'next' || key === 'prev') return resolve(run(goBack, dependencies, links[key]));

      if (!key.url) return resolve();

      log(key);

      return inquirer.prompt({
        type: 'confirm',
        message: 'Deseja consultar outro livro?',
        name: 'repeat',
        default: true,
      }).then(({ repeat }) => {
        if (!repeat) return resolve();
        if (name === 'book') return resolve(run(goBack, dependencies));
        return resolve(run(goBack, dependencies, url));
      });
    });
}

module.exports = {
  parseLinks,
  addChoices,
  displayChoicesList,
};
