
function checkWeather(lat, long) {
    var apiUrl = "https://api.weatherapi.com/v1/current.json?key=6ae7c76b7b7d498db7a75709222206&q=" + lat + ", " + long + "&aqi=no";
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    var weather = {
                        temp: data.current.temp_c,
                        condition: data.current.condition.text,
                        icon: data.current.condition.icon,
                        rain: data.current.condition.text.includes("rain")
                    };
                    
                    var weatherString = weather.temp + '°C' + '<img src=http:' + weather.icon + '></img>';
                    if (weather.temp <= 16) {
                        weatherString;
                    } else if (weather.temp > 16 && weather.temp < 24) {
                        weatherString;
                    } else if (weather.temp >= 24 && weather.temp <= 32) {
                        weatherString;
                    } else if (weather.temp > 32) {
                        weatherString;
                    };
             
                    if (weather.rain) {
                        weatherString;
                    };
                    
                    document.getElementById("weather").innerHTML = weatherString;
                });
            }
        });
};

var state = {
    contacts: []
};

function init() {
   
    loadState();
   
    renderContactList();

    $("#add-button").on("click", newContact);
    $("#save-button").on("click", saveContact);

}

function renderContactList() {
 
    var contactList = $("#contact-list ul");
    contactList.html("");
   
    for (var i = 0; i < state.contacts.length; i++) {
       
        var contact = state.contacts[i];
        
        var listItem = $("<li class='row align-items-center text-center justify-content-center px-1'></li>");
        var contactButton = $("<button class='col-10 col-lg-8 col-xl-10 btn btn-secondary'>" + contact.address + "</button>")

        contactButton.attr('data-address', state.contacts[i].address);
      
        contactButton.attr('data-contact-index', i);

        var deleteButton = $('<div class="p-1"><button class="btn btn-secondary delete-contact">X</button></div>');
       
        deleteButton.attr('data-contact-index', i);
  
        listItem.append(contactButton);
        listItem.append(deleteButton);

        contactList.append(listItem);
   
        contactButton.on('click', callAllFunctions);
   
        deleteButton.on('click', deleteContact);

        contactList.append(listItem);
    }
}

function callAllFunctions() {

    var address = $(this).attr('data-address');
    addressToMap(address);


    var contactIndex = $(this).attr('data-contact-index');
    var contact = state.contacts[contactIndex];
    renderContactInformation(contact);
}

function renderContactInformation(contact) {

    $("#display-address").text(contact.address);
}

function deleteContact() {
    var contactIndex = $(this).attr('data-contact-index');
    state.contacts.splice(contactIndex, 1);
    saveState();
    renderContactList();
}

function newContact() {
    $("#contact-information").modal("show");
}

function saveContact(event) {

    event.preventDefault();

    var addressValue = $("#address").val();


    if (addressValue === "") {
     
        $('#validationModal').modal("show");
        return;
    }

  
    $("#address").val("");


    var contact = {
        address: addressValue,
    };

    state.contacts.push(contact);
    saveState();

    $("#contact-information").modal("hide");
    renderContactList();
}

function loadState() {
    var json = localStorage.getItem("umbrella-address-book");

    if (json !== null) {
        state = JSON.parse(json);
    }
}

function saveState() {
    var json = JSON.stringify(state);

    localStorage.setItem("umbrella-address-book", json);
}

function addressToMap(address) {
   
    fetch("https://maps.googleapis.com/maps/api/geocode/json?address=" + encodeURIComponent(address) + '&key=' + "AIzaSyDSVjMQM3Hgp3upVIWiHSW1CTTP-VFT85A")
        .then(response => response.json())
        .then(data => {
        
            var lat = data.results[0].geometry.location.lat;
            var lng = data.results[0].geometry.location.lng;

            renderMap(lat, lng);

            checkWeather(lat, lng);
        })
}

function renderMap(lat, lng) {

    const contactLocation = { lat: lat, lng: lng };

    const map = new google.maps.Map(document.getElementById("location-map"), {

        zoom: 12,

        center: contactLocation,
    });

    const marker = new google.maps.Marker({
        position: contactLocation,
        map: map,
    });
}

init();
