const { addLinks } = require('../../addLinks.js');
const { selectMenu } = require('../../selectMenu');

const filterBook = book => (
  Object.entries(book)
    .filter(obj => obj[0] !== 'characters' && obj[0] !== 'povCharacters')
    .reduce((acc, obj) => ({
      ...acc,
      [obj[0]]: obj[1],
    }), {}));

const getDados = body => (
  body.map((book) => {
    const { name } = book;
    return {
      name,
      value: filterBook(book),
    };
  })
);

async function choiceNameBook({ inquirer }) {
  return inquirer.prompt({
    type: 'input',
    message: 'Digite o nome do livro',
    name: 'answer',
    default: true,
  }).then(({ answer }) => answer);
}

async function run(goBack, dependencies = {}, url) {
  const { inquirer, superagent } = dependencies;

  const bookName = await choiceNameBook(dependencies);

  const { body, headers: { link } } = await superagent.get(url || `https://www.anapioficeandfire.com/api/books?name=${bookName}`);
  const choices = addLinks(getDados(body), link, dependencies, 'livros');

  const objMenu = {
    type: 'list',
    message: '[Listar Livros] - Escolha um livro para ver mais detalhes',
    name: 'selectChoice',
    choices,
    question: 'Deseja consultar outro livro?',
    url,
    link,
  };

  return selectMenu(objMenu, { goBack, dependencies, run }, inquirer);
}

module.exports = { run };
