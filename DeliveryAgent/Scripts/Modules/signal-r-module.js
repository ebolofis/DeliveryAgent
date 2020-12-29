function CustomSignalR() {
    var signalR = this;
    signalR.status = ko.observable(connectionStatusesEnum.Disconnected);
    signalR.connectedUsers = ko.observableArray([]);
    signalR.connection = null
    signalR.proxy = null;
    signalR.stateConversion = {
        0: "connecting",
        1: "connected",
        2: "reconnecting",
        4: "disconnected"
    };
    signalR.getCustomerPhone = function () { };
    signalR.clientsResponse = function () { };
    signalR.connectionCallback = null;

    signalR.SetProxyFunctions = function (proxyOnGetCustPhone, proxyOnClientsResponse) {
        if (proxyOnGetCustPhone != null) {
            signalR.getCustomerPhone = proxyOnGetCustPhone;
        }
        if (proxyOnClientsResponse != null) {
            signalR.clientsResponse = proxyOnClientsResponse;
        }
    };

    signalR.SetConnectionCallback = function (callback) {
        signalR.connectionCallback = callback;
    };

    signalR.Connect = function (server, hubName, group, name) {
        signalR.connection = $.hubConnection(server, { useDefaultPath: true, qs: { "group": group, "name": name } });
        signalR.proxy = signalR.connection.createHubProxy(hubName);
        ApplySignalRBindings();
        Connecting();
    };

    function ApplySignalRBindings() {
        signalR.connection.stateChanged(ConnectionStateChanged);
        signalR.proxy.on("GetCustPhone", signalR.getCustomerPhone);
        signalR.proxy.on("clientsResponse", signalR.clientsResponse);
    };

    function Connecting() {
        signalR.connection.start({
            jsonp: true
        }).done(function () {
            console.log("Connected, connection id = " + signalR.connection.id + ", connection name = " + signalR.connection.qs.name);
            JoinGroup();
        }).fail(function (error) {
            console.log("Could not connect: " + error);
        });
    };

    function JoinGroup() {
        var group = signalR.connection.qs.group;
        signalR.proxy.invoke("JoinGroup", group).done(function () {
            console.log("Joined group = " + signalR.connection.qs.group);
        }).fail(function (error) {
            console.log("Could not connect: " + error);
        });
    };

    function Reconnect() {
        setTimeout(function () {
            Connecting();
        }, 10000);
    };

    function ConnectionStateChanged(state) {
        console.log("SignalR state changed from: \"" + signalR.stateConversion[state.oldState] + "\" to: \"" + signalR.stateConversion[state.newState] + "\"");
        if (state.newState == 4) {
            signalR.status(connectionStatusesEnum.Disconnected);
            Reconnect();
        }
        if (state.newState == 2) {
            signalR.status(connectionStatusesEnum.Reconnecting);
        }
        else if (state.newState == 1) {
            signalR.status(connectionStatusesEnum.Connected);
            if (signalR.connectionCallback) {
                signalR.connectionCallback();
            }
        }
        if (state.newState == 0) {
            signalR.status(connectionStatusesEnum.Connecting);
        }
    };

}