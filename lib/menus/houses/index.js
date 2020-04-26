const actionsModule = require('./actions');
const { optionMenu } = require('../../optionMenu');

function run(goBack, dependencies = {}) {
  const { actions = actionsModule } = dependencies;
  return optionMenu('casas', goBack, dependencies, actions, run);
}

module.exports = { run };
