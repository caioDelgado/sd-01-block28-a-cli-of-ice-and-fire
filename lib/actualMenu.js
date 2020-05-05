const inquirer = require('inquirer');

async function actualMenu(actualOption, goBack, dependencies, actions, run) {
  const list = {
    type: 'list',
    name: 'action',
    message: `Menu de ${actualOption} -- Escolha uma ação`,
    choices: [
      { name: `Pesquisar ${actualOption}`, value: 'list' },
      { name: 'Voltar', value: 'back' },
    ],
  };
  return inquirer.prompt(list)
    .then(({ action }) => {
      if (action === 'back') return goBack();
      if (actions[action])
        return actions[action].run(() => run(goBack, dependencies), dependencies);
      return false;
    });
}

module.exports = { actualMenu };
