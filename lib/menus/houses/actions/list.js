const superagentModule = require('superagent');

const { parseLinks, addChoices } = require('../../../utils');

async function run(goBack, dependencies = {}, url) {
  return new Promise(async (resolve, reject) => {
    const { inquirer, superagent = superagentModule, log = console.log } = dependencies;

    try {
      const { body, headers: { link } } = await superagent.get(url || 'https://www.anapioficeandfire.com/api/houses/?page=1&pageSize=10');
      const choices = body.map((house) => {
        delete house.swornMembers;
        return {
          name: house.name,
          value: house,
        };
      });

      const links = parseLinks(link);

      addChoices(inquirer, choices, links, 'Voltar para o menu das casas');

      return inquirer.prompt({
        type: 'list',
        message: '[Listar Personagens] - Escolha uma casa para ver mais detalhes',
        name: 'house',
        choices,
      })
        .then(({ house }) => {
          if (house === 'back') return goBack();
          if (house === 'next' || house === 'prev') return resolve(run(goBack, dependencies, links[house]));

          if (!house.url) return resolve();

          log(house);

          return inquirer.prompt({
            type: 'confirm',
            message: 'Deseja consultar outra casa?',
            name: 'repeat',
            default: true,
          }).then(({ repeat }) => {
            if (!repeat) return resolve();
            return resolve(run(goBack, dependencies, url));
          });
        });
    } catch (err) {
      return reject(err.message);
    }
  });
}

module.exports = { run };
