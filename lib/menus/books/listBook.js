const superagentModule = require('superagent');

const { parseLinks } = require('../../../utils');

const request = async (goBack, dependencies = {}, url, value) (
  new Promise((resolve, reject) => {
    const { inquirer, superagent = superagentModule, log = console.log } = dependencies;
  
    const request = superagent.get(url || `https://www.anapioficeandfire.com/api/books/${value}`);
  
    if (!url) request.query({ page: 1, pageSize: 10 });

    request.end((err, { body, headers: { link } }) => {
      if (err) return reject(err);

      const choices = body.map(({name})=>)
    })
  })
)
