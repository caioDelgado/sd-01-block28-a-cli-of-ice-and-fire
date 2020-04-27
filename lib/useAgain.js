async function useAgain(goBack, dependencies, url, run) {
  const { inquirer } = dependencies;

  return inquirer.prompt({
    type: 'confirm',
    message: 'Deseja consultar outra casa?',
    name: 'repeat',
    default: true,
  })
    .then(({ repeat }) => {
      if (!repeat) return;
      return run(goBack, dependencies, url);
    });
}

module.exports = { useAgain };
