const booksMenu = require('.');
const library = require('./library');

function mockObject(object) {
  return Object.keys(object).reduce((result, key) => ({
    ...result,
    [key]: {
      run: jest.fn(),
    },
  }), {});
}

describe('books menu', () => {
  describe('presented options', () => {
    let choices = [];

    beforeAll(async () => {
      const inquirer = { prompt: jest.fn().mockResolvedValueOnce({}) };

      booksMenu.run(undefined, { inquirer });

      choices = inquirer.prompt.mock.calls[0][0].choices.map(({ name }) => name);
    });

    test('displays list option', async () => {
      expect(choices).toContain('Pesquisar livros');
    });

    test('displays back option', async () => {
      expect(choices).toContain('Voltar');
    });
  });

  describe('executed actions', () => {
    test('calls list library', async () => {
      const inquirer = { prompt: jest.fn().mockResolvedValueOnce({ action: 'list' }) };
      const mockedActions = mockObject(library);

      await booksMenu.run(undefined, { inquirer, library: mockedActions });

      expect(mockedActions.list.run).toBeCalled();
    });

    test('calls back library', async () => {
      const mockedGoBack = jest.fn();
      const inquirer = { prompt: jest.fn().mockResolvedValue({ action: 'back' }) };

      await booksMenu.run(mockedGoBack, { inquirer });

      expect(mockedGoBack).toBeCalled();
    });
  });
});
