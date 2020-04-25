const actionsModule = require('./actions');
const { optionMenu } = require('../../optionMenu');

// function run(goBack, dependencies = {}) {
//   const { inquirer, actions = actionsModule } = dependencies;

//   return inquirer.prompt({
//     type: 'list',
//     name: 'action',
//     message: 'Menu de casas -- Escolha uma ação',
//     choices: [
//       { name: 'Listar casas', value: 'list' },
//       { name: 'Voltar', value: 'back' },
//     ],
//   })
//     .then(({ action }) => {
//       if (action === 'back') return goBack();

//       if (actions[action])
//         return actions[action].run(() => run(goBack, dependencies), dependencies);

//       return false;
//     });
// }

function run(goBack, dependencies = {}) {
  const { actions = actionsModule } = dependencies;
  return optionMenu('casas', goBack, dependencies, actions, run);
}

module.exports = { run };
