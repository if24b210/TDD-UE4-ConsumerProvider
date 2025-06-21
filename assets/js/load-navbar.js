// js/load-navbar.js -> Load the navbar dynamically, named load-navbar.js
// function called loadNavbar() that fetches the navbar HTML from includes/navbar.html


async function loadNavbar() {
    try {
      const response = await fetch('includes/navbar.html');
      const html = await response.text();
      document.getElementById('navbar-container').innerHTML = html;
  
      // Set the active link
      const links = document.querySelectorAll('.nav-link');
      links.forEach(link => {
        if (link.href === window.location.href) {
          link.classList.add('active');
          link.setAttribute('aria-current', 'page');
        }
      });
    } catch (err) {
      console.error("Error loading the navbar:", err);
    }
  }
  
  // Start when the page is fully loaded
  document.addEventListener('DOMContentLoaded', loadNavbar);
  



  