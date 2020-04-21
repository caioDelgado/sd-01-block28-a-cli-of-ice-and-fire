const fetch = require("node-fetch");

function api(endpoint) {
  return fetch(
    `https://www.anapioficeandfire.com/api/books?name=${endpoint}`
  )
    .then(response => response.json())
    .then(result => result);
}

async function search(goBack, endpoint) {
  return console.log(await api(endpoint));
}

module.exports = { search };
