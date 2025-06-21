window.onbeforeprint = function() {
    // Hide entire packing list section if no packing list was created
    const packingListSection = document.getElementById('packingList');
    if (!document.querySelector('#generatePackingList li')) {
        packingListSection.classList.add('no-print');
    } else {
        packingListSection.classList.remove('no-print');
    }

    // Hide entire routing section if no routing directions exist
    const routingSection = document.getElementById('routing');
    if (!document.querySelector('#routing-directions li')) {
        routingSection.classList.add('no-print');
    } else {
        routingSection.classList.remove('no-print');
    }

    // Only break after directions heading if directions exist
    const directionsHeading = document.getElementById('directions-heading');
    if (document.querySelector('#routing-directions li')) {
        directionsHeading.classList.add('print-break');
    } else {
        directionsHeading.classList.remove('print-break');
    }
};