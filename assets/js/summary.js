/*TO-DO: back button -> implement funktionality*/

const printBtn = document.getElementById("print-btn");

if (printBtn) {
  printBtn.addEventListener("click", () => {
    window.print();
  });
} else {
  console.error("Element with ID 'print-btn' not found!");
}

addEventListener("DOMContentLoaded", (event) => {

  loadParkName();
  loadParkInfo();
  loadIcons();
})

function loadParkName() {
  let parkName = localStorage.getItem('park-name');
  let parkName_container = document.getElementById("park-name");

  if (parkName && parkName_container) {
    parkName_container.textContent = parkName;
  }
  else if (parkName_container) {
    parkName_container.textContent = "No park selected! - how did you even get here? :( ";
  }
}

function loadParkInfo() {
  //Type
  let parkType = localStorage.getItem('parkCategory');
  let parkType_container = document.getElementById("parkType");
  if (parkType && parkType_container) {
    parkType_container.innerHTML = "<strong>Type:</strong> " + parkType;
  }

  //Subtype if Playground
  const subType_container = document.getElementById("parkSubType");
  const storedPlaygroundInfo = localStorage.getItem("playgroundInfo");

  if (subType_container && storedPlaygroundInfo) {
    const playgroundInfo = JSON.parse(storedPlaygroundInfo);

    if (playgroundInfo.typeDetail) {
      const translated = translate_typ_detail(playgroundInfo.typeDetail);

      if (translated.length > 0) {
        subType_container.innerHTML = `<strong>Subtype:</strong> ${translated.join(", ")}`;
      } else {
        subType_container.innerHTML = `<strong>Subtype:</strong> –`;
      }
    }
  }

  //Playground Details
  const playgroundDetails_container = document.getElementById("parkPlaygroundDetails");

  if (playgroundDetails_container && storedPlaygroundInfo) {
    const playgroundInfo = JSON.parse(storedPlaygroundInfo);

    if (playgroundInfo.playgroundDetails) {
      const translated = translate_playground_detail(playgroundInfo.playgroundDetails);

      if (translated.length > 0) {
        playgroundDetails_container.innerHTML = `<strong>Playground details:</strong> ${translated.join(", ")}`;
      } else {
        playgroundDetails_container.innerHTML = `<strong>Playground details:</strong> –`;
      }
    }
  }


  //if in PARKINFOOGD.json
  const storedProperties = localStorage.getItem('parkProperties');
  if (storedProperties) {
    const parkData = JSON.parse(storedProperties);

    // Opening - hours
    const rawHours = parkData.OEFF_ZEITEN;
    let timeOnly = rawHours;
    const match = rawHours.match(/(\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2})/); //because they can contain more then just the hours
    if (match) {
      timeOnly = match[1];
    }
    const openingHours_container = document.getElementById("parkOpeningHours");
    openingHours_container.innerHTML = "<strong>Opening Hours:</strong> " + timeOnly;

    // Size
    const parkSize_container = document.getElementById("parkSize");
    parkSize_container.innerHTML = "<strong>Size:</strong> " + parkData.FLAECHE;
    if (parkType === "Cemetery") {
      parkSize_container.innerHTML = "<strong>Size:</strong>- ";
    }

    // Phone
    const parkContact_container = document.getElementById("parkPhone");
    parkContact_container.innerHTML = "<strong>Contact:</strong> " + parkData.TELEFON;

    //Website
    const parkWebiste_container = document.getElementById("parkWebsite");
    parkWebiste_container.innerHTML = "<strong>Website:</strong> <a class='a_summary' href='" + parkData.WEBLINK1 + "' target='_blank' rel='noopener noreferrer'>" + parkData.WEBLINK1 + "</a>";

    //water
    const parkWater_container = document.getElementById("parkWater");

    if (parkData.WASSER_IM_PARK === "Ja" || parkType === "Cemetery") {
      parkWater_container.innerHTML = "<strong>Drinking fountain:</strong> Yes";
    } else {
      parkWater_container.innerHTML = "<strong>Drinking fountain:</strong> No";
    }

    //playing allowed?
    const parkPlaying_container = document.getElementById("parkPlaying")
    if (parkData.SPIELEN_IM_PARK === "Ja" && parkType != "Cemetery") {
      parkPlaying_container.innerHTML = "<strong>Playing:</strong> allowed";
    }
    else {
      parkPlaying_container.innerHTML = "<strong>Playing:</strong> not allowed";
    }


    //dog allowed?
    const parkDog_container = document.getElementById("parkDogAllowed")
    if (parkData.HUNDE_IM_PARK === "Ja" && parkType != "Cemetery") {
      parkDog_container.innerHTML = "<strong>Dog:</strong> allowed";
    }
    else {
      parkDog_container.innerHTML = "<strong>Dog:</strong> not allowed";
    }

  }
  else { //is cemetary

    // Opening - hours
    const openingHours_container = document.getElementById("parkOpeningHours");
    openingHours_container.innerHTML = "<strong>Opening Hours:</strong> please consult website ";


    // Phone
    const parkContact_container = document.getElementById("parkPhone");
    parkContact_container.innerHTML = "<strong>Contact:</strong>  +43 (0)1 534 69-0";

    //Website
    const parkWebiste_container = document.getElementById("parkWebsite");
    parkWebiste_container.innerHTML = "<strong>Website:</strong> <a class='a_summary' href='https://www.friedhoefewien.at/unsere-friedhoefe' target='_blank' rel='noopener noreferrer'>https://www.friedhoefewien.at/unsere-friedhoefe</a>";


    // Size
    const parkSize_container = document.getElementById("parkSize");
    parkSize_container.innerHTML = "<strong>Size:</strong> -"

    //water
    const parkWater_container = document.getElementById("parkWater");
    parkWater_container.innerHTML = "<strong>Drinking fountain:</strong> Yes";

    //playing allowed?
    const parkPlaying_container = document.getElementById("parkPlaying")
    parkPlaying_container.innerHTML = "<strong>Playing:</strong> not allowed";

    //dog allowed?
    const parkDog_container = document.getElementById("parkDogAllowed")
    parkDog_container.innerHTML = "<strong>Dog:</strong> not allowed";

  }


}
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
function loadIcons() {
   let iconShown = false;

  /*Cemetery - icon*/
  const parkType = localStorage.getItem("parkCategory")?.toLowerCase();

  if (parkType === "cemetery") {
    document.getElementById("cemetery-icon").style.display = 'inline-block';
    document.getElementById("water-icon").style.display = 'inline-block';
    iconShown = true;
  }

  const storedProperties = localStorage.getItem('parkProperties');


  if (!storedProperties) return;

 

  const parkProps = JSON.parse(storedProperties); //make JavaScript Object from string

  /*dog - icon*/
  if (parkProps.HUNDE_IM_PARK === "Ja" || localStorage.getItem("parkCategory")?.toLowerCase() === "dog park") {
    document.getElementById("dog-icon").style.display = 'inline-block';
    iconShown = true;
  }

  /*water - icon*/
  if (parkProps.WASSER_IM_PARK === "Ja") {
    document.getElementById("water-icon").style.display = 'inline-block';
    iconShown = true;
  }

  /*playground - icon*/
  if (parkProps.SPIELEN_IM_PARK === "Ja" || localStorage.getItem("parkCategory")?.toLowerCase() === "playground") {
    document.getElementById("playground-icon").style.display = 'inline-block';
    iconShown = true;
  }

  console.log("icons shown:" + iconShown);
  /*Don't show container if no icons are shown*/
  if(!iconShown)
  {
    const iconContainer = document.getElementById("summary-icon-container");
    if(iconContainer)
    {
      iconContainer.style.display = "none";;
    }
  }
  
}


