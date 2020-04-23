const actionsModule = require('./actions');
const { showMenu } = require('../menus');

function run(goBack, dependencies = {}) {
  const { inquirer, actions = actionsModule, superagent, log } = dependencies;
  const message = 'Menu de personagens -- Escolha uma ação';
  const choices = [
    { name: 'Listar personagens', value: 'list' },
    { name: 'Voltar', value: 'back' },
  ];

  return showMenu(goBack, { inquirer, actions, superagent, log }, message, choices);
}

module.exports = { run };
