const superagentModule = require('superagent');
const { parseLinks } = require('../../../utils');
const inquirer = require('inquirer');
const { generateInquirer } = require('../../defaultMenu.js');

const backChoices = [
  { name: 'Sim', value: 'yes' },
  { name: 'Não, obrigado!', value: 'no' },
];

function generateSecondInquirer(func, goBack, endpoint) {
  return generateInquirer('list', 'Deseja voltar?', 'back', backChoices).then(
    ({ back }) => {
      if (back === 'yes') return func(goBack, endpoint);
      return null;
    },
  );
}

function generateFirstInquirer(func, goBack, endpoint, links, choices) {
  return inquirer
    .prompt({
      type: 'list',
      message: 'livros encontrados - escolha um para ver mais detalhes',
      name: 'book',
      choices,
    })
    .then(({ book }) => {
      if (book === 'back') return goBack();
      if (book === 'next' || book === 'prev')
        return func(goBack, endpoint, links[book]);
      const { characters, povCharacters, ...restBook } = book;
      console.log(restBook);
      return generateSecondInquirer(func, goBack, endpoint);
    });
}

async function search(goBack, endpoint, url) {
  const apiResult = await superagentModule.get(
    url || `https://www.anapioficeandfire.com/api/books?name=${endpoint}`,
  );

  const choices = apiResult.body.map((book) => {
    const { name } = book;
    return {
      name,
      value: book,
    };
  });
  choices.push(new inquirer.Separator());

  const links = parseLinks(apiResult.headers.link);
  if (links.next) choices.push({ name: 'Próxima página', value: 'next' });
  if (links.prev) choices.push({ name: 'Página anterior', value: 'prev' });
  choices.push({ name: 'Voltar para o menu de livros', value: 'back' });
  choices.push(new inquirer.Separator());
  return generateFirstInquirer(search, goBack, endpoint, links, choices);
}

module.exports = { search };
