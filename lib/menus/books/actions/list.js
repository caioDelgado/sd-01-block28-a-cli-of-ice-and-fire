const fetch = require('node-fetch');
const inquirer = require('inquirer');
const actionsModule = require('../actions');

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

const caseObjIsTrue = async (goBack, dependencies = {}, valuebyFetch) => {
  const { inquirer } = dependencies;
  const line = new inquirer.Separator();
  const choices = [];

  choices.push(line);
  await valuebyFetch.map((book) => {
    choices.push({ name: book.name, value: book });
  });
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

const getUrl = (value) => {
  return `https://anapioficeandfire.com/api/books/?name=${value}`;
};

const showSearchResponse = async () => {
  const bookName = await getBookName();
  const valueResponse = await fetch(`${getUrl(bookName)}`).then((response) =>
    response.json()
  );
  return valueResponse;
};

const run = async (goBack, dependencies = {}) => {
  const valueFinal = await showSearchResponse();
  if (valueFinal.length > 0)
    return caseObjIsTrue(goBack, dependencies, valueFinal);
  return caseObjIsFalse(goBack);
};

module.exports = { run };
