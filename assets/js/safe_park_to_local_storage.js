addEventListener("DOMContentLoaded", (event) => { 

    let btn_planVisit = document.getElementById("planVisitBtn");


    //the linking to the other page needs to be paused, until all information has been loaded to the local storage
    if (btn_planVisit) {
        btn_planVisit.addEventListener("click", async (e) => {
            e.preventDefault(); 

            await loadRestrooms();   //needs to be saved to window in order to be used later    
            safeParkToLocalStorage();      

            window.location.href = btn_planVisit.href; 
        });
    }
})


function safeParkToLocalStorage()
{
    //where do i get the info from?
    /*
    in                  load_playground.js,     load_parks.js   and     load_cemeteries.js 

    Data is stored to:  window.playgroundData,  window.parksData and    window.cemeteriesData

    this data should be the same as in the JSON: 
                        SPIELPLATZPUNKTOGD.json, PARKINFOOGD.json and   FRIEDHOFOGD.json

    window.(...) should be accessable for all functions in the same HTML.window <- which is where I am

    However these contain all the data -> How to I extract just the selected park?
        Probably with the name?
    
    */

    //what do I need to safe?
    /*
    Done:
    park-name	            Schweizergarten                 get from id="parkName"
    dog	                    bool                            true if dogPark or dog selected otherwise false
    kids                    bool                            true if playground selected otherwise false
    toddler                 bool                            true if toddlerplayground selected otherwise false
    park-coordinates	    [48.18648082, 16.38591514]      get from API/JSON-> window.parksData  
    restroom	            bool                            true if public restroom within 1km radius of park
    parkCategory	        string                              ?                           
    water                   bool                            true if ?
    
    To-Do:
    
    For Park-Summary:
    opening-hours
    features? -> just for playground maybe?
    size
    
    */

    
    /*--------------------*/
    /*      park-name     */
    /*--------------------*/
    let parkName = document.getElementById("parkName").textContent;
    localStorage.setItem('park-name', parkName);
    console.log("Saved park-name to localStorage: " + localStorage.getItem('park-name'));


    /*--------------------*/
    /*        dog         */
    /*--------------------*/
    //both of these are checkboxes: is either true or false
    let dogsallowed = document.getElementById("dogs-allowed").checked;
    let dogpark = document.getElementById("dogs").checked;

    if(dogsallowed || dogpark)
    {
        localStorage.setItem('dog', 'true');  
        console.log("set 'dog' = true");
    }
    else
    {
        localStorage.setItem('dog', 'false');  
        console.log("set 'dog' = false");
    }

    /*--------------------*/
    /*        kids        */
    /*--------------------*/
    let playground = document.getElementById("general-playgrounds").checked;

    if(playground)
    { 
        localStorage.setItem('kids', 'true');
        console.log("set 'kids' = true");
    }
    else
    {
        localStorage.setItem('kids', 'false');
        console.log("set 'kids' = false");
    }
    /*----------------------*/
    /*        Toddlers      */
    /*----------------------*/
    let toddlerPlayground = document.getElementById("toddler-playgrounds").checked;

    if(toddlerPlayground)
    { 
        localStorage.setItem('toddler', 'true');
        console.log("set 'toddler' = true");
    }
    else
    {
        localStorage.setItem('toddler', 'false');
        console.log("set 'toddler' = false");
    }


    /*--------------------*/
    /*  park-coordinates  */
    /*--------------------*/
        //I should be able to get those from window.parksData etc. if I am able to identify the correct park

    console.log("parksData:", window.parksData);

    //if it is a park this works - but what if it is a cemetary, dogpark or playground? 
    // -> playgrounds seem to be undercategorys of park (they exist in both JSON)
    // -> same with dogpark
    // -> Cemetarie names are not in window.parksData!
    let selectedPark = window.parksData.features.find(feature => 
        feature.properties.ANL_NAME === parkName
    );

    if (selectedPark) 
    {
        let coords = selectedPark.geometry.coordinates;

        //because they are saved in the wrong order in the JSON
        let dummy = coords[0];
        coords[0] = coords[1];
        coords[1] = dummy;

        localStorage.setItem("park-coordinates", JSON.stringify(coords));
        console.log("Saved coordinates:", coords);
    } 
    else //look in window.cemeteriesData
    {
        console.log("No Park found in window.parksData with name: ", parkName);
        console.log("now looking in window.cemeteriesData");

        let selectedCemeterie = window.cemeteriesData.features.find(feature => 
            feature.properties.NAME === parkName
        );

        if(selectedCemeterie)
        {
            let coords = selectedCemeterie.geometry.coordinates;

            //because they are saved in the wrong order in the JSON
            let dummy = coords[0];
            coords[0] = coords[1];
            coords[1] = dummy;

            localStorage.setItem("park-coordinates", JSON.stringify(coords));
            console.log("Saved coordinates:", coords);
            }
        else
        {
            console.warn("unable to find parkName in window.parkData or window.cemeteriesData!");
        }
    }

    
    /*--------------------*/  //problem: parks exist with the same name in: PARKINFOOGD.json, HUNDEZONEOGD.json and SPIELPLATZPUNKTOGD.json -> So I can not just look there and find a match
    /*    parkCategory    */  //for park, playground and dog park it differentiates in the map -> names in cemetary differentiate
    /*--------------------*/  //     string                            ?  

    //check if cemeterie
    let selectedCemeterie = window.cemeteriesData.features.find(feature => 
        feature.properties.NAME === parkName
    );
    if(selectedCemeterie)
    {
        localStorage.setItem('parkCategory', 'Cemetery');
    }
    else { //it is either a park, a dog park or a playground

        //because the textcontent of the element with the id "parkType" contains "type: " before the parkType I have to remove it
        let parkTypeRaw = document.getElementById("parkType")?.textContent?.trim();
        let parkType = parkTypeRaw?.replace(/^type:\s*/i, '');

        if (selectedPark && parkType) {
            localStorage.setItem('parkCategory', parkType.toLowerCase());
        } 

        //if I find no parkType I need to overwrite previously saved parkCategory
        else {
            localStorage.setItem('parkCategory', 'unknown');
        }
    }
    console.log("local Storage: parkCategory set to: " + localStorage.getItem("parkCategory"));

               
    /*--------------------*/
    /*      restroom      */
    /*--------------------*/ //true if one item from WCANLAGE2OGD.json is within a perimiter of park-coords!
    let park_coords_str = localStorage.getItem('park-coordinates'); //currently a string

    const park_coords = JSON.parse(park_coords_str);
    const parkLat = park_coords[0];
    const parkLng = park_coords[1];

    const maxDistanceMeters = 1000;

    const hasNearbyRestroom = window.restroomsData.features.some((feature) => { //returns true if one restroom within maxDistanceMeters to the parks coordinates is found
        const [lng, lat] = feature.geometry.coordinates;
        const distance = getDistanceFromLatLonInMeters(parkLat, parkLng, lat, lng);
        return distance <= maxDistanceMeters;
    });

    if(hasNearbyRestroom)
    {
        localStorage.setItem('restroom', 'true');
        console.log("nearby restroom found");
    }
    else
    {
        localStorage.setItem('restroom', 'false');
        console.log("no nearby restroom found");
    }
    

    /*--------------------*/
    /*       water        */
    /*--------------------*/   

    if(selectedPark) //park is in PARKINFOOGD.json or corresponding API
    {
        const water = selectedPark.properties.WASSER_IM_PARK;
        if(water == "Ja")
        {
            localStorage.setItem('water', 'true');
        }
        else{
            localStorage.setItem('water', 'false');
        }   
    }
    else //only cemetarys -> which have water
    {
        localStorage.setItem('water', 'true');
    }


    /*-------------------------------------*/
    /*  Info about park for summary page   */
    /*-------------------------------------*/

    /*
    "properties": {
                "OBJECTID": 2886282,
                "ANL_NAME": "PA Spinozagasse",
                "BEZIRK": 16,
                "FLAECHE": "3.535 m²",
                "OEFF_ZEITEN": "0:00-24:00",
                "SPIELEN_IM_PARK": "Ja",
                "WASSER_IM_PARK": "Nein",
                "HUNDE_IM_PARK": "Nein",
                "TELEFON": "01 4000 8042",
                "WEBLINK1": "http://www.wien.gv.at/umwelt/parks/anlagen/index.html",
                "SE_ANNO_CAD_DATA": null
            }
    */
   if(selectedPark)
   {
        const parkProperties = selectedPark.properties;
        localStorage.setItem('parkProperties', JSON.stringify(parkProperties));
   }
   else{ //remove if not park
        localStorage.removeItem('parkProperties');
   }

   /*
   "properties": {
                "OBJECTID": 2225042,
                "ANL_NAME": "Richard-Wagner-Park",
                "BEZIRK": 16,
                "SPIELPLATZ_DETAIL": "Basketball, Drehen, Fitness, Fußball, Hüpfen, Klettern, Reck, Rutschen, Sandspielen, Schaukeln, Wippen",
                "TYP_DETAIL": "Ballspielkäfig, Generationenspielplatz, Spielplatz",
                "SE_ANNO_CAD_DATA": null
            }
   */
    let selectedPlayground = window.playgroundData.features.find(feature => 
        feature.properties.ANL_NAME === parkName
    );

    if(selectedPlayground)
    {
        const playgroundDetails = selectedPlayground.properties.SPIELPLATZ_DETAIL;
        console.log("playgroundDetails: ",playgroundDetails );
        const playgroundTypeDetail = selectedPlayground.properties.TYP_DETAIL;

        const playgroundInfo = {
            playgroundDetails: playgroundDetails,
            typeDetail: playgroundTypeDetail
        };

        localStorage.setItem('playgroundInfo', JSON.stringify(playgroundInfo));
        console.log("Playground info saved:", playgroundInfo);
    } 
    else { //if our park is not a playground -> delete in order to not show old Info
        localStorage.removeItem('playgroundInfo'); 
    }
}




