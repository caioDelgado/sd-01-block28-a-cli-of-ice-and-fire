const superagentModule = require('superagent');

const { parseLinks } = require('../../../utils');

function run(goBack, dependencies = {}, url) {
  const { inquirer, superagent = superagentModule, log = console.log } = dependencies;

  return inquirer.prompt({
    type: 'input',
    name: 'book',
    message: 'Qual o nome do livro que deseja procurar?',
  })
    .then(({ book }) => {
      return new Promise((resolve, reject) => {
        const request = superagent.get(url || 'https://www.anapioficeandfire.com/api/books');

        if (!url) request.query({ name: book, pageSize: 10 });

        request.end((err, { body, headers: { link } }) => {
          if (err) return reject(err);

          const choices = body.map((book) => {
            delete book.characters;
            delete book.povCharacters;
            return {
              name: book.name,
              value: book,
            }
          });

          choices.push(new inquirer.Separator());

          const links = parseLinks(link);

          if (links.next) {
            choices.push({ name: 'Próxima página', value: 'next' });
          }

          if (links.prev) {
            choices.push({ name: 'Página anterior', value: 'prev' });
          }

          choices.push({ name: 'Voltar para o menu de livros', value: 'back' });

          choices.push(new inquirer.Separator());

          return inquirer.prompt({
            type: 'list',
            message: '[Listar Livros] - Escolha um livro para ver mais detalhes',
            name: 'book',
            choices,
          })
            .then(({ book }) => {
              if (book === 'back') return goBack();
              if (book === 'next' || book === 'prev') {
                return resolve(run(goBack, dependencies, links[book]));
              }

              if (!book.url) return resolve();

              log(book);

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
