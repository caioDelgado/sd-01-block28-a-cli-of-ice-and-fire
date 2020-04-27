function showMenu(dependencies, message, choices, run) {
  const { goBack, inquirer, actions } = dependencies;

  return inquirer.prompt({
    type: 'list',
    name: 'action',
    message,
    choices,
  })
    .then(({ action }) => {
      if (action === 'back') return goBack();

      if (actions[action]) return actions[action]
        .run(() => run(goBack, dependencies), dependencies);

      return false;
    });
}

module.exports = { showMenu };
