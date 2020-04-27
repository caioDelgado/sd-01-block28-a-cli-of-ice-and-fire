const { parseLinks } = require('../utils');

const addLinks = (choices, link, { inquirer }, type) => {
  const links = parseLinks(link);
  const options = [...choices];

  if (links.next) options.push({ name: 'Próxima página', value: 'next' });
  if (links.prev) options.push({ name: 'Página anterior', value: 'prev' });

  options.push({ name: `Voltar para o menu de ${type}`, value: 'back' });
  options.push(new inquirer.Separator());
  return options;
};

module.exports = { addLinks };
