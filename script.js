let weather = {
  apiKey: "3e89a52b394eb5e25ca7bbdecef49f1c",
  fetchWeather: function (city) {
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&units=metric&appid=" +
        this.apiKey
    )
      .then((response) => {
        if (!response.ok) {
          alert("No weather found.");
          throw new Error("No weather found.");
        }
        return response.json();
      })
      .then((data) => this.displayWeather(data));
  },
  displayWeather: function (data) {
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;
    document.querySelector(".city").innerText = "Weather in " + name;
    document.querySelector(".icon").src =
      "https://openweathermap.org/img/wn/" + icon + ".png";
    document.querySelector(".description").innerText = description;
    document.querySelector(".temp").innerText = temp + "°C";
    document.querySelector(".humidity").innerText =
      "Humidity: " + humidity + "%";
    document.querySelector(".wind").innerText =
      "Wind speed: " + speed + " km/h";
    document.querySelector(".weather").classList.remove("loading");
    document.body.style.backgroundImage =
      "url('https://source.unsplash.com/1600x900/?" + name + "')";
  },
  search: function () {
    this.fetchWeather(document.querySelector(".search-bar").value);
  },
};

document.querySelector(".search button").addEventListener("click", function () {
  weather.search();
});

document
  .querySelector(".search-bar")
  .addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
      weather.search();
    }
  });

weather.fetchWeather("Nashik");


/*----------------------------------------------------------*/
const errorLabel = document.querySelector("label[for='error-msg']")
const latInp = document.querySelector("#latitude")
const lonInp = document.querySelector("#longitude")
const airQuality = document.querySelector(".air-quality")
const airQualityStat = document.querySelector(".air-quality-status")
const srchBtn = document.querySelector(".search1-btn")
const componentsEle = document.querySelectorAll(".component-val")

const appId = "3e89a52b394eb5e25ca7bbdecef49f1c" // Get your own API Key from https://home.openweathermap.org/api_keys
const link = "https://api.openweathermap.org/data/2.5/air_pollution"

const getUserLocation = () => {
  // Get user Location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onPositionGathered, onPositionGatherError)
  } else {
    onPositionGatherError({ message: "Can't Access your location. Please enter your co-ordinates" })
  }
}

const onPositionGathered = (pos) => {
  let lat = pos.coords.latitude.toFixed(4), lon = pos.coords.longitude.toFixed(4)

  // Set values of Input for user to know
  latInp.value = lat
  lonInp.value = lon

  // Get Air data from weather API
  getAirQuality(lat, lon)
}

const getAirQuality = async (lat, lon) => {
  // Get data from api
  const rawData = await fetch(`${link}?lat=${lat}&lon=${lon}&appid=${appId}`).catch(err => {
    onPositionGatherError({ message: "Something went wrong. Check your internet conection." })
    console.log(err)
  })
  const airData = await rawData.json()
  setValuesOfAir(airData)
  setComponentsOfAir(airData)
}

const setValuesOfAir = airData => {
  const aqi = airData.list[0].main.aqi
  let airStat = "", color = ""

  // Set Air Quality Index
  airQuality.innerText = aqi

  // Set status of air quality

  switch (aqi) {
    case 1:
      airStat = "Good"
      color = "rgb(19, 201, 28)"
      break
      case 2:
        airStat = "Fair"
        color = "rgb(15, 134, 25)"
        break
      case 3:
        airStat = "Moderate"
        color = "rgb(201, 204, 13)"
        break
      case 4:
        airStat = "Poor"
        color = "rgb(204, 83, 13)"
        break
    case 5:
      airStat = "Very Poor"
      color = "rgb(204, 13, 13)"
      break
    default:
      airStat = "Unknown"
  }

  airQualityStat.innerText = airStat
  airQualityStat.style.color = color
}

const setComponentsOfAir = airData => {
  let components = {...airData.list[0].components}
  componentsEle.forEach(ele => {
    const attr = ele.getAttribute('data-comp')
    ele.innerText = components[attr] += " μg/m³"
  })
}

const onPositionGatherError = e => {
  errorLabel.innerText = e.message
}

srchBtn.addEventListener("click", () => {
  getAirQuality(parseFloat(latInp.value).toFixed(4), parseFloat(lonInp.value).toFixed(4))
})

getUserLocation()
