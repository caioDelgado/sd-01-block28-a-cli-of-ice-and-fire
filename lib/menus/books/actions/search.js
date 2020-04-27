const superagentModule = require('superagent');

const { parseLinks, addChoices, displayChoicesList } = require('../../../utils');

function run(goBack, dependencies = {}, url) {
  const { inquirer, superagent = superagentModule, log = console.log } = dependencies;

  return inquirer.prompt({
    type: 'input',
    name: 'bookName',
    message: 'Qual o nome do livro que deseja procurar?',
  })
    .then(({ bookName }) => (
      new Promise(async (resolve, reject) => {
        try {
          const { body, headers: { link } } = await superagent.get(url || 'https://www.anapioficeandfire.com/api/books').query({ name: bookName, page: 1, pageSize: 10 });

          const choices = body.map((bookName) => {
            const book = { ...bookName };
            delete book.characters;
            delete book.povCharacters;
            return {
              name: book.name,
              value: book,
            };
          });

          const links = parseLinks(link);
          const message = '[Listar Livros] - Escolha um livro para ver mais detalhes';
          const name = 'book';

          addChoices(inquirer, choices, links, 'Voltar para o menu de livros');
          return displayChoicesList(inquirer, goBack, dependencies, log, message, name, choices, links, url, run, resolve);
        } catch (err) {
          return reject(err.message);
        }
      })
    ));
}

module.exports = { run };