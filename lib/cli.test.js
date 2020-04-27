const cli = require('./cli');

describe('main menu', () => {
  describe('presented options', () => {
    let choices = [];

    beforeAll(async () => {
      const inquirer = { prompt: jest.fn().mockResolvedValueOnce({}) };

      cli.run({ inquirer });

      choices = inquirer.prompt.mock.calls[0][0].choices.map(({ name }) => name);
    });

    test('shows characters option', () => {
      expect(choices).toContain('Personagens');
    });

    test('shows books option', () => {
      expect(choices).toContain('Livros');
    });

    test('shows houses option', () => {
      expect(choices).toContain('Casas');
    });

    test('shows exit opiton', () => {
      expect(choices).toContain('Sair');
    });
  });

  describe('executed actions', () => {
    test('opens characters menu', async () => {
      const inquirer = { prompt: jest.fn().mockResolvedValueOnce({ menu: 'characters' }) };
      const menus = { characters: { run: jest.fn() } };

      await cli.run({ inquirer, menus });

      expect(menus.characters.run).toBeCalled();
    });

    test('opens books menu', async () => {
      const inquirer = { prompt: jest.fn().mockResolvedValueOnce({ menu: 'books' }) };
      const menus = { books: { run: jest.fn() } };

      await cli.run({ inquirer, menus });

      expect(menus.books.run).toBeCalled();
    });

    test('opens houses menu', async () => {
      const inquirer = { prompt: jest.fn().mockResolvedValueOnce({ menu: 'houses' }) };
      const menus = { houses: { run: jest.fn() } };

      await cli.run({ inquirer, menus });

      expect(menus.houses.run).toBeCalled();
    });

    test('performs exit action', async () => {
      const inquirer = { prompt: jest.fn().mockResolvedValueOnce({ menu: 'exit' }) };
      const log = jest.fn();

      await cli.run({ inquirer, log });

      expect(log).toBeCalledWith('OK... Até mais!');
    });
  });
});
