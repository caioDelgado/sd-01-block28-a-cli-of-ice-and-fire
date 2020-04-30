const { parseLinks } = require('../../../utils');
const { chooseOption } = require('../../../listOptions');

async function getAPI(url, dependencies, param) {
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

    const links = parseLinks(link);

    return chooseOption(links, choices, dependencies, param);
  });
}

async function run(goBack, dependencies, url) {
  const param = {
    goBack,
    url,
    newList: getAPI,
    repeatRun: run,
    text: 'casas',
  };

  return getAPI(url, dependencies, param);
}

module.exports = { run };
