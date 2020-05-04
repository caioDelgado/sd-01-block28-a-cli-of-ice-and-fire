const inquirer = require('inquirer');

function generateInquirer(tp, msg, nm, chc) {
  return inquirer.prompt({
    type: tp,
    message: msg,
    name: nm,
    choices: chc,
  });
}

module.exports = { generateInquirer };
