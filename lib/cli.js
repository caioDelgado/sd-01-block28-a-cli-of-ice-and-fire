const inquirerModule = require('inquirer');

const menusModule = require('./menus');

function run(dependencies = {}) {
  const { inquirer = inquirerModule, log = console.log, menus = menusModule } = dependencies;

  return inquirer.prompt({
    type: 'list',
    name: 'menu',
    message: 'Boas vindas! Escolha um menu para continuar',
    choices: [
      { name: 'Personagens', value: 'characters' },
      { name: 'Livros', value: 'books' },
      { name: 'Casas', value: 'houses' },
      { name: 'Sair', value: 'exit' },
    ],
  })
    .then(({ menu }) => {
      if (menu === 'exit') return log('OK... Até mais!');

      if (menus[menu]) {
        return menus[menu].run(run, { inquirer, log });
      }

      return false;
    });
}

module.exports = { run };
