const libraryModule = require('./library');

function run(goBack, dependencies = {}) {
  const { inquirer, library = libraryModule } = dependencies;

  const bookList = {
    type: 'list',
    name: 'action',
    message: 'Menu de livros -- Escolha uma ação',
    choices: [
      { name: 'Pesquisar livros', value: 'list' },
      { name: 'Voltar', value: 'back' },
    ],
  };

  return inquirer.prompt(bookList)
    .then(({ action }) => {
      if (action === 'back') return goBack();

      if (library[action])
        return library[action].run(() => run(goBack, dependencies), dependencies);

      return false;
    });
}

module.exports = { run };
