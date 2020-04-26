// function listOption(goBack, dependencies, run, links, url) {
//   const { inquirer } = dependencies;

//   inquirer.prompt({
//     type: 'list',
//     message: '[Listar casas] - Escolha uma casa para ver mais detalhes',
//     name: 'house',
//     choices,
//   })
//     .then(({ house }) => {
//       if (house === 'back') return goBack();
//       if (house === 'next' || house === 'prev') return run(goBack, dependencies, links[house]);

//       log(objectFilter(house));
//       return repeatSearch(goBack, dependencies, url, run);
//     })
// }
