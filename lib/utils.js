/**
 * Recebe o valor do header `link`, retornado da API, e retorna um objeto com os links e
 * suas URLs
 * @param {string} links Header `link` retornado da API
 */
function parseLinks(links) {
  /**
   * Usamos Object.fromEntries para construir um objeto a partir do array de
   * chaves e valores que vamos construir
   */
  return Object.fromEntries(
    /**
     * Dividimos o header link nas vírgulas, o que nos dá um array de strings no formato:
     * '<url-do-link>; rel=tipo-do-link'
     */
    links.split(',')
      /**
       * Dividimos cada item do array no ponto e vírgula, obtendo um array de arrays com o formato:
       * ['<url-do-link>', ' rel=tipo-do-link']
       * Cada item com esse formato é chamado de "par" daqui em diante
       */
      .map((link) => link.split(';'))
      /**
       * Para cada par, removemos os espaços em branco, obtendo
       * ['<url-do-link>', 'rel=tipo-do-link']
       */
      .map((linkPairs) => linkPairs.map((part) => part.trim()))
      /**
       * Para cada par, utilizamos regex pra substituir os caracteres indesejados, e aproveitamos
       * pra trocar a ordem dos pares, obtendo
       * ['tipo-do-link', 'url-do-link']
       */
      .map(([link, rel]) => ([rel.replace(/(?:rel)|"|=/ig, ''), link.replace(/<|>/g, '')]))
      /**
       * Por último, removemos os links do tipo `first` e `last`, já que eles não serão utilizados
       */
      .filter(([rel]) => rel !== 'first' && rel !== 'last'),
  );
}

module.exports = {
  parseLinks,
};
