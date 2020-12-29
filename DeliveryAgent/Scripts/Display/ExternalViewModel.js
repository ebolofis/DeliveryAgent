function ExternalViewModel() {
    // ----- PROPERTIES ----- //
    var self = this;
    self.currentStaff = ko.observable(null);
    self.selectedPhone = ko.observable(null);
    self.failedOrders = ko.observableArray([]);
    self.computedClock = ko.observable(moment().format("HH:mm"));
    self.orderOriginOptions = ko.observable({
        0: language.Translate("Agent", null),
        1: language.Translate("Website", null),
        2: language.Translate("Mobile", null),
        3: language.Translate("EFood", null),
        4: language.Translate("ClickDelivery", null),
        5: language.Translate("Deliveras", null),
        6: language.Translate("Skroutz", null),
        7: language.Translate("DineIn", null)
    });
    self.stores = ko.observableArray([]);
    self.storeOptions = ko.observable(null);
    self.storeSort = null;
    self.selectedExternalOrder = ko.observable(null);
    self.addressesOptions = ko.observableArray([]);
    self.selectedAddressesOptions = ko.observable(null);
    self.deletingOrder = ko.observable(false);
    self.editingOrder = ko.observable(false);
    self.updateAddressFromMap = false;
    self.showAddressOptions = false;
    self.lockMap = ko.observable(false);
    self.ordersMultitude = ko.observable(10);
    self.resendingAllOrders = ko.observable(false);
    self.allOrdersMultitude = 0;
    self.showMessages = ko.observable(true);
    // ----- MODULES ----- //
    self.communication = new CustomCommunication();
    self.map = new CustomMap(ClickMap);
    self.navigation = new CustomNavigation();
    self.pagination = new CustomPagination(self.communication);
    self.signalR = new CustomSignalR();
    // ----- COMPUTED PROPERTIES ----- //
    // ----- INTERVAL FUNCTIONS ----- //
    // Updates time
    // ****************************** //
    var visualClockUpdate = setInterval(function () {
        self.computedClock(moment().format("HH:mm"));
    }, 1000);
    // Refreshes external orders
    // ****************************** //
    var externalOrdersRefresh = setInterval(function () {
        if (!self.resendingAllOrders() && !$("#editExternalOrder").is(":visible") && !$("#deleteExternalOrder1").is(":visible") && !$("#deleteExternalOrder2").is(":visible") && !$("#viewExternalOrder").is(":visible")) {
            GetUnmatchedOrders();
        }
    }, 30000);
    // ----- FUNCTIONS ----- //
    // #region Main Body
    // Checks version compatibility with API
    // ****************************** //
    self.CheckVersionCompatibility = function () {
        if (localStorage.ClientVersion === undefined || localStorage.ClientVersion == null || localStorage.ClientVersion == "") {
            self.navigation.GoToModule(navigationViewsEnum.Login, null);
        }
        else {
            $.ajax({
                url: localStorage.ApiAddress + "api/Security/CheckVersion?client=" + clientsEnum.Agent + "&version=" + localStorage.ClientVersion,
                cache: false,
                type: "GET",
                crossdomain: true,
                dataType: "json",
                ContentType: "application/json; charset=utf-8",
                statusCode: {
                    /*OK*/
                    200: function (response) {
                        if (sessionStorage.Staff === undefined || sessionStorage.Staff == null || sessionStorage.Staff == "" || localStorage.Phone === undefined || localStorage.Phone == null || localStorage.Phone == "") {
                            self.navigation.GoToModule(navigationViewsEnum.Login, null);
                        }
                        InitializeData();
                    },
                    /*Error*/
                    500: function (response) {
                        self.navigation.GoToModule(navigationViewsEnum.Login, null);
                    }
                }
            }).fail(function (message) {
                if (message.status != 200 && message.status != 500) {
                    var errorMessage = message.responseJSON !== undefined ? (message.responseJSON.ExceptionMessage !== undefined ? message.responseJSON.ExceptionMessage : (message.responseJSON.ModelState !== undefined ? message.responseText : message.responseJSON.Message)) : (message.responseText != undefined ? message.responseText : message.statusText);
                    toastr.error(errorMessage);
                    console.log(message);
                    self.navigation.GoToModule(navigationViewsEnum.Login, null);
                }
            });
        }
    };
    // Opens failed orders modal
    // ****************************** //
    self.OpenFailedOrders = function () {
        if (self.failedOrders().length == 0) {
            return;
        }
        $("#failedOrders").modal("show");
    };
    // Closes failed orders modal
    // ****************************** //
    self.CloseFailedOrders = function () {
        $("#failedOrders").modal("hide");
    };
    // Opens general actions modal
    // ****************************** //
    self.OpenGeneralActions = function () {
        $("#generalActions").modal("show");
    };
    // Closes general actions modal
    // ****************************** //
    self.CloseGeneralActions = function () {
        $("#generalActions").modal("hide");
    };
    // Disconnects current staff
    // ****************************** //
    self.LogOff = function () {
        sessionStorage.Staff = "";
        self.navigation.GoToModule(navigationViewsEnum.Login, null);
    };
    // Defines multitude of external's paged orders
    // ****************************** //
    self.SelectExternalOrdersMultitude = function (multitude) {
        self.ordersMultitude(multitude);
        GetUnmatchedOrders();
    };
    // Resends all external orders
    // ****************************** //
    self.ResendAllExternalOrders = function () {
        if (self.resendingAllOrders()) {
            return;
        }
        if (self.pagination.totalResults() == 0) {
            return;
        }
        self.resendingAllOrders(true);
        self.allOrdersMultitude = self.pagination.totalResults();
        ko.utils.arrayForEach(self.pagination.allEntities, function (e) {
            var url = localStorage.ApiAddress + "api/v3/da/Efood/Repost";
            var postOrder = new PostExternalModel(e);
            var showMessage = true;
            self.communication.Communicate(communicationTypesEnum.Post, url, postOrder, CallbackResendAllExternalOrders, ErrorCallbackResendAllExternalOrders, showMessage);
        });
    };
    // Selects store for selected order
    // ****************************** //
    self.SelectStore = function (store) {
        self.selectedExternalOrder().Order.StoreId = store.Id;
        self.selectedExternalOrder().Order.CheckShippingAddress = false;
        self.selectedExternalOrder.notifySubscribers();
        self.map.ShowMap();
    };
    // Calculates latitude and longitude for address
    // ****************************** //
    self.CalculateAddressCoordinates = function () {
        if (self.lockMap()) {
            return;
        }
        self.lockMap(true);
        var fullAddress = new AddressStigmaModel();
        fullAddress.Street = self.selectedExternalOrder().ShippingAddress.AddressStreet != null ? self.selectedExternalOrder().ShippingAddress.AddressStreet : "";
        fullAddress.Number = self.selectedExternalOrder().ShippingAddress.AddressNumber != null ? self.selectedExternalOrder().ShippingAddress.AddressNumber : "";
        fullAddress.Area = self.selectedExternalOrder().ShippingAddress.Area != null ? self.selectedExternalOrder().ShippingAddress.Area : "";
        fullAddress.ZipCode = self.selectedExternalOrder().ShippingAddress.ZipCode != null ? self.selectedExternalOrder().ShippingAddress.ZipCode : "";
        fullAddress.City = self.selectedExternalOrder().ShippingAddress.City != null ? self.selectedExternalOrder().ShippingAddress.City : "";
        self.map.ConvertAddressToCoordinates(fullAddress, CallbackCalculateAddressCoordinates, ErrorCallbackCalculateAddressCoordinates);
    };
    // Selects address from address for update
    // ****************************** //
    self.SelectAddressesOptionsFromAddressForExternalOrder = function (address) {
        self.selectedAddressesOptions(address);
    };
    // Selects address from address
    // ****************************** //
    self.CallbackCalculateAddressCoordinatesConfirm = function () {
        if (self.selectedAddressesOptions() == null) {
            toastr.warning(language.Translate("SelectAddress", null));
            return;
        }
        $("#addressesFromAddressExternalOrder").modal("hide");
        var addresses = [];
        addresses.push(self.selectedAddressesOptions());
        CallbackCalculateAddressCoordinates(addresses);
    };
    // Closes addresses from address modal
    // ****************************** //
    self.CallbackCalculateAddressCoordinatesCancel = function () {
        self.lockMap(false);
        $("#addressesFromAddressExternalOrder").modal("hide");
    };
    // Selects address from coordinates for update
    // ****************************** //
    self.SelectAddressesOptionsFromCoordinatesForExternalOrder = function (address) {
        self.selectedAddressesOptions(address);
    };
    // Selects address from coordinates
    // ****************************** //
    self.CallbackClickMapConfirm = function () {
        if (self.selectedAddressesOptions() == null) {
            toastr.warning(language.Translate("SelectAddress", null));
            return;
        }
        $("#addressesFromCoordinatesExternalOrder").modal("hide");
        var addresses = [];
        addresses.push(self.selectedAddressesOptions());
        CallbackClickMap(addresses);
    };
    // Closes addresses from coordinates modal
    // ****************************** //
    self.CallbackClickMapCancel = function () {
        $("#addressesFromCoordinatesExternalOrder").modal("hide");
    };
    // Opens first delete external order modal
    // ****************************** //
    self.DeleteExternalOrder = function () {
        $("#deleteExternalOrder1").modal("show");
    };
    // Opens second delete external order modal
    // ****************************** //
    self.DeleteExternalOrderConfirm = function () {
        $("#deleteExternalOrder1").modal("hide");
        $("#deleteExternalOrder2").modal("show");
    };
    // Closes first delete external order modal
    // ****************************** //
    self.DeleteExternalOrderCancel = function () {
        $("#deleteExternalOrder1").modal("hide");
    };
    // Deletes external order
    // ****************************** //
    self.DeleteExternalOrderConfirmConfirm = function () {
        if (self.deletingOrder()) {
            return;
        }
        self.deletingOrder(true);
        var orderId = self.selectedExternalOrder().Order.ExtId1;
        var url = localStorage.ApiAddress + "api/v3/da/Efood/markDeleteBucketItem/" + orderId;
        var showMessage = true;
        self.communication.Communicate(communicationTypesEnum.Get, url, null, CallbackDeleteExternalOrderConfirmConfirm, ErrorCallbackDeleteExternalOrderConfirmConfirm, showMessage);
    };
    // Closes second delete external order modal
    // ****************************** //
    self.DeleteExternalOrderConfirmCancel = function () {
        $("#deleteExternalOrder2").modal("hide");
    };
    // Opens external order details modal
    // ****************************** //
    self.ViewExternalOrder = function () {
        $("#viewExternalOrder").modal("show");
    };
    // Closes external order details modal
    // ****************************** //
    self.CloseExternalOrder = function () {
        $("#viewExternalOrder").modal("hide");
    };
    // Opens edit external order modal
    // ****************************** //
    self.EditExternalOrder = function (order) {
        self.selectedExternalOrder(order);
        $("#editExternalOrder").modal("show");
        if (self.selectedExternalOrder().ShippingAddress.Latitude == null || self.selectedExternalOrder().ShippingAddress.Longitude == null) {
            self.CalculateAddressCoordinates();
        }
        else if (self.selectedExternalOrder().Order.StoreId == null || self.selectedExternalOrder().Order.StoreId == 0) {
            var centerMap = true;
            self.map.ShowAddressOnMap(self.selectedExternalOrder().ShippingAddress.Latitude, self.selectedExternalOrder().ShippingAddress.Longitude, centerMap);
            MatchAddressWithStore();
        }
        else {
            var centerMap = true;
            self.map.ShowAddressOnMap(self.selectedExternalOrder().ShippingAddress.Latitude, self.selectedExternalOrder().ShippingAddress.Longitude, centerMap);
        }
    };
    // Edits external order
    // ****************************** //
    self.EditExternalOrderConfirm = function () {
        if (self.editingOrder()) {
            return;
        }
        self.editingOrder(true);
        var url = localStorage.ApiAddress + "api/v3/da/Efood/Repost";
        var postOrder = new PostExternalModel(self.selectedExternalOrder());
        var showMessage = true;
        self.communication.Communicate(communicationTypesEnum.Post, url, postOrder, CallbackEditExternalOrderConfirm, ErrorCallbackEditExternalOrderConfirm, showMessage);
    };
    // Closes edit external order modal
    // ****************************** //
    self.EditExternalOrderCancel = function () {
        $("#editExternalOrder").modal("hide");
        self.selectedExternalOrder(null);
    };
    // Initializes essential data
    // ****************************** //
    function InitializeData() {
        if (sessionStorage.Staff !== undefined && sessionStorage.Staff != null && sessionStorage.Staff != "") {
            var staff = JSON.parse(sessionStorage.Staff);
            var staffModel = new StaffModel(staff);
            self.currentStaff(staffModel);
        }
        if (sessionStorage.FailedOrders !== undefined && sessionStorage.FailedOrders != "") {
            var failedOrders = JSON.parse(sessionStorage.FailedOrders);
            ko.utils.arrayForEach(failedOrders, function (o) {
                self.failedOrders.push(o);
            });
        }
        if (localStorage.Phone !== undefined && localStorage.Phone != "") {
            self.selectedPhone(localStorage.Phone);
        }
        InitializeConfiguration();
        var request = indexedDB.open(dbName);
        request.onsuccess = function (event) {
            console.log(request.result);
            db = request.result;
            InitializeStores();
        };
        request.onerror = function (event) {
            console.log("Error: " + event.target.error.name + " , Description: " + event.target.error.message);
        };
        GetUnmatchedOrders();
        ConnectSignalR();
    };
    // Initializes configuration
    // ****************************** //
    function InitializeConfiguration() {
        if (localStorage.SortStores !== undefined && localStorage.SortStores != "") {
            var sortStores = JSON.parse(localStorage.SortStores);
            self.storeSort = sortStores;
        }
        if (localStorage.UpdateAddressMap !== undefined && localStorage.UpdateAddressMap != "") {
            var updateAddressMap = JSON.parse(localStorage.UpdateAddressMap);
            self.updateAddressFromMap = updateAddressMap;
        }
        if (localStorage.ShowAddressOptions !== undefined && localStorage.ShowAddressOptions != "") {
            var showAddressOptions = JSON.parse(localStorage.ShowAddressOptions);
            self.showAddressOptions = showAddressOptions;
        }
        if (localStorage.ShowMessages !== undefined && localStorage.ShowMessages != "") {
            var showMessages = JSON.parse(localStorage.ShowMessages);
            self.showMessages(showMessages);
        }
        if (localStorage.MapConfiguration !== undefined && localStorage.MapConfiguration != "") {
            var mapConfiguration = JSON.parse(localStorage.MapConfiguration);
            self.map.Initialize(mapConfiguration);
        }
    };
    // Initializes stores
    // ****************************** //
    function InitializeStores() {
        if (db) {
            db.transaction("stores").objectStore("stores").openCursor().onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor != null) {
                    var store = new StoreModel(cursor.value);
                    self.stores.push(store);
                    cursor.continue();
                }
                else {
                    var storeOptions = {};
                    ko.utils.arrayForEach(self.stores(), function (s) {
                        storeOptions[s.Id] = s.Title;
                    });
                    self.storeOptions(storeOptions);
                    if (self.storeSort == storeSortEnum.Code) {
                        self.stores.sort(function (left, right) { return left.Code == right.Code ? 0 : (left.Code < right.Code ? -1 : 1) });
                    }
                    else if (self.storeSort == storeSortEnum.Title) {
                        self.stores.sort(function (left, right) { return left.Title == right.Title ? 0 : (left.Title < right.Title ? -1 : 1) });
                    }
                }
            }
        }
    };
    // Gets unmatched orders from API
    // ****************************** //
    function GetUnmatchedOrders() {
        var url = localStorage.ApiAddress + "api/v3/da/Efood/getBucket";
        var showMessage = true;
        self.communication.Communicate(communicationTypesEnum.Get, url, null, CallbackGetUnmatchedOrders, null, showMessage);
    };
    // Displays unmatched orders
    // ****************************** //
    function CallbackGetUnmatchedOrders(orders) {
        var externalOrders = [];
        ko.utils.arrayForEach(orders, function (o) {
            var order = new ExternalModel(o);
            externalOrders.push(order);
        });
        self.pagination.Initialize();
        self.pagination.NoSearchEntities(externalOrders, self.ordersMultitude());
    };
    // Restarts refreshing external orders
    // ****************************** //
    function CallbackResendAllExternalOrders() {
        self.allOrdersMultitude--;
        if (self.allOrdersMultitude == 0) {
            self.resendingAllOrders(false);
            GetUnmatchedOrders();
        }
    };
    // Informs on error at resending external order
    // ****************************** //
    function ErrorCallbackResendAllExternalOrders(message) {
        self.allOrdersMultitude--;
        if (self.allOrdersMultitude == 0) {
            self.resendingAllOrders(false);
            GetUnmatchedOrders();
        }
    };
    // Edits external order
    // ****************************** //
    function CallbackEditExternalOrderConfirm(order) {
        if (order == null || (order != null && (order.Order.Errors == null || order.Order.Errors == ""))) {
            toastr.success(language.Translate("OrderUpdated", null));
            $("#editExternalOrder").modal("hide");
            self.selectedExternalOrder(null);
        }
        else {
            toastr.warning(language.Translate("ModifyOrder", null));
            var externalOrder = new ExternalModel(order);
            self.selectedExternalOrder(externalOrder);
            self.map.ShowMap();
        }
        self.editingOrder(false);
        GetUnmatchedOrders();
    };
    // Informs on error at editing external order
    // ****************************** //
    function ErrorCallbackEditExternalOrderConfirm(message) {
        self.editingOrder(false);
    };
    // Refreshes external orders
    // ****************************** //
    function CallbackDeleteExternalOrderConfirmConfirm() {
        $("#deleteExternalOrder2").modal("hide");
        $("#editExternalOrder").modal("hide");
        toastr.success(language.Translate("OrderDeleted", null));
        self.deletingOrder(false);
        self.selectedExternalOrder(null);
        GetUnmatchedOrders();
    };
    // Informs on error at deleting external order
    // ****************************** //
    function ErrorCallbackDeleteExternalOrderConfirmConfirm(message) {
        self.deletingOrder(false);
    };
    // Updates latitude and longitude
    // ****************************** //
    function CallbackCalculateAddressCoordinates(addressStigmas) {
        self.addressesOptions(addressStigmas);
        if (self.addressesOptions().length == 1) {
            var addressStigma = self.addressesOptions()[0];
            self.selectedExternalOrder().ShippingAddress.Latitude = addressStigma.Latitude;
            self.selectedExternalOrder().ShippingAddress.Longitude = addressStigma.Longitude;
            self.selectedExternalOrder().ShippingAddress.Proximity = addressStigma.Proximity;
            if (self.selectedExternalOrder().ShippingAddress.ZipCode == null || self.selectedExternalOrder().ShippingAddress.ZipCode == "") {
                self.selectedExternalOrder().ShippingAddress.ZipCode = addressStigma.ZipCode;
            }
            self.selectedExternalOrder.notifySubscribers();
            self.addressesOptions([]);
            self.selectedAddressesOptions(null);
            self.lockMap(false);
            var centerMap = true;
            self.map.ShowAddressOnMap(self.selectedExternalOrder().ShippingAddress.Latitude, self.selectedExternalOrder().ShippingAddress.Longitude, centerMap);
            MatchAddressWithStore();
        }
        else {
            if (self.showAddressOptions) {
                self.selectedAddressesOptions(null);
                $("#addressesFromAddressExternalOrder").modal("show");
            }
            else {
                var addressStigma = self.addressesOptions()[0];
                CallbackCalculateAddressCoordinates([addressStigma]);
            }
        }
    };
    // Re-enables address conversion
    // ****************************** //
    function ErrorCallbackCalculateAddressCoordinates() {
        self.lockMap(false);
    };
    // Matches address with store
    // ****************************** //
    function MatchAddressWithStore() {
        var address = new AddressModel(self.selectedExternalOrder().ShippingAddress);
        var postAddress = new PostAddressModel(address);
        var url = localStorage.ApiAddress + "api/v3/da/Polygons/Address";
        var showMessage = true;
        self.communication.Communicate(communicationTypesEnum.Post, url, postAddress, CallbackMatchAddressWithStore, null, showMessage);
    };
    // Updates customer store
    // ****************************** //
    function CallbackMatchAddressWithStore(storeId) {
        if (storeId >= 0) {
            self.selectedExternalOrder().Order.StoreId = storeId;
            self.selectedExternalOrder().Order.CheckShippingAddress = false;
            self.selectedExternalOrder.notifySubscribers();
            self.map.ShowMap();
        }
        else if (storeId < 0) {
            var store = self.storeOptions()[-storeId];
            toastr.info(language.Translate("StoreAddressUnavailable", { description: store }));
        }
    };
    // Gets new coordinates from map
    // ****************************** //
    function ClickMap(latitude, longitude) {
        var fullAddress = new AddressStigmaModel();
        fullAddress.Latitude = latitude;
        fullAddress.Longitude = longitude;
        self.map.ConvertCoordinatesToAddress(fullAddress, CallbackClickMap, null);
    };
    // Updates map with new location
    // ****************************** //
    function CallbackClickMap(addressStigmas) {
        self.addressesOptions(addressStigmas);
        if (self.addressesOptions().length == 1) {
            var addressStigma = self.addressesOptions()[0];
            var centerMap = false;
            self.map.ShowAddressOnMapWithInfoWindow(addressStigma, UpdateCustomerAddressFromMarker, centerMap);
            self.addressesOptions([]);
            self.selectedAddressesOptions(null);
            if (self.updateAddressFromMap) {
                UpdateCustomerAddressFromMarker(addressStigma);
            }
            else {
                toastr.info(language.Translate("ChangeCoordinatesMap", null));
            }
        }
        else {
            if (self.showAddressOptions) {
                self.selectedAddressesOptions(null);
                $("#addressesFromCoordinatesExternalOrder").modal("show");
            }
            else {
                var addressStigma = self.addressesOptions()[0];
                CallbackClickMap([addressStigma]);
            }
        }
    };
    // Updates address with new location
    // ****************************** //
    function UpdateCustomerAddressFromMarker(addressStigma) {
        self.selectedExternalOrder().ShippingAddress.ZipCode = addressStigma.ZipCode;
        self.selectedExternalOrder().ShippingAddress.Latitude = addressStigma.Latitude;
        self.selectedExternalOrder().ShippingAddress.Longitude = addressStigma.Longitude;
        self.selectedExternalOrder().ShippingAddress.Proximity = addressStigma.Proximity;
        self.selectedExternalOrder.notifySubscribers();
        self.map.ShowMap();
    };
    // #endregion
    // #region SignalR
    // Creates signalR connection
    // ****************************** //
    function ConnectSignalR() {
        self.signalR.SetProxyFunctions(null, ProxyOnClientsResponse);
        var server = localStorage.ApiAddress;
        var hubName = "DAHub";
        var group = "Agents";
        var name = "Agent_" + localStorage.Phone;
        self.signalR.Connect(server, hubName, group, name);
    };
    // Proxy on response from clients
    // ****************************** //
    function ProxyOnClientsResponse(clientResponse) {
        var clientOrderResponse = new ClientResponseModel(clientResponse);
        var foundFailedOrder = ko.utils.arrayFirst(self.failedOrders(), function (o) {
            return o.Id == clientOrderResponse.Id;
        });
        if (foundFailedOrder != null) {
            if (clientOrderResponse.Success) {
                self.failedOrders.splice(self.failedOrders.indexOf(clientOrderResponse), 1);
            }
        }
        else {
            if (!clientOrderResponse.Success) {
                self.failedOrders.push(clientOrderResponse);
            }
        }
        sessionStorage.FailedOrders = "";
        sessionStorage.FailedOrders = JSON.stringify(self.failedOrders());
    };
    // #endregion

}