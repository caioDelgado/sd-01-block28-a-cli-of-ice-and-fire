const actionsModule = require('./actions');

async function run(goBack, dependencies = {}) {
  const { inquirer, actions = actionsModule } = dependencies;

  return inquirer.prompt({
    type: 'list',
    name: 'action',
    message: 'Menu de livros -- Escolha uma ação',
    choices: [
      { name: 'Pesquisar livros', value: 'search' },
      { name: 'Voltar', value: 'back' },
    ],
  })
    .then(({ action }) => {
      if (action === 'back') return goBack();

      if (actions[action]) return actions[action]
        .run(() => run(goBack, dependencies), dependencies);

      return false;
    });
}

module.exports = { run };
