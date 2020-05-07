const actionsModule = require('./actions');
const { inquirerQuestion } = require('../../../service/Functions');

const values = {
  type: 'list',
  name: 'action',
  message: 'Menu de personagens -- Escolha uma ação',
  choices: [
    { name: 'Listar personagens', value: 'list' },
    { name: 'Voltar', value: 'back' },
  ],
};

const run = (goBack, dependencies = {}) => {
  const { inquirer, actions = actionsModule } = dependencies;
  const { type, name, message, choices } = values;
  return inquirerQuestion(inquirer, type, name, message, choices).then(
    ({ action }) => {
      if (action === 'back') return goBack();

      if (actions[action]) {
        return actions[action].run(
          () => run(goBack, dependencies),
          dependencies
        );
      }

      return false;
    }
  );
};

module.exports = { run };
