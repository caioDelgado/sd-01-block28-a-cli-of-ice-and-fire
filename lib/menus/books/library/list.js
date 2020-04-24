const superagentModule = require('superagent');

const { parseLinks } = require('../../../utils');

async function run(goBack, dependencies = {}) {
  return new Promise((resolve) => {
    const { inquirer, superagent = superagentModule, log = console.log } = dependencies;

    return inquirer.prompt({
      type: 'input',
      message: 'Digite o nome do livro para filtrar lista',
      name: 'volume',
    })
      .then(({ volume }) => {
        if (volume === 'voltar') return goBack();
        const request = superagent.get(`https://www.anapioficeandfire.com/api/books?name=${volume}`);

        request.then(({ body, headers: { link } }) => {
          const choices = body.map(title => {
            return {
              name: title.name,
              value: title,
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
                return resolve(run(goBack, dependencies, links[book]));
              }

              if (!book.url) return resolve();

              let informationBook = Object.entries(body[0]);
              informationBook.pop();
              informationBook.pop();
              informationBook = Object.fromEntries(informationBook);

              log(informationBook);

              return inquirer.prompt({
                type: 'confirm',
                message: 'Deseja fazer outra pesquisa?',
                name: 'repeat',
                default: true,
              })
                .then(({ repeat }) => {
                  if (!repeat) return resolve();
                  return resolve(run(goBack, dependencies));
                });
            });
        });
      });
  });
}

module.exports = { run };
