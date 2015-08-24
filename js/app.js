$(function () {
    $('#btnClear').hide();
});

function getRecent() {
    var countriesList = document.getElementById("result");
    countriesList.style.minHeight = "565px";
    countriesList.style.maxHeight = "800px";
    countriesList.style.transition = "0.3s";
    var searchResults = document.getElementById("searchResults");
    searchResults.className = "resultList";
    document.getElementById("searchArea").className = "search-area";
    var input = document.getElementById("txtCountry");
    $.getJSON("data/recentData.json", function (data) {
        //read recent data
        var items = [];
        var typeOfSearch = "";
        var typeofclass = "";
        $.each(data, function (key, val) {
            // for each data get the value
            var result = "";
            if (key == "recent") {
                typeOfSearch = "Recent search";
                typeofclass = "fa fa-clock-o";
            } else {
                typeOfSearch = "Popular search";
                typeofclass = "fa fa-star";
            }
            result += "<h6 class='recent-popular'>" + typeOfSearch + "</h6>";
            for (var i = 0; i < val.length; i++) {
                result += "<div class='result-row' onclick='return selectCountry(this)'><span class='" + typeofclass + "'></span> <span class='result-title'>" + val[i].name + "</span></div>";
            }
            result += "<hr/>"
            items.push(result);
        });

        countriesList.innerHTML = items.join("");
        input.placeholder = "Enter destination or hotel...";
    });

    var searchResults = document.getElementById("searchResults");
    searchResults.className = "show-results";
    document.getElementById("btnSrcEsc").innerHTML = "<i class='text-primary fa fa-arrow-left' onclick='return clearList()'></i>";
}

function matchResults(result) {
    var input = document.getElementById("txtCountry");
    var inputValue = input.value;
    var reg = new RegExp(inputValue.split('').join('\\w*').replace(/\W/, ""), 'i'); //get the text from the input with case-insensitive

    //check if the input is maatching with kuala
    var kualaMatch = result.kuala.filter(function (place) {
        if (place.term === undefined) return false;
        if (place.term.match(reg)) {

            return place;
        }
    });

    //check if the input is matching with sin
    var sinMatch = result.sin.filter(function (place) {
        if (place.term === undefined) return false;
        if (place.term.match(reg)) {
            return place;
        }
    });

    var list = "";
    //print kuala match results
    if (kualaMatch.length !== 0) {
        for (var i = 0; i < kualaMatch[0].results.city.length; i++) {
            if (kualaMatch[0].results.city[0].term === undefined) return false;

            if (kualaMatch[0].results.city[0].term.match(reg)) {
                list += "<div class='result-row' onclick='return selectCountry(this)'><i class='fa fa-map-marker pl3'></i><span style='padding-left: 10px;'>" + kualaMatch[0].results.city[i].term + "</span></div>";
            }
        }
        for (var i = 0; i < kualaMatch[0].results.hotel.length; i++) {
            if (kualaMatch[0].results.hotel[0].term === undefined) return false;

            if (kualaMatch[0].results.hotel[0].term.match(reg)) {
                list += "<div class='result-row' onclick='return selectCountry(this)'><i class='fa fa-building-o'></i><span style='padding-left: 10px;'>" + kualaMatch[0].results.hotel[i].term + "</span><p class='small-text'>" + kualaMatch[0].results.hotel[i].data.city + ", " + kualaMatch[0].results.hotel[i].data.country + "</p></div>";
            }
        }
        for (var i = 0; i < kualaMatch[0].results.poi.length; i++) {
            if (kualaMatch[0].results.poi[0].term.match(reg)) {
                list += "<div class='result-row' onclick='return selectCountry(this)'><i class='fa fa-university' style='margin-left:-2px;'></i> <span class='result-title' style='padding-left: 5px;'>" + kualaMatch[0].results.poi[i].term + " </span><p class='small-text' style='padding-left: 23px !important;'>" + kualaMatch[0].results.poi[i].data.city + ", " + kualaMatch[0].results.poi[i].data.country + "</p></div>";
            }
        }
    }

    //print sin match results
    if (sinMatch.length !== 0) {
        for (var i = 0; i < sinMatch[0].results.city.length; i++) {
            if (sinMatch[0].results.city[0].term === undefined) return false;

            if (sinMatch[0].results.city[0].term.match(reg)) {
                list += "<div class='result-row' onclick='return selectCountry(this)'><i class='fa fa-map-marker pl3'></i> <span style='padding-left: 7px;'>" + sinMatch[0].results.city[i].term + "</span></div>";
            }
        }
        for (var i = 0; i < sinMatch[0].results.hotel.length; i++) {
            if (sinMatch[0].results.hotel[0].term === undefined) return false;

            if (sinMatch[0].results.hotel[0].term.match(reg)) {
                list += "<div class='result-row' onclick='return selectCountry(this)'><i class='fa fa-building-o'></i> <span style='padding-left: 7px;'>" + sinMatch[0].results.hotel[i].term + "</span><p class='small-text'>" + sinMatch[0].results.hotel[i].data.city + ", " + sinMatch[0].results.hotel[i].data.country + "</p></div>";
            }
        }
        for (var i = 0; i < sinMatch[0].results.poi.length; i++) {
            if (sinMatch[0].results.poi[0].term.match(reg)) {
                list += "<div class='result-row' onclick='return selectCountry(this)'><i class='fa fa-university' style='margin-left:-2px;'></i> <span class='result-title' style='padding-left: 5px;'>" + sinMatch[0].results.poi[i].term + "</span><p class='small-text' style='padding-left: 23px !important;'>" + sinMatch[0].results.poi[i].data.city + ", " + sinMatch[0].results.poi[i].data.country + "</p></div>";
            }
        }
    }

    var autoCompleteResult = list;
    var countriesList = document.getElementById("result");
    countriesList.style.minHeight = "565px";
    countriesList.style.maxHeight = "800px";
    countriesList.style.display = "block";
    countriesList.style.transition = "0.3s";
    countriesList.innerHTML = autoCompleteResult;
}

