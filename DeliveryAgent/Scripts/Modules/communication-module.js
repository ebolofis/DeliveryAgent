function CustomCommunication() {
    var communication = this;

    communication.Communicate = function (communicationType, url, model, callback, errorCallback, showMessage) {
        switch (communicationType) {
            case communicationTypesEnum.Get:
                Get(url, callback, errorCallback, showMessage);
                break;
            case communicationTypesEnum.Post:
                Post(url, model, callback, errorCallback, showMessage);
                break;
            case communicationTypesEnum.Put:
                Put(url, model, callback, errorCallback, showMessage);
                break;
            case communicationTypesEnum.Delete:
                Delete(url, callback, errorCallback, showMessage);
                break;
            default:
                break;
        }
    };

    communication.SetHeaders = function (xhr) {
        if (localStorage.Authorization !== undefined && localStorage.Authorization != null && localStorage.Authorization != "") {
            var authorizationHeader = localStorage.Authorization;
            xhr.setRequestHeader("Authorization", authorizationHeader);
        }
        if (localStorage.SiteLanguage !== undefined && localStorage.SiteLanguage != null && localStorage.SiteLanguage != "") {
            var languageHeader = localStorage.SiteLanguage;
            xhr.setRequestHeader("Accept-Language", languageHeader);
        }
    };

    function Get(url, callback, errorCallback, showMessage) {
        $.ajax({
            url: url,
            cache: false,
            type: "GET",
            crossdomain: true,
            dataType: "json",
            ContentType: "application/json; charset=utf-8",
            beforeSend: communication.SetHeaders,
            statusCode: {
                /*OK*/
                200: function (response) {
                    if (callback) {
                        callback(response);
                    }
                }
            }
        }).fail(function (message) {
            if (message.status != 200) {
                console.log(message);
                if (showMessage) {
                    var errorMessage = message.responseJSON !== undefined ? (message.responseJSON.ExceptionMessage !== undefined ? message.responseJSON.ExceptionMessage : (message.responseJSON.ModelState !== undefined ? message.responseText : (message.responseJSON.Message !== undefined ? message.responseJSON.Message : message.responseJSON))) : (message.responseText != undefined ? message.responseText : message.statusText);
                    toastr.error(errorMessage);
                }
                if (errorCallback) {
                    errorCallback(message);
                }
            }
        });
    };

    function Post(url, model, callback, errorCallback, showMessage) {
        $.ajax({
            url: url,
            cache: false,
            type: "POST",
            crossdomain: true,
            dataType: "json",
            ContentType: "application/json; charset=utf-8",
            data: model,
            beforeSend: communication.SetHeaders,
            statusCode: {
                /*OK*/
                200: function (response) {
                    if (callback) {
                        callback(response);
                    }
                }
            }
        }).fail(function (message) {
            if (message.status != 200) {
                console.log(message);
                if (showMessage) {
                    var errorMessage = message.responseJSON !== undefined ? (message.responseJSON.ExceptionMessage !== undefined ? message.responseJSON.ExceptionMessage : (message.responseJSON.ModelState !== undefined ? message.responseText : (message.responseJSON.Message !== undefined ? message.responseJSON.Message : message.responseJSON))) : (message.responseText != undefined ? message.responseText : message.statusText);
                    toastr.error(errorMessage);
                }
                if (errorCallback) {
                    errorCallback(message);
                }
            }
        });
    };

    function Put(url, model, callback, errorCallback, showMessage) {

    };

    function Delete(url, callback, errorCallback, showMessage) {

    };

}