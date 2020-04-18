const actionsModule = require('./actions');

function run(goBack, dependencies = {}) {
  const { inquirer, actions = actionsModule, log } = dependencies;

  return inquirer.prompt({
    type: 'list',
    name: 'action',
    message: 'Menu de personagens -- Escolha uma ação',
    choices: [
      { name: 'Listar personagens', value: 'list' },
      { name: 'Voltar', value: 'back' },
    ],
  })
    .then(({ action }) => {
      log(action)
      if (action === 'back') return goBack(); // roda a função que foi passada como parametro do cli, por isso que volta;

      if (actions[action]) {
        return actions[action].run(() => run(goBack, dependencies), dependencies);
      }

      return false;
    });
}

module.exports = { run };