var changeInput = function () {
    $('#btnClear').show();
    var input = document.getElementById("txtCountry");
    var KeyID = event.keyCode; //check which key is pressed on the keyboard
    if (KeyID == "8") {
        //if back-space is pressed
        if (input.value === "") {
            //if the textbox is empty
            getRecent();
            return false;
        }
    }

    $.when(
        $.getJSON('data/kuala.json'),
        $.getJSON('data/sin.json')
    ).done(function (kuala, sin) {
            var result = {};
            result = {
                kuala: kuala,
                sin: sin
            }
            matchResults(result);
        });
};

var selectCountry = function (country) {
    //on country select place the name of the country in the textbox
    document.getElementById("txtCountry").value = country.textContent;
    var countriesList = document.getElementById("result");
    countriesList.style.minHeight = "0px";
    countriesList.style.maxHeight = "0px";
    countriesList.innerHTML = "";
    document.getElementById("btnSrcEsc").innerHTML = "<i class='text-primary fa fa-search'></i>";
    $('#btnClear').show();
    var searchResults = document.getElementById("searchResults");
    searchResults.className = "";
    document.getElementById("searchArea").className = "";
};

var clearList = function () {
    //clear the countries list
    var countriesList = document.getElementById("result");
    countriesList.style.minHeight = "0px";
    countriesList.style.maxHeight = "0px";
    countriesList.innerHTML = "";
    document.getElementById("btnSrcEsc").innerHTML = "<i class='text-primary fa fa-search'></i>";
    document.getElementById("txtCountry").value = "";
    $('#btnClear').hide();
    var searchResults = document.getElementById("searchResults");
    searchResults.className = "";
    var input = document.getElementById("txtCountry");
    input.placeholder = "Where you want to go?";
    document.getElementById("searchArea").className = "";
};

function clearSearch() {
    var input = document.getElementById("txtCountry");
    input.value = "";
    $('#btnClear').hide();
    getRecent();
    input.focus();
}