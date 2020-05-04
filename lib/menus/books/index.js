const actions = require('./actions');
const { generateInquirer } = require('../defaultMenu.js');

const choices = [
  { name: 'Pesquisar livros', value: 'list' },
  { name: 'Voltar', value: 'back' },
];

function run(goBack, dependencies = {}) {
  const search = actions.search.search;
  const { inquirer } = dependencies;

  return generateInquirer('list', 'escolha uma opção:', 'action', choices).then(
    ({ action }) => {
      if (action === 'back') return goBack();
      return inquirer
        .prompt({
          type: 'input',
          name: 'text',
          message: 'Digite o nome do livro:',
        })
        .then(({ text }) => {
          search(() => run(goBack, dependencies), text);
        });
    },
  );
}

module.exports = { run };
