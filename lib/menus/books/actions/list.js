const fetch = require('node-fetch');
const inquirer = require('inquirer');
const { parseLinks } = require('../../../utils');
const { inquirerQuestion } = require('../../../../service/Functions');

const getBookName = async () => {
  const { Fetch } = await inquirer.prompt({
    type: 'input',
    name: 'Fetch',
    message: 'Menu de livros Digite o nome do livro',
  });
  return Fetch;
};

const caseObjIsFalse = (goBack) => {
  console.log('Sua busca está vazia! Voltando para o menu anterior');
  goBack();
};

const showTheBook = ({ characters, povCharacters, ...book }) => {
  console.log(JSON.stringify(book));
};

const getBooksFromAPI = async (url) => {
  const response = await fetch(`${url}`);
  const json = await response.json();
  const headers = response.headers.get('link');
  return { json, headers };
};

const getUrl = (value = '') =>
  `https://anapioficeandfire.com/api/books/?name=${value}`;

const run = async (goBack, dependencies = {}, url) => {
  if (url) {
    const { json, headers } = await getBooksFromAPI(url);
    return caseObjIsTrue(goBack, dependencies, json, headers);
  }

  const nameBook = await getBookName();
  const { json, headers } = await getBooksFromAPI(getUrl(nameBook));
  if (json.length > 0)
    return caseObjIsTrue(goBack, dependencies, json, headers);
  return caseObjIsFalse(goBack);
};

const values = {
  type: 'list',
  message: '[Listar Livros] - Escolha um livro para ver mais detalhes',
  name: 'book',
};
const caseObjIsTrue = async (
  goBack,
  dependencies = {},
  valuebyFetch,
  nextOrPrev
) => {
  const { type, name, message } = values;
  const line = new inquirer.Separator();
  const choices = [];
  const link = parseLinks(nextOrPrev);
  choices.push(line);
  await valuebyFetch.map((book) =>
    choices.push({ name: book.name, value: book })
  );
  if (link.next) choices.push({ name: 'Próxima página', value: 'next' });
  if (link.prev) choices.push({ name: 'Página anterior', value: 'prev' });
  choices.push({ name: 'Voltar para o menu anterior', value: 'back' });
  choices.push(line);
  return inquirerQuestion(inquirer, type, name, message, choices).then(
    ({ book }) => {
      if (book === 'back') return goBack();
      if (book === 'next' || book === 'prev')
        return run(goBack, dependencies, link[book]);
      showTheBook(book);
      return run(goBack, dependencies);
    }
  );
};

module.exports = { run };
