const libraryModule = require('./library');

const type = 'list';
const name = 'action';
const message = 'Menu de livros -- Escolha uma ação';

function run(goBack, dependencies = {}) {
  const { inquirer, library = libraryModule } = dependencies;

  return inquirer.prompt({
    type,
    name,
    message,
    choices: [
      { name: 'Pesquisar livros', value: 'list' },
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
