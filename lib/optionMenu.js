function optionMenu(menu) {
  const bookList = {
    type: 'list',
    name: 'action',
    message: `Menu de ${menu} -- Escolha uma ação`,
    choices: [
      { name: `Pesquisar ${menu}`, value: 'list' },
      { name: 'Voltar', value: 'back' },
    ],
  };
  return bookList;
}

module.exports = { optionMenu };
