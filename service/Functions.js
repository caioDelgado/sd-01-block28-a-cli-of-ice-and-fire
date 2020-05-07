const inquirerQuestion = (inquirer, type, name, message, choices) => {
  const values = {
    type,
    name,
    message,
    choices,
  };
  return inquirer.prompt({ ...values });
};

module.exports = { inquirerQuestion };
