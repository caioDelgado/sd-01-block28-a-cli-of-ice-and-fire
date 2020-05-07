const inquirerModule = require('inquirer');
const { inquirerQuestion } = require('../service/Functions');
const menusModule = require('./menus');

const values = {
  type: 'list',
  name: 'menu',
  message: 'Boas vindas! Escolha um menu para continuar',
  choices: [
    { name: 'Personagens', value: 'characters' },
    { name: 'livros', value: 'books' },
    { name: 'Sair', value: 'exit' },
  ],
};

const run = (dependencies = {}) => {
  const {
    inquirer = inquirerModule,
    log = console.log,
    menus = menusModule,
  } = dependencies;
  const { type, name, message, choices } = values;
  return inquirerQuestion(inquirer, type, name, message, choices).then(
    ({ menu }) => {
      if (menu === 'exit') return log('OK... Até mais!');

      if (menus[menu]) {
        return menus[menu].run(run, { inquirer, log });
      }
      return false;
    }
  );
};

module.exports = { run };
