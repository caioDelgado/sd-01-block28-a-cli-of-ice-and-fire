const { handleChoice } = require('../../handleChoice.js');
const { addLinks } = require('../../addLinks.js');

const getDados = body => (
  body.map((character) => {
    const { name, aliases } = character;

    return {
      name: name || aliases[0],
      value: character,
    };
  })
);

async function run(goBack, dependencies, url) {
  const { inquirer, superagent} = dependencies;
  const { body, headers: { link } } = await superagent.get(url || 'https://www.anapioficeandfire.com/api/characters');

  const choices = addLinks(getDados(body), link, dependencies, 'personagens');

  const linkAndUrl = { url, link, message: 'Deseja consultar outra personagem?', run };

  return inquirer.prompt({
    type: 'list',
    message: '[Listar Personagens] - Escolha uma personagem para ver mais detalhes',
    name: 'selectChoice',
    choices,
  })
    .then(answers => handleChoice(answers, goBack, dependencies, linkAndUrl));
}

module.exports = { run };
