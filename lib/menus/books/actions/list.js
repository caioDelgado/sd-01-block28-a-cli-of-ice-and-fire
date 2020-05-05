const superagent = require('superagent');

const { parseLinks } = require('../../../utils');
const { useAgain } = require('../../../useAgain');

function withdrawProperties(books, log) {
  let informationBook = Object.entries(books);
  informationBook.pop();
  informationBook.pop();
  informationBook = Object.fromEntries(informationBook);
  return log(informationBook);
}

function menuOption(inquirer, choices, links) {
  choices.push(new inquirer.Separator());
  if (links.next) choices.push({ name: 'Próxima página', value: 'next' });
  if (links.prev) choices.push({ name: 'Página anterior', value: 'prev' });
  choices.push({ name: 'Voltar para o menu de livros', value: 'back' });
  choices.push(new inquirer.Separator());
}

async function teste(goBack, dependencies = {}, obj, choices, links, url) {
  const { inquirer, log = console.log } = dependencies;
  const { newRun } = obj;
  return inquirer.prompt({
    type: 'list',
    message: '[Listar Livros] - Escolha um livro para ver mais detalhes',
    name: 'books',
    choices,
  })
    .then(({ books }) => {
      if (books === 'back') return goBack();
      if (books === 'next' || books === 'prev') return newRun(goBack, dependencies, links[books]);
      if (!books.url) return;
      withdrawProperties(books, log);
      return useAgain(goBack, dependencies, url, newRun);
    });
}

async function ready(goBack, dependencies, url, obj) {
  const { inquirer } = dependencies;
  inquirer.prompt({
    type: 'input',
    name: 'searchBooks',
    message: 'Qual livro você deseja pesquisar?',
  })
    .then(({ searchBooks }) => {
      const request = superagent.get(url || `https://www.anapioficeandfire.com/api/books?name=${searchBooks}`);
      request.then(({ body, headers: { link } }) => {
        const choices = body.map((books) => {
          const { name } = books;
          return { name, value: books };
        });
        const links = parseLinks(link);
        menuOption(inquirer, choices, links);
        teste(goBack, dependencies, obj, choices, links, url);
      });
    });
}

async function run(goBack, dependencies = {}, url) {
  const obj = {
    newRun: run,
  };
  return ready(goBack, dependencies, url, obj);
}

module.exports = { run };
