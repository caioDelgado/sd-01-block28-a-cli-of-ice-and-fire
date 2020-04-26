const libraryModule = require('./library');
const { optionMenu } = require('../../optionMenu');

function run(goBack, dependencies = {}) {
  const { library = libraryModule } = dependencies;
  optionMenu('casas', goBack, dependencies, library, run);
}

module.exports = { run };
