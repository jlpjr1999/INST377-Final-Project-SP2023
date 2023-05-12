function initBarChart(chart, object, labelName) {
    const labels = Object.keys(object);

    const data = Object.values(object);

    console.log(data);

    return new Chart(chart, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: labelName,
            data: data,
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
};


function deleteChart() {
  if (Chart.getChart("myChart")){
    Chart.getChart("myChart").destroy();
  }
};

function getLabels(chartData) {
    let names = chartData.map((item) => {
        return item['name'];
    });
    return names;
}

function shapeDataForBarChart(chartData) {
    let ranking = chartData.reduce((collection, item) => {
        collection[item.name] = [item.ratings_count]
        return collection;
    }, {});
    return ranking;
}

function shapeDevData(chartData) {
  let numberOfGames = chartData.reduce((collection, item) => {
    collection[item.name] = [item.games.length]
    return collection;
  }, {});
  return numberOfGames;
}


async function mainEvent(){
    console.log("in main event");
    const visArea = document.querySelector("#vis_cont");
    const loadButton = document.querySelector("#data_load");
    const gen_chart_ranks = document.querySelector("#generate_chart_ranks");
    const gen_chart_dev = document.querySelector("#generate_chart_dev");
    const chartArea = document.querySelector("#myChart");
    const filterGamesButton = document.querySelector("#filter_data_games");
    const filterGamesText = document.querySelector("#game");
    const filterDevsButton = document.querySelector("#filter_data_devs");
    const filterDevText = document.querySelector("#dev");
    const refreshButton = document.querySelector("#refresh");
    const key = "9e7780c9f276446c8102a0b384672031";
    const pageSize = 50;
    let apiPage = 2;
    let gameUrl = `https://api.rawg.io/api/games?key=${key}&page_size=${pageSize}`;
    let devUrl = `https://api.rawg.io/api/developers?key=${key}&page_size=${pageSize}`;
    let myChart = "";
    let isFiltered = false;


    const gameData = localStorage.getItem("gameData");
    let parsedGameData = JSON.parse(gameData);

    let filterDevData = []
    let filterGameData = []

    const devData = localStorage.getItem("devData");
    let parsedDevData = JSON.parse(devData)

    let path = window.location.pathname;
    console.log(path)
    let token_path = path.split("/")
    let page = token_path[token_path.length-1];
    console.log(page) 

    if (page == "ratings.html") {
      apiPage = 1;
      gen_chart_ranks.addEventListener("click", (event) => {
        deleteChart();
        if (!isFiltered) {
          const shapedData = shapeDataForBarChart(parsedGameData.results);
          myChart = initBarChart(chartArea, shapedData, "# of Votes");
        } else {
          const shapedData = shapeDataForBarChart(filterGameData);
          myChart = initBarChart(chartArea, shapedData, "Number of Votes for Filter")
        }

      filterGamesButton.addEventListener("click", (event) => {
        console.log("filtering data");
        let gameName = filterGamesText.value;
        console.log(gameName)
        if (gameName === "") {
          isFiltered = false;
        }else {
          isFiltered = true;
          console.log(parsedGameData)
          filterGameData = parsedGameData.results.filter((item) => {
            if (item.name == gameName){
              console.log(item)
              return item;
            }
          })
        }
  
        console.log(filterGameData)
      })
    });
    }else if(page == "index.html") {
      apiPage = 1;
      gen_chart_dev.addEventListener("click", (event) => {
        deleteChart();
        if (!isFiltered) {
          const shapedData = shapeDevData(parsedDevData.results);
          myChart = initBarChart(chartArea, shapedData, "# of Games in Database");
          console.log(parsedDevData.results)
        } else {
          const shapedData = shapeDevData(filterDevData);
          myChart = initBarChart(chartArea, shapedData, "# of Games For Filter")
        }
      });

      filterDevsButton.addEventListener("click", (event) => {
        console.log("filtering data");
        let devName = filterDevText.value;
        console.log(devName)
        if (devName === "") {
          isFiltered = false;
        }else {
          isFiltered = true;
          filterDevData = parsedDevData.results.filter((item) => {
            if (item.name == devName){
              console.log(item)
              return item;
            }
          })
        }
  
        console.log(filterDevData)
      })
    }

    loadButton.addEventListener("click", async (event) => {
        console.log("loading data");
        apiPage = 2;

        let result = await fetch(gameUrl);
        let data = await result.json();

        localStorage.setItem("gameData", JSON.stringify(data));
        parsedGameData = data;
        console.log(data);

        result = await fetch(devUrl);
        data = await result.json();
        localStorage.setItem("devData", JSON.stringify(data));
        parsedDevData = data;
    });

    refreshButton.addEventListener("click", async (event) => {
      console.log("refreshing with new data");

      let nextGamePage = `${gameUrl}&page=${apiPage}`;
      let nextDevPage =  `${devUrl}&page=${apiPage}`

      let result = await fetch(nextGamePage);
      let data = await result.json();

      localStorage.setItem("gameData", JSON.stringify(data));
      parsedGameData = data;
      console.log(data);

      result = await fetch(nextDevPage);
      data = await result.json();
      localStorage.setItem("devData", JSON.stringify(data));
      parsedDevData = data;

      apiPage = apiPage + 1;
    })
};


document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests