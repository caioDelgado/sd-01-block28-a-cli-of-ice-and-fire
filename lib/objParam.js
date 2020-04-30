async function objParam(goBack, url, getAPI, run, string) {
  return {
    goBack,
    url,
    newList: getAPI,
    repeatRun: run,
    text: string,
  };
}

module.exports = { objParam };
