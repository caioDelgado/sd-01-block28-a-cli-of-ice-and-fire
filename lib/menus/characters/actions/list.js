const superagentModule = require('superagent');

const { parseLinks } = require('../../../utils');

const getDados = body => (
  body.map((character) => {
    const { name, aliases } = character;

    return {
      name: name || aliases[0],
      value: character,
    };
  })
);

const addLinks = (choices, link, { inquirer }) => {
  const links = parseLinks(link);
  const options = [...choices];

  if (links.next) {
    options.push({ name: 'Próxima página', value: 'next' });
  }
  if (links.prev) {
    options.push({ name: 'Página anterior', value: 'prev' });
  }
  options.push({ name: 'Voltar para o menu de personagens', value: 'back' });
  options.push(new inquirer.Separator());
  return options;
};

function handleChoice({ selectChoice }, goBack, dependencies, { url, link }) {
  const { inquirer } = dependencies;
  const log = console.log;
  const links = parseLinks(link);
  if (selectChoice === 'back') return goBack();
  if (selectChoice === 'next' || selectChoice === 'prev') {
    return run(goBack, dependencies, links[selectChoice]);
  }
  if (!selectChoice.url) return log('Deu ruim');
  log(selectChoice);
  return inquirer.prompt({
    type: 'confirm',
    message: 'Deseja consultar outra personagem?',
    name: 'repeat',
    default: true,
  }).then(answers => repeatChoice(answers, goBack, dependencies, url));
}

async function run(goBack, dependencies = {}, url) {
  try {
    const { inquirer, superagent = superagentModule } = dependencies;

    const { body, headers: { link } } = await superagent.get(url || 'https://www.anapioficeandfire.com/api/characters');

    const choices = addLinks(getDados(body), link, dependencies);

    const linkAndUrl = { url, link };

    return inquirer.prompt({
      type: 'list',
      message: '[Listar Personagens] - Escolha uma personagem para ver mais detalhes',
      name: 'selectChoice',
      choices,
    })
      .then(answers => handleChoice(answers, goBack, dependencies, linkAndUrl));
  } catch (err) {
    const log = console.log;
    return log(err);
  }
}

function repeatChoice({ repeat }, goBack, dependencies, url) {
  const log = console.log;
  if (!repeat) return log('Bye');
  return run(goBack, dependencies, url);
}

module.exports = { run };
