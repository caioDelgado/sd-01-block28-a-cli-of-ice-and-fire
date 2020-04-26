const { parseLinks } = require('../../../utils');
const { repeatSearch } = require('../../../repeatSearch');

// async function repeatSearch(goBack, dependencies, url) {
//   const { inquirer } = dependencies;

//   return inquirer.prompt({
//     type: 'confirm',
//     message: 'Deseja fazer outra pesquisa?',
//     name: 'repeat',
//     default: true,
//   })
//     .then(({ repeat }) => {
//       if (!repeat) return;
//       return run(goBack, dependencies, url);
//     });
// }

async function filterObj(book) {
  const informationBook = Object.entries(book);
  informationBook.pop();
  informationBook.pop();
  return Object.fromEntries(informationBook);
}

async function choose(links, choices, dependencies, param) {
  const { inquirer, log } = dependencies;
  const { goBack, url, run } = param;

  choices.push(new inquirer.Separator());
  if (links.next) choices.push({ name: 'Próxima página', value: 'next' });
  if (links.prev) choices.push({ name: 'Página anterior', value: 'prev' });

  choices.push({ name: 'Voltar para o menu de livros', value: 'back' });
  choices.push(new inquirer.Separator());

  return inquirer.prompt({
    type: 'list',
    message: '[Listar livros] - Escolha um livro para ver mais detalhes',
    name: 'book',
    choices,
  })
    .then(({ book }) => {
      if (book === 'back') return goBack();
      if (book === 'next' || book === 'prev')
        return run(goBack, dependencies, links[book]);

      log(filterObj(book));
      return repeatSearch(goBack, dependencies, url, run);
    });
}

async function response(link, choices, dependencies, param) {
  const links = parseLinks(link);

  return choose(links, choices, dependencies, param);
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
    run,
  };

  return getAPI(goBack, dependencies, param)
}

module.exports = { run };
