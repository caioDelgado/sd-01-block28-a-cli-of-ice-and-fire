const actionsModule = require('./actions');
const { showMenu } = require('../menus');

function run(goBack, dependencies = {}) {
  const { inquirer, actions = actionsModule, superagent, log } = dependencies;
  const message = 'Menu de Livros -- Escolha uma ação';
  const choices = [
    { name: 'Escolher Livro', value: 'book' },
    { name: 'Voltar', value: 'back' },
  ];

  return showMenu(
    goBack,
    { inquirer, actions, superagent, log },
    message,
    { choices, run },
  );
}

module.exports = { run };
