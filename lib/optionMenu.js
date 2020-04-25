const inquirer = require('inquirer');

async function optionMenu(menu, goBack, dependencies, actions, run) {
  const bookList = {
    type: 'list',
    name: 'action',
    message: `Menu de ${menu} -- Escolha uma ação`,
    choices: [
      { name: `Pesquisar ${menu}`, value: 'list' },
      { name: 'Voltar', value: 'back' },
    ],
  };
  return inquirer.prompt(bookList)
    .then(({ action }) => {
      if (action === 'back') return goBack();
      if (actions[action])
        return actions[action].run(() => run(goBack, dependencies), dependencies);
      return false;
    });
}

module.exports = { optionMenu };
