const actionsModule = require('./library');

function run(goBack, dependencies = {}) {
  const { inquirer, library = actionsModule } = dependencies;

  return inquirer.prompt({
    type: 'list',
    name: 'action',
    message: 'Menu de livros -- Escolha uma ação',
    choices: [
      { name: 'Pesquisar livros', value: 'list' },
      { name: 'Pesquisar livro pelo nome', value: 'book' },
      { name: 'Filtrar livros pelo nome', value: 'listInput'},
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
