const actionsModule = require('./actions');
const optionMenu = require('../../optionMenu');

function run(goBack, dependencies = {}) {
  const { inquirer, actions = actionsModule } = dependencies;

  return inquirer.prompt(optionMenu('casas'))
    .then(({ action }) => {
      if (action === 'back') return goBack();

      if (actions[action])
        return actions[action].run(() => run(goBack, dependencies), dependencies);

      return false;
    });
}

module.exports = { run };
