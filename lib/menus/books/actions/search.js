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
      return new Promise(async (resolve, reject) => {
        try {
          const { body, headers: { link } } = await superagent.get(url || 'https://www.anapioficeandfire.com/api/books').query({ name: book, page: 1, pageSize: 10 });

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
              if (book === 'next' || book === 'prev') return resolve(run(goBack, dependencies, links[book]));

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
        } catch (err) {
          return reject(err.message);
        }
      });
    });
}

module.exports = { run };