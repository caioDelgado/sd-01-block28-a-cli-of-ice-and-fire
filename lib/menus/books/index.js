const libraryModule = require('./library');
const { optionMenu } = require('../../optionMenu');

function run(goBack, dependencies = {}) {
  const { inquirer, library = libraryModule } = dependencies;

  return inquirer.prompt(optionMenu('livros'))
    .then(({ action }) => {
      if (action === 'back') return goBack();

      if (library[action])
        return library[action].run(() => run(goBack, dependencies), dependencies);

      return false;
    });
}

module.exports = { run };
