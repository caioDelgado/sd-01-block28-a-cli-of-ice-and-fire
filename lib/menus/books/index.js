const actionsModule = require('./actions');

function run(goBack, dependencies = {}) {
  const { inquirer, actions = actionsModule } = dependencies;

  return inquirer.prompt({
    type: 'list',
    name: 'action',
    message: 'Menu de Livros -- Escolha uma ação',
    choices: [
      { name: 'Escolher Livro', value: 'book' },
      { name: 'Voltar', value: 'back' },
    ],
  })
    .then(({ action }) => {
      if (action === 'back') return goBack();

      if (actions[action]) {
        return inquirer.prompt({
          type: 'input',
          message: 'Digite o nome do livro?',
          name: 'answers',
        }).then(answer => actions[action].run(() => run(goBack, dependencies), dependencies, answer));
        
      }

      return false;
    });
}

module.exports = { run };
