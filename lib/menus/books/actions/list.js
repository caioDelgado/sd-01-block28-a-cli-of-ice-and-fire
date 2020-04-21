const fetch = require('node-fetch');

const url = (value) => `https://anapioficeandfire.com/api/books/${value}`

// Voce tá garrado na questão do endpoint.
// Voce não sabe se é para usar um endpoit
// Nem sabe usar o endpoint
// Na verdade sabe, mais não sabe como associar um endpoint escrito por um numerico
// Tmb não sabe como vai relacionar o campo index com o lis
// O list está funcionado, somente se ele for chamado diretamente na raiz
// ou seja, no index


const run = async (goBack, dependencies = {}, endPoint) => {
  const { inquirer, log = console.log } = dependencies;
  const line = new inquirer.Separator();
  const choices = []
  
  await fetch(`${url(endPoint)}`)
    .then((response) => response.json().then((json) => (response.ok ? Promise.resolve(json) : Promise.reject(json))))
    .then(data => data.map(({ name }) => choices.push(name)));

    choices.push(line)
    choices.push({ name: 'Voltar para o menu anterior', value: 'back' });
    choices.push(line)

  return inquirer.prompt({
    type: 'list',
    message: '[Listar Livros] - Escolha um livro para ver mais detalhes',
    name: 'book',
    choices,
  }).then(({ book }) => {
    if (book === 'back') return goBack();
    log(book);
  })
};

module.exports = { run };