

function checkCheckboxes(){
    const dog = localStorage.getItem('dog') === 'true';             //bool
    if(dog === true){
        let checkboxDog = document.getElementById("companionDogs");
        checkboxDog.checked = true;
    }

    const kids = localStorage.getItem('kids') === 'true';
    if(kids === true){
        let checkboxKids = document.getElementById("companionKids");
        checkboxKids.checked = true;
    }

    const toddlers = localStorage.getItem('toddler') === 'true';
    if(toddlers === true){
        let checkboxToddlers = document.getElementById("companionToddlers");
        checkboxToddlers.checked = true;
    }
}

//Dom Content loaded-> dogs checked if dog in local storage?
document.addEventListener('DOMContentLoaded', () => {
    limitDateInput();

    //localStorage.clear(); 
    //provisionallyFillLocalStorage(); //this function simulates the filling of the local storage on the index page

    checkCheckboxes();

});

function createPackingList(){
    //initialize empty array 
    let listContent = []; 

    

    //get information out of local storage
    const water = localStorage.getItem('water') === 'true';         // === 'true' basicaly transforms the value of the local storage item 'water' (which would normally be a string) into a bool
    const restroom = localStorage.getItem('restroom') === 'true';   //bool
    const parkCategory = localStorage.getItem('parkCategory');      //string | possible values: 'Park', 'Playground', 'Cemetery' or 'Dog Park'

    //get information from form
    let companions = extractCompanions();    //contains all selected companion values as strings
    let activities = extractActivities();    //contains all selected activities values as strings
    let weatherCode = extractWeatherCodeFromLocalStorrage();

    //get information from weather
    let weather = translateWeatherCodesToWords(weatherCode);
    

/*----------------------*/
/*        WATER         */
/*----------------------*/
    //FILL ARRAY   with content based on selections -> should this be its own function for read-ability?
    if(water === false){
        listContent.push("💧 filled Water bottle");
    }else{
        listContent.push("💧 empty watter bottle to get water from the fountain");
    }

/*----------------------*/
/*     RESTROOM         */
/*----------------------*/
    if(restroom === true){
        listContent.push("🪙 50c coins for restroom");
    }

/*-------------------------*/
/*     PARKCATEGORY        */
/*-------------------------*/

    const parkCategorys = {
        Park: [],
        Playground: [],
        Cemetery: ["🕯️ grave candle", "🔥 Lighter/Matches", "💐 Flowers"] 
        //Dog Park
    }

    if(parkCategorys[parkCategory]) {
        listContent.push(...parkCategorys[parkCategory]);
    }

/*------------------- ---*/
/*        WEATHER        */
/*------------------- ---*/
    const weatherItems = {
        rainy: ["☂️ Umbrella", "🧥 Raincoat", "🥾 Waterproof boots"],
        snow: ["🧤 Thermal gloves", "🧣 Scarf", "🧥 Heavy coat", "☕ Thermos"],
        sunny: [" 🕶 Sunglasses", "🧴 Sunscreen", "🧢 Cap"],
        cloudy: ["🧥 Light jacket"],
        partialyCloudy: ["🧥 Light jacket"],
        storm: ["⚠ there is a Storm on the date and time you selected ⚠", "☂️ Umbrella", "🧥 Raincoat", "🥾 Waterproof boots"], 
        none: ["❌ no information about weather - pack accordingly"]
    };


    if (weatherItems[weather]) {
        listContent.push(...weatherItems[weather]);
        //console.log("listContent[] after weather: ", listContent);
    }

/*---------------------------*/
/*        COMPANGIONS        */
/*---------------------------*/
    companions.forEach(choice => { 
        if(choice === "alone"){
            listContent.push("📚 Book", "🎧 Headphones");
        }
        if(choice === "friends"){
            listContent.push("📷 Camera");
        }
        if(choice === "toddlers"){
            listContent.push("🥕 Snacks for toddlers", "🍼 Milk", "🧷 Diapers", "🧸 Toys for toddlers");
        }
        if(choice === "kids"){
            listContent.push("🧃 Snacks for kids", "🧸 Toys for kids");
        }
        if(choice === "dogs"){
            listContent.push("🐶 dog-leash", "🐶 dog-muzzle", "🐶 dog-poop-bags", "🧸 Toys for dogs");
        }
    });

/*---------------------------*/
/*        AVTIVITIES         */
/*---------------------------*/
    activities.forEach(choice => {
        if(choice === "relax"){
            //is there anything special?
        }
        if(choice === "picknick"){
            listContent.push("🍱 Picknick food", "🧣 Picknick Blanket", "🍴 Utensils"); 
        }
        if(choice === "games"){
            listContent.push("🎲 Board Games", "🎴Card Games");
        }
        if(choice === "sport"){
            listContent.push("🎽 Sportswear", "🏸Gear for your sport", "👟 Sport shoes");
        }

    });
    console.log("listContent: ", listContent);
    
    //Display list
    attachList(listContent);

    //display print-button
    document.getElementById("btn_printPackingList").style.display = "block";

}



