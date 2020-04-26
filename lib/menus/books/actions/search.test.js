const inquirerModule = require('inquirer');

const searchAction = require('./search');
const booksFixture = require('../../../../test/fixtures/books');

function getSuperagentMock(response) {
  const superagent = {
    get: jest.fn(),
    query: jest.fn(),
  };

  superagent.get.mockImplementation(() => superagent);
  superagent.query.mockImplementation(() => response);

  return superagent;
}


describe('List action', () => {
  describe('presented options', () => {
    let choices = [];

    const superagent = getSuperagentMock(booksFixture.responses.hasNext);

    beforeAll(async () => {
      const inquirer = {
        prompt: jest.fn().mockResolvedValue({ book: 'A Knight of the Seven Kingdoms' }),
        Separator: inquirerModule.Separator,
      };

      await searchAction.run(undefined, { inquirer, superagent });

      choices = inquirer.prompt.mock.calls[1][0].choices.map(({ name }) => name);
    });

    test('calls API to get results', () => {
      expect(superagent.get).toBeCalledWith('https://www.anapioficeandfire.com/api/books');
      expect(superagent.query).toBeCalledWith({ name: 'A Knight of the Seven Kingdoms', page: 1, pageSize: 10 });
    });

    test('presents all returned results as options', () => {
      expect(choices).toEqual(expect.arrayContaining(booksFixture.names.hasNext));
    });

    test('presents a "back" option', () => {
      expect(choices).toContain('Voltar para o menu de livros');
    });
  });

  describe('details', () => {
    const superagent = getSuperagentMock(booksFixture.responses.hasNext);
    const book = booksFixture.responses.hasNext.body[0];
    const mockPrompt = jest.fn().mockImplementation((question) => {
      if (question.type === 'list') return Promise.resolve({ book });
      return Promise.resolve({ repeat: false });
    });

    const inquirer = {
      prompt: mockPrompt,
      Separator: inquirerModule.Separator,
    };

    const log = jest.fn();

    beforeAll(async () => {
      await searchAction.run(undefined, { inquirer, log, superagent });
    });

    test('display details of selected book', async () => {
      expect(log.mock.calls[0][0]).toEqual(book);
    });

    test('offers to go back to character list after showing details', () => {
      expect(inquirer.prompt).toBeCalledWith({
        type: 'confirm',
        message: 'Deseja consultar outro livro?',
        name: 'repeat',
        default: true,
      });
    });
  });

  describe('pagination', () => {
    describe('next', () => {
      const superagent = getSuperagentMock(booksFixture.responses.hasNext);
      const mockPrompt = jest.fn();
      mockPrompt.mockImplementation(() => {
        if (mockPrompt.mock.calls.length === 1) return Promise.resolve({ book: 'next' });
        return Promise.resolve({ book: {} });
      });

      const inquirer = {
        prompt: mockPrompt,
        Separator: inquirerModule.Separator,
      };

      const log = jest.fn();

      beforeAll(async () => {
        await searchAction.run(undefined, { inquirer, log, superagent });
      });

      test('presents a "next" option when not in the last page', async () => {
        const choices = inquirer.prompt.mock.calls[1][0].choices.map(({ name }) => name);
        expect(choices).toContain('Próxima página');
        expect(choices).not.toContain('Página anterior');
      });

      test('requests next page from API when "next" option is selected', () => {
        expect(superagent.get).toBeCalledWith('https://www.anapioficeandfire.com/api/books');
        expect(superagent.query).toBeCalledTimes(1);
      });
    });

    describe('previous', () => {
      const superagent = getSuperagentMock(booksFixture.responses.hasPrevious);
      const mockPrompt = jest.fn();
      mockPrompt.mockImplementation(() => {
        if (mockPrompt.mock.calls.length === 1) return Promise.resolve({ book: 'prev' });
        return Promise.resolve({ book: {} });
      });

      const inquirer = {
        prompt: mockPrompt,
        Separator: inquirerModule.Separator,
      };

      const log = jest.fn();

      beforeAll(async () => {
        await searchAction.run(undefined, { inquirer, log, superagent });
      });

      test('presents a "previous" option when not in the last page', async () => {
        const choices = inquirer.prompt.mock.calls[1][0].choices.map(({ name }) => name);
        expect(choices).not.toContain('Próxima página');
        expect(choices).toContain('Página anterior');
      });

      test('requests previous page from API when "previous" option is selected', () => {
        expect(superagent.get).toBeCalledWith('https://www.anapioficeandfire.com/api/books');
        expect(superagent.query).toBeCalledTimes(1);
      });
    });
  });

  describe('actions', () => {
    const superagent = getSuperagentMock(booksFixture.responses.hasBoth);
    const inquirer = {
      prompt: jest.fn().mockResolvedValue({ book: 'back' }),
      Separator: inquirerModule.Separator,
    };

    const log = jest.fn();
    const mockedGoBack = jest.fn();

    beforeAll(async () => {
      searchAction.run(mockedGoBack, { superagent, inquirer, log });
    });

    test('goes back to list action when "back" option is selected', () => {
      expect(mockedGoBack).toBeCalled();
      expect(log).not.toBeCalled();
    });
  });
});
