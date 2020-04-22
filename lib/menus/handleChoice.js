const { parseLinks } = require('../utils');

function handleChoice({ selectChoice }, goBack, dependencies, { url, link, message, run }) {
  const { inquirer } = dependencies;
  const log = console.log;
  const links = parseLinks(link);
  if (selectChoice === 'back') return goBack();
  if (selectChoice === 'next' || selectChoice === 'prev') {
    return run(goBack, dependencies, links[selectChoice]);
  }
  if (!selectChoice.url) return log('Deu ruim');
  log(selectChoice);
  return inquirer.prompt({
    type: 'confirm',
    message,
    name: 'repeat',
    default: true,
  }).then(answers => repeatChoice(answers, goBack, dependencies, url, run));
}

function repeatChoice({ repeat }, goBack, dependencies, url, run) {
  const log = console.log;
  if (!repeat) return log('Bye');
  return run(goBack, dependencies, url);
}

module.exports = { handleChoice };
