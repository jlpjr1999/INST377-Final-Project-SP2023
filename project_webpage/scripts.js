function initChart(chart, object) {
    const labels = Object.keys(object);

    const data = Object.values(object);

    console.log(data);

    return new Chart(chart, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: '# of Votes',
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

async function mainEvent(){
    console.log("in main event");
    const visArea = document.querySelector("#vis_cont");
    const loadButton = document.querySelector("#data_load");
    const gen_chart = document.querySelector("#generate_chart")
    const chartArea = document.querySelector("#myChart")
    const key = "9e7780c9f276446c8102a0b384672031";
    let endpoint = "games";
    let url = `https://api.rawg.io/api/${endpoint}?key=${key}`

    const storedData = localStorage.getItem("gameData");
    let parsedData = JSON.parse(storedData);
    console.log(parsedData);

    gen_chart.addEventListener("click", (event) => {
      const shapedData = shapeDataForBarChart(parsedData.results);
      const myChart = initChart(chartArea, shapedData);
    });

    loadButton.addEventListener("click", async (event) => {
        console.log("loading data");

        const result = await fetch(url);
        const data = await result.json();

        localStorage.setItem("gameData", JSON.stringify(data));
        parsedData = data;
        console.log(data);
    });
    
};


document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests