const inquirerModule = require('inquirer');

const listAction = require('./list');
const charactersFixture = require('../../../../test/fixtures/characters');

function getSuperagentMock(response) {
  const superagent = {
    get: jest.fn(),
    query: jest.fn(),
    end: jest.fn().mockImplementation((callback) => {
      callback(null, response);
    }),
  };

  superagent.get.mockImplementation(() => superagent);
  superagent.query.mockImplementation(() => superagent);

  return superagent;
}

describe('List action', () => {
  describe('presented options', () => {
    let choices = [];

    const superagent = getSuperagentMock(charactersFixture.responses.hasNext);

    beforeAll(async () => {
      const inquirer = {
        prompt: jest.fn().mockResolvedValue({ character: {} }),
        Separator: inquirerModule.Separator,
      };

      await listAction.run(undefined, { inquirer, superagent });

      choices = inquirer.prompt.mock.calls[0][0].choices.map(({ name }) => name);
    });

    test('calls API to get results', () => {
      expect(superagent.get).toBeCalledWith('https://www.anapioficeandfire.com/api/characters?page=1&pageSize=10');
      expect(superagent.query).toBeCalledWith({ page: 1, pageSize: 10 });
    });

    test('presents all returned results as options', () => {
      expect(choices).toEqual(expect.arrayContaining(charactersFixture.names.hasNext));
    });

    test('presents a "back" option', () => {
      expect(choices).toContain('Voltar para o menu de personagens');
    });
  });

  describe('details', () => {
    const superagent = getSuperagentMock(charactersFixture.responses.hasNext);
    const character = charactersFixture.responses.hasNext.body[0];
    const mockPrompt = jest.fn().mockImplementation((question) => {
      if (question.type === 'list') return Promise.resolve({ character });
      return Promise.resolve({ repeat: false });
    });

    const inquirer = {
      prompt: mockPrompt,
      Separator: inquirerModule.Separator,
    };

    const log = jest.fn();

    beforeAll(async () => {
      await listAction.run(undefined, { inquirer, log, superagent });
    });

    test('display details of selected character', async () => {
      expect(log.mock.calls[0][0]).toEqual(character);
    });

    test('offers to go back to character list after showing details', () => {
      expect(inquirer.prompt).toBeCalledWith({
        type: 'confirm',
        message: 'Deseja consultar outra personagem?',
        name: 'repeat',
        default: true,
      });
    });
  });

  describe('pagination', () => {
    describe('next', () => {
      const superagent = getSuperagentMock(charactersFixture.responses.hasNext);
      const mockPrompt = jest.fn();
      mockPrompt.mockImplementation(() => {
        if (mockPrompt.mock.calls.length === 1) return Promise.resolve({ character: 'next' });
        return Promise.resolve({ character: {} });
      });

      const inquirer = {
        prompt: mockPrompt,
        Separator: inquirerModule.Separator,
      };

      const log = jest.fn();

      beforeAll(async () => {
        await listAction.run(undefined, { inquirer, log, superagent });
      });

      test('presents a "next" option when not in the last page', async () => {
        const choices = inquirer.prompt.mock.calls[0][0].choices.map(({ name }) => name);
        expect(choices).toContain('Próxima página');
        expect(choices).not.toContain('Página anterior');
      });

      test('requests next page from API when "next" option is selected', () => {
        expect(superagent.get).toBeCalledWith('https://www.anapioficeandfire.com/api/characters?page=2&pageSize=10');
        expect(superagent.query).toBeCalledTimes(1);
      });
    });

    describe('previous', () => {
      const superagent = getSuperagentMock(charactersFixture.responses.hasPrevious);
      const mockPrompt = jest.fn();
      mockPrompt.mockImplementation(() => {
        if (mockPrompt.mock.calls.length === 1) return Promise.resolve({ character: 'prev' });
        return Promise.resolve({ character: {} });
      });

      const inquirer = {
        prompt: mockPrompt,
        Separator: inquirerModule.Separator,
      };

      const log = jest.fn();

      beforeAll(async () => {
        await listAction.run(undefined, { inquirer, log, superagent });
      });

      test('presents a "previous" option when not in the last page', async () => {
        const choices = inquirer.prompt.mock.calls[0][0].choices.map(({ name }) => name);
        expect(choices).not.toContain('Próxima página');
        expect(choices).toContain('Página anterior');
      });

      test('requests previous page from API when "previous" option is selected', () => {
        expect(superagent.get).toBeCalledWith('https://www.anapioficeandfire.com/api/characters?page=213&pageSize=10');
        expect(superagent.query).toBeCalledTimes(1);
      });
    });
  });

  describe('actions', () => {
    const superagent = getSuperagentMock(charactersFixture.responses.hasBoth);
    const inquirer = {
      prompt: jest.fn().mockResolvedValueOnce({ character: 'back' }),
      Separator: inquirerModule.Separator,
    };

    const log = jest.fn();
    const mockedGoBack = jest.fn();

    beforeAll(async () => {
      listAction.run(mockedGoBack, { superagent, inquirer, log });
    });

    test('goes back to list action when "back" option is selected', () => {
      expect(mockedGoBack).toBeCalled();
      expect(log).not.toBeCalled();
    });
  });
});
