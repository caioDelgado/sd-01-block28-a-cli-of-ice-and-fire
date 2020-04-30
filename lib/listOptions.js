const { repeatSearch } = require('./repeatSearch');

async function filterObj(text, book) {
  const informationBook = Object.entries(book);
  informationBook.pop();

  if (text === 'livros') {
    informationBook.pop();
    return Object.fromEntries(informationBook);
  }
  return Object.fromEntries(informationBook);
}

async function chooseOption(links, choices, dependencies, param) {
  const { inquirer, log } = dependencies;
  const { goBack, url, repeatRun, text, newList } = param;

  choices.push(new inquirer.Separator());
  if (links.next) choices.push({ name: 'Próxima página', value: 'next' });
  if (links.prev) choices.push({ name: 'Página anterior', value: 'prev' });

  choices.push({ name: `Voltar para o menu de ${text}`, value: 'back' });
  choices.push(new inquirer.Separator());

  return inquirer.prompt({
    type: 'list',
    message: `[Listar ${text}] - Escolha um livro para ver mais detalhes`,
    name: 'book',
    choices,
  })
    .then(({ book }) => {
      if (book === 'back') return goBack();
      if (book === 'next' || book === 'prev')
        return newList(links[book], dependencies, param);

      log(filterObj(text, book));
      return repeatSearch(goBack, dependencies, url, repeatRun);
    });
}

module.exports = { chooseOption };
