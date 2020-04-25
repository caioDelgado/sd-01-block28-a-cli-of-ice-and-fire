
const { parseLinks } = require('../../../utils');

async function run(goBack, dependencies, url) {
  return new Promise((resolve) => {
    const { inquirer, superagent, log = console.log } = dependencies;

    const request = superagent.get(url || 'https://www.anapioficeandfire.com/api/characters');
    if (!url) request.query({ page: 1, pageSize: 10 });

    request.then(({ body, headers: { link } }) => {
      const choices = body.map((character) => {
        const { name, aliases } = character;

        return {
          name: name || aliases[0],
          value: character,
        };
      });

      choices.push(new inquirer.Separator());

      const links = parseLinks(link);

      if (links.next) {
        choices.push({ name: 'Próxima página', value: 'next' });
      }

      if (links.prev) {
        choices.push({ name: 'Página anterior', value: 'prev' });
      }

      choices.push({ name: 'Voltar para o menu de personagens', value: 'back' });

      choices.push(new inquirer.Separator());

      return inquirer.prompt({
        type: 'list',
        message: '[Listar Personagens] - Escolha uma personagem para ver mais detalhes',
        name: 'character',
        choices,
      })
        .then(({ character }) => {
          if (character === 'back') return goBack();
          if (character === 'next' || character === 'prev') {
            return resolve(run(goBack, dependencies, links[character]));
          }

          if (!character.url) return resolve();

          log(character);

          return inquirer.prompt({
            type: 'confirm',
            message: 'Deseja consultar outra personagem?',
            name: 'repeat',
            default: true,
          })
            .then(({ repeat }) => {
              if (!repeat) return resolve();
              return resolve(run(goBack, dependencies, url));
            });
        });
    });
  });
}

module.exports = { run };