//Helping Functions:
async function loadRestrooms() {

    const onlineUrl = 'https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:WCANLAGE2OGD&srsName=EPSG:4326&outputFormat=json';
    const localUrl = '../data/WCANLAGE2OGD.json';

    try {
        const response = await fetch(onlineUrl);
        if (!response.ok) throw new Error('Online-Data could not be fetched');

        const data = await response.json();
        console.log('Restrooms: online Data loaded: ', data);

        window.restroomsData = data;

    } catch (error) {
        console.warn('Restrooms: failed to load data online, trying local json...', error);

        try {
            const response = await fetch(localUrl);
            if (!response.ok) throw new Error('local json not found');

            const data = await response.json();
            console.log('Restrooms: Local Data loaded:', data);

            window.restroomsData = data;

        } catch (fallbackError) {
            console.error('Restrooms: error while loading local json: ', fallbackError);

        }
    }
}


//not written by me - based on Haversine-Formel:
function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earths Radius in Meter
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
}

function translate_typ_detail(typ_detail_ger) {
    if (!Array.isArray(typ_detail_ger) || typ_detail_ger.length === 0) {
        return [];
    }

    const typ_details = {
        Ballspielkäfig: "ballcage",
        Ballspielplatz: "ball playground",
        Spielplatz: "playground",
        Themenspielplatz: "themed playground",
        Kleinkinderspielplatz: "toddler playground",
        Skaterpark: "skate park",
        Generationenspielplatz: "generational playground",
        Wasserspielplatz: "water playground"
    };

    let return_array = [];

    for (let i = 0; i < typ_detail_ger.length; i++) {
        const translated = typ_details[typ_detail_ger[i]];
        if (translated) {
            return_array.push(translated);
        }
    }

    return return_array;
}