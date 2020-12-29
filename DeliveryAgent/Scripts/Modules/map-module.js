function CustomMap(clickMap) {
    var map = this;
    map.mapService = null;
    map.language = null;
    map.urlAddress = null;
    map.urlLatitudeLongitude = null;
    map.removeRegions = [];
    map.map = null;
    map.mapElement = null;
    map.markers = [];
    map.clickMap = clickMap;
    // #region Google
    var keyGoogle = null;
    // #endregion
    // #region Terra
    var vectorUrlTerra = null;
    var featureUrlTerra = null;
    var VectorTileLayerTerra = null;
    var BaseMapTerra = null;
    var GraphicsLayerTerra = null;
    var FieldInfoTerra = null;
    var FieldsContentTerra = null;
    var PopupTemplateTerra = null;
    var FeatureLayerTerra = null;
    var MapTerra = null;
    var MapViewTerra = null;
    var PointTerra = null;
    var PictureMarkerSymbolTerra = null;
    var GraphicTerra = null;
    var clickInfoWindowTerra = null;
    var clickInfoWindowTerraData = null;
    // #endregion

    map.Initialize = function (mapConfiguration) {
        map.mapService = mapConfiguration.Service;
        map.language = mapConfiguration.Language !== undefined ? mapConfiguration.Language : null;
        map.urlAddress = mapConfiguration.ApiAddressUrl !== undefined ? mapConfiguration.ApiAddressUrl : null;
        map.urlLatitudeLongitude = mapConfiguration.ApiLatitudeLongitudeUrl !== undefined ? mapConfiguration.ApiLatitudeLongitudeUrl : null;
        var regionsToRemove = mapConfiguration.RemoveRegions !== undefined ? mapConfiguration.RemoveRegions.split(",") : [];
        ko.utils.arrayForEach(regionsToRemove, function (r) {
            map.removeRegions.push(r);
        });
        keyGoogle = mapConfiguration.ApiKey !== undefined ? mapConfiguration.ApiKey : null;
        vectorUrlTerra = mapConfiguration.ApiJson !== undefined ? mapConfiguration.ApiJson : null;
        featureUrlTerra = mapConfiguration.ApiFeature !== undefined ? mapConfiguration.ApiFeature : null;
        var scriptSource = mapConfiguration.ApiScript !== undefined ? mapConfiguration.ApiScript : null;
        var styleSource = mapConfiguration.ApiStyle !== undefined ? mapConfiguration.ApiStyle : null;
        CreateScript(scriptSource, styleSource);
    };

    map.ConvertAddressToCoordinates = function (addressStigma, callback, errorCallback) {
        var formattedAddress = FormatAddress(addressStigma);
        switch (map.mapService) {
            case geocoder.Google:
                var url = map.urlAddress + "?address=" + formattedAddress + "&key=" + keyGoogle + "&language=" + map.language;
                break;
            case geocoder.Terra:
                var url = map.urlAddress + "?SingleLine=" + formattedAddress + "&langCode=" + map.language;
                break;
            default:
                var url = "";
                break;
        }
        $.ajax({
            url: url,
            cache: false,
            type: "GET",
            crossdomain: true,
            dataType: "json",
            ContentType: "application/json; charset=utf-8",
            statusCode: {
                /*OK*/
                200: function (response) {
                    switch (map.mapService) {
                        case geocoder.Google:
                            CallbackConvertAddressToCoordinatesGoogle(response, callback, errorCallback);
                            break;
                        case geocoder.Terra:
                            CallbackConvertAddressToCoordinatesTerra(response, callback, errorCallback);
                            break;
                        default:
                            break;
                    }
                }
            }
        }).fail(function () {
            toastr.error(language.Translate("ErrorConvertingAddressToCoordinates", null));
            if (errorCallback) {
                errorCallback();
            }
        });
    };

    map.ConvertCoordinatesToAddress = function (addressStigma, callback, errorCallback) {
        var formattedCoordinates = FormatCoordinates(addressStigma);
        switch (map.mapService) {
            case geocoder.Google:
                var url = map.urlLatitudeLongitude + "?latlng=" + formattedCoordinates + "&key=" + keyGoogle + "&language=" + map.language;
                break;
            case geocoder.Terra:
                var url = map.urlLatitudeLongitude + "?location=" + formattedCoordinates + "&langCode=" + map.language;
                break;
            default:
                var url = "";
                break;
        }
        $.ajax({
            url: url,
            cache: false,
            type: "GET",
            crossdomain: true,
            dataType: "json",
            ContentType: "application/json; charset=utf-8",
            statusCode: {
                /*OK*/
                200: function (response) {
                    switch (map.mapService) {
                        case geocoder.Google:
                            CallbackConvertCoordinatesToAddressGoogle(response, callback, errorCallback);
                            break;
                        case geocoder.Terra:
                            CallbackConvertCoordinatesToAddressTerra(response, callback, errorCallback);
                            break;
                        default:
                            break;
                    }
                }
            }
        }).fail(function () {
            toastr.error(language.Translate("ErrorConvertingCoordinatesToAddress", null));
            if (errorCallback) {
                errorCallback();
            }
        });
    };

    map.ShowAddressOnMap = function (latitude, longitude) {
        DeleteMarkers();
        if (map.map == null) {
            InitializeMap(latitude, longitude);
        }
        else {
            map.ShowMap();
            DeleteInfoWindow();
        }
        var centerMap = true;
        PlaceMarker(latitude, longitude, centerMap);
    };

    map.ShowAddressOnMapWithInfoWindow = function (addressStigma, clickInfoWindow, centerMap) {
        DeleteMarkers();
        if (map.map == null) {
            InitializeMap(addressStigma.Latitude, addressStigma.Longitude);
        }
        else {
            map.ShowMap();
            DeleteInfoWindow();
        }
        PlaceMarker(addressStigma.Latitude, addressStigma.Longitude, centerMap);
        CreateInfoWindow(addressStigma, clickInfoWindow);
    };

    map.ShowMap = function () {
        var element = document.getElementById("map");
        if (element != null && element.childNodes.length == 0 && map.mapElement != null) {
            element.appendChild(map.mapElement);
        }
    };

    map.RefreshMarkers = function () {
        ClearMarkers();
        ShowMarkers();
    };

    function CreateScript(scriptSource, styleSource) {
        switch (map.mapService) {
            case geocoder.Google:
                CreateScriptGoogle(scriptSource);
                break;
            case geocoder.Terra:
                CreateScriptTerra(scriptSource, styleSource);
                break;
            default:
                break;
        }
    };

    function FormatAddress(addressStigma) {
        var formattedAddress;
        switch (map.mapService) {
            case geocoder.Google:
                formattedAddress = FormatAddressGoogle(addressStigma);
                break;
            case geocoder.Terra:
                formattedAddress = FormatAddressTerra(addressStigma);
                break;
            default:
                break;
        }
        return formattedAddress;
    };

    function FormatCoordinates(addressStigma) {
        var formattedCoordinates;
        switch (map.mapService) {
            case geocoder.Google:
                formattedCoordinates = FormatCoordinatesGoogle(addressStigma);
                break;
            case geocoder.Terra:
                formattedCoordinates = FormatCoordinatesTerra(addressStigma);
                break;
            default:
                break;
        }
        return formattedCoordinates;
    };

    function InitializeMap(latitude, longitude) {
        switch (map.mapService) {
            case geocoder.Google:
                InitializeMapGoogle(latitude, longitude);
                break;
            case geocoder.Terra:
                InitializeMapTerra(latitude, longitude);
                break;
            default:
                break;
        }
    };

    function PlaceMarker(latitude, longitude, centerMap) {
        var mapInitialized = setInterval(function () {
            if (map.map != null) {
                clearInterval(mapInitialized);
                switch (map.mapService) {
                    case geocoder.Google:
                        PlaceMarkerGoogle(latitude, longitude, centerMap);
                        break;
                    case geocoder.Terra:
                        PlaceMarkerTerra(latitude, longitude, centerMap);
                        break;
                    default:
                        break;
                }
            }
        }, 100);
    };

    function ShowMarkers() {
        if (map.map != null) {
            switch (map.mapService) {
                case geocoder.Google:
                    ShowMarkersGoogle();
                    break;
                case geocoder.Terra:
                    ShowMarkersTerra();
                    break;
                default:
                    break;
            }
        }
    };

    function ClearMarkers() {
        if (map.map != null) {
            switch (map.mapService) {
                case geocoder.Google:
                    ClearMarkersGoogle();
                    break;
                case geocoder.Terra:
                    ClearMarkersTerra();
                    break;
                default:
                    break;
            }
        }
    };

    function DeleteMarkers() {
        if (map.map != null) {
            ClearMarkers();
            map.markers = [];
        }
    };

    function CreateInfoWindow(addressStigma, clickInfoWindow) {
        var mapInitialized = setInterval(function () {
            if (map.map != null) {
                clearInterval(mapInitialized);
                switch (map.mapService) {
                    case geocoder.Google:
                        CreateInfoWindowGoogle(addressStigma, clickInfoWindow);
                        break;
                    case geocoder.Terra:
                        CreateInfoWindowTerra(addressStigma, clickInfoWindow);
                        break;
                    default:
                        break;
                }
            }
        }, 100);
    };

    function DeleteInfoWindow() {
        if (map.map != null) {
            switch (map.mapService) {
                case geocoder.Google:
                    DeleteInfoWindowGoogle();
                    break;
                case geocoder.Terra:
                    DeleteInfoWindowTerra();
                    break;
                default:
                    break;
            }
        }
    };

    // #region Google

    function CreateScriptGoogle(scriptSource) {
        if (scriptSource != null) {
            var googleScript = document.createElement("script");
            googleScript.setAttribute("async", true);
            googleScript.setAttribute("defer", true);
            scriptSource = scriptSource + "&key=" + keyGoogle;
            scriptSource = scriptSource + "&language=" + map.language;
            googleScript.setAttribute("src", scriptSource);
            document.body.appendChild(googleScript);
        }
    };

    function FormatAddressGoogle(addressStigma) {
        var urlAddress = "";
        var temp = [];
        if (addressStigma.Number != null && addressStigma.Number != "") {
            temp = addressStigma.Number.split(" ");
            for (i = 0; i < temp.length; i++) {
                urlAddress = urlAddress + temp[i] + " ";
            }
        }
        if (addressStigma.Street != null && addressStigma.Street != "") {
            temp = addressStigma.Street.split(" ");
            for (i = 0; i < temp.length; i++) {
                urlAddress = urlAddress + temp[i];
                if (i == (temp.length - 1)) {
                    urlAddress = urlAddress + ",";
                }
                else {
                    urlAddress = urlAddress + " ";
                }
            }
        }
        if (addressStigma.Area != null && addressStigma.Area != "") {
            temp = addressStigma.Area.split(" ");
            for (i = 0; i < temp.length; i++) {
                urlAddress = urlAddress + " " + temp[i];
                if (i == (temp.length - 1) && ((addressStigma.City != null && addressStigma.City != "") || (addressStigma.ZipCode != null && addressStigma.ZipCode != ""))) {
                    urlAddress = urlAddress + ",";
                }
            }
        }
        if (addressStigma.City != null && addressStigma.City != "") {
            temp = addressStigma.City.split(" ");
            for (i = 0; i < temp.length; i++) {
                urlAddress = urlAddress + " " + temp[i];
                if (i == (temp.length - 1) && (addressStigma.ZipCode != null && addressStigma.ZipCode != "")) {
                    urlAddress = urlAddress + ",";
                }
            }
        }
        if (addressStigma.ZipCode != null && addressStigma.ZipCode != "") {
            temp = addressStigma.ZipCode.split(" ");
            for (i = 0; i < temp.length; i++) {
                urlAddress = urlAddress + " " + temp[i];
            }
        }
        var formattedAddress = urlAddress.replace("&", "and");
        ko.utils.arrayForEach(map.removeRegions, function (r) {
            formattedAddress = formattedAddress.replace(r, "");
        });
        return formattedAddress;
    };

    function FormatCoordinatesGoogle(addressStigma) {
        var urlLatitudeLongitude = "";
        urlLatitudeLongitude = urlLatitudeLongitude + addressStigma.Latitude;
        urlLatitudeLongitude = urlLatitudeLongitude + ",";
        urlLatitudeLongitude = urlLatitudeLongitude + addressStigma.Longitude;
        return urlLatitudeLongitude;
    };

    function CallbackConvertAddressToCoordinatesGoogle(response, callback, errorCallback) {
        if (response.status == geocoderStatusEnum.Ok && response.results.length > 0) {
            var addresses = [];
            ko.utils.arrayForEach(response.results, function (a) {
                var address = new AddressStigmaModel();
                address.Proximity = a.geometry.location_type;
                var location = a.geometry.location;
                address.Latitude = location.lat;
                address.Longitude = location.lng;
                var addressList = a.address_components;
                for (i = 0; i < addressList.length; i++) {
                    for (j = 0; j < addressList[i].types.length; j++) {
                        switch (addressList[i].types[j]) {
                            case "street_number":
                                var streetNumber = addressList[i].long_name;
                                address.Number = streetNumber;
                                break;
                            case "route":
                                var streetName = addressList[i].long_name;
                                address.Street = streetName;
                                break;
                            case "neighborhood":
                            case "locality":
                                var areaName = addressList[i].long_name;
                                address.Area = areaName;
                                break;
                            case "postal_town":
                            case "administrative_area_level_3":
                                var cityName = addressList[i].long_name;
                                address.City = cityName;
                                break;
                            case "country":
                            case "administrative_area_level_1":
                                var countryName = addressList[i].long_name;
                                address.Country = countryName;
                                break;
                            case "postal_code":
                                var tempZipCode = addressList[i].long_name.split(" ");
                                var zipCodeName = "";
                                for (k = 0; k < tempZipCode.length; k++) {
                                    zipCodeName = zipCodeName + tempZipCode[k];
                                }
                                address.ZipCode = zipCodeName;
                                break;
                            default:
                                break;
                        }
                    }
                }
                addresses.push(address);
            });
            if (callback) {
                callback(addresses);
            }
        }
        else {
            toastr.error(language.Translate("AddressNotMatched", null));
            if (response.error_message !== undefined) {
                toastr.error(response.error_message);
            }
            if (errorCallback) {
                errorCallback();
            }
        }
    };

    function CallbackConvertCoordinatesToAddressGoogle(response, callback, errorCallback) {
        if (response.status == geocoderStatusEnum.Ok && response.results.length > 0) {
            var addresses = [];
            ko.utils.arrayForEach(response.results, function (a) {
                if (a.geometry.location_type != geocoderLocationTypeDescriptionEnum.Approximate) {
                    var address = new AddressStigmaModel();
                    address.Proximity = a.geometry.location_type;
                    var location = a.geometry.location;
                    address.Latitude = location.lat;
                    address.Longitude = location.lng;
                    var addressList = a.address_components;
                    for (i = 0; i < addressList.length; i++) {
                        for (j = 0; j < addressList[i].types.length; j++) {
                            switch (addressList[i].types[j]) {
                                case "street_number":
                                    var streetNumber = addressList[i].long_name;
                                    address.Number = streetNumber;
                                    break;
                                case "route":
                                    var streetName = addressList[i].long_name;
                                    address.Street = streetName;
                                    break;
                                case "neighborhood":
                                case "locality":
                                    var areaName = addressList[i].long_name;
                                    address.Area = areaName;
                                    break;
                                case "postal_town":
                                case "administrative_area_level_3":
                                    var cityName = addressList[i].long_name;
                                    address.City = cityName;
                                    break;
                                case "country":
                                case "administrative_area_level_1":
                                    var countryName = addressList[i].long_name;
                                    address.Country = countryName;
                                    break;
                                case "postal_code":
                                    var tempZipCode = addressList[i].long_name.split(" ");
                                    var zipCodeName = "";
                                    for (k = 0; k < tempZipCode.length; k++) {
                                        zipCodeName = zipCodeName + tempZipCode[k];
                                    }
                                    address.ZipCode = zipCodeName;
                                    break;
                                default:
                                    break;
                            }
                        }
                    }
                    addresses.push(address);
                }
            });
            if (callback) {
                callback(addresses);
            }
        }
        else {
            toastr.error(language.Translate("AddressNotMatched", null));
            if (response.error_message !== undefined) {
                toastr.error(response.error_message);
            }
            if (errorCallback) {
                errorCallback();
            }
        }
    };

    function InitializeMapGoogle(latitude, longitude) {
        var startLocation = new google.maps.LatLng(latitude, longitude);
        map.map = new google.maps.Map(document.getElementById("map"), {
            zoom: 15,
            center: startLocation
        });
        map.mapElement = document.getElementById("map");
        google.maps.event.addListener(map.map, "click", function (event) {
            if (map.clickMap != null) {
                var latitude = event.latLng.lat();
                var longitude = event.latLng.lng();
                map.clickMap(latitude, longitude);
            }
        });
    };

    function PlaceMarkerGoogle(latitude, longitude, centerMap) {
        var location = new google.maps.LatLng(latitude, longitude);
        var marker = new google.maps.Marker({
            position: location,
            map: map.map
        });
        map.markers.push(marker);
        if (centerMap) {
            map.map.setCenter(marker.getPosition());
        }
    };

    function ShowMarkersGoogle() {
        for (var i = 0; i < map.markers.length; i++) {
            map.markers[i].setMap(map.map);
        }
    };

    function ClearMarkersGoogle() {
        for (var i = 0; i < map.markers.length; i++) {
            map.markers[i].setMap(null);
        }
    };

    function CreateInfoWindowGoogle(addressStigma, clickInfoWindow) {
        var marker = map.markers[map.markers.length - 1];
        var infoWindow = new google.maps.InfoWindow;
        var address = "";
        if (addressStigma.Street != null) {
            address = address + addressStigma.Street;
            address = address + " ";
        }
        if (addressStigma.Number != null) {
            address = address + addressStigma.Number;
            address = address + ", ";
        }
        if (addressStigma.Area != null) {
            address = address + addressStigma.Area;
        }
        infoWindow.setContent(address);
        infoWindow.open(map.map, marker);
        marker.addListener("click", function () {
            if (clickInfoWindow != null) {
                clickInfoWindow(addressStigma);
            }
        });
    };

    function DeleteInfoWindowGoogle() {

    };

    // #endregion

    // #region Terra

    function CreateScriptTerra(scriptSource, styleSource) {
        if (scriptSource != null) {
            var terraScript = document.createElement("script");
            terraScript.setAttribute("src", scriptSource);
            document.head.appendChild(terraScript);
        }
        if (styleSource != null) {
            var terraStyle = document.createElement("link");
            terraStyle.setAttribute("rel", "stylesheet");
            terraStyle.setAttribute("href", styleSource);
            document.head.appendChild(terraStyle);
        }
        dojoConfig = {
            locale: map.language,
            parseOnLoad: true,
            has: {
                "esri-featurelayer-webgl": 1
            }
        };
        var initializeTerraMap = setInterval(function () {
            if (document.readyState === "complete" && window.dojo !== undefined) {
                clearInterval(initializeTerraMap);
                require([
                    "esri/layers/VectorTileLayer",
                    "esri/Basemap",
                    "esri/layers/GraphicsLayer",
                    "esri/popup/FieldInfo",
                    "esri/popup/content/FieldsContent",
                    "esri/PopupTemplate",
                    "esri/layers/FeatureLayer",
                    "esri/Map",
                    "esri/views/MapView",
                    "esri/geometry/Point",
                    "esri/symbols/PictureMarkerSymbol",
                    "esri/Graphic",
                ], function (VectorTileLayer, Basemap, GraphicsLayer, FieldInfo, FieldsContent, PopupTemplate, FeatureLayer, Map, MapView, Point, PictureMarkerSymbol, Graphic) {
                        VectorTileLayerTerra = VectorTileLayer;
                        BaseMapTerra = Basemap;
                        GraphicsLayerTerra = GraphicsLayer;
                        FieldInfoTerra = FieldInfo;
                        FieldsContentTerra = FieldsContent;
                        PopupTemplateTerra = PopupTemplate;
                        FeatureLayerTerra = FeatureLayer;
                        MapTerra = Map;
                        MapViewTerra = MapView;
                        PointTerra = Point;
                        PictureMarkerSymbolTerra = PictureMarkerSymbol;
                        GraphicTerra = Graphic;
                });
            };
        }, 1000);
    };

    function FormatAddressTerra(addressStigma) {
        var urlAddress = "";
        var temp = [];
        if (addressStigma.Street != null && addressStigma.Street != "") {
            temp = addressStigma.Street.split(" ");
            for (i = 0; i < temp.length; i++) {
                urlAddress = urlAddress + temp[i] + " ";
            }
        }
        if (addressStigma.Number != null && addressStigma.Number != "") {
            temp = addressStigma.Number.split(" ");
            for (i = 0; i < temp.length; i++) {
                urlAddress = urlAddress + temp[i];
                if (i == (temp.length - 1)) {
                    urlAddress = urlAddress + ",";
                }
                else {
                    urlAddress = urlAddress + " ";
                }
            }
        }
        if (addressStigma.Area != null && addressStigma.Area != "") {
            temp = addressStigma.Area.split(" ");
            for (i = 0; i < temp.length; i++) {
                urlAddress = urlAddress + " " + temp[i];
                if (i == (temp.length - 1) && ((addressStigma.City != null && addressStigma.City != "") || (addressStigma.ZipCode != null && addressStigma.ZipCode != ""))) {
                    urlAddress = urlAddress + ",";
                }
            }
        }
        if (addressStigma.City != null && addressStigma.City != "") {
            temp = addressStigma.City.split(" ");
            for (i = 0; i < temp.length; i++) {
                urlAddress = urlAddress + " " + temp[i];
                if (i == (temp.length - 1) && (addressStigma.ZipCode != null && addressStigma.ZipCode != "")) {
                    urlAddress = urlAddress + ",";
                }
            }
        }
        if (addressStigma.ZipCode != null && addressStigma.ZipCode != "") {
            temp = addressStigma.ZipCode.split(" ");
            for (i = 0; i < temp.length; i++) {
                urlAddress = urlAddress + " " + temp[i];
            }
        }
        var formattedAddress = urlAddress.replace("&", "and");
        ko.utils.arrayForEach(map.removeRegions, function (r) {
            formattedAddress = formattedAddress.replace(r, "");
        });
        return formattedAddress;
    };

    function FormatCoordinatesTerra(addressStigma) {
        var urlLatitudeLongitude = "";
        urlLatitudeLongitude = urlLatitudeLongitude + "{x:";
        urlLatitudeLongitude = urlLatitudeLongitude + addressStigma.Longitude;
        urlLatitudeLongitude = urlLatitudeLongitude + ",y:";
        urlLatitudeLongitude = urlLatitudeLongitude + addressStigma.Latitude;
        urlLatitudeLongitude = urlLatitudeLongitude + "}";
        return urlLatitudeLongitude;
    };

    function CallbackConvertAddressToCoordinatesTerra(response, callback, errorCallback) {
        if (response.candidates.length > 0) {
            var addresses = [];
            ko.utils.arrayForEach(response.candidates, function (a) {
                var address = new AddressStigmaModel();
                if ((a.attributes.street == null || a.attributes.street == "") && (a.attributes.municip == null || a.attributes.municip == "")) {
                    address.Proximity = geocoderLocationTypeDescriptionEnum.Approximate;
                }
                else if ((a.attributes.street == null || a.attributes.street == "") && a.attributes.municip != null && a.attributes.municip != "" && a.attributes.zip != null && a.attributes.zip != "") {
                    address.Proximity = geocoderLocationTypeDescriptionEnum.GeometricCenter;
                }
                else if ((a.attributes.municip == null || a.attributes.municip == "") && a.attributes.street != null && a.attributes.street != "" && a.attributes.zip != null && a.attributes.zip != "") {
                    address.Proximity = geocoderLocationTypeDescriptionEnum.RangeInterpolated;
                }
                else if (a.attributes.street != null && a.attributes.street != "" && a.attributes.municip != null && a.attributes.municip != "" && a.attributes.zip != null && a.attributes.zip != "") {
                    address.Proximity = geocoderLocationTypeDescriptionEnum.Rooftop;
                }
                else {
                    address.Proximity = geocoderLocationTypeDescriptionEnum.Unknown;
                }
                var location = a.location;
                address.Latitude = location.y;
                address.Longitude = location.x;
                var addressList = a.attributes;
                address.Number = addressList.num;
                address.Street = addressList.street;
                address.Area = addressList.municip;
                address.City = addressList.pref;
                address.Country = addressList.country;
                address.ZipCode = addressList.zip;
                if (addressList.name !== undefined) {
                    address.Description = addressList.name;
                }
                addresses.push(address);
            });
            if (callback) {
                callback(addresses);
            }
        }
        else {
            toastr.error(language.Translate("AddressNotMatched", null));
            if (errorCallback) {
                errorCallback();
            }
        }
    };

    function CallbackConvertCoordinatesToAddressTerra(response, callback, errorCallback) {
        if (response.address !== undefined) {
            var address = new AddressStigmaModel();
            if ((response.attributes.street == null || response.attributes.street == "") && (response.attributes.municip == null || response.attributes.municip == "")) {
                address.Proximity = geocoderLocationTypeDescriptionEnum.Approximate;
            }
            else if ((response.attributes.street == null || response.attributes.street == "") && response.attributes.municip != null && response.attributes.municip != "" && response.attributes.zip != null && response.attributes.zip != "") {
                address.Proximity = geocoderLocationTypeDescriptionEnum.GeometricCenter;
            }
            else if ((response.attributes.municip == null || response.attributes.municip == "") && response.attributes.street != null && response.attributes.street != "" && response.attributes.zip != null && response.attributes.zip != "") {
                address.Proximity = geocoderLocationTypeDescriptionEnum.RangeInterpolated;
            }
            else if (response.attributes.street != null && response.attributes.street != "" && response.attributes.municip != null && response.attributes.municip != "" && response.attributes.zip != null && response.attributes.zip != "") {
                address.Proximity = geocoderLocationTypeDescriptionEnum.Rooftop;
            }
            else {
                address.Proximity = geocoderLocationTypeDescriptionEnum.Unknown;
            }
            var location = response.location;
            address.Latitude = location.y;
            address.Longitude = location.x;
            var addressList = response.attributes;
            address.Number = addressList.num;
            address.Street = addressList.street;
            address.Area = addressList.municip;
            address.City = addressList.pref;
            address.Country = addressList.country;
            address.ZipCode = addressList.zip;
            if (addressList.name !== undefined) {
                address.Description = addressList.name;
            }
            if (callback) {
                callback([address]);
            }
        }
        else {
            toastr.error(language.Translate("AddressNotMatched", null));
            if (errorCallback) {
                errorCallback();
            }
        }
    };

    function InitializeMapTerra(latitude, longitude) {
        var vectorTileLayerTerra = new VectorTileLayerTerra({
            url: vectorUrlTerra
        });
        var baseMapTerra = new BaseMapTerra({
            baseLayers: [vectorTileLayerTerra],
            title: "Terra Streets",
            id: "TerraVectorBasemap"
        });
        var graphicsLayerTerra = new GraphicsLayerTerra();
        var fieldInfoTerra1 = new FieldInfoTerra({
            fieldName: "ADDR_GR",
            label: "Διεύθυνση"
        });
        var fieldInfoTerra2 = new FieldInfoTerra({
            fieldName: "ADD_NUMB",
            label: "Αριθμός"
        });
        var fieldInfoTerra3 = new FieldInfoTerra({
            fieldName: "MUN_GR",
            label: "Πόλη"
        });
        var fieldInfoTerra4 = new FieldInfoTerra({
            fieldName: "REMARK",
            label: "Σχόλιο"
        });
        var fieldsContentTerra = new FieldsContentTerra({
            fieldInfos: [fieldInfoTerra1, fieldInfoTerra2, fieldInfoTerra3, fieldInfoTerra4]
        });
        var popupTemplateTerra = new PopupTemplateTerra({
            title: "NAME_GR",
            content: [fieldsContentTerra]
        });
        var featureLayerTerra = new FeatureLayerTerra({
            url: featureUrlTerra,
            outFields: ["ADDR_GR", "ADD_NUMB", "MUN_GR", "REMARK"],
            popupTemplate: popupTemplateTerra,
            popupEnabled: false,
            minScale: 30000
        });
        var mapTerra = new MapTerra({
            basemap: baseMapTerra,
            layers: [graphicsLayerTerra, featureLayerTerra]
        });
        map.map = new MapViewTerra({
            container: "map",
            map: mapTerra,
            zoom: 15,
            center: [longitude, latitude]
        });
        map.mapElement = document.getElementById("map");
        map.map.surface.style.cursor = "pointer";
        map.map.on("click", function (event) {
            if (map.clickMap != null) {
                var latitude = event.mapPoint.latitude;
                var longitude = event.mapPoint.longitude;
                map.clickMap(latitude, longitude);
            }
        });
        map.map.popup.on("trigger-action", function (event) {
            if (event.action.id == "update-address") {
                if (clickInfoWindowTerra != null) {
                    clickInfoWindowTerra(clickInfoWindowTerraData);
                }
            }
        });
    };

    function PlaceMarkerTerra(latitude, longitude, centerMap) {
        var point = new PointTerra(longitude, latitude);
        var pictureMarkerSymbol = new PictureMarkerSymbolTerra({
            url: "./../Content/Images/pinpoint.png",
            width: "40px",
            height: "40px"
        });
        var marker = new GraphicTerra({
            geometry: point,
            symbol: pictureMarkerSymbol
        });
        map.markers.push(marker);
        var mapReady = setInterval(function () {
            if (map.map.ready && !map.map.updating) {
                clearInterval(mapReady);
                setTimeout(function () {
                    map.map.graphics.add(marker);
                    if (centerMap) {
                        map.map.center = point;
                    }
                }, 2000);
            }
        }, 100);
    };

    function ShowMarkersTerra() {
        for (i = 0; i < map.markers.length; i++) {
            map.map.graphics.add(map.markers[i]);
        }
        //map.map.graphics.addMany(map.markers);
    };

    function ClearMarkersTerra() {
        for (i = 0; i < map.markers.length; i++) {
            map.map.graphics.remove(map.markers[i]);
        }
        //map.map.graphics.removeMany(map.markers);
    };

    function CreateInfoWindowTerra(addressStigma, clickInfoWindow) {
        clickInfoWindowTerra = clickInfoWindow;
        clickInfoWindowTerraData = addressStigma;
        var point = new PointTerra(addressStigma.Longitude, addressStigma.Latitude);
        var marker = map.markers[map.markers.length - 1];
        var address = "";
        if (addressStigma.Street != null) {
            address = address + addressStigma.Street;
            address = address + " ";
        }
        if (addressStigma.Number != null) {
            address = address + addressStigma.Number;
            address = address + ", ";
        }
        if (addressStigma.Area != null) {
            address = address + addressStigma.Area;
        }
        marker.attributes = {
            "name": address
        };
        var updateAddress = {
            title: language.Translate("Action", null),
            id: "update-address",
        };
        marker.popupTemplate = {
            title: "{name}",
            actions: [updateAddress]
        };
        map.map.popup.open({
            location: point,
            features: [marker]
        });
    };

    function DeleteInfoWindowTerra() {
        map.map.popup.close();
        clickInfoWindowTerra = null;
        clickInfoWindowTerraData = null;
    };

    // #endregion

}