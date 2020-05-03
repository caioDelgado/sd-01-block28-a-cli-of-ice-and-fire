const actionsModule = require('./actions');

function run(goBack, dependencies = {}) {
  const { inquirer, actions = actionsModule } = dependencies;

  return inquirer
    .prompt({
      type: 'list',
      name: 'action',
      message: 'Menu de personagens -- Escolha uma ação',
      choices: [
        { name: 'Listar personagens', value: 'list' },
        { name: 'Voltar', value: 'back' },
      ],
    })
    .then(({ action }) => {
      if (action === 'back') return goBack();

      if (actions[action]) {
        return actions[action].run(
          () => run(goBack, dependencies),
          dependencies,
        );
      }

      return false;
    });
}

module.exports = { run };
