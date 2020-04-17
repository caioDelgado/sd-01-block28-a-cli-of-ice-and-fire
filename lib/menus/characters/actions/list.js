const superagentModule = require('superagent');

const { parseLinks } = require('../../../utils');

const repeatChoice = ({ repeat }, goBack, dependencies, url) => {
  if (!repeat) return;
  return run(goBack, dependencies, url);
}

const handleChoice = ({ selectChoice }, goBack, dependencies, url, links) => {
  const { inquirer, log } = dependencies;
  if (selectChoice === 'back') return goBack();
  if (selectChoice === 'next' || selectChoice === 'prev') {
    console.log(selectChoice, links)
    return run(goBack, dependencies, links[selectChoice]);
  }

  if (!selectChoice.url) return;

  log(selectChoice);

  return inquirer.prompt({
    type: 'confirm',
    message: 'Deseja consultar outra personagem?',
    name: 'repeat',
    default: true,
  }).then((answers) => repeatChoice(answers, goBack, dependencies, url));
}

const getDados = (body) => (
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
}

async function run(goBack, dependencies = {}, url) {
  try {
    const { inquirer, superagent = superagentModule, log = console.log } = dependencies;

    const { body, headers: { link } } = await superagent.get(url || 'https://www.anapioficeandfire.com/api/characters');

    const choices = addLinks(getDados(body), link, dependencies)

    return inquirer.prompt({
      type: 'list',
      message: '[Listar Personagens] - Escolha uma personagem para ver mais detalhes',
      name: 'selectChoice',
      choices,
    })
      .then((answers) => handleChoice(answers, goBack, dependencies, url, link))
  } catch (err) {
    log(err);
  }
};

module.exports = { run };
