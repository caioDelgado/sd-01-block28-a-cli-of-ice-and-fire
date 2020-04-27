const { linkAndUrl } = require('./LinkAndUrl');
const { handleChoice } = require('./handleChoice.js');

function selectMenu(
  { type, message, name, choices, question, url, link },
  { goBack, dependencies, run },
  inquirer,
) {
  return inquirer.prompt({
    type,
    message,
    name,
    choices,
  })
    .then(answers => (
      handleChoice(
        answers,
        goBack,
        dependencies,
        linkAndUrl(url, link, question, run),
      )));
}

module.exports = { selectMenu };
