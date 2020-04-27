const actionsModule = require('./actions');
const { showMenu } = require('../menus');

function run(goBack, dependencies = {}) {
  const { inquirer, actions = actionsModule, superagent, log } = dependencies;
  const choices = [
    { name: 'Listar personagens', value: 'list' },
    { name: 'Voltar', value: 'back' },
  ];

  return showMenu(
    { goBack, inquirer, actions, superagent, log },
    'Menu de personagens -- Escolha uma ação',
    choices,
    run,
  );
}

module.exports = { run };
