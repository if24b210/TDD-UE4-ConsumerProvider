
async function loadFilter() {
    try {
      const response = await fetch('includes/filters.html');
      const html = await response.text();
      document.getElementById('filters').innerHTML = html;
  
    } catch (err) {
      console.error("Error loading the filters:", err);
    }
  }
  
  // Start when the page is fully loaded
  document.addEventListener('DOMContentLoaded', loadFilter);

/* because the amount of filters has been reduced I decided that they do not need to collapse anymore, when the webiste is viewed from a small screen
function colapseFilters(){
    const viewportWidth = window.innerWidth;
    console.log("Viewport width:", viewportWidth);
   
    const collapses = ['#dropdown1', '#dropdown2'];

    collapses.forEach(id => {
      const element = document.querySelector(id);
      const bsCollapse = bootstrap.Collapse.getOrCreateInstance(element);

        //on small screens (Bootstrap md - Medium -	≥768px) the filters should collapse
      if (viewportWidth < 768) {
        bsCollapse.hide(); 
      } else {
        bsCollapse.show(); //if the user klicks on them they should open again!
      }
    });
}  

window.addEventListener('load', colapseFilters);
window.addEventListener('resize', colapseFilters); //just for easier testing can be deleted at the end
*/

function syncMapHeightWithFilters() {
  const filters = document.querySelector('#filters');
  const map = document.querySelector('#map');
  const viewportWidth = window.innerWidth;

  if (filters && map) {
    if(viewportWidth <= 768){
      map.sytle.height = 220 + 'px';

    }else{
      filtersHeight = filters.offsetHeight; //.offesetHeight should give me the height of all contents if they are collapsed or not
      filtersHeight = filtersHeight + 38;
      map.style.height = filtersHeight + 'px';
    }
    
  }
}

window.addEventListener('load', syncMapHeightWithFilters);
