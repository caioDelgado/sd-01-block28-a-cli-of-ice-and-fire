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

function displayChoicesList(inquirer, goBack, dependencies, log, message, key, choices, links, run, resolve) {
  return inquirer.prompt({
    type: 'list',
    message: message,
    name: key,
    choices,
  })
    .then((name) => {
      if (name[key] === 'back') return goBack();
      if (name[key] === 'next' || name[key] === 'prev') return resolve(run(goBack, dependencies, links[name]));

      // if (!name.url) return resolve();

      log(name[key]);

      return inquirer.prompt({
        type: 'confirm',
        message: 'Deseja consultar outra personagem?',
        name: 'repeat',
        default: true,
      }).then(({ repeat }) => {
        if (!repeat) return resolve();
        return resolve(run(goBack, dependencies, url));
      });
    });
}

// displayChoicesList(
//   inquirer, goBack, dependencies, log,
//   '[Listar Personagens] - Escolha uma personagem para ver mais detalhes',
//   'character', choices, links, run, resolve);

module.exports = {
  parseLinks,
  addChoices,
  displayChoicesList,
};
