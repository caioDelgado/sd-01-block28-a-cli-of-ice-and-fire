
const { parseLinks } = require('../../../utils');

async function run(goBack, dependencies, url) {
  return new Promise((resolve, reject) => {
    const { inquirer, superagent, log = console.log } = dependencies;

    const request = superagent.get(url || 'https://www.anapioficeandfire.com/api/characters');
    // dependendo da string de consulta  o headers.link sofre mudanças;
    // cria uma string de consulta https://www.anapioficeandfire.com/api/characters?page=2&pageSize=10>
    // valores depois da ?;

    if (!url) request.query({ page: 1, pageSize: 10 });
    // elementos de consulta vem com esse valor na primeira solicitação;
    request.end((err, { body, headers: { link } }) => {
      // responsável por receber o retorno da solicitação
      // dependendo da string de consulta  o headers.link sofre mudanças;
      // console.log(body) // body é tudo o que é retornado, um array de objetos neste caso
      // console.log(link)
      if (err) return reject(err);

      const choices = body.map((character) => {
        const { name, aliases } = character;

        return {
          name: name || aliases[0],
          // se o filme tiver nome, pega o nome, senão pega o apelido que esta em um array;
          value: character, // recebe todo o objeto;
        };
      });

      choices.push(new inquirer.Separator()); // serve para fazer uma linha de separação

      const links = parseLinks(link);

      if (links.next) {
        choices.push({ name: 'Próxima página', value: 'next' });
      }

      if (links.prev) {
        choices.push({ name: 'Página anterior', value: 'prev' });
      }

      choices.push({ name: 'Voltar para o menu de personagens', value: 'back' });
      // descobrir a relação do value;

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

          log(character); // retorna o objeto de informações;

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
