const { parseLinks } = require('../../../utils');
const { chooseOption } = require('../../../listOptions');

async function response(link, choices, dependencies, param) {
  const links = parseLinks(link);

  return chooseOption(links, choices, dependencies, param);
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
    });
}

async function run(goBack, dependencies = {}, url) {
  const param = {
    goBack,
    url,
    repeatRun: run,
    text: 'livros',
  };

  return getAPI(goBack, dependencies, param);
}

module.exports = { run };
