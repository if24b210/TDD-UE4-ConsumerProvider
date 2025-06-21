// Global variables
let map;
let directions_div;
let currentRouteLine = null;
let userMarker = null;


const ORS_API_KEY = "PLACE YOUR API KEY FOR OPEN ROUTING SERVICE HERE";



/*-----------------------------------------------------
Everytime the page is loaded:
------------------------------------------------------*/
addEventListener("DOMContentLoaded", () => {
    // Load DOM elements
    directions_div = document.getElementById("routing-output");
    const routing_btn = document.getElementById("btn_routing");

    initMapWithPark();  // Initialize map and place park marker
    addParkName();
    autoFillCurrentAddress(); // Autofill address form with geolocation or stored data

    // Attach click listener to routing button
    routing_btn.addEventListener("click", handleRoutingButton);

    getRoute();
});
/*----------------------------------------------
    FUNKTIONS
 -----------------------------------------------*/
//To reduce API requests (the user should not be able to spam the routing button)
function handleRoutingButton() {
    console.log("Routing button clicked");

    const routing_btn = document.getElementById("btn_routing");
    routing_btn.removeEventListener("click", handleRoutingButton);
    setTimeout(() => {
        routing_btn.addEventListener("click", handleRoutingButton);
    }, 1500);

    getRoute();
}

//Initialize the map and place the park marker:
function initMapWithPark() {

    //initialize the map
    map = L.map('routing-map-container');
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { //attribution
        attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    // Get park coordinates from localStorage
    const parkRaw = localStorage.getItem("park-coordinates");   // Get park coordinates from localStorage
    if (!parkRaw) return console.warn("no park coordinates!");  // If no park coordinates are stored, exit

    const parkCoords = JSON.parse(parkRaw);                     // Parse coordinates from localStorage
    const parkName = localStorage.getItem("park-name");         // Get park name from localStorage
    //const parkType = localStorage.getItem("park-type");         // Get park type
    const parkType = localStorage.getItem("parkCategory"); // schon vorhanden
    const marker = createMarkerByCategory(parkType, parkCoords);

    //let marker;
    /*if (parkType && parkType.toLowerCase().includes("friedhof")) {
        marker = createCemeteryMarker(parkCoords); // Create cemetery marker
    } else {
        marker = createDefaultMarker(parkCoords); // Create default Park marker
    }*/

    marker.addTo(map).bindPopup(parkName).openPopup(); // Add marker to map and bind popup with park name
    map.setView(parkCoords, 13); // center map on park

    

    /*
    // Get user location, after Map-Init 
    if (window.getUserLocation && map) {    // Check if getUserLocation function and map are available
        getUserLocation(map);               // Call getUserLocation with the map instance
    } else {
        console.error("Map or getUserLocation function not found - ensure map_helper.js is loaded.");
    }
    */
}

// Center map view between two points - used when routing
function centerMapBetween(start, end) {
    map.fitBounds(L.latLngBounds([start, end]));
}

// Geocode address string to coordinates using Nominatim
async function getCoordsFromAddress(query) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
    const res = await fetch(url, { headers: { "User-Agent": "GreenScape_universityProject/1.0 (if24b255@technikum-wien.at)" } });
    const results = await res.json();
    if (results.length === 0) throw new Error("Address not found");
    return [parseFloat(results[0].lat), parseFloat(results[0].lon)];
}

