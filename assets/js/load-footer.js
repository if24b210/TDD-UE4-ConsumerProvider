
async function loadFooter() {
    try {
      const response = await fetch('includes/footer.html');
      const html = await response.text();
      document.getElementById('footer-container').innerHTML = html;
  
    } catch (err) {
      console.error("Error loading the footer:", err);
    }
  }
  
  // Start when the page is fully loaded
  document.addEventListener('DOMContentLoaded', loadFooter);

  //to keep the footer at the bottom of the page
  function pushFooterIfNeeded() { //The function adds a margin at the top of the footer when the Height of everything inside the body is smaller than the Height of the browser-window
    const bodyHeight = document.body.offsetHeight; //Height of everything inside the body
    const viewportHeight = window.innerHeight; //Height of the browser-window
  
    const footer = document.getElementById('footer-container');
  
    if (bodyHeight < viewportHeight) {
      footer.style.marginTop = `${viewportHeight - bodyHeight}px`;
    } else {
      footer.style.marginTop = '0';
    }
  }

  window.addEventListener('load', pushFooterIfNeeded);
  window.addEventListener('resize', pushFooterIfNeeded);