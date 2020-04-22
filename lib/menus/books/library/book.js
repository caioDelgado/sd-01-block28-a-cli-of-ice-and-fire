const superagentModule = require('superagent');

async function run(goBack, dependencies = {}) {
  return new Promise((resolve) => {
    const { inquirer, superagent = superagentModule, log = console.log } = dependencies;

    return inquirer.prompt({
      type: 'input',
      message: 'Digite o nome do livro para ver detalhes ou digite *voltar* ao menu de livros',
      name: 'book',
    })
      .then(({ book }) => {
        if (book === 'voltar') return goBack();
        const request = superagent.get(`https://www.anapioficeandfire.com/api/books?name=${book}`);

        request.then(({ body }) => {

          const informationBook = {};

          for (const key in body[0]) {
            if (key !== 'characters' && key !== 'povCharacters') {
              informationBook[key] = body[0][key];
            };
          };

          if (!informationBook.name) {
            log('Valor não corresponde a nenhum nome de livro ou a opção voltar');
            return resolve(run(goBack, dependencies));
          };

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
      })
  })
    .catch((err) => console.log(err.message));
}

module.exports = { run };
