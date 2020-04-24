const { parseLinks } = require('../../../utils');

function repeatList(goBack, dependencies, url, resolve) {
  const { inquirer } = dependencies;
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
};

function objectFilter(obj) {
  let objKeysHouses = Object.entries(obj);
  objKeysHouses.pop();
  return objKeysHouses = Object.fromEntries(objKeysHouses);
};

function listHouses(goBack, dependencies, links, choices, url, resolve) {
  const { inquirer, log } = dependencies;
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

      log(objectFilter(house));
      repeatList(goBack, dependencies, url, resolve)
    });
};

function chooseOption(choices, link, dependencies, goBack, url, resolve) {
  const { inquirer } = dependencies
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

  listHouses(goBack, dependencies, links, choices, url, resolve)
};

function request(goBack, dependencies, url, resolve) {
  const { superagent } = dependencies;
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

    chooseOption(choices, link, dependencies, goBack, url, resolve)
  });
};

async function run(goBack, dependencies = {}, url) {
  return new Promise((resolve) => {
    request(goBack, dependencies, url, resolve);
  });
};

module.exports = { run };
