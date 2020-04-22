const superagentModule = require('superagent');

const { parseLinks } = require('../../../utils');

async function run(goBack, dependencies = {}, url) {
  return new Promise((resolve) => {
    const { inquirer, superagent = superagentModule, log = console.log } = dependencies;

    const request = superagent.get(url || 'https://www.anapioficeandfire.com/api/books');

    if (!url) request.query({ page: 1, pageSize: 10 });

    request.then(({ body, headers: { link } }) => {
      const choices = body.map((book) => {
        const { name } = book;

        return {
          name,
          value: book,
        };
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
        message: '[Listar Personagens] - Escolha um livro para ver mais detalhes',
        name: 'book',
        choices,
      })
        .then(({ book }) => {
          if (book === 'back') return goBack();
          if (book === 'next' || book === 'prev') {
            console.log(links[book]);
            return resolve(run(goBack, dependencies, links[book]));
          }

          if (!book.url) return resolve();

          let informationBook = Object.entries(book);
          informationBook.pop();
          informationBook.pop();
          informationBook = Object.fromEntries(informationBook);

          log(informationBook);

          return inquirer.prompt({
            type: 'confirm',
            message: 'Deseja consultar outra personagem?',
            name: 'repeat',
            default: true,
          })
            .then(({ repeat }) => {
              if (!repeat) return resolve();
              return resolve(run(goBack, dependencies, url));
            });
        });
    });
  });
}

module.exports = { run };
