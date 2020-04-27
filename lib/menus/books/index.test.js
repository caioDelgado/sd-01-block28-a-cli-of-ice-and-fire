const booksMenu = require('.');
const actions = require('./actions');

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
    test('calls list action', async () => {
      const inquirer = { prompt: jest.fn().mockResolvedValueOnce({ action: 'search' }) };
      const mockedActions = mockObject(actions);

      await booksMenu.run(undefined, { inquirer, actions: mockedActions });

      expect(mockedActions.search.run).toBeCalled();
    });

    test('calls back action', async () => {
      const inquirer = { prompt: jest.fn().mockResolvedValue({ action: 'back' }) };
      const mockedGoBack = jest.fn();
      await booksMenu.run(mockedGoBack, { inquirer });

      expect(mockedGoBack).toBeCalled();
    });
  });
});
