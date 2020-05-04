const fetch = require('node-fetch');
const inquirer = require('inquirer');
const { parseLinks } = require('../../../utils');
const superagentModule = require('superagent');

const getBookName = () => {
  return inquirer
    .prompt({
      type: 'input',
      name: 'Fetch',
      message: `-- Menu de livros -- 
Digite o nome do livro →`,
    })
    .then(({ Fetch }) => Fetch);
};

const caseObjIsFalse = (goBack) => {
  console.log(`
|-------------------------------|  
|     Sua busca está vazia      |
|             ___               |
|            (._.)              |
|            <|>                |
|            _/\_                |
|                               | 
| Voltando para o menu anterior |
|-------------------------------|
`);
  goBack();
};

const showTheBook = ({ characters, povCharacters, ...book }) => {
  console.log(JSON.stringify(book));
};

const caseObjIsTrue = async (
  goBack,
  dependencies = {},
  valuebyFetch,
  nextOrPrev
) => {
  const { inquirer } = dependencies;
  const line = new inquirer.Separator();
  const choices = [];

  choices.push(line);
  await valuebyFetch.map((book) => {
    choices.push({ name: book.name, value: book });
  });

  if (nextOrPrev === 'next') {
    choices.push({ name: 'Próxima página', value: 'next' });
  }

  if (nextOrPrev === 'prev') {
    choices.push({ name: 'Página anterior', value: 'prev' });
  }

  choices.push({ name: 'Voltar para o menu anterior', value: 'back' });
  choices.push(line);

  return inquirer
    .prompt({
      type: 'list',
      message: '[Listar Livros] - Escolha um livro para ver mais detalhes',
      name: 'book',
      choices,
    })
    .then(({ book }) => {
      if (book === 'back') return goBack();
      showTheBook(book);
      return run(goBack, dependencies);
    });
};

const getUrl = (value = '') => {
  return `https://anapioficeandfire.com/api/books/?name=${value}`;
};

// const showSearchResponse = async () => {
//   const bookName = await getBookName();
//   return superagentModule.get(`${getUrl(bookName)}`);
// };

// const showSearchResponse = async () => {

//   const bookName = await getBookName();

//   const request = superagentModule.get(getUrl(bookName));

//   if (!bookName) request.query({ page: 1, pageSize: 10 });
//   return request
// };

// const showSearchResponse = async () => {
//   const bookName = await getBookName();
//   let valueReturn = { json: '', headers: '' };
//   await fetch(`${getUrl(bookName)}`)
//     .then((response) => (valueReturn[json] = response.json()))
//     // .then((response) => (valueReturn[headers] = response.headers));

//   return await valueReturn;
// };

const showSearchResponse = async () => {
  const bookName = await getBookName();
  return await fetch(`${getUrl(bookName)}`);
};

const manipulatingTheString = (value) => {
  const fistArray = value.split(',');
  const secondArray = fistArray.map((link) => link.split(';'));
  const thirdArray = secondArray.map((linkPairs) =>
    linkPairs.map((part) => part.trim())
  );
  const fourthArray = thirdArray.map(([link, rel]) => [
    rel.replace(/(?:rel)|"|=/gi, ''),
    link.replace(/<|>/g, ''),
  ]);
  const fifthArray = fourthArray.filter(
    ([rel]) => rel !== 'first' && rel !== 'last'
  );
  return fifthArray;
};

const run = async (goBack, dependencies = {}) => {
  const json = await showSearchResponse().then((response) => response.json());
  const headers = await showSearchResponse().then((response) =>
    response.headers.get('link')
  );

  const header = await manipulatingTheString(headers)[0][0];
  console.log(header);
  if (json.length > 0) return caseObjIsTrue(goBack, dependencies, json, header);
  return caseObjIsFalse(goBack);
};

module.exports = { run };

// perguntar o Roz como guardar num objeto a qual posso fazer um destruction no showSearchResponse. tmb perguntar ele como paginar usando o fetch
