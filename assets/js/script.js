// Switch weather forecsts 3-7 days
document.addEventListener("DOMContentLoaded", function () {
    const switchBtns = document.querySelectorAll('#days-switch-btn .days-switch');
    const forecast3 = document.getElementById('forecast-days3');
    const forecast7 = document.getElementById('forecast-days7');

    switchBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // Remove active class from all buttons
            switchBtns.forEach(b => b.classList.remove('active'));

            // Add active class to the clicked one
            this.classList.add('active');

            // Show/hide forecasts accordingly
            if (this.textContent.trim() === '3 days') {
                forecast3.style.display = 'block';
                forecast7.style.display = 'none';
            } else {
                forecast3.style.display = 'none';
                forecast7.style.display = 'block';
            }
        });
    });

    // Set initial visibility
    forecast3.style.display = 'block';
    forecast7.style.display = 'none';
});