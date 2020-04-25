const inquirer = require('inquirer');

function optionMenu(menu, goBack, dependencies, actions, run) {
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

// const actionsModule = require('./actions');

// function run(goBack, dependencies = {}) {
//   const { inquirer, actions = actionsModule } = dependencies;

//   return inquirer.prompt(bookList)
//   .then(({ action }) => {
//     if (action === 'back') return goBack();

//     if (actions[action])
//       return actions[action].run(() => run(goBack, dependencies), dependencies);

//     return false;
//   });

// }

// module.exports = { run };
