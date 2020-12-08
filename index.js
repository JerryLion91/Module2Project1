import { promises as fs } from 'fs';

async function getData() {
  try {
    const allStates = JSON.parse(await fs.readFile(`./json/Estados.json`));
    const allCities = JSON.parse(await fs.readFile(`./json/Cidades.json`));

    allStates.forEach((state) => {
      let filteredCities = allCities.filter((city) => city.Estado === state.ID);
      createJson(state.Sigla, filteredCities);
      // if (state.Sigla === 'AC') {
      //   console.log(state);
      //   const AC = console.log(AC);
      // }
    });
  } catch (error) {
    console.error(error);
  }
}
getData();

async function createJson(fileName, content) {
  await fs.writeFile(`./json/${fileName}.json`, JSON.stringify(content));
}
