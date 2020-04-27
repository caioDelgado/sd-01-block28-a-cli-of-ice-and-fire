const { addLinks } = require('../../addLinks.js');
const { selectMenu } = require('../../selectMenu');

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
  const { inquirer, superagent } = dependencies;
  const { body, headers: { link } } = await superagent.get(url || 'https://www.anapioficeandfire.com/api/characters');

  const choices = addLinks(getDados(body), link, dependencies, 'personagens');

  const objMenu = {
    type: 'list',
    message: '[Listar Personagens] - Escolha uma personagem para ver mais detalhes',
    name: 'selectChoice',
    choices,
    question: 'Deseja consultar outra personagem?',
    url,
    link,
  };

  return selectMenu(objMenu, { goBack, dependencies, run }, inquirer);
}

module.exports = { run };
