const fetch = require('node-fetch');
const inquirer = require('inquirer');

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

const caseObjIsFalse = () => console.log('Sua busca está vazia');

const caseObjIsTrue = async (goBack, dependencies = {}, valuebyFetch) => {
  // const { log = console.log } = dependencies;
  const line = new inquirer.Separator();

  const choices = [];

  await valuebyFetch.map(({ name }) => {
    choices.push(line);
    choices.push(name);
    choices.push({ name: 'Voltar para o menu anterior', value: 'back' });
    choices.push(line);
  });

  return inquirer
    .prompt({
      type: 'list',
      message: '[Listar Livros] - Escolha um livro para ver mais detalhes',
      name: 'book',
      choices,
    })
    .then(({ book }) => {
      if (book === 'back') return goBack();
      return run(goBack, dependencies);
    });
};

const getUrl = (value) => {
  return `https://anapioficeandfire.com/api/books/?name=${value}`;
};

const showSearchResponse = async () => {
  const bookName = await getBookName();
  const valueResponse = await fetch(`${getUrl(bookName)}`).then((response) =>
    response
      .json()
      .then((json) =>
        response.ok ? Promise.resolve(json) : Promise.reject(json)
      )
  );
  return valueResponse;
};

const run = async (goBack) => {
  const valueFinal = await showSearchResponse();
  showSearchResponse();
  if (valueFinal) return caseObjIsTrue(goBack, (dependencies = {}), valueFinal);
  return caseObjIsFalse();
};

module.exports = { run };