function extractCompanions() {
    let a_companions = [];  
    const companionCheckboxes = document.querySelectorAll('#further_choices input[id^="companion"]');
    companionCheckboxes.forEach(cb => {
      if (cb.checked) {
        a_companions.push(cb.value);
      }
    });
    return a_companions;
}

function extractActivities(){
    let a_activities = []; 
    const activityCheckboxes = document.querySelectorAll('#further_choices input[id^="activity"]');
    activityCheckboxes.forEach(cb => {
        if (cb.checked) {
            a_activities.push(cb.value);
        }
    });
    return a_activities;
}

//function to get weathercode for selected day
function extractWeatherCodeFromLocalStorrage() {
    const visitDate = document.getElementById('visitDate').value; // for examle: "2025-05-14"
    const selectedTime = document.querySelector('input[name="time"]:checked').value; //possible values: morning noon afternoon evening

    const timeMap = {
        morning: "09:00",
        noon: "13:00",
        afternoon: "16:00",
        evening: "20:00"
    };

    const fullTime = `${visitDate}T${timeMap[selectedTime]}`; //now correct format - for example: 2025-05-14T13:00
    console.log("fullTime: " + fullTime);

    const cachedData = JSON.parse(localStorage.getItem("weatherForecast"));
    if (!cachedData || !cachedData.data || !cachedData.data.hourly) {
        console.error("No Weather Data in Local Storrage.");
        return -1;
    }

    const hourlyTimes = cachedData.data.hourly.time; //returns array of all times
    const weatherCodes = cachedData.data.hourly.weather_code; //returns array of all weatherCodes

    const index = hourlyTimes.indexOf(fullTime); //get the index of the time we look for - the index of the time == the index of the weathercode
    if (index === -1) {
        console.error("Time was not found in local Storrage Item: weatherData");
        return -1;
    }

    const weatherCode = weatherCodes[index]; //get the weatherCode
    console.log(`WeatherCode for ${fullTime}:`, weatherCode);
    return weatherCode;
}

function attachList(contents) {
    let listContainer = document.getElementById("generatePackingList");
    listContainer.innerHTML = "";

    contents.forEach(item => {
        const li = document.createElement("li");
        li.className = "list-group-item";
        
        //creating a checkbox for every item in contents
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "form-check-input"; // Bootstrap-Styling
        
        // Erstelle das Label für die Checkbox
        const label = document.createElement("label");
        label.className = "form-check-label"; // Bootstrap-Styling
        label.textContent = item;

        //checkbox and label are added to the list element
        li.appendChild(checkbox);
        li.appendChild(label);

        // the list element is added to the list
        listContainer.appendChild(li);
    });
}

//function to transalte the weather codes from https://open-meteo.com/ to the words uses in const weatherItems
function translateWeatherCodesToWords(weatherCode){
    console.log("weatherCode: " + weatherCode);
    if(weatherCode === -1) return "none";
    if (weatherCode === 0) return "sunny";
    if ([1, 2].includes(weatherCode)) return "partialyCloudy";
    if (weatherCode === 3) return "cloudy";
    if ([45, 48].includes(weatherCode)) return "cloudy";
    if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) return "rainy";
    if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) return "snow";
    if ([95, 96, 99].includes(weatherCode)) return "storm";

    return null;
}


//this function simulates the filling of the local storage, which would normally happen on the index page
function provisionallyFillLocalStorage(){ 
    //localStorage.setItem('water', 'false');         //possible values: 'true' / 'false'
    //localStorage.setItem('restroom', 'true');       //possible values: 'true' / 'false'
    //localStorage.setItem('dog', 'true');            //possible values: 'true' / 'false'
    //localStorage.setItem('parkCategory', 'value');  //possible values: 'cemetary', 'playground', 'dogpark', 'generalPark'   
    //localStorage.setItem('kids', true);
}


//Function to limit the date that can be inputed to 7 days into the future
function limitDateInput(){
    const visitDateInput = document.getElementById('visitDate');

    if (visitDateInput) {
        const today = new Date();
        const maxDate = new Date();
        maxDate.setDate(today.getDate() + 6);

        const toDateInputValue = (date) => date.toISOString().split('T')[0];

        visitDateInput.min = toDateInputValue(today);
        visitDateInput.max = toDateInputValue(maxDate);

        visitDateInput.value = toDateInputValue(today); //today is preselected
    }

}

//function to print the packing list - it opens a new window which contains only the packing list and closes it again itself
function printPackingList() {
    const list = document.getElementById('generatePackingList');
    const listHtml = list.outerHTML;
  
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
      <html>
        <head>
          <title>Packing List</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            ul { list-style-type: none; padding: 0; }
            li { margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <h1>Packing List</h1>
          ${listHtml}
        </body>
      </html>
    `);
    printWindow.document.close();
  
    printWindow.onload = function () {
      printWindow.focus();
      printWindow.print();
  
      // window is closed after 100 milliseconds as a Fallback
      const closeTimeout = setTimeout(() => {
        if (!printWindow.closed) printWindow.close();
      }, 100);
  
      // Timeout is deleted after printing is finished
      printWindow.onafterprint = function () {
        clearTimeout(closeTimeout);
        printWindow.close();
      };
    };
  }

 
