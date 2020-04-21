const actions = require('./actions');
function run(goBack, dependencies = {}) {
  const search = actions.search.search;
  const { inquirer } = dependencies;

  return inquirer
    .prompt({
      type: "list",
      name: "action",
      message: "Escolha uma opção:",
      choices: [
        { name: "Pesquisar livros", value: "list" },
        { name: "Voltar", value: "back" }
      ]
    })
    .then(({ action }) => {
      if (action === "back") return goBack();
      return inquirer
        .prompt({
          type: "input",
          name: "text",
          message: "Digite o nome do livro:"
        })
        .then(({ text }) => {
          search(text);
        });
    });
}

module.exports = { run };
