const charactersMenu = require('.');
const actions = require('./actions');

function mockObject(object) {
  return Object.keys(object).reduce((result, key) => ({
    ...result,
    [key]: {
      run: jest.fn(),
    },
  }), {});
}

describe('characters menu', () => {
  describe('presented options', () => {
    let choices = [];

    beforeAll(async () => {
      const inquirer = { prompt: jest.fn().mockResolvedValueOnce({}) };

      charactersMenu.run(undefined, { inquirer });

      choices = inquirer.prompt.mock.calls[0][0].choices.map(({ name }) => name);
    });

    test('displays list option', async () => {
      expect(choices).toContain('Listar personagens');
    });

    test('displays back option', async () => {
      expect(choices).toContain('Voltar');
    });
  });

  describe('executed actions', () => {
    test('calls list action', async () => {
      const inquirer = { prompt: jest.fn().mockResolvedValueOnce({ action: 'list' }) };
      const mockedActions = mockObject(actions);

      await charactersMenu.run(undefined, { inquirer, actions: mockedActions });

      expect(mockedActions.list.run).toBeCalled();
    });

    test('calls back action', async () => {
      const mockedGoBack = jest.fn();
      const inquirer = { prompt: jest.fn().mockResolvedValue({ action: 'back' }) };

      await charactersMenu.run(mockedGoBack, { inquirer });

      expect(mockedGoBack).toBeCalled();
    });
  });
});
