let lat = 48.2082,
  lon = 16.3738;

document.addEventListener("DOMContentLoaded", async function () {
  let timestamp = Number(localStorage.getItem("iconDataCacheTimestamp"));
  let weather_icons = JSON.parse(localStorage.getItem("iconDataCache"));

  if (!weather_icons || Date.now() - timestamp > 7 * 24 * 60 * 60 * 1000) {
    weather_icons = await getWeatherIcons();
    weather_icons = JSON.parse(localStorage.getItem("iconDataCache"));
  }

  getCurrWeather(lat, lon, weather_icons);
  getDailyWeather(lat, lon, weather_icons);
});

// Weather icons and cached to local storage
async function getWeatherIcons() {
  let cached = localStorage.getItem("iconDataCache");
  if (cached) return JSON.parse(cached);

  try {
    let res = await fetch(
      `https://gist.githubusercontent.com/stellasphere/9490c195ed2b53c707087c8c2db4ec0c/raw/descriptions.json`
    );
    if (!res.ok) {
      console.warn("Fallback to local file...");
      res = await fetch(`../../data/weather_icons.json`);
    }
    const iconData = await res.json();
    localStorage.setItem("iconDataCache", JSON.stringify(iconData));
    localStorage.setItem("iconDataCacheTimestamp", Date.now().toString());
    // console.log("Weather iconDataCache:", iconDataCache);
    // console.log("Weather iconData:", iconData);
    return iconData;
  } catch (err) {
    console.error(err);
    return null;
  }
}

// Current-hourly weather card
function getCurrWeather(lat, lon, weather_icons) {
  let CurrWeatherApiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weather_code,relative_humidity_2m,apparent_temperature,wind_speed_10m&current=is_day,temperature_2m,apparent_temperature,weather_code,wind_speed_10m,relative_humidity_2m&timezone=auto`;

  // console.log("weather_icons:", weather_icons);

  fetch(CurrWeatherApiUrl)
    .then((res) => res.json())
    .then((data) => {
      let { current, hourly, current_units } = data;

      // console.log(data);

      // document.getElementById("city_name").innerHTML = name;
      // document.getElementById("country").innerHTML = country;

      let is_day = current.is_day ? "day" : "night";

      document.getElementById("cur_weather_icon").src =
        weather_icons[current.weather_code][is_day].image;
      document.getElementById("cur_weather_icon").alt =
        weather_icons[current.weather_code][is_day].description;

      document.getElementById("cur_temp").innerHTML = `
                <h4>${current.temperature_2m} <span" class="fs-md-6 text-body-secondary">${current_units.temperature_2m}</span></h4>
                <h6>Temp</h6>
            `;

      document.getElementById("cur_humid").innerHTML = `
                <h4>${current.relative_humidity_2m} <span class="fs-md-6 text-body-secondary">${current_units.relative_humidity_2m}</span></h4>
                <h6>Humidity</h6>
            `;

      document.getElementById("cur_wind_speed").innerHTML = `
                <h4>${current.wind_speed_10m} <span class="fs-md-6 text-body-secondary">${current_units.wind_speed_10m}</span></h4>
                <h6>Wind</h6>
            `;

      let currentTime = current.time.split(":")[0];
      // console.log(currentTime);

      let startIndex;
      startIndex = hourly.time.findIndex((time) => {
        return time.split(":")[0] == currentTime;
      });

      let weatherHourly = document.querySelectorAll(".weather-hourly");
      // console.log(weatherHourly);
      weatherHourly.forEach((item, index) => {
        if (startIndex != -1) {
          for (let i = startIndex; i < startIndex + (index + 1); i++) {
            let hourlyTime = hourly.time[i].split("T")[1].split(":")[0];

            let am_pm = hourlyTime >= 12 ? "pm" : "am";
            hourlyTime = hourlyTime % 12 || 12;

            // console.log("weather_code",hourly.weather_code[i]);
            let weather_code = hourly.weather_code[i];
            let weather_icon = weather_icons[weather_code][is_day].image;

            item.innerHTML = `
                            <p class="mb-0 d-flex flex-column">${hourlyTime} <span>${am_pm}</span></p>
                            <img src="${weather_icon}" alt="${weather_icons[weather_code][is_day].description}" class="w-100 h-100 w-sm-75 h-sm-75 w-md-50 h-md-50">
                            <div class="hourly-temp">${hourly.temperature_2m[i]}&deg</div>
                        `;
          }
        }
      });
    })
    .catch((err) =>
      console.error("Error fetching Current weather data: ", err)
    );
}

// 3-7 days weather card
function getDailyWeather(lat, lon, weather_icons) {
  const dailyWeatherApiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,uv_index_clear_sky_max,wind_speed_10m_max&timezone=auto`;

  fetch(dailyWeatherApiUrl)
    .then((res) => res.json())
    .then((data) => {
      let { daily } = data;
      // console.log(data);

      const months = {
        "01": "Jan",
        "02": "Feb",
        "03": "Mar",
        "04": "Apr",
        "05": "May",
        "06": "Jun",
        "07": "Jul",
        "08": "Aug",
        "09": "Sep",
        10: "Oct",
        11: "Nov",
        12: "Dec",
      };

      const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

      let forecastDays3 = document.getElementById("forecast-days3").children;
      setForecastWeather(forecastDays3, daily, weather_icons, months, weekdays);

      let forecastDays7 = document.getElementById("forecast-days7").children;

      const switchBtns = document.querySelectorAll(
        "#days-switch-btn .days-switch"
      );
      switchBtns.forEach((btn) => {
        btn.addEventListener("click", function () {
          if (btn.textContent.trim() === "7 days") {
            setForecastWeather(
              forecastDays7,
              daily,
              weather_icons,
              months,
              weekdays
            );
          }
        });
      });
    })
    .catch((err) => console.error("Error fetching Daily weather data: ", err));
}

// Forecast daily weather card
function setForecastWeather(
  forecastDays,
  daily,
  weather_icons,
  months,
  weekdays
) {
  forecastDays = Array.from(forecastDays);

  forecastDays.forEach((item, index) => {
    item.querySelector("img").src =
      weather_icons[daily.weather_code[index]].day.image;
    item.querySelector("img").alt =
      weather_icons[daily.weather_code[index]].day.description;
    item.querySelector(".max").textContent = daily.temperature_2m_max[index];
    item.querySelector(".min").textContent = daily.temperature_2m_min[index];

    let date = daily.time[index].split("-");
    // console.log(date);

    const dayIndex = new Date(daily.time[index]).getDay();
    // console.log(weekdays[dayIndex]);

    item.querySelector(".date").innerHTML = `
            <span class="fw-semibold fs-md-5 me-2 day">${date[2]}</span>
            <span class="text-body-secondary month">${months[date[1]]}</span>
            <span class="comma">, &nbsp;</span>
            <span class="text-body-secondary weekday">${
              weekdays[dayIndex]
            }</span>
        `;
  });
}
