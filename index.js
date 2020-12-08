import { promises as fs } from 'fs';
import readline from 'readline';

/**
 * invoke functions
 */
// getData();
questionInterface();

/**
 * Create each state array
 */
async function getData() {
  try {
    const allStates = JSON.parse(await fs.readFile(`./json/Estados.json`));
    const allCities = JSON.parse(await fs.readFile(`./json/Cidades.json`));

    allStates.forEach((state) => {
      let filteredCities = allCities.filter((city) => city.Estado === state.ID);
      createJson(state.Sigla, filteredCities);
    });
    const allCitiesAndStates = allStates.map(({ ID: stateId, Sigla, Nome }) => {
      let cities = allCities.filter((city) => city.Estado === stateId);
      return {
        ID: stateId,
        Sigla,
        Nome,
        // Cities: cities,
        NumberOfCities: cities.length,
      };
    });
    createJson('StatesAndCities', allCitiesAndStates);
  } catch (error) {
    console.error(error);
  }
}

/**
 * create interaction interface
 */
function questionInterface() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const consoleMsg = `
    Bem vindo a interacao com o boot:
    Digite 1 para receber os 5 estados com mais cidades
    Digite 2 para receber os 5 estados com menos cidades
    Digite 3 para receber as cidades com o nome mais longo por estado
    Digite 4 para receber as cidades com o nome mais curto por estado
    Digite 5 para receber a cidade com o nome mais longo
    Digite 6 para receber a cidade com o nome mais curto
    Digite 7 para outros
    `;
  rl.question(consoleMsg, (response) => {
    switch (response) {
      case '0':
        console.log('Sair da interface');
        // getData();
        rl.close();
        break;
      case '1':
        console.log('5 Estados com mais cidades: ');
        topFiveStates();
        rl.close();
        break;
      case '2':
        console.log('5 estados com menos cidades');
        bottomFiveStates();
        rl.close();
        break;
      case '3':
        console.log('As cidades com o nome mais longo por estado');
        greaterCityNamePerState();
        rl.close();
        break;
      case '4':
        console.log('As cidades com o nome mais curto por estado');
        rl.close();
        smalestCityNamePerState();
        break;
      case '5':
        console.log('A cidades com o nome mais longo');
        rl.close();
        greaterCityNameAndState();
        break;
      case '6':
        console.log('A cidades com o nome mais curto');
        rl.close();
        smalestCityNameAndState();
        break;
      case '7':
        console.log('Outros calculos');
        rl.close();
        anotherFunction();
        break;
      default:
        console.log('resposta invalida, digite novamente');
        rl.close();
        questionInterface();
        break;
    }
  });
}

/**
 * create a Json file from name and content
 */
async function createJson(fileName, content) {
  await fs.writeFile(`./json/${fileName}.json`, JSON.stringify(content));
}

/**
 *Criar uma função que recebe como parâmetro o UF do estado,
 * que realize a leitura do arquivo JSON correspondente e
 * que retorne a quantidade de cidades daquele estado
 */
async function readState(stateUf) {
  const stateArray = JSON.parse(await fs.readFile(`./json/${stateUf}.json`));
  return stateArray.length;
}

/**
 *Criar um método que imprima no console um array com o
 * UF dos cinco estados que mais possuem cidades,
 * seguidos da quantidade, em ordem decrescente.
 * Você pode usar a função criada no tópico 2.
 * Exemplo de impressão: [“UF - 93”, “UF - 82”, “UF -74”, “UF - 72”, “UF - 65”]
 */
async function topFiveStates() {
  let allStates = JSON.parse(await fs.readFile(`./json/Estados.json`));
  allStates = await Promise.all(
    allStates.map(async ({ Sigla }) => {
      let numberOfCities = await readState(Sigla);
      return `${Sigla} - ${numberOfCities}`;
    })
  );
  allStates = allStates.sort(
    (a, b) => parseInt(b.substring(4)) - parseInt(a.substring(4))
  );
  allStates = allStates.slice(0, 5);
  console.log(
    allStates.reduce((acc, value) => {
      return acc + parseInt(value.substring(4));
    }, 0)
  );
  console.log(allStates);
}

