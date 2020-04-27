const actionsModule = require('./actions');
const { showMenu } = require('../menus');

function run(goBack, dependencies = {}) {
  const { inquirer, actions = actionsModule, superagent, log } = dependencies;

  return showMenu(
    { goBack, inquirer, actions, superagent, log },
    'Menu de Livros -- Escolha uma ação',
    [
      { name: 'Escolher Livro', value: 'book' },
      { name: 'Voltar', value: 'back' },
    ],
    run,
  );
}

module.exports = { run };
