const superagentModule = require('superagent');

const { parseLinks } = require('../../../utils');

function withdrawProperties(books, log) {
  let informationBook = Object.entries(books);
  informationBook.pop();
  informationBook.pop();
  informationBook = Object.fromEntries(informationBook);
  return log(informationBook);
}

async function run(goBack, dependencies = {}, url) {
  return new Promise((resolve) => {
    const { inquirer, superagent = superagentModule, log = console.log } = dependencies;

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

            return {
              name,
              value: books,
            };
          });

          return inquirer.prompt({
            type: 'list',
            message: '[Listar Livros] - Escolha um livro para ver mais detalhes',
            name: 'books',
            choices,
          })
            .then(({ books }) => {
              if (books === 'back') return goBack();
              if (books === 'next' || books === 'prev') return resolve(run(goBack, dependencies, links[books]));

              if (!books.url) return resolve();

              withdrawProperties(books, log);

              return inquirer.prompt({
                type: 'confirm',
                message: 'Deseja consultar outro livro?',
                name: 'repeat',
                default: true,
              }).then(({ repeat }) => {
                if (!repeat) return resolve();
                return resolve(run(goBack, dependencies, url));
              });
            });
        });
      });
  });
}

module.exports = { run };