// Reverse geocode coordinates string to address data using Nominatim
async function getAddressFromCoords(coordsString) {
    // coordsString format: "lat, lon"
    const [lat, lon] = coordsString.split(",").map(s => s.trim());
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&format=json`;
    const res = await fetch(url, { headers: { "User-Agent": "GreenScape_universityProject/1.0 (if24b255@technikum-wien.at)" } });
    if (!res.ok) throw new Error("Reverse geocoding failed");
    const data = await res.json();
    return data.address;
}

/*-------------------------------------------------------------------------
  Fills address form from storage (to reduce API requests - but I kinda gave up on that) or geolocation, 
  and always saves user coords so that they can be used in getRoute()
 --------------------------------------------------------------------------*/
async function autoFillCurrentAddress() {
    const street_input = document.getElementById("start_address_street");
    const number_input = document.getElementById("start_address_street_number");
    const postal_input = document.getElementById("start_address_postal_code");

    const storedAddressRaw = localStorage.getItem("user-address");
    const storedCoordsRaw = localStorage.getItem("user-coordinates");
    let locStor_coords = storedCoordsRaw ? JSON.parse(storedCoordsRaw) : null;
    let locStor_address = storedAddressRaw ? JSON.parse(storedAddressRaw) : null;

    // If we have stored address, fill form
    if (locStor_address) {
        street_input.value = locStor_address.street;
        number_input.value = locStor_address.house_number;
        postal_input.value = locStor_address.postcode;
    }

    if (locStor_coords) {
        try {
            const addressData = await getAddressFromCoords(locStor_coords.join(", "));
            const street = addressData.road || "";
            const house_number = addressData.house_number || "";
            const postcode = addressData.postcode || "";
            // Save address 
            localStorage.setItem("user-address", JSON.stringify({ street, house_number, postcode }));
            // Fill form
            street_input.value = street;
            number_input.value = house_number;
            postal_input.value = postcode;
        } catch (err) {
            console.error("Could not retrieve address from stored coordinates:", err);
        }
    }
}



//Requests and displays route using OpenRouteService, checking if form address changed
async function getRoute() {
    const errorInfoDiv = document.getElementById("routing-error");
    const directionsDiv = document.getElementById("routing-directions");

    //get address from form
    const street = document.getElementById("start_address_street").value.trim();
    const number = document.getElementById("start_address_street_number").value.trim();
    const postal = document.getElementById("start_address_postal_code").value.trim();
    const fullAddress = `${street} ${number}, ${postal}`;

    const storedAddressRaw = localStorage.getItem("user-address");
    const storedCoordsRaw = localStorage.getItem("user-coordinates");
    let userCoords;

    //if the full address is in the form and there is no address in the local storage or the address in the local storage is not the same as in the form
    if (street && number && postal && (!storedAddressRaw || JSON.parse(storedAddressRaw).raw !== fullAddress)) {
        try { //get the current address via geodata-Coordinates from API
            userCoords = await getCoordsFromAddress(fullAddress);
            localStorage.setItem("user-coordinates", JSON.stringify(userCoords));
            localStorage.setItem("user-address", JSON.stringify({ raw: fullAddress, street, house_number: number, postcode: postal }));
        } catch (e) {
            console.error("Geocoding failed:", e);
            errorInfoDiv.innerHTML = "Could not geocode the provided address.";
            return;
        }
    }
    //if we already have coords in the local storage use these for routing 
    else if (storedCoordsRaw) {
        userCoords = JSON.parse(storedCoordsRaw);
    }
    //if we have neither coords in the local storage nor in the form - inform the user - does not happen anymore because we have the default location
    else {
        errorInfoDiv.innerHTML = "No user coordinates available - please either activate geolocation or fill out the form.";
        return;
    }

    //display user pin
    if (userMarker && map) {
        map.removeLayer(userMarker);
        userMarker = null;
    }
    userMarker = createDefaultMarker(userCoords).addTo(map);  // Create a marker at user coordinates
    userMarker.bindPopup('You are here!').openPopup();


    // Get park coords - these need to bet there we have no other means to get them
    const parkCoords = JSON.parse(localStorage.getItem("park-coordinates"));

    // Center map between user and park
    centerMapBetween(userCoords, parkCoords);

    // Map mode to ORS profile
    const profile = document.querySelector('input[name="modeOfTransport"]:checked')?.value || "cycling-regular"; //cycling is default

    // Build OpenRouteService URL
    const url = `https://api.openrouteservice.org/v2/directions/${profile}?api_key=${ORS_API_KEY}&start=${userCoords[1]},${userCoords[0]}&end=${parkCoords[1]},${parkCoords[0]}`;

    try {
        const resp = await fetch(url);
        const data = await resp.json();
        const feature = data.features[0]; //contains type (LineString), coordinates and information like duration or distance

        //empty error div
        errorInfoDiv.innerHTML = "";
        
        // Draw route geometry
        if (currentRouteLine) map.removeLayer(currentRouteLine); //so that only one route is shown
        currentRouteLine = L.geoJSON(feature.geometry, { style: { color: 'var(--color-primary)', weight: 4 } }).addTo(map);
        map.fitBounds(currentRouteLine.getBounds()); //makes sure the map shows the whole route

        // Extract summary
        const summary = feature.properties.summary;
        const dist = (summary.distance / 1000).toFixed(2); //turns meters into kilometers
        const dur = (summary.duration / 60).toFixed(1); //turns hours into minutes

        // Extract steps -> From ORS every step contains a instruction (like "turn") and some contain the name of the street conected to the instruction () 
        const steps = feature.properties.segments[0].steps;
        //console.log("steps JSON:", JSON.stringify(feature.properties.segments[0].steps, null, 2));
        let html = `<ol>`;
        let stepCounter = 0;
        let lastIndex = steps.length - 1;

        steps.forEach(step => {
            let instructionText = step.instruction;
            if (stepCounter > 0 && stepCounter != lastIndex && (!step.name || step.name === "-" || step.name.trim() === "")) {  //not for the first step because it just says which direction to head in
                const distStr = formatDistance(step.distance);
                instructionText = `In ${distStr}: ${step.instruction}`;
            }
            html += `<li>${instructionText}</li>`;
            stepCounter++;
        });
        html += `</ol>`;

        //document.getElementById("distance").innerHTML = "";
        document.getElementById("distance").innerHTML = `<h5 class="align-center">Distance: </h5><p class="align-center">${dist} km</p>`;
        //document.getElementById("time-estimate").innerHTML = "";
        document.getElementById("time-estimate").innerHTML = `<h5 class="align-center">Time:</h5><p class="align-center">${dur} min</p>`;

        directionsDiv.innerHTML = html;

    } catch (err) {
        console.error("ORS routing error:", err);
        directionsDiv.innerHTML = "Error fetching route.";
    }
}

function addParkName() {
    const parkName_container = document.getElementById("goal_address");
    const parkName = localStorage.getItem("park-name");

    if (parkName && parkName_container) {
        parkName_container.value = parkName;
    }
    else {
        parkName_container.value = "something went wrong";
    }
}

const formatDistance = (meters) => {
    return meters >= 1000
        ? `${(meters / 1000).toFixed(1)} km`
        : `${Math.round(meters)} m`;
};
