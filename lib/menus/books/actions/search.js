const superagentModule = require('superagent');
const { parseLinks } = require('../../../utils');
const inquirer = require('inquirer');

async function search(goBack, endpoint, url) {
  const apiResult = await superagentModule.get(
    url || `https://www.anapioficeandfire.com/api/books?name=${endpoint}`
  );

  const choices = apiResult.body.map((book) => {
    const { name } = book;
    return {
      name: name,
      value: book,
    };
  });
  choices.push(new inquirer.Separator());

  const links = parseLinks(apiResult.headers.link);

  if (links.next) {
    choices.push({ name: 'Próxima página', value: 'next' });
  }

  if (links.prev) {
    choices.push({ name: 'Página anterior', value: 'prev' });
  }

  choices.push({ name: 'Voltar para o menu de livros', value: 'back' });

  choices.push(new inquirer.Separator());

  return inquirer
    .prompt({
      type: 'list',
      message: 'livros encontrados - escolha um para ver mais detalhes',
      name: 'book',
      choices,
    })
    .then(({ book }) => {
      if (book === 'back') return goBack();
      if (book === 'next' || book === 'prev') {
        return search(goBack, endpoint, links[book]);
      }
      delete book.characters;
      delete book.povCharacters;
      console.log(book);
      return inquirer
        .prompt({
          type: 'list',
          message: 'Deseja voltar?',
          name: 'back',
          choices: [
            { name: 'Sim', value: 'yes' },
            { name: 'Não, obrigado!', value: 'no' },
          ],
        })
        .then(({ back }) => {
          if (back === 'yes') return search(goBack, endpoint);
          return null;
        });
    });
}

module.exports = { search };
