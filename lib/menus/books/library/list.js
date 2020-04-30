const { parseLinks } = require('../../../utils');
const { chooseOption } = require('../../../listOptions');
const { objParam } = require('../../../objParam');

async function response(link, choices, dependencies, param) {
  const links = parseLinks(link);

  return chooseOption(links, choices, dependencies, param);
}

async function prevList(request, dependencies, param) {
  return request.then(({ body, headers: { link } }) => {
    const choices = body.map((title) => {
      const name = title.name;
      return {
        name,
        value: title,
      };
    });

    return response(link, choices, dependencies, param);
  });
}

async function previousList(links, dependencies, param) {
  const { superagent } = dependencies;

  const request = superagent.get(links);
  return prevList(request, dependencies, param);
}

async function getAPI(goBack, dependencies = {}, param) {
  const { inquirer, superagent } = dependencies;

  return inquirer.prompt({
    type: 'input',
    message: 'Digite o nome do livro para filtrar lista',
    name: 'volume',
  })
    .then(({ volume }) => {
      if (volume === 'voltar') return goBack();
      const request = superagent.get(`https://www.anapioficeandfire.com/api/books?name=${volume}`);

      prevList(request, dependencies, param);
    });
}

async function run(goBack, dependencies = {}, url) {
  const param = await objParam(goBack, url, previousList, run, 'livros');

  return getAPI(goBack, dependencies, param);
}

module.exports = { run };
