const superagentModule = require('superagent');

const { parseLinks } = require('../../../utils');

async function run(goBack, dependencies = {}, url) {
  return new Promise((resolve) => {
    const { inquirer, superagent = superagentModule, log = console.log } = dependencies;

    const request = superagent.get(url || 'https://www.anapioficeandfire.com/api/houses');

    if (!url) request.query({ page: 1, pageSize: 10 });

    request.then(({ body, headers: { link } }) => {
      const choices = body.map((house) => {
        const { name } = house;

        return {
          name,
          value: house,
        };
      });

      choices.push(new inquirer.Separator());

      const links = parseLinks(link);

      if (links.next) {
        choices.push({ name: 'Próxima página', value: 'next' });
      }

      if (links.prev) {
        choices.push({ name: 'Página anterior', value: 'prev' });
      }

      choices.push({ name: 'Voltar para o menu de casas', value: 'back' });

      choices.push(new inquirer.Separator());

      return inquirer.prompt({
        type: 'list',
        message: '[Listar casas] - Escolha uma casa para ver mais detalhes',
        name: 'house',
        choices,
      })
        .then(({ house }) => {
          if (house === 'back') return goBack();
          if (house === 'next' || house === 'prev') {
            return resolve(run(goBack, dependencies, links[house]));
          }

          if (!house.url) return resolve();

          let objKeysHouses = Object.entries(house);
          objKeysHouses.pop();
          objKeysHouses = Object.fromEntries(objKeysHouses);

          log(objKeysHouses);

          return inquirer.prompt({
            type: 'confirm',
            message: 'Deseja consultar outra casa?',
            name: 'repeat',
            default: true,
          })
            .then(({ repeat }) => {
              if (!repeat) return resolve();
              return resolve(run(goBack, dependencies, url));
            });
        });
    });
  });
}

module.exports = { run };