/**
 * Criar um método que imprima no console um array com o
 * UF dos cinco estados que menos possuem cidades,
 * seguidos da quantidade, em ordem decrescente.
 * Você pode usar a função criada no tópico 2.
 * Exemplo de impressão: [“UF - 30”, “UF - 27”, “UF - 25”, “UF - 23”, “UF - 21”
 */
async function bottomFiveStates() {
  let allStates = JSON.parse(await fs.readFile(`./json/Estados.json`));
  allStates = await Promise.all(
    allStates.map(async ({ Sigla }) => {
      let numberOfCities = await readState(Sigla);
      return `${Sigla} - ${numberOfCities}`;
    })
  );
  allStates = allStates.sort(
    (a, b) => parseInt(b.substring(4)) - parseInt(a.substring(4))
  );
  allStates = allStates.slice(-5);
  console.log(
    allStates.reduce((acc, value) => {
      return acc + parseInt(value.substring(4));
    }, 0)
  );

  console.log(allStates);
}

/**
 * Criar um método que imprima no console um array com a
 * cidade de maior nome de cada estado, seguida de seu UF.
 * Por exemplo: [“Nome da Cidade – UF”, “Nome da Cidade – UF”, ...].
 */
async function greaterCityNamePerState() {
  try {
    let allStates = JSON.parse(await fs.readFile(`./json/Estados.json`));
    let stateCities;
    allStates = await Promise.all(
      allStates.map(async ({ Sigla }) => {
        stateCities = JSON.parse(await fs.readFile(`./json/${Sigla}.json`));
        stateCities.sort((a, b) => b.Nome.length - a.Nome.length);
        return `${stateCities[0].Nome} - ${Sigla}`;
      })
    );
    console.log(allStates);
  } catch (error) {
    console.error(error);
  }
}

/**
 * Criar um método que imprima no console um array com a
 * cidade de menor nome de cada estado, seguida de seu UF.
 * Por exemplo: [“Nome da Cidade – UF”, “Nome da Cidade – UF”, ...].
 */
async function smalestCityNamePerState() {
  try {
    let allStates = JSON.parse(await fs.readFile(`./json/Estados.json`));
    let stateCities;
    allStates = await Promise.all(
      allStates.map(async ({ Sigla }) => {
        stateCities = JSON.parse(await fs.readFile(`./json/${Sigla}.json`));
        stateCities.sort((a, b) => a.Nome.length - b.Nome.length);

        return `${stateCities[0].Nome} - ${Sigla}`;
      })
    );
    console.log(allStates);
  } catch (error) {
    console.error(error);
  }
}

/**
 * Criar um método que imprima no console a
 * cidade de maior nome entre todos os estados, seguido do seu UF.
 * Exemplo: “Nome da Cidade - UF".
 */
async function greaterCityNameAndState() {
  try {
    const allStates = JSON.parse(await fs.readFile(`./json/Estados.json`));
    const allCities = JSON.parse(await fs.readFile(`./json/Cidades.json`));
    allCities.sort((a, b) => b.Nome.length - a.Nome.length);
    console.log(
      `${allCities[0].Nome} - ${
        allStates.find(({ ID }) => ID === allCities[0].Estado).Sigla
      }`
    );
  } catch (error) {
    console.error(error);
  }
}

/**
 * Criar um método que imprima no console a
 * cidade de menor nome entre todos os estados, seguido do seu UF.
 * Exemplo: “Nome da Cidade - UF".
 */
async function smalestCityNameAndState() {
  try {
    const allStates = JSON.parse(await fs.readFile(`./json/Estados.json`));
    const allCities = JSON.parse(await fs.readFile(`./json/Cidades.json`));
    allCities.sort((a, b) => a.Nome.length - b.Nome.length);
    let filterCities = allCities.filter(
      (city) => city.Nome.length <= allCities[0].Nome.length
    );
    filterCities.sort((a, b) => a.Nome.localeCompare(b.Nome));
    console.log(
      `${filterCities[0].Nome} - ${
        allStates.find(({ ID }) => ID === filterCities[0].Estado).Sigla
      }`
    );
  } catch (error) {
    console.error(error);
  }
}

async function anotherFunction() {
  console.log('hi');
}
//comment
