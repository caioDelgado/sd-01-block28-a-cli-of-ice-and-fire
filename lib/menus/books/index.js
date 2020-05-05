const libraryModule = require('./actions');
const { actualMenu } = require('../../actualMenu');

function run(goBack, dependencies = {}) {
  const { library = libraryModule } = dependencies;
  actualMenu('livros', goBack, dependencies, library, run);
}

module.exports = { run };
