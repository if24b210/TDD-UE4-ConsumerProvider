const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast"; //put this in comments and run localStorage.clear in browser console to test no available data for packing list

// Get current date and end date (6 days later - one week weather forecast)
const today = new Date();
const pad = n => n.toString().padStart(2, "0");
const formatDate = d =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const startDate = formatDate(today);
const endDateObj = new Date(today);
endDateObj.setDate(endDateObj.getDate() + 6); // Add 6 days to today
const endDate = formatDate(endDateObj);

console.log(`Date range: ${startDate} to ${endDate}`);

// API request parameters
const PARAMS = {
  latitude: 48.2085, // Vienna coordinates (same as map default location)
  longitude: 16.3721,
  hourly: "weather_code,temperature_180m",
  timezone: "Europe/Berlin",
  temporal_resolution: "hourly",
  start_date: startDate,
  end_date: endDate,
  wantedHours: [9, 13, 16, 20] // Suggested hours for forecast (we want to show the whole day, but hourly would be too much)
};


// weather cache manager
const WeatherCache = {

  // Get cached weather or fetch fresh data
  getWeather: async () => {
    const cacheKey = "weatherForecast";
    const cachedData = localStorage.getItem(cacheKey);
    //console.log("hallo" + cachedData);
    // Check for valid cached data
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData); //?

      // Use cache if it's less than 1 hour old

      const age = Math.round((Date.now() - timestamp) / 60000);
      console.log(`Cached data found (age: ${age} minutes)`);

      if (Date.now() - timestamp < 3600 * 1000) {
        console.log('Using cached weather data');
        return data;
      } else {
        console.log('Cached data is stale, fetching fresh data');
      }
    } else {
      console.log('No cached data found, fetching fresh data');
    }

    // Build API URL if need for fresh data
    const url = new URL(WEATHER_API_URL);
    Object.entries(PARAMS).forEach(([key, val]) => {
      if (key === "wantedHours") return; // Skip non-API parameters (extra hours we don't want to show)
      url.searchParams.set(key, val);
    });

    console.log(`Fetching weather data from API: ${url.toString()}`);
    const response = await fetch(url);
    const freshData = await response.json();
    console.log('Fresh weather data received');

    // Save to cache with cache key weatherForecast
    localStorage.setItem(cacheKey, JSON.stringify({
      data: freshData,
      timestamp: Date.now()
    }));
    console.log('Weather data saved to cache: ' + cacheKey);

    return freshData;
  }
};

// Hour-to-label mapping
const hourLabels = {
  9: "Morning",
  13: "Noon",
  16: "Afternoon",
  20: "Evening"
};



function getDayIconData(code) {
  const iconDataCache = JSON.parse(localStorage.getItem("iconDataCache") || "{}");
  const codeStr = String(code);
 // const codeStr = String(-1); //Test for icon not found (example: open-meteo adds new codes)


 if (iconDataCache[codeStr]?.day) {
    return iconDataCache[codeStr].day;
  }
  // Fallback: show "?" emoji and description "Unknown"
  return { description: "Unknown", image: "assets/images/question-mark.svg"};
}



// Main forecast rendering function
; (async function renderForecast() {
  const container = document.querySelector(".days-row");

  try {
    // Show loading state while we get data
    container.innerHTML = '<div class="loading">Loading weather...</div>';
    console.log('Loading weather forecast...');

    // Get weather data (either cached or fresh)
    const json = await WeatherCache.getWeather();
    const { time, temperature_180m, weather_code } = json.hourly;

    // Organize data by day
    const bucket = {};
    time.forEach((ts, i) => {
      const dt = new Date(ts);
      const hr = dt.getHours();
      if (PARAMS.wantedHours.includes(hr)) {
        const dayName = dt.toLocaleDateString("en-US", { weekday: "short" });
        bucket[dayName] = bucket[dayName] || []; // Create array if missing
        bucket[dayName].push({
          hour: hr,
          temp: temperature_180m[i],
          code: weather_code[i]
        });
      }
    });

    console.log('Bucketed weather data by day:', bucket);

    // Sort days starting with today
    const allDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const todayName = today.toLocaleDateString("en-US", { weekday: "short" });
    const startIdx = allDays.indexOf(todayName);
    const daysOrder = startIdx >= 0
      ? allDays.slice(startIdx).concat(allDays.slice(0, startIdx))
      : allDays;

    console.log('Sorted day order:', daysOrder);

    // Build the forecast display
    container.innerHTML = ""; // Clear loading message

    daysOrder.forEach(day => {
      const col = document.createElement("div");
      col.className = "day-column";

      // Create day header with "Today" label
      const hdr = document.createElement("div");
      hdr.className = "day-header";
      hdr.textContent = day === todayName ? "Today" : day;
      hdr.setAttribute("data-today", day === todayName ? "true" : "false");
      col.append(hdr);

      // Add time slots for each period
      (bucket[day] || []).forEach(item => {
        const slot = document.createElement("div");
        slot.className = "time-slot";

        // Weather icon 
        const iconData = getDayIconData(item.code);
        const icon = document.createElement("img");
        icon.className = "weather-icon";
        icon.src = iconData.image;
        icon.alt = iconData.description;
        icon.setAttribute("aria-label", iconData.description);

        // Temperature display
        const tmp = document.createElement("div");
        tmp.className = "temperature";
        tmp.textContent = `${item.temp} °C`;

        // Time label (e.g., "Morning")
        const lbl = document.createElement("div");
        lbl.className = "time-label";
        lbl.textContent = hourLabels[item.hour] || `${item.hour}:00`;

        slot.append(icon, tmp, lbl);
        col.append(slot);
      });

      container.append(col);
    });

    console.log('Weather forecast rendered successfully.');

  } catch (error) {
    // Show error if something goes wrong
    console.error('Weather load failed:', error);
    container.innerHTML = `
      <div class="error">
        Failed to load weather data. Please try again later.
      </div>
    `;
  }
})();