/*
<strong>Type:</strong> Urban Park
<strong>Features:</strong> Playgrounds (toddler & all-age), basketball court, football pitch, slackline area, table tennis, streams, ponds, rose garden
  <div id="parkType"></div>
  <div id="parkAddress"></div>
  <div id="parkFeatures"></div>
  <div id="parkDescription"></div>
  <div id="parkOpeningHours"></div>                         
*/
function translate_typ_detail(typ_detail_ger) {
  if (!typ_detail_ger) return [];

  // if string turn to array:
  if (typeof typ_detail_ger === "string") {
    typ_detail_ger = typ_detail_ger.split(",").map(s => s.trim());
  }

  const typ_details = {
    Ballspielkäfig: "ball cage",
    Ballspielplatz: "ball playground",
    Spielplatz: "playground",
    Themenspielplatz: "themed playground",
    Kleinkinderspielplatz: "toddler playground",
    Skaterpark: "skate park",
    Generationenspielplatz: "generational playground",
    Wasserspielplatz: "water playground"
  };

  return typ_detail_ger
    .map(item => typ_details[item] || null)
    .filter(Boolean);
}

function translate_playground_detail(detail_ger) {
  if (!detail_ger) return [];

  let detailArr = detail_ger.split(",").map(item => item.trim());

  const playgroundDetailDict = {
    Basketball: "basketball",
    Beachvolleyball: "beach volleyball",
    BMX: "BMX",
    Brettspiel: "board game",
    Drehen: "spinning",
    Drehscheibe: "turntable",
    Fitness: "fitness",
    Fußball: "soccer",
    Karussell: "carousel",
    Klangspiel: "sound game",
    Klettern: "climbing",
    Motorikspielplatz: "Motor skills playground",
    Parkour: "parkour",
    Rutschen: "slides",
    "Sand-Matsch": "sand and mud play",
    Sandspielen: "sand play",
    Schaukel: "swing",
    Schaukeln: "swings",
    Seilbahn: "zip line",
    Skaten: "skating",
    Slackline: "slackline",
    Spielhaus: "play house",
    Spieltafel: "play panel",
    Spieltier: "play animal",
    Spieltiere: "play animals",
    Stammlabyrinth: "log labyrinth",
    Streetball: "streetball",
    Tischtennis: "table tennis",
    Trampolin: "trampoline",
    Volleyball: "volleyball",
    Wasserspiel: "water play",
    Wippen: "seesaws",
    Geschicklichkeitsspiel: "skill game"
  };


  return detailArr
    .map(item => playgroundDetailDict[item] || null)
    .filter(Boolean);
}

// Get the new Back to Top button
let backToTopBtn = document.getElementById("backToTopBtn");

if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
} else {
    console.error("Element with ID 'backToTopBtn' not found!");
}

// When the user clicks on the button, scroll to the top of the document
backToTopBtn.addEventListener("click", function() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
});
