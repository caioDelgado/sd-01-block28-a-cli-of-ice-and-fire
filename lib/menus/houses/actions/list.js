const { parseLinks } = require('../../../utils');
const { repeatSearch } = require('../../../repeatSearch');
// async function repeatSearch(goBack, dependencies, url) {
//   const { inquirer } = dependencies;
//   return inquirer.prompt({
//     type: 'confirm',
//     message: 'Deseja consultar outra casa?',
//     name: 'repeat',
//     default: true,
//   })
//     .then(({ repeat }) => {
//       if (!repeat) return;
//       return run(goBack, dependencies, url);
//     });
// }

async function objectFilter(obj) {
  const objKeysHouses = Object.entries(obj);
  objKeysHouses.pop();
  return Object.fromEntries(objKeysHouses);
}

// async function listHouses(goBack, dependencies, links, choices, url) {
//   const { inquirer, log } = dependencies;
//   return inquirer.prompt({
//     type: 'list',
//     message: '[Listar casas] - Escolha uma casa para ver mais detalhes',
//     name: 'house',
//     choices,
//   })
//     .then(({ house }) => {
//       if (house === 'back') return goBack();
//       if (house === 'next' || house === 'prev') return run(goBack, dependencies, links[house]);

//       if (!house.url) return;

//       log(objectFilter(house));
//       return repeatSearch(goBack, dependencies, url, run);
//     });
// }

async function chooseOption(choices, link, dependencies) {
  const { inquirer } = dependencies;
  choices.push(new inquirer.Separator());

  const links = parseLinks(link);

  if (links.next) choices.push({ name: 'Próxima página', value: 'next' });

  if (links.prev) choices.push({ name: 'Página anterior', value: 'prev' });

  choices.push({ name: 'Voltar para o menu de casas', value: 'back' });

  choices.push(new inquirer.Separator());

  return {
    links,
    choices,
  };
  // return listHouses(goBack, dependencies, links, choices, url);
}

async function getAPI(dependencies, url) {
  const { superagent } = dependencies;
  const request = superagent.get(url || 'https://www.anapioficeandfire.com/api/houses');
  if (!url) request.query({ page: 1, pageSize: 10 });

  return request.then(({ body, headers: { link } }) => {
    const choices = body.map((house) => {
      const { name } = house;

      return {
        name,
        value: house,
      };
    });

    return chooseOption(choices, link, dependencies);
  });
}

async function run(goBack, dependencies, url) {
  const { inquirer, log } = dependencies;

  return getAPI(dependencies, url)
    .then(({ links, choices }) => (
      inquirer.prompt({
        type: 'list',
        message: '[Listar casas] - Escolha uma casa para ver mais detalhes',
        name: 'house',
        choices,
      })
        .then(({ house }) => {
          if (house === 'back') return goBack();
          if (house === 'next' || house === 'prev') return run(goBack, dependencies, links[house]);

          log(objectFilter(house));
          return repeatSearch(goBack, dependencies, url, run);
        })),
    );
}

module.exports = { run };
