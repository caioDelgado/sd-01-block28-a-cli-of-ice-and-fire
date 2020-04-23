
function run(goBack, dependencies = {}) {
  const { inquirer } = dependencies;

  return inquirer.prompt({
    type: 'list',
    name: 'action',
    message: 'Menu dos livros -- Escolha uma ação',
    choices: [
      { name: 'Voltar', value: 'back' },
    ],
  })
    .then(({ action }) => {
      if (action === 'back') return goBack();
    });
}

module.exports = { run };
