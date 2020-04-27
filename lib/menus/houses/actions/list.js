const superagentModule = require('superagent');

const { parseLinks, addChoices, displayChoicesList } = require('../../../utils');

async function run(goBack, dependencies = {}, url) {
  return new Promise(async (resolve, reject) => {
    const { inquirer, superagent = superagentModule, log = console.log } = dependencies;

    try {
      const { body, headers: { link } } = await superagent.get(url || 'https://www.anapioficeandfire.com/api/houses/?page=1&pageSize=10');
      const choices = body.map((eachHouse) => {
        const house = { ...eachHouse };
        delete house.swornMembers;
        return {
          name: house.name,
          value: house,
        };
      });

      const links = parseLinks(link);
      const message = '[Listar Casas] - Escolha uma casa para ver mais detalhes';
      const name = 'house';

      addChoices(inquirer, choices, links, 'Voltar para o menu das casas');
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
