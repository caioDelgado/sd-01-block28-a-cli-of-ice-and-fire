const actionsModule = require('./actions');

function run(goBack, dependencies = {}) {
  const { inquirer, actions = actionsModule } = dependencies;

  return inquirer.prompt({
    type: 'input',
    name: 'Fetch',
    message: `-- Menu de livros -- 
Digite o nome do livro →`,
  }).then(({ Fetch }) => actions[Fetch].run(() => run(goBack, dependencies), dependencies, Fetch = ''));
}

module.exports = { run };
