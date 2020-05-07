const actionsModule = require('./actions');
const { inquirerQuestion } = require('../../../service/Functions');

const values = {
  type: 'list',
  name: 'actionBook',
  message: 'Menu de livros -- Escolha uma ação',
  choices: [
    { name: 'Buscar Livros', value: 'list' },
    { name: 'Voltar', value: 'back' },
  ],
};

const run = (goBack, dependencies = {}) => {
  const { inquirer, actions = actionsModule } = dependencies;

  const { type, name, message, choices } = values;

  return inquirerQuestion(inquirer, type, name, message, choices).then(
    ({ actionBook }) => {
      if (actionBook === 'back') return goBack();

      if (actions[actionBook])
        return actions[actionBook].run(
          () => run(goBack, dependencies),
          dependencies
        );
      return false;
    }
  );
};

module.exports = { run };
