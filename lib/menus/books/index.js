const actionsModule = require('./library');

function run(goBack, dependencies = {}) {
  const { inquirer, library = actionsModule, log } = dependencies;

  return inquirer.prompt({
    type: 'list',
    name: 'action',
    message: 'Menu de livros -- Escolha uma ação',
    choices: [
      { name: 'Pesquisar Livros', value: 'list' },
      { name: 'Voltar', value: 'back' },
    ],
  })
    .then(({ action }) => {
      if (action === 'back') return goBack();

      if (library[action]) {
        return library[action].run(() => run(goBack, dependencies), dependencies);
      }

      return false;
    });
}

module.exports = { run };
