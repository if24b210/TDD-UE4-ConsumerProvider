
document.addEventListener('DOMContentLoaded', () => {
 
    let btn_planVisit = document.getElementById("planVisitBtn");

    if(btn_planVisit){
        btn_planVisit.addEventListener('click', function () {
            if (window.selectedPark) {
                const park = window.selectedPark;
        
                localStorage.setItem('parkName', park.name);
                localStorage.setItem('parkCategory', park.type);
                localStorage.setItem('water', park.water);
                localStorage.setItem('dog', park.dogs);
                localStorage.setItem('parkPlayground', park.playground);
                localStorage.setItem('parkDescription', park.description);
                localStorage.setItem('parkDistrict', park.district);
        
                alert('Park saved to localStorage (individually).');
            } else {
                alert('No park selected – nothing saved.');
            }
        });
    }

});



function safeParkToLocalStorrage(){


}