const actionsModule = require('./actions');

const inquirerQuestion = (inquirer) => {
  return inquirer.prompt({
    type: 'list',
    name: 'actionBook',
    message: 'Menu de livros -- Escolha uma ação',
    choices: [
      { name: 'Buscar Livros', value: 'list' },
      { name: 'Voltar', value: 'back' },
    ],
  });
};

const run = (goBack, dependencies = {}) => {
  const { inquirer, actions = actionsModule } = dependencies;

  return inquirerQuestion(inquirer).then(({ actionBook }) => {
    if (actionBook === 'back') return goBack();

    if (actions[actionBook]) {
      return actions[actionBook].run(
        () => run(goBack, dependencies),
        dependencies
      );
    }

    return false;
  });
};

module.exports = { run };
