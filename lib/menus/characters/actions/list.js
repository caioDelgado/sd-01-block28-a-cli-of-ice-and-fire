const superagentModule = require('superagent');

const { parseLinks, addChoices, displayChoicesList } = require('../../../utils');

async function run(goBack, dependencies = {}, url) {
  return new Promise(async (resolve, reject) => {
    const { inquirer, superagent = superagentModule, log = console.log } = dependencies;

    try {
      const { body, headers: { link } } = await superagent.get(url || 'https://www.anapioficeandfire.com/api/characters?page=1&pageSize=10');

      const choices = body.map((character) => {
        const { name, aliases } = character;

        return {
          name: name || aliases[0],
          value: character,
        };
      });

      const links = parseLinks(link);
      const message = '[Listar Personagens] - Escolha uma personagem para ver mais detalhes';
      const name = 'character';

      addChoices(inquirer, choices, links, 'Voltar para o menu de personagens');
      return displayChoicesList(
        inquirer, goBack, dependencies,
        log, message, name,
        choices, links, url,
        run, resolve);
    } catch (err) {
      return reject(err.message);
    }
  });
}

module.exports = { run };
