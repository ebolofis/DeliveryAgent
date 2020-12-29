function CustomerViewModel() {
    // ----- PROPERTIES ----- //
    var self = this;
    self.currentStaff = ko.observable(null);
    self.selectedPhone = ko.observable(null);
    self.failedOrders = ko.observableArray([]);
    self.computedClock = ko.observable(moment().format("HH:mm"));
    self.administratorPassword = null;
    self.administratorPasswordInput = ko.observable(null);
    self.activeLoyalty = ko.observable(loyaltyTypeEnum.Hit);
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
    self.customerAddressTypeOptions = ko.observable({
        0: language.Translate("Shipping", null),
        1: language.Translate("Billing", null)
    });
    self.updatingCustomer = ko.observable(false);
    self.updatingAddress = ko.observable(false);
    self.navigationOptions = ["Search", "Insert", "Order"];
    self.navigationAction = ko.observable(self.navigationOptions[0]);
    // #region NavigationOptions = Search
    self.searchOptions = ko.observableArray([
        { ImageClass: "fa fa-phone custom-fa-faint", Description: language.Translate("Phone", null), Field: "PhoneNumber", Value: "", InputType: "text", SearchType: customerSearchEnum.Phone },
        { ImageClass: "fa fa-user custom-fa-faint", Description: language.Translate("Name", null), Field: "Name", Value: "", InputType: "text", SearchType: customerSearchEnum.Name },
        { ImageClass: "fa fa-map-marker custom-fa-faint", Description: language.Translate("Address", null), Field: "Address", Value: "", InputType: "text", SearchType: customerSearchEnum.Address },
        { ImageClass: "fa fa-address-book custom-fa-faint", Description: language.Translate("TaxNumber", null), Field: "VatNo", Value: "", InputType: "number", SearchType: customerSearchEnum.TaxNumber },
        { ImageClass: "fa fa-at custom-fa-faint", Description: language.Translate("EMail", null), Field: "Email", Value: "", InputType: "text", SearchType: customerSearchEnum.Email }
    ]);
    self.searchSelection = ko.observable(self.searchOptions()[0]);
    self.scrollableCustomers = false;
    self.addressInformation = ko.observable(addressInformationEnum.None);
    self.showLoyalty = ko.observable(false);
    self.showTelephones = ko.observable(false);
    self.showEditCustomer = ko.observable(false);
    self.searchHistory = ko.observableArray([]);
    self.customerIdForSearch = 0;
    self.customerForEdit = false;
    self.customerForRequest = false;
    self.searchingCustomer = ko.observable(false);
    self.selectedSearchCustomer = ko.observable(null);
    self.selectedSearchCustomerLoyaltyHist = ko.observableArray([]);
    self.customerOptions = ko.observableArray([
        { Description: language.Translate("Order", null), Field: "Order" },
        { Description: language.Translate("Request", null), Field: "Message" },
        { Description: language.Translate("CustomerInformation", null), Field: "Details" },
        { Description: language.Translate("HistoricOrders", null), Field: "Orders" },
        { Description: language.Translate("HistoricRequests", null), Field: "Messages" }
    ]);
    self.customerTab = ko.observable(self.customerOptions()[0]);
    self.hasCommunicationPhone = ko.observable(false);
    self.hasLoyaltyCode = ko.observable(false);
    self.notifyLastOrderNote = false;
    self.addressPriority = addressPriorityEnum.LastAddress;
    self.selectDeliveryStore = false;
    self.stores = ko.observableArray([]);
    self.storeSort = null;
    self.storeOptions = ko.observableArray(null);
    self.storeStatusOptions = ko.observable({
        0: language.Translate("Closed", null),
        1: language.Translate("Delivery", null),
        2: language.Translate("TakeOut", null),
        4: language.Translate("FullFunction", null)
    });
    self.customerStore = ko.observable(null);
    self.paymentOptions = ko.observableArray([
        { Description: language.Translate("Cash", null), Type: 1 },
        { Description: language.Translate("CreditCard", null), Type: 4 }
    ]);
    self.customerPayment = ko.observable(self.paymentOptions()[0]);
    self.saleOptions = ko.observableArray([
        { Description: language.Translate("Delivery", null), Type: 20 },
        { Description: language.Translate("TakeOut", null), Type: 21 }
    ]);
    self.customerSale = ko.observable(self.saleOptions()[0]);
    self.invoiceOptions = ko.observableArray([
        { Description: language.Translate("Receipt", null), Type: 1 },
        { Description: language.Translate("Bill", null), Type: 7 }
    ]);
    self.customerInvoice = ko.observable(self.invoiceOptions()[0]);
    self.keepSelectionsAfterEdit = false;
    self.customerOrdersMultitude = ko.observable(5);
    self.customerOrders = ko.observableArray([]);
    self.accountTypeOptions = ko.observable({
        1: language.Translate("Cash", null),
        4: language.Translate("CreditCard", null)
    });
    self.saleTypeOptions = ko.observable({
        20: language.Translate("Delivery", null),
        21: language.Translate("TakeOut", null)
    });
    self.invoiceTypeOptions = ko.observable({
        1: language.Translate("Receipt", null),
        7: language.Translate("Bill", null)
    });
    self.orderStatusOptions = ko.observable({
        0: language.Translate("New", null),
        1: language.Translate("Kitchen", null),
        3: language.Translate("Ready", null),
        4: language.Translate("OnRoad", null),
        5: language.Translate("Canceled", null),
        6: language.Translate("Completed", null),
        7: language.Translate("Returned", null),
        11: language.Translate("OnHold", null)
    });
    self.showActiveOrder = false;
    self.staffAdministratorUsername = ko.observable(null);
    self.staffAdministratorPassword = ko.observable(null);
    self.authorizingAdministrator = false;
    self.staffAdministratorId = 0;
    self.customerLoyaltyPoints = ko.observable(null);
    self.customerLoyaltyDescription = ko.observable(null);
    self.addingLoyaltyPoints = false;
    self.customerLoyaltyCode = null;
    self.selectedOrder = ko.observable(null);
    self.customerComplaints = ko.observable(new ComplaintsModel());
    self.addingComplaint = ko.observable(false);
    self.showModifyOrder = ko.observable(true);
    self.cancelStatusOptions = ko.observableArray([]);
    self.cancelingOrder = ko.observable(false);
    self.modifyingOrder = ko.observable(false);
    self.redoingOrder = ko.observable(false);
    self.showMessages = ko.observable(true);
    self.generalMessages = ko.observable(null);
    self.addingMessage = ko.observable(false);
    self.selectedMessage = ko.observable(null);
    self.updatingMessage = ko.observable(false);
    // #endregion
    // #region NavigationOptions = Insert
    self.customerInsertOptions = ko.observableArray([
        { Description: language.Translate("Customer", null), Field: "Customer" },
        { Description: language.Translate("Address", null), Field: "Address" }
    ]);
    self.customerInsertTab = ko.observable(self.customerInsertOptions()[0]);
    self.newCustomer = ko.observable(null);
    self.getCustomerData = false;
    self.addressOptions = ko.observableArray([
        { Description: language.Translate("ShippingAddress", null), Type: 0 },
        { Description: language.Translate("BillingAddress", null), Type: 1 }
    ]);
    self.addressTypeOptions = ko.observable({
        0: language.Translate("ShippingAddress", null),
        1: language.Translate("BillingAddress", null)
    });
    self.addressesOptions = ko.observableArray([]);
    self.selectedAddressesOptions = ko.observable(null);
    self.copiedCustomer = ko.observable(null);
    self.deletingCustomer = ko.observable(false);
    self.addingCustomer = ko.observable(false);
    self.addressLength = 0;
    self.newAddress = ko.observable(null);
    self.matchAddressWithStore = false;
    self.matchAddressWithStoreChecked = false;
    self.updateAddressFromMap = false;
    self.showAddressOptions = false;
    self.deletingAddress = ko.observable(false);
    self.lockMap = ko.observable(false);
    // #endregion
    // ----- MODULES ----- //
    self.communication = new CustomCommunication();
    self.keyboard = new CustomKeyboard();
    self.map = new CustomMap(ClickMapInsert);
    self.navigation = new CustomNavigation();
    self.customerPagination = new CustomPagination(self.communication);
    self.customerMessagesPagination = new CustomPagination(self.communication);
    self.signalR = new CustomSignalR();
    self.loyaltyGoodys = new CustomGoodys(self.communication, true, false);
    // ----- COMPUTED PROPERTIES ----- //
    // ----- INTERVAL FUNCTIONS ----- //
    // Updates time
    // ****************************** //
    var visualClockUpdate = setInterval(function () {
        self.computedClock(moment().format("HH:mm"));
    }, 1000);
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
    // Navigates between local views
    // ****************************** //
    self.Navigate = function (optionPosition) {
        var previousNavigation = self.navigationAction();
        self.navigationAction(self.navigationOptions[optionPosition]);
        if (self.navigationAction() == "Insert") {
            self.newCustomer(new CustomerModel());
            if (self.searchSelection().Field == "PhoneNumber" && self.searchSelection().Value != null && self.searchSelection().Value != "" && self.selectedSearchCustomer() == null) {
                var phoneNumber = self.searchSelection().Value;
                self.newCustomer().Phone1 = phoneNumber;
                self.newCustomer.notifySubscribers();
                if (self.getCustomerData) {
                    GetAdditionalCustomerInformation(phoneNumber);
                }
            }
            self.newAddress(new AddressModel());
            self.customerInsertTab(self.customerInsertOptions()[0]);
            self.ClearSearchValues();
            self.customerPagination.Initialize();
            self.selectedSearchCustomer(null);
            self.customerForRequest = false;
            if (self.activeLoyalty() == loyaltyTypeEnum.Goodys) {
                self.loyaltyGoodys.HideLoyaltyInformation();
            }
        }
        else if (self.navigationAction() == "Search") {
            self.keepSelectionsAfterEdit = false;
            self.customerForEdit = false;
            self.ClearCustomer();
            self.ClearAddress();
            localStorage.StageOrder = "";
        }
        else if (self.navigationAction() == "Order") {
            if (previousNavigation == "Insert") {
                toastr.warning(language.Translate("CompleteInsertCustomer", null));
                self.navigationAction(self.navigationOptions[1]);
                return;
            }
            if (self.selectedSearchCustomer() == null) {
                toastr.warning(language.Translate("ChooseCustomer", null));
                self.navigationAction(self.navigationOptions[0]);
                return;
            }
            else if (self.selectedSearchCustomer().selectedAddress == null) {
                toastr.warning(language.Translate("ChooseAddress", null));
                self.navigationAction(self.navigationOptions[0]);
                return;
            }
            else if (self.customerStore() == null) {
                toastr.warning(language.Translate("ChooseStore", null));
                self.navigationAction(self.navigationOptions[0]);
                return;
            }
            else if (self.customerInvoice().Type == invoiceTypeEnum.Bill && self.selectedSearchCustomer().selectedBillingAddress == null) {
                toastr.warning(language.Translate("ChooseBillingAddress", null));
                self.navigationAction(self.navigationOptions[0]);
                return;
            }
            if (self.activeLoyalty() == loyaltyTypeEnum.Goodys && self.loyaltyGoodys.notifyLoyaltyStatus && !self.loyaltyGoodys.loyaltyStatusNotified && self.customerOrders().length < 5) {
                self.loyaltyGoodys.NotifyLoyaltyStatus();
                self.navigationAction(self.navigationOptions[0]);
                return;
            }
            if (self.customerInvoice().Type == invoiceTypeEnum.Bill && self.selectedSearchCustomer().daCustomerModel.BillingAddressesId != self.selectedSearchCustomer().selectedBillingAddress.Id) {
                self.updatingCustomer(true);
                self.selectedSearchCustomer().daCustomerModel.BillingAddressesId = self.selectedSearchCustomer().selectedBillingAddress.Id;
                var url = localStorage.ApiAddress + "api/v3/da/Customers/UpdateCustomer";
                var customerToUpdate = new CustomerModel(self.selectedSearchCustomer().daCustomerModel);
                var customerToPost = new PostCustomerModel(customerToUpdate);
                var showMessage = true;
                self.communication.Communicate(communicationTypesEnum.Post, url, customerToPost, CallbackNavigateUpdateCustomer, null, showMessage);
            }
            if (self.searchSelection().Field == "PhoneNumber" && self.selectedSearchCustomer().selectedAddress.LastPhoneNumber != self.searchSelection().Value) {
                self.updatingAddress(true);
                ko.utils.arrayForEach(self.selectedSearchCustomer().daAddrModel, function (a) {
                    if (a.Id == self.selectedSearchCustomer().selectedAddress.Id) {
                        a.LastPhoneNumber = self.searchSelection().Value;
                    }
                    else if (a.LastPhoneNumber == self.searchSelection().Value) {
                        a.LastPhoneNumber = null;
                    }
                });
                self.selectedSearchCustomer().selectedAddress.LastPhoneNumber = self.searchSelection().Value;
                var url = localStorage.ApiAddress + "api/v3/da/Address/UpdateAddressPhone";
                var UpdateAddressPhoneModel = {};
                UpdateAddressPhoneModel.CustomerId = self.selectedSearchCustomer().daCustomerModel.Id;
                UpdateAddressPhoneModel.AddressId = self.selectedSearchCustomer().selectedAddress.Id;
                UpdateAddressPhoneModel.PhoneNumber = self.searchSelection().Value;
                var showMessage = true;
                self.communication.Communicate(communicationTypesEnum.Post, url, UpdateAddressPhoneModel, CallbackNavigateUpdateAddress, null, showMessage);
            }
            var updateCustomerAddress = setInterval(function () {
                if (!self.updatingCustomer() && !self.updatingAddress()) {
                    clearInterval(updateCustomerAddress);
                    var customer = new CustomerModel(self.selectedSearchCustomer().daCustomerModel);
                    var address = new AddressModel(self.selectedSearchCustomer().selectedAddress);
                    if (self.selectedSearchCustomer().selectedBillingAddress != null) {
                        var billingAddress = new AddressModel(self.selectedSearchCustomer().selectedBillingAddress);
                    }
                    else {
                        var billingAddress = null;
                    }
                    var communicationPhone = self.selectedSearchCustomer().selectedCommunicationPhone;
                    var addresses = [];
                    ko.utils.arrayForEach(self.selectedSearchCustomer().daAddrModel, function (a) {
                        var currentAddress = new AddressModel(a);
                        addresses.push(currentAddress);
                    });
                    var store = self.customerStore();
                    var payment = self.customerPayment();
                    var sale = self.customerSale();
                    var invoice = self.customerInvoice();
                    var loyaltyCode = self.customerLoyaltyCode;
                    var generalObject = {};
                    generalObject.Customer = customer;
                    generalObject.Address = address;
                    generalObject.BillingAddress = billingAddress;
                    generalObject.CommunicationPhone = communicationPhone;
                    generalObject.Addresses = addresses;
                    generalObject.Store = store;
                    generalObject.Payment = payment;
                    generalObject.Sale = sale;
                    generalObject.Invoice = invoice;
                    generalObject.LoyaltyCode = loyaltyCode;
                    localStorage.GeneralCustomerOrder = "";
                    localStorage.GeneralCustomerOrder = JSON.stringify(generalObject);
                    self.navigation.GoToModule(navigationViewsEnum.Pos, null);
                }
            }, 100);
        }
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
        if (localStorage.SearchHistory !== undefined && localStorage.SearchHistory != "") {
            var searchHistory = JSON.parse(localStorage.SearchHistory);
            ko.utils.arrayForEach(searchHistory, function (h) {
                self.searchHistory.push(h);
            });
        }
        InitializeConfiguration();
        if (localStorage.CancelStatuses !== undefined && localStorage.CancelStatuses != "") {
            var cancelStatuses = JSON.parse(localStorage.CancelStatuses);
            ko.utils.arrayForEach(cancelStatuses, function (s) {
                var status = parseInt(s);
                self.cancelStatusOptions.push(status);
            });
        }
        if (localStorage.StageOrder !== undefined && localStorage.StageOrder != "") {
            var stagedOrder = JSON.parse(localStorage.StageOrder);
            if (stagedOrder.CustomerPhone != null) {
                self.customerIdForSearch = stagedOrder.CustomerId != null ? stagedOrder.CustomerId : 0;
                self.customerForEdit = true;
                SearchCustomerByPhone(stagedOrder.CustomerPhone);
            }
        }
        if (localStorage.ClearOrder !== undefined && localStorage.ClearOrder != "") {
            var clearedOrder = JSON.parse(localStorage.ClearOrder);
            if (clearedOrder.CustomerPhone != null) {
                self.customerIdForSearch = clearedOrder.CustomerId != null ? clearedOrder.CustomerId : 0;
                self.customerForRequest = true;
                SearchCustomerByPhone(clearedOrder.CustomerPhone);
            }
            localStorage.ClearOrder = "";
        }
        localStorage.GeneralCustomerOrder = "";
        localStorage.ModifyOrder = "";
        localStorage.RedoOrder = "";
        var request = indexedDB.open(dbName);
        request.onsuccess = function (event) {
            console.log(request.result);
            db = request.result;
            InitializeStores();
            InitializeMessages();
        };
        request.onerror = function (event) {
            console.log("Error: " + event.target.error.name + " , Description: " + event.target.error.message);
        };
        ConnectSignalR();
    };
    // Initializes configuration
    // ****************************** //
    function InitializeConfiguration() {
        if (localStorage.AdministratorPassword !== undefined && localStorage.AdministratorPassword != "") {
            var administratorPassword = localStorage.AdministratorPassword;
            self.administratorPassword = administratorPassword;
        }
        if (localStorage.SortStores !== undefined && localStorage.SortStores != "") {
            var sortStores = JSON.parse(localStorage.SortStores);
            self.storeSort = sortStores;
        }
        if (localStorage.ScrollableCustomers !== undefined && localStorage.ScrollableCustomers != "") {
            var scrollableCustomers = JSON.parse(localStorage.ScrollableCustomers);
            self.scrollableCustomers = scrollableCustomers;
        }
        if (localStorage.AddressInformation !== undefined && localStorage.AddressInformation != "") {
            var addressInformation = JSON.parse(localStorage.AddressInformation);
            self.addressInformation(addressInformation);
        }
        if (localStorage.ShowLoyalty !== undefined && localStorage.ShowLoyalty != "") {
            var showLoyalty = JSON.parse(localStorage.ShowLoyalty);
            self.showLoyalty(showLoyalty);
        }
        if (localStorage.ShowTelephones !== undefined && localStorage.ShowTelephones != "") {
            var showTelephones = JSON.parse(localStorage.ShowTelephones);
            self.showTelephones(showTelephones);
        }
        if (localStorage.ShowEditCustomer !== undefined && localStorage.ShowEditCustomer != "") {
            var showEditCustomer = JSON.parse(localStorage.ShowEditCustomer);
            self.showEditCustomer(showEditCustomer);
        }
        if (localStorage.HasCommunicationPhone !== undefined && localStorage.HasCommunicationPhone != "") {
            var hasCommunicationPhone = JSON.parse(localStorage.HasCommunicationPhone);
            self.hasCommunicationPhone(hasCommunicationPhone);
        }
        if (localStorage.HasLoyaltyCode !== undefined && localStorage.HasLoyaltyCode != "") {
            var hasLoyaltyCode = JSON.parse(localStorage.HasLoyaltyCode);
            self.hasLoyaltyCode(hasLoyaltyCode);
        }
        if (localStorage.NotifyLastOrderNote !== undefined && localStorage.NotifyLastOrderNote != "") {
            var notifyLastOrderNote = JSON.parse(localStorage.NotifyLastOrderNote);
            self.notifyLastOrderNote = notifyLastOrderNote;
        }
        if (localStorage.MatchNewAddressStore !== undefined && localStorage.MatchNewAddressStore != "") {
            var matchNewAddressStore = JSON.parse(localStorage.MatchNewAddressStore);
            self.matchAddressWithStore = matchNewAddressStore;
        }
        if (localStorage.UpdateAddressMap !== undefined && localStorage.UpdateAddressMap != "") {
            var updateAddressMap = JSON.parse(localStorage.UpdateAddressMap);
            self.updateAddressFromMap = updateAddressMap;
        }
        if (localStorage.ShowAddressOptions !== undefined && localStorage.ShowAddressOptions != "") {
            var showAddressOptions = JSON.parse(localStorage.ShowAddressOptions);
            self.showAddressOptions = showAddressOptions;
        }
        if (localStorage.SetAddressPriority !== undefined && localStorage.SetAddressPriority != "") {
            var setAddressPriority = JSON.parse(localStorage.SetAddressPriority);
            self.addressPriority = setAddressPriority;
        }
        if (localStorage.SelectDeliveryStore !== undefined && localStorage.SelectDeliveryStore != "") {
            var selectDeliveryStore = JSON.parse(localStorage.SelectDeliveryStore);
            self.selectDeliveryStore = selectDeliveryStore;
        }
        if (localStorage.ShowModifyOrder !== undefined && localStorage.ShowModifyOrder != "") {
            var showModifyOrder = JSON.parse(localStorage.ShowModifyOrder);
            self.showModifyOrder(showModifyOrder);
        }
        if (localStorage.ShowMessages !== undefined && localStorage.ShowMessages != "") {
            var showMessages = JSON.parse(localStorage.ShowMessages);
            self.showMessages(showMessages);
        }
        if (localStorage.ActiveLoyalty !== undefined && localStorage.ActiveLoyalty != "") {
            var activeLoyalty = JSON.parse(localStorage.ActiveLoyalty);
            self.activeLoyalty(activeLoyalty);
        }
        if (localStorage.NewCustomerData !== undefined && localStorage.NewCustomerData != "") {
            var newCustomerData = JSON.parse(localStorage.NewCustomerData);
            self.getCustomerData = newCustomerData;
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
                    if (self.storeSort == storeSortEnum.Code) {
                        self.stores.sort(function (left, right) { return left.Code == right.Code ? 0 : (left.Code < right.Code ? -1 : 1) });
                    }
                    else if (self.storeSort == storeSortEnum.Title) {
                        self.stores.sort(function (left, right) { return left.Title == right.Title ? 0 : (left.Title < right.Title ? -1 : 1) });
                    }
                    var storeOptions = {};
                    ko.utils.arrayForEach(self.stores(), function (s) {
                        storeOptions[s.Id] = s.Title;
                    });
                    self.storeOptions(storeOptions);
                }
            }
        }
    };
    // Initializes messages
    // ****************************** //
    function InitializeMessages() {
        if (db) {
            var temporaryMessages = [];
            db.transaction("messages").objectStore("messages").openCursor().onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor != null) {
                    var message = cursor.value;
                    temporaryMessages.push(message);
                    cursor.continue();
                }
                else {
                    if (temporaryMessages.length > 0) {
                        var allMessages = new GeneralMessageModel(temporaryMessages);
                        self.generalMessages(allMessages);
                    }
                }
            }
        }
    };
    // Gets additional customer information from third party sources
    // ****************************** //
    function GetAdditionalCustomerInformation(phoneNumber) {
        var url = localStorage.ApiAddress + "api/v3/da/Customers/GetCustomerInfoExternal/?phone=" + phoneNumber;
        var showMessage = true;
        self.communication.Communicate(communicationTypesEnum.Get, url, null, CallbackGetAdditionalCustomerInformation, null, showMessage);
    };
    // Updates customer information from third party sources
    // ****************************** //
    function CallbackGetAdditionalCustomerInformation(customer) {
        if (customer != null) {
            self.newCustomer().Email = customer.Email;
            self.newCustomer().FirstName = customer.FirstName;
            self.newCustomer().LastName = customer.LastName;
            self.newCustomer().Phone1 = customer.Phone1;
            self.newCustomer.notifySubscribers();
        }
    };
    // Updates customer
    // ****************************** //
    function CallbackNavigateUpdateCustomer() {
        self.updatingCustomer(false);
    };
    // Updates customer
    // ****************************** //
    function CallbackNavigateUpdateAddress() {
        self.updatingAddress(false);
    };
    // #endregion
    // #region NavigationOptions = Search
    // Selects previous phone search
    // ****************************** //
    self.SelectPhoneFromHistory = function (phone) {
        SearchCustomerByPhone(phone);
    };
    // Clears search inputs
    // ****************************** //
    self.ClearSearchValues = function () {
        ko.utils.arrayForEach(self.searchOptions(), function (o) {
            o.Value = "";
        });
        self.searchSelection.notifySubscribers();
    };
    // Searches customer after refreshing stores
    // ****************************** //
    self.SearchCustomer = function () {
        if (self.searchingCustomer()) {
            toastr.info(language.Translate("SearchingCustomer", null));
            return;
        }
        if (self.searchSelection().Value == "") {
            toastr.warning(language.Translate("InsertSearchValue", null));
            return;
        }
        if (self.searchSelection().Field == "PhoneNumber" && self.searchSelection().Value.length < 10) {
            toastr.warning(language.Translate("InsertValidPhoneSearchValue", null));
            return;
        }
        self.searchingCustomer(true);
        UpdateSearchHistory();
        RefreshStores();
        if (self.activeLoyalty() == loyaltyTypeEnum.Goodys) {
            self.loyaltyGoodys.HideLoyaltyInformation();
        }
    };
    // Selects customer
    // ****************************** //
    self.SelectCustomer = function (customer) {
        if (self.selectedSearchCustomer() != null) {
            self.selectedSearchCustomer().shownMap = false;
        }
        self.selectedSearchCustomer(customer);
        self.customerStore(null);
        var addressId = self.selectedSearchCustomer().selectedAddress != null ? self.selectedSearchCustomer().selectedAddress.Id : 0;
        GetStoreForAddress(addressId);
        if (self.activeLoyalty() == loyaltyTypeEnum.Hit && self.selectedSearchCustomer().daCustomerModel.Loyalty) {
            var customerId = self.selectedSearchCustomer().daCustomerModel.Id;
            GetLoyaltyPointsForCustomer(customerId);
        }
        else if (self.activeLoyalty() == loyaltyTypeEnum.Goodys) {
            self.loyaltyGoodys.HideLoyaltyInformation();
            var emailLoyaltyGoodys = null;
            var phoneLoyaltyGoodys = self.selectedSearchCustomer().daCustomerModel.Mobile;
            self.loyaltyGoodys.GetLoyaltyPoints(emailLoyaltyGoodys, phoneLoyaltyGoodys);
        }
        if (self.notifyLastOrderNote && self.selectedSearchCustomer().daCustomerModel.LastOrderNote != null && self.selectedSearchCustomer().daCustomerModel.LastOrderNote != "") {
            toastr.warning(self.selectedSearchCustomer().daCustomerModel.LastOrderNote);
        }
        if (!self.keepSelectionsAfterEdit) {
            self.customerPayment(self.paymentOptions()[0]);
            self.customerSale(self.saleOptions()[0]);
            self.customerInvoice(self.invoiceOptions()[0]);
        }
        else {
            self.keepSelectionsAfterEdit = false;
        }
        if (self.customerForRequest) {
            var showLastOrder = false;
        }
        else {
            var showLastOrder = true;
        }
        GetLastCustomerOrders(showLastOrder);
        self.customerTab(self.customerOptions()[0]);
    };
    // Selects tab of customer options
    // ****************************** //
    self.SelectTab = function (tab) {
        self.customerTab(tab);
        if (self.customerTab().Field == "Order") {
            if (self.selectedSearchCustomer().shownMap) {
                self.map.ShowMap();
            }
        }
        else if (self.customerTab().Field == "Message") {
            ReinitializeMessages();
        }
        else if (self.customerTab().Field == "Orders") {
            GetLastCustomerOrders(false);
        }
        else if (self.customerTab().Field == "Messages") {
            GetCustomerMessages();
        }
    };
    // Selects communication phone for selected customer
    // ****************************** //
    self.SelectCommunicationPhone = function (phone) {
        self.selectedSearchCustomer().selectedCommunicationPhone = phone;
        self.selectedSearchCustomer.notifySubscribers();
    };
    // Selects address for selected customer
    // ****************************** //
    self.SelectAddress = function (address) {
        self.selectedSearchCustomer().selectedAddress = address;
        self.selectedSearchCustomer().shownMap = false;
        self.selectedSearchCustomer.notifySubscribers();
        self.customerStore(null);
        GetStoreForAddress(address.Id);
    };
    // Selects store for selected customer
    // ****************************** //
    self.SelectStore = function (store) {
        self.customerStore(store);
        CheckStorePayments();
    };
    // Selects payment for selected customer
    // ****************************** //
    self.SelectPayment = function (account) {
        self.customerPayment(account);
    };
    // Selects sale type for selected customer
    // ****************************** //
    self.SelectSaleType = function (saleType) {
        self.customerSale(saleType);
    };
    // Selects invoice for selected customer
    // ****************************** //
    self.SelectInvoice = function (invoice) {
        self.customerInvoice(invoice);
    };
    // Selects billing address for selected customer
    // ****************************** //
    self.SelectBillingAddress = function (address) {
        self.selectedSearchCustomer().selectedBillingAddress = address;
        self.selectedSearchCustomer.notifySubscribers();
        if (self.selectedSearchCustomer().shownMap) {
            self.map.ShowMap();
        }
    };
    // Shows selected customer's address on map
    // ****************************** //
    self.ShowMap = function () {
        if (self.selectedSearchCustomer().selectedAddress == null) {
            toastr.warning(language.Translate("ChooseAddress", null));
            return;
        }
        self.selectedSearchCustomer().shownMap = true;
        self.selectedSearchCustomer.notifySubscribers();
        var latitude = parseFloat(self.selectedSearchCustomer().selectedAddress.Latitude);
        var longitude = parseFloat(self.selectedSearchCustomer().selectedAddress.Longtitude);
        var centerMap = true;
        self.map.ShowAddressOnMap(latitude, longitude, centerMap);
    };
    // Selects main message
    // ****************************** //
    self.SelectMainMessage = function (mainMessage) {
        self.generalMessages().SelectedMainMessage(mainMessage);
        self.generalMessages().SelectedMessage(null);
        self.generalMessages().SelectedMessageDetail(null);
    };
    // Selects message
    // ****************************** //
    self.SelectMessage = function (message) {
        self.generalMessages().SelectedMessage(message);
        self.generalMessages().SelectedMessageDetail(null);
    };
    // Selects message detail
    // ****************************** //
    self.SelectMessageDetail = function (messageDetail) {
        self.generalMessages().SelectedMessageDetail(messageDetail);
    };
    // Selects customer message order
    // ****************************** //
    self.SelectCustomerMessageOrder = function (order) {
        self.generalMessages().SelectedOrder(order);
    };
    // Clears customer message order
    // ****************************** //
    self.ClearCustomerMessageOrder = function () {
        self.generalMessages().SelectedOrder(null);
    };
    // Selects customer message store
    // ****************************** //
    self.SelectCustomerMessageStore = function (store) {
        self.generalMessages().SelectedStore(store);
    };
    // Clears customer message store
    // ****************************** //
    self.ClearCustomerMessageStore = function () {
        self.generalMessages().SelectedStore(null);
    };
    // Submits temporary customer message
    // ****************************** //
    self.SubmitTemporaryCustomerMessage = function () {
        if (self.addingMessage()) {
            return;
        }
        self.addingMessage(true);
        var customerMessageId = 0;
        var staffId = self.currentStaff().Id;
        var customerId = self.selectedSearchCustomer().daCustomerModel.Id;
        var orderId = self.generalMessages().SelectedOrder() != null ? self.generalMessages().SelectedOrder().Id : null;
        var storeId = self.generalMessages().SelectedStore() != null ? self.generalMessages().SelectedStore().Id : null;
        var messageDescription = self.generalMessages().MessageDescription;
        var customerDescription = self.generalMessages().CustomerDescription;
        var isTemporary = true;
        var customerMessage = new PostCustomerMessageModel(customerMessageId, staffId, customerId, orderId, storeId, self.generalMessages().SelectedMainMessage(), self.generalMessages().SelectedMessage(), self.generalMessages().SelectedMessageDetail(), messageDescription, customerDescription, isTemporary);
        SubmitCustomerMessage(customerMessage);
    };
    // Submits customer message
    // ****************************** //
    self.SubmitPermanentCustomerMessage = function () {
        if (self.addingMessage()) {
            return;
        }
        if (self.generalMessages().SelectedMainMessage() == null) {
            toastr.warning(language.Translate("SelectReason", null));
            return;
        }
        else if (self.generalMessages().SelectedMessage() == null) {
            toastr.warning(language.Translate("SelectCategory", null));
            return;
        }
        else if (self.generalMessages().SelectedMessageDetail() == null && self.generalMessages().SelectedMessage().MessageDetails.length > 0) {
            toastr.warning(language.Translate("SelectSubcategory", null));
            return;
        }
        self.addingMessage(true);
        var customerMessageId = 0;
        var staffId = self.currentStaff().Id;
        var customerId = self.selectedSearchCustomer().daCustomerModel.Id;
        var orderId = self.generalMessages().SelectedOrder() != null ? self.generalMessages().SelectedOrder().Id : null;
        var storeId = self.generalMessages().SelectedStore() != null ? self.generalMessages().SelectedStore().Id : null;
        var messageDescription = self.generalMessages().MessageDescription;
        var customerDescription = self.generalMessages().CustomerDescription;
        var isTemporary = false;
        var customerMessage = new PostCustomerMessageModel(customerMessageId, staffId, customerId, orderId, storeId, self.generalMessages().SelectedMainMessage(), self.generalMessages().SelectedMessage(), self.generalMessages().SelectedMessageDetail(), messageDescription, customerDescription, isTemporary);
        SubmitCustomerMessage(customerMessage);
    };
    // Edits selected customer
    // ****************************** //
    self.EditCustomer = function () {
        var customer = self.selectedSearchCustomer().daCustomerModel;
        var addresses = self.selectedSearchCustomer().daAddrModel;
        self.newCustomer(new CustomerModel(customer));
        self.newAddress(new AddressModel());
        if (addresses != null && addresses.length > 0) {
            ko.utils.arrayForEach(addresses, function (a) {
                var address = new AddressModel(a);
                self.newCustomer().Addresses.push(address);
            });
            self.newCustomer().SelectedAddress = self.newCustomer().Addresses[0];
            var billingAddress = ko.utils.arrayFirst(self.newCustomer().Addresses, function (a) {
                return a.Id == self.newCustomer().BillingAddressId;
            });
            if (billingAddress != null) {
                self.newCustomer().SelectedBillingAddress = billingAddress;
            }
        }
        self.keepSelectionsAfterEdit = true;
        self.navigationAction(self.navigationOptions[1]);
        self.customerInsertTab(self.customerInsertOptions()[0]);
        self.ClearSearchValues();
        self.customerPagination.Initialize();
        self.selectedSearchCustomer(null);
    };
    // Defines multitude of selected customer's last orders
    // ****************************** //
    self.SelectOrdersMultitude = function (multitude) {
        self.customerOrdersMultitude(multitude);
        GetLastCustomerOrders(false);
    };
    // Opens insert complaint modal
    // ****************************** //
    self.AddComplaint = function (orderId) {
        self.customerComplaints().OrderId = orderId;
        self.customerComplaints().CustomerComplaint = null;
        self.customerComplaints().StaffNote = null;
        self.customerComplaints.notifySubscribers();
        $("#insertComplaint").modal("show");
    };
    // Opens insert complaint modal with previous complaint
    // ****************************** //
    self.EditComplaint = function (orderId, complaint) {
        self.customerComplaints().OrderId = orderId;
        self.customerComplaints().CustomerComplaint = complaint;
        self.customerComplaints().StaffNote = null;
        self.customerComplaints.notifySubscribers();
        $("#insertComplaint").modal("show");
    };
    // Inserts complaint
    // ****************************** //
    self.AddComplaintConfirm = function () {
        if (self.addingComplaint()) {
            return;
        }
        if (self.customerComplaints().CustomerComplaint == null || self.customerComplaints().CustomerComplaint == "") {
            toastr.warning(language.Translate("InsertCustomerComplaint", null));
            return;
        }
        self.addingComplaint(true);
        var url = localStorage.ApiAddress + "api/v3/da/Orders/UpdateRemarks";
        var UpdateRemarksModel = {};
        UpdateRemarksModel.OrderId = self.customerComplaints().OrderId;
        UpdateRemarksModel.Remarks = self.customerComplaints().CustomerComplaint;
        UpdateRemarksModel.LastOrderNote = self.customerComplaints().StaffNote;
        var showMessage = true;
        self.communication.Communicate(communicationTypesEnum.Post, url, UpdateRemarksModel, CallbackAddComplaintConfirm, ErrorCallbackAddComplaintConfirm, showMessage);
    };
    // Closes insert complaint modal
    // ****************************** //
    self.AddComplaintCancel = function () {
        $("#insertComplaint").modal("hide");
    };
    // Opens view order modal
    // ****************************** //
    self.ViewOrder = function (order) {
        self.selectedOrder(new OrderModel(order));
        $("#viewOrder").modal("show");
    };
    // Closes view order modal
    // ****************************** //
    self.ViewOrderClose = function () {
        $("#viewOrder").modal("hide");
        self.selectedOrder(null);
    };
    // Opens cancel order modal
    // ****************************** //
    self.CancelOrder = function () {
        $("#cancelOrder").modal("show");
    };
    // Cancels order
    // ****************************** //
    self.CancelOrderConfirm = function () {
        if (self.cancelingOrder()) {
            return;
        }
        var availableStatus = ko.utils.arrayFirst(self.cancelStatusOptions(), function (o) {
            return o == self.selectedOrder().Status;
        });
        if (availableStatus == null) {
            toastr.info(language.Translate("DenyOrderCancelation", null));
            return;
        }
        if (self.administratorPassword != null) {
            $("#cancelOrderPasswordConfirmation").modal("show");
        }
        else {
            self.cancelingOrder(true);
            var orderId = self.selectedOrder().Id;
            var url = localStorage.ApiAddress + "api/v3/da/Orders/Cancel/Id/" + orderId;
            var showMessage = true;
            self.communication.Communicate(communicationTypesEnum.Get, url, null, CallbackCancelOrderConfirm, ErrorCallbackCancelOrderConfirm, showMessage);
        }
    };
    // Closes cancel order modal
    // ****************************** //
    self.CancelOrderCancel = function () {
        $("#cancelOrder").modal("hide");
    };
    // Cancels order after password confirmation
    // ****************************** //
    self.CancelOrderPasswordConfirmationConfirm = function () {
        if (self.administratorPassword == self.administratorPasswordInput()) {
            self.cancelingOrder(true);
            var orderId = self.selectedOrder().Id;
            var url = localStorage.ApiAddress + "api/v3/da/Orders/Cancel/Id/" + orderId;
            var showMessage = true;
            self.communication.Communicate(communicationTypesEnum.Get, url, null, CallbackCancelOrderConfirm, ErrorCallbackCancelOrderConfirm, showMessage);
        }
        else {
            toastr.warning(language.Translate("InsertCorrectPassword", null))
        }
        self.administratorPasswordInput(null);
        $("#cancelOrderPasswordConfirmation").modal("hide");
    };
    // Modifies order
    // ****************************** //
    self.ModifyOrder = function () {
        if (localStorage.StageOrder !== undefined && localStorage.StageOrder != "") {
            toastr.info(language.Translate("StagedOrderOnHold", null));
            return;
        }
        if (self.selectedOrder().Status != orderStatusEnum.Received && self.selectedOrder().Status != orderStatusEnum.Preparing) {
            toastr.info(language.Translate("DenyOrderModificationStatus", null));
            return;
        }
        else if (self.selectedOrder().IsSend == 0 && ((self.selectedOrder().SaleType == saleTypeEnum.Delivery && moment(self.selectedOrder().EstBillingDate).diff(moment(), "minutes") < 6) || (self.selectedOrder().SaleType == saleTypeEnum.Takeout && moment(self.selectedOrder().EstTakeoutDate).diff(moment(), "minutes") < 6))) {
            $("#orderModificationConfirmation").modal("show");
            return;
        }
        self.modifyingOrder(true);
        ModifyOrderAction();
    };
    // Modifies order after confirmation
    // ****************************** //
    self.ModifyOrderConfirm = function () {
        $("#orderModificationConfirmation").modal("hide");
        ModifyOrderAction();
    };
    // Cancels order modification
    // ****************************** //
    self.ModifyOrderCancel = function () {
        $("#orderModificationConfirmation").modal("hide");
    };
    // Redoes order
    // ****************************** //
    self.RedoOrder = function () {
        if (localStorage.StageOrder !== undefined && localStorage.StageOrder != "") {
            toastr.info(language.Translate("StagedOrderOnHold", null));
            return;
        }
        self.redoingOrder(true);
        var productItems = [];
        ko.utils.arrayForEach(self.selectedOrder().Details, function (d) {
            if (d.OtherDiscount != otherDiscountEnum.Goodys) {
                var item = {};
                item.ProductId = d.ProductId;
                item.PriceListId = d.PriceListId;
                item.Quantity = d.Quantity;
                item.Extras = [];
                ko.utils.arrayForEach(d.Extras, function (e) {
                    var extra = {};
                    extra.ExtraId = e.ExtraId;
                    extra.Quantity = e.Quantity;
                    item.Extras.push(extra);
                });
                productItems.push(item);
            }
        });
        localStorage.RedoOrder = "";
        localStorage.RedoOrder = JSON.stringify(productItems);
        self.ViewOrderClose();
        self.Navigate(2);
    };
    // Downloads order
    // ****************************** //
    self.DownloadOrder = function () {
        downloadWindow = window.open();
        downloadWindow.document.write("<html><head>");
        downloadWindow.document.write("</head><body>");
        downloadWindow.document.write(CreateHtmlFromOrder());
        downloadWindow.document.write("</body></html>");
        downloadWindow.print();
        downloadWindow.close();
    };
    // Opens edit customer message modal
    // ****************************** //
    self.EditCustomerMessage = function (customerMessage) {
        self.selectedMessage(customerMessage);
        ReinitializeMessages();
        if (self.generalMessages() != null) {
            if (self.selectedMessage().MainMessageId != null) {
                var mainMessage = ko.utils.arrayFirst(self.generalMessages().MainMessages, function (mm) {
                    return mm.Id == self.selectedMessage().MainMessageId;
                });
                if (mainMessage != null) {
                    self.generalMessages().SelectedMainMessage(mainMessage);
                    if (self.selectedMessage().MessageId != null) {
                        var message = ko.utils.arrayFirst(mainMessage.Messages, function (m) {
                            return m.Id == self.selectedMessage().MessageId;
                        });
                        if (message != null) {
                            self.generalMessages().SelectedMessage(message);
                            if (self.selectedMessage().MessageDetailId != null) {
                                var messageDetail = ko.utils.arrayFirst(message.MessageDetails, function (md) {
                                    return md.Id == self.selectedMessage().MessageDetailId;
                                });
                                if (messageDetail != null) {
                                    self.generalMessages().SelectedMessageDetail(messageDetail);
                                }
                            }
                        }
                    }
                }
            }
            if (self.selectedMessage().OrderId != null) {
                var order = ko.utils.arrayFirst(self.customerOrders(), function (o) {
                    return o.Id == self.selectedMessage().OrderId;
                });
                if (order != null) {
                    self.generalMessages().SelectedOrder(order);
                }
            }
            else {
                self.generalMessages().SelectedOrder(null);
            }
            if (self.selectedMessage().StoreId != null) {
                var store = ko.utils.arrayFirst(self.stores(), function (s) {
                    return s.Id == self.selectedMessage().StoreId;
                });
                if (store != null) {
                    self.generalMessages().SelectedStore(store);
                }
            }
            else {
                self.generalMessages().SelectedStore(null);
            }
        }
        $("#editCustomerMessage").modal("show");
    };
    // Edits customer message
    // ****************************** //
    self.EditCustomerMessageConfirm = function () {
        if (self.updatingMessage()) {
            return;
        }
        if (self.generalMessages().SelectedMainMessage() == null) {
            toastr.warning(language.Translate("SelectReason", null));
            return;
        }
        else if (self.generalMessages().SelectedMessage() == null) {
            toastr.warning(language.Translate("SelectCategory", null));
            return;
        }
        else if (self.generalMessages().SelectedMessageDetail() == null && self.generalMessages().SelectedMessage().MessageDetails.length > 0) {
            toastr.warning(language.Translate("SelectSubcategory", null));
            return;
        }
        self.updatingMessage(true);
        var url = localStorage.ApiAddress + "api/v3/da/CustomerMessages/UpdateDaCustomerMessage";
        var customerMessageId = self.selectedMessage().Id;
        var staffId = self.selectedMessage().StaffId;
        var customerId = self.selectedMessage().CustomerId;
        var orderId = self.generalMessages().SelectedOrder() != null ? self.generalMessages().SelectedOrder().Id : null;
        var storeId = self.generalMessages().SelectedStore() != null ? self.generalMessages().SelectedStore().Id : null;
        var messageDescription = self.generalMessages().MessageDescription;
        var customerDescription = self.generalMessages().CustomerDescription;
        var isTemporary = false;
        var customerMessage = new PostCustomerMessageModel(customerMessageId, staffId, customerId, orderId, storeId, self.generalMessages().SelectedMainMessage(), self.generalMessages().SelectedMessage(), self.generalMessages().SelectedMessageDetail(), messageDescription, customerDescription, isTemporary);
        var showMessage = true;
        self.communication.Communicate(communicationTypesEnum.Post, url, customerMessage, CallbackEditCustomerMessageConfirm, ErrorCallbackEditCustomerMessageConfirm, showMessage);
    };
    // Closes edit customer message modal
    // ****************************** //
    self.EditCustomerMessageCancel = function () {
        ReinitializeMessages();
        $("#editCustomerMessage").modal("hide");
        self.selectedMessage(null);
    };
    // Updates search history
    // ****************************** //
    function UpdateSearchHistory() {
        if (self.searchSelection().Field == "PhoneNumber") {
            self.searchHistory.reverse();
            var phone = self.searchSelection().Value;
            var phoneFound = ko.utils.arrayFirst(self.searchHistory(), function (h) {
                return h == phone;
            });
            if (phoneFound == null) {
                self.searchHistory.push(phone);
            }
            else {
                self.searchHistory.splice(self.searchHistory.indexOf(phoneFound), 1);
                self.searchHistory.push(phone);
            }
            if (self.searchHistory().length > 5) {
                self.searchHistory.splice(0, 1);
            }
            self.searchHistory.reverse();
            localStorage.SearchHistory = "";
            localStorage.SearchHistory = JSON.stringify(self.searchHistory());
            if ($("#searchHistory").is(":visible")) {
                var element = document.getElementById("searchHistoryContainer");
                if (element != null) {
                    element.classList.remove("open");
                }
            }
        }
    };
    // Gets stores from API
    // ****************************** //
    function RefreshStores() {
        var url = localStorage.ApiAddress + "api/v3/da/Stores/GetStores";
        var showMessage = true;
        self.communication.Communicate(communicationTypesEnum.Get, url, null, CallbackRefreshStores, null, showMessage);
    };
    // Refresh stores
    // ****************************** //
    function CallbackRefreshStores(stores) {
        db.transaction("stores", "readwrite").objectStore("stores").clear();
        self.stores([]);
        ko.utils.arrayForEach(stores, function (s) {
            var objectStore = db.transaction("stores", "readwrite").objectStore("stores");
            var request = objectStore.put(s);
            var store = new StoreModel(s);
            self.stores.push(store);
        });
        if (self.storeSort == storeSortEnum.Code) {
            self.stores.sort(function (left, right) { return left.Code == right.Code ? 0 : (left.Code < right.Code ? -1 : 1) });
        }
        else if (self.storeSort == storeSortEnum.Title) {
            self.stores.sort(function (left, right) { return left.Title == right.Title ? 0 : (left.Title < right.Title ? -1 : 1) });
        }
        var storeOptions = {};
        ko.utils.arrayForEach(self.stores(), function (s) {
            storeOptions[s.Id] = s.Title;
        });
        self.storeOptions(storeOptions);
        self.customerPagination.Initialize();
        var url = localStorage.ApiAddress + "api/v3/da/Customers/SearchCustomers";
        var model = {};
        model.Type = self.searchSelection().SearchType;
        model.Value = self.searchSelection().Value;
        var pageSize = 10;
        self.customerPagination.SearchEntitiesWithModel(url, model, pageSize, PostExecuteSearchCustomers, CallbackSearchCustomers);
    };
    // Searches customer by phone
    // ****************************** //
    function SearchCustomerByPhone(phone) {
        self.searchSelection(self.searchOptions()[0]);
        self.searchSelection().Value = phone;
        self.searchSelection.notifySubscribers();
        self.SearchCustomer();
    };
    // Enriches customer models
    // ****************************** //
    function PostExecuteSearchCustomers(customers) {
        ko.utils.arrayForEach(customers, function (c) {
            c.daCustomerModel.LoyaltyPoints = 0;
            c.shownMap = false;
            c.selectedCommunicationPhone = c.daCustomerModel.Phone1 != null ? c.daCustomerModel.Phone1 : c.daCustomerModel.Mobile != null ? c.daCustomerModel.Mobile : c.daCustomerModel.Phone2 != null ? c.daCustomerModel.Phone2 : null;
            if (c.daAddrModel.length > 0) {
                var address = ko.utils.arrayFirst(c.daAddrModel, function (a) {
                    if (self.addressPriority == addressPriorityEnum.LastAddress) {
                        return a.Id == c.daCustomerModel.LastAddressId;
                    }
                    else if (self.addressPriority == addressPriorityEnum.PhoneAddress) {
                        return self.searchSelection().Field == "PhoneNumber" && a.LastPhoneNumber == self.searchSelection().Value;
                    }
                    else {
                        return false;
                    }
                });
                if (address == null) {
                    address = ko.utils.arrayFirst(c.daAddrModel, function (a) {
                        return a.AddressType == addressTypeEnum.Shipping;
                    });
                }
                c.selectedAddress = address;
                var billingAddress = ko.utils.arrayFirst(c.daAddrModel, function (a) {
                    return a.Id == c.daCustomerModel.BillingAddressesId;
                });
                if (billingAddress == null) {
                    billingAddress = ko.utils.arrayFirst(c.daAddrModel, function (a) {
                        return a.AddressType == addressTypeEnum.Billing;
                    });
                }
                c.selectedBillingAddress = billingAddress;
            }
            else {
                c.selectedAddress = null;
                c.selectedBillingAddress = null;
            }
        });
        return customers;
    };
    // Enables and re-initializes search
    // ****************************** //
    function CallbackSearchCustomers() {
        self.searchingCustomer(false);
        self.selectedSearchCustomer(null);
        if (self.customerPagination.allEntities.length > 0) {
            self.customerPagination.Sort(sortKeysEnum.SearchCustomer, sortInnerKeysEnum.SearchCustomerName, sortDirectionsEnum.Ascending);
            self.customerPagination.Sort(sortKeysEnum.SearchCustomer, sortInnerKeysEnum.SearchCustomerSurname, sortDirectionsEnum.Ascending);
        }
        if (self.customerIdForSearch != 0) {
            var customer = self.customerPagination.Find(findKeysEnum.SearchCustomer, findInnerKeysEnum.SearchCustomerId, self.customerIdForSearch);
            if (customer != null) {
                self.SelectCustomer(customer);
                if (self.customerForEdit) {
                    self.EditCustomer();
                }
                else if (self.customerForRequest) {
                    self.SelectTab(self.customerOptions()[1]);
                    self.customerForRequest = false;
                }
            }
            self.customerIdForSearch = 0;
        }
        else {
            self.keepSelectionsAfterEdit = false;
        }
        if (self.scrollableCustomers) {
            self.customerPagination.ScrollEntities("customerList");
        }
    };
    // Matches address with store
    // ****************************** //
    function GetStoreForAddress(addressId) {
        var url = localStorage.ApiAddress + "api/v3/da/Polygons/Address/Id/" + addressId;
        var showMessage = true;
        self.communication.Communicate(communicationTypesEnum.Get, url, null, CallbackGetStoreForAddress, ErrorCallbackGetStoreForAddress, showMessage);
    };
    // Selects store
    // ****************************** //
    function CallbackGetStoreForAddress(storeId) {
        if (self.modifyingOrder()) {
            return;
        }
        if (storeId >= 0) {
            var store = ko.utils.arrayFirst(self.stores(), function (s) {
                return s.Id == storeId;
            });
            if (store != null) {
                self.customerStore(store);
                CheckStorePayments();
            }
            else {
                toastr.info(language.Translate("StoreAddressMismatch", null));
            }
        }
        else if (storeId < 0) {
            var store = ko.utils.arrayFirst(self.stores(), function (s) {
                return s.Id == (storeId * (-1));
            });
            if (store != null) {
                toastr.info(language.Translate("StoreAddressUnavailable", { description: store.Title }));
            }
            else {
                toastr.info(language.Translate("StoreAddressMismatch", null));
            }
        }
    };
    // Informs on error at getting associated store for selected address
    // ****************************** //
    function ErrorCallbackGetStoreForAddress(message) {
        self.customerStore(null);
    };
    // Checks store's available payments
    // ****************************** //
    function CheckStorePayments() {
        if (!self.customerStore().HasCreditCard && self.customerPayment() != null && self.customerPayment().Type == accountTypeEnum.CreditCard) {
            self.customerPayment(self.paymentOptions()[0]);
        }
    };
    // Gets selected customer's last orders from API
    // ****************************** //
    function GetLastCustomerOrders(showOrder) {
        self.showActiveOrder = showOrder;
        self.customerOrders([]);
        var customerId = self.selectedSearchCustomer().daCustomerModel.Id;
        var lastOrders = self.customerOrdersMultitude();
        var url = localStorage.ApiAddress + "api/v3/da/Orders/GetOrders/customer/" + customerId + /top/ + lastOrders;
        var showMessage = true;
        self.communication.Communicate(communicationTypesEnum.Get, url, null, CallbackGetLastCustomerOrders, null, showMessage);
    };
    // Shows selected customer's last orders
    // ****************************** //
    function CallbackGetLastCustomerOrders(orders) {
        self.customerOrders(orders);
        var activeOrder = ko.utils.arrayFirst(self.customerOrders(), function (o) {
            return ((moment(o.OrderDate).format("YYYY-MM-DD") == moment().format("YYYY-MM-DD")) || (moment(o.OrderDate).format("YYYY-MM-DD") != moment().format("YYYY-MM-DD") && moment.duration(moment().diff(o.OrderDate)).asMinutes() < 180));
        });
        if (activeOrder != null && activeOrder.Status != orderStatusEnum.Canceled && self.showActiveOrder && self.navigationAction() == "Search") {
            self.ViewOrder(activeOrder);
        }
        ReinitializeMessageOrderStore();
    };
    // Reinitializes general messages
    // ****************************** //
    function ReinitializeMessages() {
        if (self.generalMessages() != null) {
            self.generalMessages().SelectedMainMessage(null);
            self.generalMessages().SelectedMessage(null);
            self.generalMessages().SelectedMessageDetail(null);
            self.generalMessages().SelectedStore(null);
            self.generalMessages().SelectedOrder(null);
            self.generalMessages().MessageDescription = null;
            self.generalMessages().CustomerDescription = null;
            ReinitializeMessageOrderStore();
            ReinitializeMessageDescriptionInput();
            ReinitializeCustomerDescriptionInput();
        }
    };
    // Reinitializes message order and store
    // ****************************** //
    function ReinitializeMessageOrderStore() {
        if (self.generalMessages() != null) {
            if (self.customerOrders().length > 0) {
                var lastOrder = self.customerOrders()[0];
                self.generalMessages().SelectedOrder(lastOrder);
                var lastStore = ko.utils.arrayFirst(self.stores(), function (s) {
                    return s.Id == lastOrder.StoreId;
                });
                if (lastStore != null) {
                    self.generalMessages().SelectedStore(lastStore);
                }
            }
            else {
                self.generalMessages().SelectedOrder(null);
                self.generalMessages().SelectedStore(null);
            }
        }
    };
    // Reinitializes message description
    // ****************************** //
    function ReinitializeMessageDescriptionInput() {
        if (self.generalMessages() != null) {
            var elements = document.getElementsByClassName("customer-message-message-description-input");
            if (elements != null && elements.length > 0) {
                var element = elements[0];
                element.value = self.generalMessages().MessageDescription;
            }
            var modalElements = document.getElementsByClassName("edit-customer-message-message-description-input");
            if (modalElements != null && modalElements.length > 0) {
                var element = modalElements[0];
                element.value = self.generalMessages().MessageDescription;
            }
        }
    };
    // Reinitializes customer description
    // ****************************** //
    function ReinitializeCustomerDescriptionInput() {
        if (self.generalMessages() != null) {
            var elements = document.getElementsByClassName("customer-message-customer-description-input");
            if (elements != null && elements.length > 0) {
                var element = elements[0];
                element.value = self.generalMessages().CustomerDescription;
            }
            var modalElements = document.getElementsByClassName("edit-customer-message-customer-description-input");
            if (modalElements != null && modalElements.length > 0) {
                var element = modalElements[0];
                element.value = self.generalMessages().CustomerDescription;
            }
        }
    };
    // Submits customer message
    // ****************************** //
    function SubmitCustomerMessage(customerMessage) {
        var url = localStorage.ApiAddress + "api/v3/da/CustomerMessages/InsertDaCustomerMessage";
        var showMessage = true;
        self.communication.Communicate(communicationTypesEnum.Post, url, customerMessage, CallbackSubmitCustomerMessage, ErrorCallbackSubmitCustomerMessage, showMessage);
    };
    // Reinitializes customer message
    // ****************************** //
    function CallbackSubmitCustomerMessage() {
        toastr.success(language.Translate("RequestSubmitted", null));
        self.addingMessage(false);
        if (self.generalMessages().CustomerDescription != null && self.generalMessages().CustomerDescription != "") {
            self.selectedSearchCustomer().daCustomerModel.LastOrderNote = self.generalMessages().CustomerDescription;
        }
        ReinitializeMessages();
    };
    // Informs on error at submitting customer message
    // ****************************** //
    function ErrorCallbackSubmitCustomerMessage(message) {
        self.addingMessage(false);
    };
    // Refreshes customer invoices
    // ****************************** //
    function CallbackAddComplaintConfirm() {
        $("#insertComplaint").modal("hide");
        toastr.success(language.Translate("ComplaintAdded", null));
        self.addingComplaint(false);
        self.selectedSearchCustomer().daCustomerModel.LastOrderNote = self.customerComplaints().StaffNote;
        GetLastCustomerOrders(false);
    };
    // Informs on error at adding complaint
    // ****************************** //
    function ErrorCallbackAddComplaintConfirm(message) {
        self.addingComplaint(false);
    };
    // Refreshes customer invoices
    // ****************************** //
    function CallbackCancelOrderConfirm() {
        $("#cancelOrder").modal("hide");
        $("#viewOrder").modal("hide");
        toastr.success(language.Translate("OrderCanceled", null));
        self.selectedOrder(null);
        self.cancelingOrder(false);
        GetLastCustomerOrders(false);
    };
    // Informs on error at canceling order
    // ****************************** //
    function ErrorCallbackCancelOrderConfirm(message) {
        self.cancelingOrder(false);
    };
    // Prepares order modification
    // ****************************** //
    function ModifyOrderAction() {
        var order = self.selectedOrder();
        localStorage.ModifyOrder = "";
        localStorage.ModifyOrder = JSON.stringify(order);
        var address = ko.utils.arrayFirst(self.selectedSearchCustomer().daAddrModel, function (a) {
            return a.Id == self.selectedOrder().ShippingAddressId;
        });
        if (address != null) {
            self.selectedSearchCustomer().selectedAddress = address;
        }
        var billingAddress = null;
        if (billingAddress == null && self.selectedOrder().BillingAddressId != null) {
            billingAddress = ko.utils.arrayFirst(self.selectedSearchCustomer().daAddrModel, function (a) {
                return a.Id == self.selectedOrder().BillingAddressId;
            });
        }
        if (billingAddress == null && self.selectedSearchCustomer().daCustomerModel.BillingAddressesId != null) {
            billingAddress = ko.utils.arrayFirst(self.selectedSearchCustomer().daAddrModel, function (a) {
                return a.Id == self.selectedSearchCustomer().daCustomerModel.BillingAddressesId;
            });
        }
        if (billingAddress == null) {
            billingAddress = ko.utils.arrayFirst(self.selectedSearchCustomer().daAddrModel, function (a) {
                return a.AddressType == addressTypeEnum.Billing;
            });
        }
        self.selectedSearchCustomer().selectedBillingAddress = billingAddress;
        if (self.hasCommunicationPhone()) {
            self.selectedSearchCustomer().selectedCommunicationPhone = self.selectedOrder().CommunicationPhone;
        }
        var store = ko.utils.arrayFirst(self.stores(), function (s) {
            return s.Id == self.selectedOrder().StoreId;
        });
        if (store != null) {
            self.customerStore(store);
        }
        var payment = ko.utils.arrayFirst(self.paymentOptions(), function (p) {
            return p.Type == self.selectedOrder().AccountType;
        });
        if (payment != null) {
            if (!(payment.Type == accountTypeEnum.CreditCard && self.customerStore() != null && !self.customerStore().HasCreditCard)) {
                self.customerPayment(payment);
            }
        }
        var sale = ko.utils.arrayFirst(self.saleOptions(), function (s) {
            return s.Type == self.selectedOrder().SaleType;
        });
        if (sale != null) {
            self.customerSale(sale);
        }
        var invoice = ko.utils.arrayFirst(self.invoiceOptions(), function (i) {
            return i.Type == self.selectedOrder().InvoiceType;
        });
        if (invoice != null) {
            self.customerInvoice(invoice);
        }
        if (self.hasLoyaltyCode()) {
            self.customerLoyaltyCode = self.selectedOrder().LoyaltyCode;
        }
        self.ViewOrderClose();
        self.Navigate(2);
    };
    // Gets selected customer's messages from API
    // ****************************** //
    function GetCustomerMessages() {
        self.customerMessagesPagination.Initialize();
        var customerId = self.selectedSearchCustomer().daCustomerModel.Id;
        var url = localStorage.ApiAddress + "api/v3/da/CustomerMessages/GetDACustomerMessage/" + customerId;
        var showMessage = true;
        self.communication.Communicate(communicationTypesEnum.Get, url, null, CallbackGetCustomerMessages, null, showMessage);
    };
    // Shows selected customer's messages
    // ****************************** //
    function CallbackGetCustomerMessages(messages) {
        var customerMessages = [];
        ko.utils.arrayForEach(messages, function (m) {
            var message = new CustomerMessageModel(m);
            customerMessages.push(message);
        });
        var pageSize = 10;
        self.customerMessagesPagination.NoSearchEntities(customerMessages, pageSize);
    };
    // Creates html element from selected order
    // ****************************** //
    function CreateHtmlFromOrder() {
        var htmlOrder = "";
        htmlOrder += "<div style=\"border: 1px solid silver; border-radius: 5px; display: flex; flex-direction: column;\">\n";
        htmlOrder += "<div style=\"border-bottom: 1px solid #DEDEDE; align-items: center; text-align: center; justify-content: center; margin: 0.5%;\">\n";
        htmlOrder += "<div style=\"font-family: Roboto; font-weight: 700; font-size: 18px;\">" + language.Translate("OrderCaps", null) + "</div>\n";
        htmlOrder += "</div>\n";
        htmlOrder += "<div style=\"border-bottom: 1px dotted #C4C4C4; align-items: center; text-align: center; justify-content: center; margin: 0.5%;\">\n";
        htmlOrder += "<div style=\"font-family: Roboto; font-weight: 700; font-size: 15px;\">" + language.Translate("Items", null) + "</div>\n";
        htmlOrder += "</div>\n";
        ko.utils.arrayForEach(self.selectedOrder().Details, function (d) {
            htmlOrder += "<div style=\"border-bottom: 1px groove #BFBFB7; margin: 0.5%;\">\n";
            htmlOrder += "<div style=\"display: flex; flex-direction: row;\">\n";
            htmlOrder += "<div style=\"width: 51%; padding-left: 2%; align-items: center; text-align: start; justify-content: flex-start; font-family: Roboto; font-weight: 400; font-size: 14px;\">" + d.Description + "</div>\n";
            htmlOrder += "<div style=\"width: 13%; align-items: center; text-align: center; justify-content: center; font-family: Roboto; font-weight: 400; font-size: 14px;\">" + d.Quantity + "x" + "</div>\n";
            htmlOrder += "<div style=\"width: 10%; align-items: center; text-align: center; justify-content: center; font-family: Roboto; font-weight: 400; font-size: 14px;\">" + d.Price.toFixed(2) + "</div>\n";
            htmlOrder += "<div style=\"width: 13%; align-items: center; text-align: center; justify-content: center; font-family: Roboto; font-weight: 400; font-size: 14px;\">" + (d.Discount != null && d.Discount != 0 ? "-" + d.Discount.toFixed(2) : "") + "</div>\n";
            htmlOrder += "<div style=\"width: 13%; padding-right: 2%; align-items: end; text-align: end; justify-content: flex-end; font-family: Roboto; font-weight: 700; font-size: 14px;\">" + d.TotalWithExtras.toFixed(2) + "€" + "</div>\n";
            htmlOrder += "</div>\n";
            ko.utils.arrayForEach(d.Extras, function (e) {
                htmlOrder += "<div style=\"display: flex; flex-direction: row;\">\n";
                htmlOrder += "<div style=\"width: 20%; padding-left: 2%;\"></div>\n";
                htmlOrder += "<div style=\"width: 31%; align-items: center; text-align: start; justify-content: flex-start; font-family: Roboto; font-weight: 400; font-size: 14px;\">" + e.Description + "</div>\n";
                if (e.Quantity == -1) {
                    htmlOrder += "<div style=\"width: 13%; align-items: center; text-align: center; justify-content: center; font-family: Roboto; font-weight: 400; font-size: 14px;\">" + "-" + "</div>\n";
                }
                else if (e.Quantity == 1) {
                    htmlOrder += "<div style=\"width: 13%; align-items: center; text-align: center; justify-content: center; font-family: Roboto; font-weight: 400; font-size: 14px;\">" + "+" + "</div>\n";
                }
                else {
                    htmlOrder += "<div style=\"width: 13%; align-items: center; text-align: center; justify-content: center; font-family: Roboto; font-weight: 400; font-size: 14px;\">" + e.Quantity + "x" + "</div>\n";
                }
                htmlOrder += "<div style=\"width: 10%; align-items: center; text-align: center; justify-content: center; font-family: Roboto; font-weight: 400; font-size: 14px;\">" + e.Price.toFixed(2) + "</div>\n";
                htmlOrder += "<div style=\"width: 26%; padding-right: 2%;\"></div>\n";
                htmlOrder += "</div>\n";
            });
            if (d.ItemRemark != null) {
                htmlOrder += "<div style=\"display: flex; flex-direction: row;\">\n";
                htmlOrder += "<div style=\"width: 100%; padding-left: 2%; padding-right: 2%; align-items: center; text-align: end; justify-content: flex-end; font-family: Roboto; font-weight: 400; font-size: 14px;\">" + d.ItemRemark + "</div>\n";
                htmlOrder += "</div>\n";
            }
            htmlOrder += "</div>\n";
        });
        htmlOrder += "<div style=\"border-bottom: 1px dotted #C4C4C4; align-items: center; text-align: center; justify-content: center; margin: 0.5%;\">\n";
        htmlOrder += "<div style=\"font-family: Roboto; font-weight: 700; font-size: 15px;\">" + language.Translate("Information", null) + "</div>\n";
        htmlOrder += "</div>\n";
        if (self.selectedOrder().Discount != null && self.selectedOrder().Discount != 0) {
            htmlOrder += "<div style=\"display: flex; flex-direction: row; margin: 0.5%;\">\n";
            htmlOrder += "<div style=\"width: 40%; padding-left: 2%; align-items: center; text-align: start; justify-content: flex-start; font-family: Roboto; font-weight: 700; font-size: 14px;\">" + language.Translate("DiscountColon", null) + "</div>\n";
            htmlOrder += "<div style=\"width: 60%; padding-right: 2%; align-items: center; text-align: end; justify-content: flex-end; font-family: Roboto; font-weight: 700; font-size: 14px;\">" + "-" + self.selectedOrder().Discount.toFixed(2) + "€" + "</div>\n";
            htmlOrder += "</div>\n";
        }
        htmlOrder += "<div style=\"display: flex; flex-direction: row; margin: 0.5%;\">\n";
        htmlOrder += "<div style=\"width: 40%; padding-left: 2%; align-items: center; text-align: start; justify-content: flex-start; font-family: Roboto; font-weight: 700; font-size: 14px;\">" + language.Translate("TotalColon", null) + "</div>\n";
        htmlOrder += "<div style=\"width: 60%; padding-right: 2%; align-items: center; text-align: end; justify-content: flex-end; font-family: Roboto; font-weight: 700; font-size: 14px;\">" + self.selectedOrder().Total.toFixed(2) + "€" + "</div>\n";
        htmlOrder += "</div>\n";
        htmlOrder += "<div style=\"display: flex; flex-direction: row; margin: 0.5%;\">\n";
        htmlOrder += "<div style=\"width: 40%; padding-left: 2%; align-items: center; text-align: start; justify-content: flex-start; font-family: Roboto; font-weight: 700; font-size: 14px;\">" + language.Translate("OriginColon", null) + "</div>\n";
        htmlOrder += "<div style=\"width: 60%; padding-right: 2%; align-items: center; text-align: end; justify-content: flex-end; font-family: Roboto; font-weight: 400; font-size: 14px;\">" + self.orderOriginOptions()[self.selectedOrder().Origin] + "</div>\n";
        htmlOrder += "</div>\n";
        htmlOrder += "<div style=\"display: flex; flex-direction: row; margin: 0.5%;\">\n";
        htmlOrder += "<div style=\"width: 40%; padding-left: 2%; align-items: center; text-align: start; justify-content: flex-start; font-family: Roboto; font-weight: 700; font-size: 14px;\">" + language.Translate("StaffColon", null) + "</div>\n";
        htmlOrder += "<div style=\"width: 60%; padding-right: 2%; align-items: center; text-align: end; justify-content: flex-end; font-family: Roboto; font-weight: 400; font-size: 14px;\">" + self.selectedOrder().StaffName + "</div>\n";
        htmlOrder += "</div>\n";
        htmlOrder += "<div style=\"display: flex; flex-direction: row; margin: 0.5%;\">\n";
        htmlOrder += "<div style=\"width: 40%; padding-left: 2%; align-items: center; text-align: start; justify-content: flex-start; font-family: Roboto; font-weight: 700; font-size: 14px;\">" + language.Translate("OrderIdColon", null) + "</div>\n";
        htmlOrder += "<div style=\"width: 60%; padding-right: 2%; align-items: center; text-align: end; justify-content: flex-end; font-family: Roboto; font-weight: 400; font-size: 14px;\">" + self.selectedOrder().Id + "</div>\n";
        htmlOrder += "</div>\n";
        htmlOrder += "<div style=\"display: flex; flex-direction: row; margin: 0.5%;\">\n";
        htmlOrder += "<div style=\"width: 40%; padding-left: 2%; align-items: center; text-align: start; justify-content: flex-start; font-family: Roboto; font-weight: 700; font-size: 14px;\">" + language.Translate("StoreColon", null) + "</div>\n";
        htmlOrder += "<div style=\"width: 60%; padding-right: 2%; align-items: center; text-align: end; justify-content: flex-end; font-family: Roboto; font-weight: 400; font-size: 14px;\">" + self.storeOptions()[self.selectedOrder().StoreId] + "</div>\n";
        htmlOrder += "</div>\n";
        htmlOrder += "<div style=\"display: flex; flex-direction: row; margin: 0.5%;\">\n";
        htmlOrder += "<div style=\"width: 40%; padding-left: 2%; align-items: center; text-align: start; justify-content: flex-start; font-family: Roboto; font-weight: 700; font-size: 14px;\">" + language.Translate("OrderNumberColon", null) + "</div>\n";
        htmlOrder += "<div style=\"width: 60%; padding-right: 2%; align-items: center; text-align: end; justify-content: flex-end; font-family: Roboto; font-weight: 400; font-size: 14px;\">" + (self.selectedOrder().StoreOrderNumber != null ? self.selectedOrder().StoreOrderNumber : "") + "</div>\n";
        htmlOrder += "</div>\n";
        htmlOrder += "<div style=\"display: flex; flex-direction: row; margin: 0.5%;\">\n";
        htmlOrder += "<div style=\"width: 40%; padding-left: 2%; align-items: center; text-align: start; justify-content: flex-start; font-family: Roboto; font-weight: 700; font-size: 14px;\">" + language.Translate("OrderStatusColon", null) + "</div>\n";
        htmlOrder += "<div style=\"width: 60%; padding-right: 2%; align-items: center; text-align: end; justify-content: flex-end; font-family: Roboto; font-weight: 400; font-size: 14px;\">" + self.orderStatusOptions()[self.selectedOrder().Status] + "</div>\n";
        htmlOrder += "</div>\n";
        htmlOrder += "<div style=\"display: flex; flex-direction: row; margin: 0.5%;\">\n";
        htmlOrder += "<div style=\"width: 40%; padding-left: 2%; align-items: center; text-align: start; justify-content: flex-start; font-family: Roboto; font-weight: 700; font-size: 14px;\">" + language.Translate("PaymentIdColon", null) + "</div>\n";
        htmlOrder += "<div style=\"width: 60%; padding-right: 2%; align-items: center; text-align: end; justify-content: flex-end; font-family: Roboto; font-weight: 400; font-size: 14px;\">" + (self.selectedOrder().PaymentId != null ? self.selectedOrder().PaymentId : "") + "</div>\n";
        htmlOrder += "</div>\n";
        htmlOrder += "<div style=\"display: flex; flex-direction: row; margin: 0.5%;\">\n";
        htmlOrder += "<div style=\"width: 40%; padding-left: 2%; align-items: center; text-align: start; justify-content: flex-start; font-family: Roboto; font-weight: 700; font-size: 14px;\">" + language.Translate("PaidOrderColon", null) + "</div>\n";
        htmlOrder += "<div style=\"width: 60%; padding-right: 2%; align-items: center; text-align: end; justify-content: flex-end; font-family: Roboto; font-weight: 400; font-size: 14px;\">" + (self.selectedOrder().IsPaid ? language.Translate("Yes", null) : language.Translate("No", null)) + "</div>\n";
        htmlOrder += "</div>\n";
        htmlOrder += "<div style=\"display: flex; flex-direction: row; margin: 0.5%;\">\n";
        htmlOrder += "<div style=\"width: 40%; padding-left: 2%; align-items: center; text-align: start; justify-content: flex-start; font-family: Roboto; font-weight: 700; font-size: 14px;\">" + language.Translate("AccountTypeColon", null) + "</div>\n";
        htmlOrder += "<div style=\"width: 60%; padding-right: 2%; align-items: center; text-align: end; justify-content: flex-end; font-family: Roboto; font-weight: 400; font-size: 14px;\">" + self.accountTypeOptions()[self.selectedOrder().AccountType] + "</div>\n";
        htmlOrder += "</div>\n";
        htmlOrder += "<div style=\"display: flex; flex-direction: row; margin: 0.5%;\">\n";
        htmlOrder += "<div style=\"width: 40%; padding-left: 2%; align-items: center; text-align: start; justify-content: flex-start; font-family: Roboto; font-weight: 700; font-size: 14px;\">" + language.Translate("SaleTypeColon", null) + "</div>\n";
        htmlOrder += "<div style=\"width: 60%; padding-right: 2%; align-items: center; text-align: end; justify-content: flex-end; font-family: Roboto; font-weight: 400; font-size: 14px;\">" + self.saleTypeOptions()[self.selectedOrder().SaleType] + "</div>\n";
        htmlOrder += "</div>\n";
        htmlOrder += "<div style=\"display: flex; flex-direction: row; margin: 0.5%;\">\n";
        htmlOrder += "<div style=\"width: 40%; padding-left: 2%; align-items: center; text-align: start; justify-content: flex-start; font-family: Roboto; font-weight: 700; font-size: 14px;\">" + language.Translate("InvoiceTypeColon", null) + "</div>\n";
        htmlOrder += "<div style=\"width: 60%; padding-right: 2%; align-items: center; text-align: end; justify-content: flex-end; font-family: Roboto; font-weight: 400; font-size: 14px;\">" + self.invoiceTypeOptions()[self.selectedOrder().InvoiceType] + "</div>\n";
        htmlOrder += "</div>\n";
        if (self.selectedOrder().InvoiceType == invoiceTypeEnum.Bill) {
            htmlOrder += "<div style=\"display: flex; flex-direction: row; margin: 0.5%;\">\n";
            htmlOrder += "<div style=\"width: 40%; padding-left: 2%; align-items: center; text-align: start; justify-content: flex-start; font-family: Roboto; font-weight: 700; font-size: 14px;\">" + language.Translate("CompanyNameColon", null) + "</div>\n";
            htmlOrder += "<div style=\"width: 60%; padding-right: 2%; align-items: center; text-align: end; justify-content: flex-end; font-family: Roboto; font-weight: 400; font-size: 14px;\">" + self.selectedSearchCustomer().daCustomerModel.JobName + "</div>\n";
            htmlOrder += "</div>\n";
        }
        htmlOrder += "<div style=\"display: flex; flex-direction: row; margin: 0.5%;\">\n";
        htmlOrder += "<div style=\"width: 40%; padding-left: 2%; align-items: center; text-align: start; justify-content: flex-start; font-family: Roboto; font-weight: 700; font-size: 14px;\">" + language.Translate("OrderNoteColon", null) + "</div>\n";
        htmlOrder += "<div style=\"width: 60%; padding-right: 2%; align-items: center; text-align: end; justify-content: flex-end; font-family: Roboto; font-weight: 400; font-size: 14px;\">" + (self.selectedOrder().Remarks != null ? self.selectedOrder().Remarks : "") + "</div>\n";
        htmlOrder += "</div>\n";
        htmlOrder += "<div style=\"display: flex; flex-direction: row; margin: 0.5%;\">\n";
        htmlOrder += "<div style=\"width: 40%; padding-left: 2%; align-items: center; text-align: start; justify-content: flex-start; font-family: Roboto; font-weight: 700; font-size: 14px;\">" + language.Translate("CustomerNoteColon", null) + "</div>\n";
        htmlOrder += "<div style=\"width: 60%; padding-right: 2%; align-items: center; text-align: end; justify-content: flex-end; font-family: Roboto; font-weight: 400; font-size: 14px;\">" + (self.selectedSearchCustomer().daCustomerModel.Notes != null ? self.selectedSearchCustomer().daCustomerModel.Notes : "") + "</div>\n";
        htmlOrder += "</div>\n";
        if (self.hasCommunicationPhone()) {
            htmlOrder += "<div style=\"display: flex; flex-direction: row; margin: 0.5%;\">\n";
            htmlOrder += "<div style=\"width: 40%; padding-left: 2%; align-items: center; text-align: start; justify-content: flex-start; font-family: Roboto; font-weight: 700; font-size: 14px;\">" + language.Translate("CommunicationPhoneColon", null) + "</div>\n";
            htmlOrder += "<div style=\"width: 60%; padding-right: 2%; align-items: center; text-align: end; justify-content: flex-end; font-family: Roboto; font-weight: 400; font-size: 14px;\">" + (self.selectedOrder().CommunicationPhone != null ? self.selectedOrder().CommunicationPhone : "") + "</div>\n";
            htmlOrder += "</div>\n";
        }
        if (self.hasLoyaltyCode()) {
            htmlOrder += "<div style=\"display: flex; flex-direction: row; margin: 0.5%;\">\n";
            htmlOrder += "<div style=\"width: 40%; padding-left: 2%; align-items: center; text-align: start; justify-content: flex-start; font-family: Roboto; font-weight: 700; font-size: 14px;\">" + language.Translate("LoyaltyCodeColon", null) + "</div>\n";
            htmlOrder += "<div style=\"width: 60%; padding-right: 2%; align-items: center; text-align: end; justify-content: flex-end; font-family: Roboto; font-weight: 400; font-size: 14px;\">" + (self.selectedOrder().LoyaltyCode != null ? self.selectedOrder().LoyaltyCode : "") + "</div>\n";
            htmlOrder += "</div>\n";
        }
        htmlOrder += "<div style=\"display: flex; flex-direction: row; margin: 0.5%;\">\n";
        htmlOrder += "<div style=\"width: 40%; padding-left: 2%; align-items: center; text-align: start; justify-content: flex-start; font-family: Roboto; font-weight: 700; font-size: 14px;\">" + language.Translate("StartColon", null) + "</div>\n";
        htmlOrder += "<div style=\"width: 60%; padding-right: 2%; align-items: center; text-align: end; justify-content: flex-end; font-family: Roboto; font-weight: 400; font-size: 14px;\">" + moment(self.selectedOrder().StartDate).format("DD-MM-YYYY HH:mm") + "</div>\n";
        htmlOrder += "</div>\n";
        htmlOrder += "<div style=\"display: flex; flex-direction: row; margin: 0.5%;\">\n";
        htmlOrder += "<div style=\"width: 40%; padding-left: 2%; align-items: center; text-align: start; justify-content: flex-start; font-family: Roboto; font-weight: 700; font-size: 14px;\">" + language.Translate("EstimatedCompletionColon", null) + "</div>\n";
        htmlOrder += "<div style=\"width: 60%; padding-right: 2%; align-items: center; text-align: end; justify-content: flex-end; font-family: Roboto; font-weight: 400; font-size: 14px;\">" + "(" + (self.selectedOrder().SaleType == saleTypeEnum.Delivery ? moment.duration(moment(self.selectedOrder().EstBillingDate).diff(moment(self.selectedOrder().StartDate))).asMinutes().toFixed(0) : moment.duration(moment(self.selectedOrder().EstTakeoutDate).diff(moment(self.selectedOrder().StartDate))).asMinutes().toFixed(0)) + "') " + (self.selectedOrder().SaleType == saleTypeEnum.Delivery ? moment(self.selectedOrder().EstBillingDate).format("HH:mm") : moment(self.selectedOrder().EstTakeoutDate).format("HH:mm")) + "</div>\n";
        htmlOrder += "</div>\n";
        htmlOrder += "<div style=\"display: flex; flex-direction: row; margin: 0.5%;\">\n";
        htmlOrder += "<div style=\"width: 40%; padding-left: 2%; align-items: center; text-align: start; justify-content: flex-start; font-family: Roboto; font-weight: 700; font-size: 14px;\">" + language.Translate("DelayColon", null) + "</div>\n";
        htmlOrder += "<div style=\"width: 60%; padding-right: 2%; align-items: center; text-align: end; justify-content: flex-end; font-family: Roboto; font-weight: 400; font-size: 14px;\">" + (self.selectedOrder().SaleType == saleTypeEnum.Delivery ? moment.duration(moment().diff(moment(self.selectedOrder().EstBillingDate))).asMinutes() >= 1 ? moment.duration(moment().diff(moment(self.selectedOrder().EstBillingDate))).asMinutes().toFixed(0) + "'" : "" : moment.duration(moment().diff(moment(self.selectedOrder().EstTakeoutDate))).asMinutes() >= 1 ? moment.duration(moment().diff(moment(self.selectedOrder().EstTakeoutDate))).asMinutes().toFixed(0) + "'" : "") + "</div>\n";
        htmlOrder += "</div>\n";
        htmlOrder += "</div>\n";
        return htmlOrder;
    };
    // Reinitializes customer message and closes edit customer message modal
    // ****************************** //
    function CallbackEditCustomerMessageConfirm() {
        toastr.success(language.Translate("RequestSubmitted", null));
        self.updatingMessage(false);
        if (self.generalMessages().CustomerDescription != null && self.generalMessages().CustomerDescription != "") {
            self.selectedSearchCustomer().daCustomerModel.LastOrderNote = self.generalMessages().CustomerDescription;
        }
        ReinitializeMessages();
        $("#editCustomerMessage").modal("hide");
        self.selectedMessage(null);
        GetCustomerMessages();
    };
    // Informs on error at updating customer message
    // ****************************** //
    function ErrorCallbackEditCustomerMessageConfirm() {
        self.updatingMessage(false);
    };
    // #endregion
    // #region NavigationOptions = Insert
    // Selects tab of customer options
    // ****************************** //
    self.SelectInsertTab = function (tab) {
        var previousField = self.customerInsertTab().Field;
        self.customerInsertTab(tab);
        if (self.customerInsertTab().Field == "Customer" && previousField == "Address") {
            var customerAddress = ko.utils.arrayFirst(self.newCustomer().Addresses, function (a) {
                return a == self.newAddress();
            });
            if (customerAddress == null) {
                toastr.info(language.Translate("AddressNotAddedCustomer", null));
            }
        }
    };
    // Selects address of new customer
    // ****************************** //
    self.SelectInsertedAddress = function (address) {
        self.newCustomer().SelectedAddress = address;
        self.newCustomer.notifySubscribers();
    };
    // Edits selected address
    // ****************************** //
    self.EditSelectedAddress = function () {
        if (self.newCustomer().SelectedAddress == null) {
            toastr.warning(language.Translate("InsertAddressFirst", null));
            return;
        }
        var address = self.newCustomer().SelectedAddress;
        self.newAddress(address);
        self.customerInsertTab(self.customerInsertOptions()[1]);
    };
    // Selects billing address of new customer
    // ****************************** //
    self.SelectInsertedBillingAddress = function (address) {
        self.newCustomer().SelectedBillingAddress = address;
        self.newCustomer().BillingAddressId = self.newCustomer().SelectedBillingAddress.Id;
        self.newCustomer.notifySubscribers();
    };
    // Opens delete customer modal
    // ****************************** //
    self.DeleteCustomer = function () {
        $("#deleteCustomer").modal("show");
    };
    // Deletes customer and associated addresses
    // ****************************** //
    self.DeleteCustomerConfirm = function () {
        if (self.deletingCustomer()) {
            return;
        }
        if (self.administratorPassword != null) {
            $("#deleteCustomerPasswordConfirmation").modal("show");
        }
        else {
            self.deletingCustomer(true);
            DeleteAllCustomerAddresses();
        }
    };
    // Closes delete customer modal
    // ****************************** //
    self.DeleteCustomerCancel = function () {
        $("#deleteCustomer").modal("hide");
    };
    // Deletes customer and associated addresses after password confirmation
    // ****************************** //
    self.DeleteCustomerPasswordConfirmationConfirm = function () {
        if (self.administratorPassword == self.administratorPasswordInput()) {
            self.deletingCustomer(true);
            DeleteAllCustomerAddresses();
        }
        else {
            toastr.warning(language.Translate("InsertCorrectPassword", null));
        }
        self.administratorPasswordInput(null);
        $("#deleteCustomerPasswordConfirmation").modal("hide");
    };
    // Clears customer
    // ****************************** //
    self.ClearCustomer = function () {
        self.newCustomer(new CustomerModel());
    };
    // Copys customer
    // ****************************** //
    self.CopyCustomer = function () {
        var customer = new CustomerModel(self.newCustomer());
        customer.Id = 0;
        customer.LastAddressId = 0;
        customer.BillingAddressId = 0;
        customer.Email = null;
        customer.Password = null;
        customer.SendEmail = false;
        customer.SelectedAddress = null;
        customer.SelectedBillingAddress = null;
        customer.LastAddress = null;
        ko.utils.arrayForEach(customer.Addresses, function (a) {
            a.Id = 0;
            a.CustomerId = 0;
            a.Modified = true;
        });
        self.copiedCustomer(customer);
        toastr.success(language.Translate("CustomerCopied", null));
    };
    // Clears copied customer
    // ****************************** //
    self.ClearCopiedCustomer = function () {
        self.copiedCustomer(null);
    };
    // Pastes customer
    // ****************************** //
    self.PasteCustomer = function () {
        self.copiedCustomer().Id = self.newCustomer().Id;
        self.copiedCustomer().LastAddressId = self.newCustomer().LastAddressId;
        self.copiedCustomer().BillingAddressId = self.newCustomer().BillingAddressId;
        self.copiedCustomer().Email = self.newCustomer().Email;
        self.copiedCustomer().Password = self.newCustomer().Password;
        self.copiedCustomer().SendEmail = self.newCustomer().SendEmail;
        self.copiedCustomer().SelectedAddress = self.newCustomer().SelectedAddress;
        self.copiedCustomer().SelectedBillingAddress = self.newCustomer().SelectedBillingAddress;
        self.copiedCustomer().LastAddress = self.newCustomer().LastAddress;
        ko.utils.arrayForEach(self.newCustomer().Addresses, function (a) {
            self.copiedCustomer().Addresses.push(a);
        });
        self.newCustomer(self.copiedCustomer());
        self.newAddress(new AddressModel());
        self.ClearCopiedCustomer();
    };
    // Upserts customer
    // ****************************** //
    self.AddCustomer = function () {
        if (self.addingCustomer()) {
            return;
        }
        if (self.newCustomer().LastName == null || self.newCustomer().LastName == "") {
            toastr.warning(language.Translate("AddLastName", null));
            return;
        }
        else if ((self.newCustomer().Phone1 == null || self.newCustomer().Phone1 == "") && (self.newCustomer().Mobile == null || self.newCustomer().Mobile == "")) {
            toastr.warning(language.Translate("InsertPhone", null));
            return;
        }
        else if ((self.newCustomer().Phone1 != null && self.newCustomer().Phone1 != "" && self.newCustomer().Phone1.length < 10) || (self.newCustomer().Phone2 != null && self.newCustomer().Phone2 != "" && self.newCustomer().Phone2.length < 10) || (self.newCustomer().Mobile != null && self.newCustomer().Mobile != "" && self.newCustomer().Mobile.length < 10)) {
            toastr.warning(language.Translate("InsertValidPhone", null));
            return;
        }
        else if (self.newCustomer().Loyalty && (self.newCustomer().Mobile == null || self.newCustomer().Mobile == "")) {
            toastr.warning(language.Translate("InsertMobilePhone", null));
            return;
        }
        else if (self.newCustomer().JobName != null && self.newCustomer().JobName != "" && (self.newCustomer().CompanyPhone == null || self.newCustomer().CompanyPhone == "" || self.newCustomer().Profession == null || self.newCustomer().Profession == "" || self.newCustomer().TaxNumber == null || self.newCustomer().TaxNumber == "" || self.newCustomer().TaxOffice == null || self.newCustomer().TaxOffice == "" || self.newCustomer().SelectedBillingAddress == null)) {
            toastr.warning(language.Translate("InsertAllBillingInfo", null));
            return;
        }
        else if (self.newCustomer().CompanyPhone != null && self.newCustomer().CompanyPhone != "" && (self.newCustomer().JobName == null || self.newCustomer().JobName == "" || self.newCustomer().Profession == null || self.newCustomer().Profession == "" || self.newCustomer().TaxNumber == null || self.newCustomer().TaxNumber == "" || self.newCustomer().TaxOffice == null || self.newCustomer().TaxOffice == "" || self.newCustomer().SelectedBillingAddress == null)) {
            toastr.warning(language.Translate("InsertAllBillingInfo", null));
            return;
        }
        else if (self.newCustomer().Profession != null && self.newCustomer().Profession != "" && (self.newCustomer().JobName == null || self.newCustomer().JobName == "" || self.newCustomer().CompanyPhone == null || self.newCustomer().CompanyPhone == "" || self.newCustomer().TaxNumber == null || self.newCustomer().TaxNumber == "" || self.newCustomer().TaxOffice == null || self.newCustomer().TaxOffice == "" || self.newCustomer().SelectedBillingAddress == null)) {
            toastr.warning(language.Translate("InsertAllBillingInfo", null));
            return;
        }
        else if (self.newCustomer().TaxNumber != null && self.newCustomer().TaxNumber != "" && (self.newCustomer().JobName == null || self.newCustomer().JobName == "" || self.newCustomer().CompanyPhone == null || self.newCustomer().CompanyPhone == "" || self.newCustomer().Profession == null || self.newCustomer().Profession == "" || self.newCustomer().TaxOffice == null || self.newCustomer().TaxOffice == "" || self.newCustomer().SelectedBillingAddress == null)) {
            toastr.warning(language.Translate("InsertAllBillingInfo", null));
            return;
        }
        else if (self.newCustomer().TaxOffice != null && self.newCustomer().TaxOffice != "" && (self.newCustomer().JobName == null || self.newCustomer().JobName == "" || self.newCustomer().CompanyPhone == null || self.newCustomer().CompanyPhone == "" || self.newCustomer().Profession == null || self.newCustomer().Profession == "" || self.newCustomer().TaxNumber == null || self.newCustomer().TaxNumber == "" || self.newCustomer().SelectedBillingAddress == null)) {
            toastr.warning(language.Translate("InsertAllBillingInfo", null));
            return;
        }
        else if (self.newCustomer().SelectedBillingAddress != null && (self.newCustomer().JobName == null || self.newCustomer().JobName == "" || self.newCustomer().CompanyPhone == null || self.newCustomer().CompanyPhone == "" || self.newCustomer().Profession == null || self.newCustomer().Profession == "" || self.newCustomer().TaxNumber == null || self.newCustomer().TaxNumber == "" || self.newCustomer().TaxOffice == null || self.newCustomer().TaxOffice == "")) {
            toastr.warning(language.Translate("InsertAllBillingInfo", null));
            return;
        }
        else if (self.newCustomer().CompanyPhone != null && self.newCustomer().CompanyPhone != "" && self.newCustomer().CompanyPhone.length < 10) {
            toastr.warning(language.Translate("InsertValidPhone", null));
            return;
        }
        self.addingCustomer(true);
        if (self.newCustomer().Id != 0) {
            var url = localStorage.ApiAddress + "api/v3/da/Customers/UpdateCustomer";
            var postCustomer = new PostCustomerModel(self.newCustomer());
            var showMessage = true;
            self.communication.Communicate(communicationTypesEnum.Post, url, postCustomer, CallbackAddCustomer, ErrorCallbackAddCustomer, showMessage);
        }
        else {
            var url = localStorage.ApiAddress + "api/v3/da/Customers/Add";
            var postCustomer = new PostCustomerModel(self.newCustomer());
            var showMessage = true;
            self.communication.Communicate(communicationTypesEnum.Post, url, postCustomer, CallbackAddCustomer, ErrorCallbackAddCustomer, showMessage);
        }
    };
    // Selects address type
    // ****************************** //
    self.SelectAddressType = function (addressType) {
        self.newAddress().AddressType = addressType.Type;
        self.newAddress.notifySubscribers();
        if (self.newAddress().Latitude != null && self.newAddress().Longitude) {
            self.map.ShowMap();
        }
    };
    // Shows map for address
    // ****************************** //
    self.ShowInsertMap = function () {
        if (self.lockMap()) {
            return;
        }
        if (self.newAddress().AddressStreet == null || self.newAddress().AddressStreet == "") {
            toastr.warning(language.Translate("InsertAddress", null));
            return;
        }
        self.lockMap(true);
        var fullAddress = new AddressStigmaModel();
        fullAddress.Street = self.newAddress().AddressStreet;
        fullAddress.Number = self.newAddress().AddressNumber;
        fullAddress.Area = self.newAddress().Area;
        fullAddress.ZipCode = self.newAddress().ZipCode;
        fullAddress.City = self.newAddress().City;
        self.map.ConvertAddressToCoordinates(fullAddress, CallbackShowInsertMap, ErrorCallbackShowInsertMap);
    };
    // Refreshes map markers
    // ****************************** //
    self.RefreshMapMarkers = function () {
        self.map.RefreshMarkers();
    };
    // Selects address from address for update
    // ****************************** //
    self.SelectAddressesOptionsFromAddress = function (address) {
        self.selectedAddressesOptions(address);
    };
    // Selects address from address
    // ****************************** //
    self.CallbackShowInsertMapConfirm = function () {
        if (self.selectedAddressesOptions() == null) {
            toastr.warning(language.Translate("SelectAddress", null));
            return;
        }
        $("#addressesFromAddress").modal("hide");
        var addresses = [];
        addresses.push(self.selectedAddressesOptions());
        CallbackShowInsertMap(addresses);
    };
    // Closes addresses from address modal
    // ****************************** //
    self.CallbackShowInsertMapCancel = function () {
        self.lockMap(false);
        $("#addressesFromAddress").modal("hide");
    };
    // Selects address from coordinates for update
    // ****************************** //
    self.SelectAddressesOptionsFromCoordinates = function (address) {
        self.selectedAddressesOptions(address);
    };
    // Selects address from coordinates
    // ****************************** //
    self.CallbackClickMapInsertConfirm = function () {
        if (self.selectedAddressesOptions() == null) {
            toastr.warning(language.Translate("SelectAddress", null));
            return;
        }
        $("#addressesFromCoordinates").modal("hide");
        var addresses = [];
        addresses.push(self.selectedAddressesOptions());
        CallbackClickMapInsert(addresses);
    };
    // Closes addresses from coordinates modal
    // ****************************** //
    self.CallbackClickMapInsertCancel = function () {
        $("#addressesFromCoordinates").modal("hide");
    };
    // Deletes address
    // ****************************** //
    self.DeleteAddress = function () {
        $("#deleteAddress").modal("show");
    };
    // Deletes address
    // ****************************** //
    self.DeleteAddressConfirm = function () {
        if (self.deletingAddress()) {
            return;
        }
        if (self.administratorPassword != null) {
            $("#deleteAddressPasswordConfirmation").modal("show");
        }
        else {
            self.deletingAddress(true);
            if (self.newAddress().Id != 0) {
                var addressId = self.newAddress().Id;
                var url = localStorage.ApiAddress + "api/v3/da/Address/Delete/Id/" + addressId;
                var showMessage = true;
                self.communication.Communicate(communicationTypesEnum.Get, url, null, CallbackDeleteAddressConfirm, ErrorCallbackDeleteAddressConfirm, showMessage);
                if (self.newAddress().Id == self.newCustomer().BillingAddressId) {
                    if (self.newCustomer().SelectedBillingAddress != null && self.newCustomer().SelectedBillingAddress.Id == self.newCustomer().BillingAddressId) {
                        self.newCustomer().SelectedBillingAddress = null;
                    }
                    self.newCustomer().BillingAddressId = 0;
                    var url = localStorage.ApiAddress + "api/v3/da/Customers/UpdateCustomer";
                    var postCustomer = new PostCustomerModel(self.newCustomer());
                    var showMessage = true;
                    self.communication.Communicate(communicationTypesEnum.Post, url, postCustomer, null, null, showMessage);
                }
            }
            else {
                CallbackDeleteAddressConfirm();
            }
        }
    };
    // Deletes address
    // ****************************** //
    self.DeleteAddressCancel = function () {
        $("#deleteAddress").modal("hide");
    };
    // Deletes address after password confirmation
    // ****************************** //
    self.DeleteAddressPasswordConfirmationConfirm = function () {
        if (self.administratorPassword == self.administratorPasswordInput()) {
            self.deletingAddress(true);
            if (self.newAddress().Id != 0) {
                var addressId = self.newAddress().Id;
                var url = localStorage.ApiAddress + "api/v3/da/Address/Delete/Id/" + addressId;
                var showMessage = true;
                self.communication.Communicate(communicationTypesEnum.Get, url, null, CallbackDeleteAddressConfirm, ErrorCallbackDeleteAddressConfirm, showMessage);
                if (self.newAddress().Id == self.newCustomer().BillingAddressId) {
                    if (self.newCustomer().SelectedBillingAddress != null && self.newCustomer().SelectedBillingAddress.Id == self.newCustomer().BillingAddressId) {
                        self.newCustomer().SelectedBillingAddress = null;
                    }
                    self.newCustomer().BillingAddressId = 0;
                    var url = localStorage.ApiAddress + "api/v3/da/Customers/UpdateCustomer";
                    var postCustomer = new PostCustomerModel(self.newCustomer());
                    var showMessage = true;
                    self.communication.Communicate(communicationTypesEnum.Post, url, postCustomer, null, null, showMessage);
                }
            }
            else {
                CallbackDeleteAddressConfirm();
            }
        }
        else {
            toastr.warning(language.Translate("InsertCorrectPassword", null))
        }
        self.administratorPasswordInput(null);
        $("#deleteAddressPasswordConfirmation").modal("hide");
    };
    // Clears address
    // ****************************** //
    self.ClearAddress = function () {
        self.newAddress(new AddressModel());
    };
    // Adds address to customer
    // ****************************** //
    self.AddAddress = function () {
        if (self.newAddress().AddressStreet == null || self.newAddress().AddressStreet == "") {
            toastr.warning(language.Translate("InsertAddress", null));
            return;
        }
        else if (self.newAddress().Latitude == null || self.newAddress().Longitude == null) {
            toastr.warning(language.Translate("GetCoordinates", null));
            return;
        }
        else if (self.newAddress().Floor == null || self.newAddress().Floor == "") {
            toastr.warning(language.Translate("InsertFloor", null));
            return;
        }
        else if (self.matchAddressWithStore && !self.matchAddressWithStoreChecked) {
            toastr.warning(language.Translate("StoreAddressMismatch", null));
            return;
        }
        var customerAddress = ko.utils.arrayFirst(self.newCustomer().Addresses, function (a) {
            return a == self.newAddress();
        });
        if (customerAddress == null) {
            var address = new AddressModel(self.newAddress());
            address.Modified = true;
            self.newCustomer().Addresses.push(address);
            if (address.AddressType == addressTypeEnum.Shipping) {
                self.newCustomer().LastAddress = address;
            }
            else if (address.AddressType == addressTypeEnum.Billing) {
                var shippingAdrressFound = ko.utils.arrayFirst(self.newCustomer().Addresses, function (a) {
                    return a.AddressType == addressTypeEnum.Shipping && a.Latitude == address.Latitude && a.Longitude == address.Longitude;
                });
                if (shippingAdrressFound == null) {
                    self.newAddress().AddressType = addressTypeEnum.Shipping;
                    var shippingAddress = new AddressModel(self.newAddress());
                    shippingAddress.Modified = true;
                    self.newCustomer().Addresses.push(shippingAddress);
                }
            }
        }
        else {
            customerAddress.Modified = true;
            if (customerAddress.AddressType == addressTypeEnum.Shipping) {
                self.newCustomer().LastAddress = customerAddress;
            }
        }
        self.newCustomer().SelectedAddress = self.newCustomer().Addresses[self.newCustomer().Addresses.length - 1];
        var billingAddress = ko.utils.arrayFirst(self.newCustomer().Addresses, function (a) {
            return a.AddressType == addressTypeEnum.Billing;
        });
        if (billingAddress != null) {
            self.newCustomer().SelectedBillingAddress = billingAddress;
        }
        else {
            self.newCustomer().SelectedBillingAddress = null;
        }
        self.customerInsertTab(self.customerInsertOptions()[0]);
        self.newAddress(new AddressModel());
    };
    // Deletes associated addresses with recursion
    // ****************************** //
    function DeleteAllCustomerAddresses() {
        if (self.newCustomer().Addresses.length > 0) {
            var addresses = self.newCustomer().Addresses;
            var address = addresses[addresses.length - 1];
            self.newCustomer().Addresses.splice(self.newCustomer().Addresses.indexOf(address), 1);
            if (address.Id != 0) {
                var addressId = address.Id;
                var url = localStorage.ApiAddress + "api/v3/da/Address/Delete/Id/" + addressId;
                var showMessage = true;
                self.communication.Communicate(communicationTypesEnum.Get, url, null, DeleteAllCustomerAddresses, ErrorCallbackDeleteAllCustomerAddresses, showMessage);
            }
            else {
                DeleteAllCustomerAddresses();
            }
        }
        else {
            DeleteCustomerAfterAddresses();
        }
    };
    // Informs on error at deleting address
    // ****************************** //
    function ErrorCallbackDeleteAllCustomerAddresses(message) {
        DeleteAllCustomerAddresses();
    };
    // Deletes customer
    // ****************************** //
    function DeleteCustomerAfterAddresses() {
        if (self.newCustomer().Id != 0) {
            var customerId = self.newCustomer().Id;
            var url = localStorage.ApiAddress + "api/v3/da/Customers/Delete/Id/" + customerId;
            var showMessage = true;
            self.communication.Communicate(communicationTypesEnum.Get, url, null, CallbackDeleteCustomerConfirm, ErrorCallbackDeleteCustomerConfirm, showMessage);
        }
        else {
            CallbackDeleteCustomerConfirm();
        }
    };
    // Re-initializes customer search
    // ****************************** //
    function CallbackDeleteCustomerConfirm() {
        $("#deleteCustomer").modal("hide");
        toastr.success(language.Translate("CustomerAddressesDeleted", null));
        self.deletingCustomer(false);
        self.ClearCustomer();
        self.ClearAddress();
    };
    // Informs on error at deleting customer
    // ****************************** //
    function ErrorCallbackDeleteCustomerConfirm(message) {
        self.deletingCustomer(false);
    };
    // Upserts associated addresses
    // ****************************** //
    function CallbackAddCustomer(customerInfo) {
        if (self.newCustomer().Id != 0) {
            var customerId = self.newCustomer().Id;
        }
        else {
            var customerId = customerInfo;
            self.newCustomer().Id = customerId;
        }
        self.customerIdForSearch = customerId;
        self.customerForEdit = false;
        if (self.newCustomer().Addresses.length > 0) {
            self.addressLength = self.newCustomer().Addresses.length;
            ko.utils.arrayForEach(self.newCustomer().Addresses, function (a) {
                if (a.Modified) {
                    a.CustomerId = customerId;
                    if (a == self.newCustomer().SelectedBillingAddress && a.Id == 0) {
                        InsertBillingAddress(a);
                    }
                    else if (a == self.newCustomer().LastAddress) {
                        InsertLastAddress(a);
                    }
                    else {
                        if (a.Id != 0) {
                            var url = localStorage.ApiAddress + "api/v3/da/Address/Update";
                        }
                        else {
                            var url = localStorage.ApiAddress + "api/v3/da/Address/Insert";
                        }
                        var postAddress = new PostAddressModel(a);
                        var showMessage = true;
                        self.communication.Communicate(communicationTypesEnum.Post, url, postAddress, CallbackCallbackAddCustomer, ErrorCallbackCallbackAddCustomer, showMessage);
                    }
                }
                else {
                    self.addressLength--;
                    if (self.addressLength == 0) {
                        toastr.success(language.Translate("CustomerAddressesAdded", null));
                        self.addingCustomer(false);
                        var phone = self.newCustomer().Phone1 != null && self.newCustomer().Phone1 != "" ? self.newCustomer().Phone1 : self.newCustomer().Mobile;
                        SearchCustomerByPhone(phone);
                        self.navigationAction(self.navigationOptions[0]);
                        self.ClearCustomer();
                        self.ClearCopiedCustomer();
                        self.ClearAddress();
                    }
                }
            });
        }
        else {
            toastr.success(language.Translate("CustomerAddressesAdded", null));
            self.addingCustomer(false);
            var phone = self.newCustomer().Phone1 != null && self.newCustomer().Phone1 != "" ? self.newCustomer().Phone1 : self.newCustomer().Mobile;
            SearchCustomerByPhone(phone);
            self.navigationAction(self.navigationOptions[0]);
            self.ClearCustomer();
            self.ClearCopiedCustomer();
            self.ClearAddress();
        }
    };
    // Informs on error at adding customer
    // ****************************** //
    function ErrorCallbackAddCustomer(message) {
        self.addingCustomer(false);
    };
    // Searches newly inserted customer
    // ****************************** //
    function CallbackCallbackAddCustomer() {
        self.addressLength--;
        if (self.addressLength == 0) {
            toastr.success(language.Translate("CustomerAddressesAdded", null));
            self.addingCustomer(false);
            var phone = self.newCustomer().Phone1 != null && self.newCustomer().Phone1 != "" ? self.newCustomer().Phone1 : self.newCustomer().Mobile;
            SearchCustomerByPhone(phone);
            self.navigationAction(self.navigationOptions[0]);
            self.ClearCustomer();
            self.ClearCopiedCustomer();
            self.ClearAddress();
        }
    };
    // Informs on error at adding address
    // ****************************** //
    function ErrorCallbackCallbackAddCustomer(message) {
        self.addingCustomer(false);
    };
    // Inserts selected billing addresses
    // ****************************** //
    function InsertBillingAddress(address) {
        var url = localStorage.ApiAddress + "api/v3/da/Address/Insert";
        var postAddress = new PostAddressModel(address);
        var showMessage = true;
        self.communication.Communicate(communicationTypesEnum.Post, url, postAddress, CallbackInsertBillingAddress, ErrorCallbackInsertBillingAddress, showMessage);
    };
    // Updates customer with selected billing addresses
    // ****************************** //
    function CallbackInsertBillingAddress(addressId) {
        self.newCustomer().BillingAddressId = addressId;
        var url = localStorage.ApiAddress + "api/v3/da/Customers/UpdateCustomer";
        var postCustomer = new PostCustomerModel(self.newCustomer());
        var showMessage = true;
        self.communication.Communicate(communicationTypesEnum.Post, url, postCustomer, CallbackCallbackInsertBillingAddress, ErrorCallbackCallbackInsertBillingAddress, showMessage);
    };
    // Informs on error ar inserting selected billing addresses
    // ****************************** //
    function ErrorCallbackInsertBillingAddress(message) {
        self.addingCustomer(false);
    };
    // Searches newly inserted customer
    // ****************************** //
    function CallbackCallbackInsertBillingAddress() {
        self.addressLength--;
        if (self.addressLength == 0) {
            toastr.success(language.Translate("CustomerAddressesAdded", null));
            self.addingCustomer(false);
            var phone = self.newCustomer().Phone1 != null && self.newCustomer().Phone1 != "" ? self.newCustomer().Phone1 : self.newCustomer().Mobile;
            SearchCustomerByPhone(phone);
            self.navigationAction(self.navigationOptions[0]);
            self.ClearCustomer();
            self.ClearCopiedCustomer();
            self.ClearAddress();
        }
    };
    // Informs on error at updating customer with selected billing addresses
    // ****************************** //
    function ErrorCallbackCallbackInsertBillingAddress(message) {
        self.addingCustomer(false);
    };
    // Inserts last edited shipping addresses
    // ****************************** //
    function InsertLastAddress(address) {
        if (address.Id != 0) {
            var url = localStorage.ApiAddress + "api/v3/da/Address/Update";
        }
        else {
            var url = localStorage.ApiAddress + "api/v3/da/Address/Insert";
        }
        var postAddress = new PostAddressModel(address);
        var showMessage = true;
        self.communication.Communicate(communicationTypesEnum.Post, url, postAddress, CallbackInsertLastAddress, ErrorCallbackInsertLastAddress, showMessage);
    };
    // Updates customer with last shipping addresses
    // ****************************** //
    function CallbackInsertLastAddress(addressId) {
        self.newCustomer().LastAddressId = addressId;
        var url = localStorage.ApiAddress + "api/v3/da/Customers/UpdateCustomer";
        var postCustomer = new PostCustomerModel(self.newCustomer());
        var showMessage = true;
        self.communication.Communicate(communicationTypesEnum.Post, url, postCustomer, CallbackCallbackInsertLastAddress, ErrorCallbackCallbackInsertLastAddress, showMessage);
    };
    // Informs on error ar inserting last edited shipping addresses
    // ****************************** //
    function ErrorCallbackInsertLastAddress(message) {
        self.addingCustomer(false);
    };
    // Searches newly inserted customer
    // ****************************** //
    function CallbackCallbackInsertLastAddress() {
        self.addressLength--;
        if (self.addressLength == 0) {
            toastr.success(language.Translate("CustomerAddressesAdded", null));
            self.addingCustomer(false);
            var phone = self.newCustomer().Phone1 != null && self.newCustomer().Phone1 != "" ? self.newCustomer().Phone1 : self.newCustomer().Mobile;
            SearchCustomerByPhone(phone);
            self.navigationAction(self.navigationOptions[0]);
            self.ClearCustomer();
            self.ClearCopiedCustomer();
            self.ClearAddress();
        }
    };
    // Informs on error at updating customer with last shipping addresses
    // ****************************** //
    function ErrorCallbackCallbackInsertLastAddress() {
        self.addingCustomer(false);
    };
    // Opens addresses modal or updates latitude and longitude
    // ****************************** //
    function CallbackShowInsertMap(addressStigmas) {
        self.addressesOptions(addressStigmas);
        if (self.addressesOptions().length == 1) {
            var addressStigma = self.addressesOptions()[0];
            self.newAddress().Latitude = addressStigma.Latitude;
            self.newAddress().Longitude = addressStigma.Longitude;
            self.newAddress().AddressNumber = addressStigma.Number;
            self.newAddress().AddressStreet = addressStigma.Street;
            self.newAddress().Area = addressStigma.Area;
            self.newAddress().ZipCode = addressStigma.ZipCode;
            self.newAddress().City = addressStigma.City;
            self.newAddress().Proximity = addressStigma.Proximity;
            if (addressStigma.Description != null) {
                self.newAddress().FriendlyName = addressStigma.Description;
            }
            self.newAddress.notifySubscribers();
            var centerMap = true;
            self.map.ShowAddressOnMap(self.newAddress().Latitude, self.newAddress().Longitude, centerMap);
            self.addressesOptions([]);
            self.selectedAddressesOptions(null);
            self.lockMap(false);
            if (self.matchAddressWithStore) {
                CheckMatchAddressStore();
            }
        }
        else {
            if (self.showAddressOptions) {
                self.selectedAddressesOptions(null);
                $("#addressesFromAddress").modal("show");
            }
            else {
                var addressStigma = self.addressesOptions()[0];
                CallbackShowInsertMap([addressStigma]);
            }
        }
    };
    // Re-enables address conversion
    // ****************************** //
    function ErrorCallbackShowInsertMap() {
        self.lockMap(false);
    };
    // Gets new coordinates for new address from map
    // ****************************** //
    function ClickMapInsert(latitude, longitude) {
        if (self.navigationAction() == "Insert") {
            var fullAddress = new AddressStigmaModel();
            fullAddress.Latitude = latitude;
            fullAddress.Longitude = longitude;
            self.map.ConvertCoordinatesToAddress(fullAddress, CallbackClickMapInsert, null);
        }
    };
    // Updates map with new location for new address
    // ****************************** //
    function CallbackClickMapInsert(addressStigmas) {
        self.addressesOptions(addressStigmas);
        if (self.addressesOptions().length == 1) {
            var addressStigma = self.addressesOptions()[0];
            var centerMap = false;
            self.map.ShowAddressOnMapWithInfoWindow(addressStigma, UpdateNewCustomerAddressFromMarker, centerMap);
            self.addressesOptions([]);
            self.selectedAddressesOptions(null);
            if (self.updateAddressFromMap) {
                UpdateNewCustomerAddressFromMarker(addressStigma);
            }
            else {
                toastr.info(language.Translate("ChangeCoordinatesMap", null));
            }
        }
        else {
            if (self.showAddressOptions) {
                self.selectedAddressesOptions(null);
                $("#addressesFromCoordinates").modal("show");
            }
            else {
                var addressStigma = self.addressesOptions()[0];
                CallbackClickMapInsert([addressStigma]);
            }
        }
    };
    // Updates new address with new location
    // ****************************** //
    function UpdateNewCustomerAddressFromMarker(addressStigma) {
        self.newAddress().Latitude = addressStigma.Latitude;
        self.newAddress().Longitude = addressStigma.Longitude;
        self.newAddress().AddressNumber = addressStigma.Number;
        self.newAddress().AddressStreet = addressStigma.Street;
        self.newAddress().Area = addressStigma.Area;
        self.newAddress().ZipCode = addressStigma.ZipCode;
        self.newAddress().City = addressStigma.City;
        self.newAddress().Proximity = addressStigma.Proximity;
        self.newAddress.notifySubscribers();
        self.map.ShowMap();
        if (self.matchAddressWithStore) {
            CheckMatchAddressStore();
        }
    };
    // Matches new address with store
    // ****************************** //
    function CheckMatchAddressStore() {
        var url = localStorage.ApiAddress + "api/v3/da/Polygons/Address";
        var address = new PostAddressModel(self.newAddress());
        var showMessage = true;
        self.communication.Communicate(communicationTypesEnum.Post, url, address, CallbackCheckMatchAddressStore, null, showMessage);
        self.matchAddressWithStoreChecked = false;
    };
    // Notifies if address is matched with store
    // ****************************** //
    function CallbackCheckMatchAddressStore(storeId) {
        if (storeId != 0) {
            var store = null;
            if (storeId > 0) {
                store = ko.utils.arrayFirst(self.stores(), function (s) {
                    return s.Id == storeId;
                });
            }
            else if (storeId < 0) {
                store = ko.utils.arrayFirst(self.stores(), function (s) {
                    return s.Id == (storeId * (-1));
                });
            }
            if (store != null) {
                self.matchAddressWithStoreChecked = true;
                toastr.info(language.Translate("StoreAddressMatched", { description: store.Title }));
            }
            else {
                self.matchAddressWithStoreChecked = false;
                toastr.error(language.Translate("StoreAddressMismatch", null));
            }
        }
        else {
            self.matchAddressWithStoreChecked = false;
            toastr.error(language.Translate("StoreAddressMismatch", null));
        }
    };
    // Re-initializes customer search
    // ****************************** //
    function CallbackDeleteAddressConfirm() {
        toastr.success(language.Translate("AddressDeleted", null));
        $("#deleteAddress").modal("hide");
        self.deletingAddress(false);
        var customerAddress = ko.utils.arrayFirst(self.newCustomer().Addresses, function (a) {
            return a == self.newAddress();
        });
        if (customerAddress != null) {
            self.newCustomer().Addresses.splice(self.newCustomer().Addresses.indexOf(customerAddress), 1);
            if (self.newCustomer().Addresses.length > 0) {
                self.newCustomer().SelectedAddress = self.newCustomer().Addresses[self.newCustomer().Addresses.length - 1];
            }
            else {
                self.newCustomer().SelectedAddress = null;
            }
            self.newCustomer().Addresses.reverse();
            var billingAddress = ko.utils.arrayFirst(self.newCustomer().Addresses, function (a) {
                return a.AddressType == addressTypeEnum.Billing;
            });
            if (billingAddress != null) {
                self.newCustomer().SelectedBillingAddress = billingAddress;
            }
            else {
                self.newCustomer().SelectedBillingAddress = null;
            }
            self.newCustomer().Addresses.reverse();
        }
        self.customerInsertTab(self.customerInsertOptions()[0]);
        self.ClearAddress();
    };
    // Informs on error at deleting customer
    // ****************************** //
    function ErrorCallbackDeleteAddressConfirm(message) {
        self.deletingAddress(false);
    };
    // #endregion
    // #region Loyalty

    self.ShowLoyaltyPointsHistory = function () {
        var customerid = 0;
       if ( self.selectedSearchCustomer().daCustomerModel != null)
             customerid = self.selectedSearchCustomer().daCustomerModel.Id;

        var url = localStorage.ApiAddress + "api/v3/da/Loyalty/GetCustomerDa_LoyalPointsHistory/" + customerid;
        var showMessage = true;
        self.communication.Communicate(communicationTypesEnum.Get, url, null, CallbackGetCustomerDaLoyalPointsHistory, null, showMessage);
    }

    // Opens administrator authorization modal
    // ****************************** //
    self.AdministratorAuthorization = function () {
        $("#addLoyaltyAdministratorAuthorization").modal("show");
    };
    // Checks administrator authorization
    // ****************************** //
    self.AddLoyaltyAdministratorAuthorizationConfirm = function () {
        if (self.authorizingAdministrator) {
            return;
        }
        if (self.staffAdministratorUsername() == null || self.staffAdministratorUsername() == "") {
            toastr.warning(language.Translate("InsertUsername", null));
            return;
        }
        if (self.staffAdministratorPassword() == null || self.staffAdministratorPassword() == "") {
            toastr.warning(language.Translate("InsertPassword", null));
            return;
        }
        self.authorizingAdministrator = true;
        var url = localStorage.ApiAddress + "api/v3/Staff/AuthorizationLoyalty/loyaltyadminusername/" + self.staffAdministratorUsername() + "/loyaltyadminpassword/" + self.staffAdministratorPassword();
        var showMessage = true;
        self.communication.Communicate(communicationTypesEnum.Get, url, null, CallbackAddLoyaltyAdministratorAuthorizationConfirm, ErrorCallbackAddLoyaltyAdministratorAuthorizationConfirm, showMessage);
    };
    // Closes administrator authorization modal
    // ****************************** //
    self.AddLoyaltyAdministratorAuthorizationCancel = function () {
        $("#addLoyaltyAdministratorAuthorization").modal("hide");
        self.staffAdministratorUsername(null);
        self.staffAdministratorPassword(null);
    };
    // Adds loyalty points to customer
    // ****************************** //
    self.AddLoyaltyPointsConfirm = function () {
        if (self.addingLoyaltyPoints) {
            return;
        }
        if (self.customerLoyaltyPoints() == null || self.customerLoyaltyPoints() == "") {
            toastr.warning(language.Translate("InsertLoyaltyPoints", null));
            return;
        }
        self.addingLoyaltyPoints = true;
        var customerPoints = {};
        customerPoints.StaffId = self.staffAdministratorId;
        customerPoints.CustomerId = self.selectedSearchCustomer().daCustomerModel.Id;
        customerPoints.Date = (moment().format("YYYY-MM-DD"));
        customerPoints.OrderId = 0;
        customerPoints.StoreId = 0;
        customerPoints.Points = self.customerLoyaltyPoints();
        customerPoints.Description = self.customerLoyaltyDescription() != null ? self.customerLoyaltyDescription() : "";
        var url = localStorage.ApiAddress + "api/v3/da/Loyalty/SaveDALoyaltyPointsByStaffId";
        var showMessage = true;
        self.communication.Communicate(communicationTypesEnum.Post, url, customerPoints, CallbackAddLoyaltyPointsConfirm, ErrorCallbackAddLoyaltyPointsConfirm, showMessage);
    };
    // Closes loyalty points addition modal
    // ****************************** //
    self.AddLoyaltyPointsCancel = function () {
        $("#addLoyaltyPoints").modal("hide");
        self.staffAdministratorId = 0;
        self.customerLoyaltyPoints(null);
        self.customerLoyaltyDescription(null);
    };
    // Gets loyalty points for selected customer
    // ****************************** //
    function GetLoyaltyPointsForCustomer(customerId) {
        var url = localStorage.ApiAddress + "api/v3/da/Loyalty/GetLoyaltyPoints/Id/" + customerId;
        var showMessage = true;
        self.communication.Communicate(communicationTypesEnum.Get, url, null, CallbackGetLoyaltyPointsForCustomer, null, showMessage);
    };


    // Assigns loyalty points to selected customer
    // ****************************** //
    function CallbackGetLoyaltyPointsForCustomer(points) {
        if (self.selectedSearchCustomer() != null && self.selectedSearchCustomer().daCustomerModel != null) {
            self.selectedSearchCustomer().daCustomerModel.LoyaltyPoints = points;
            self.selectedSearchCustomer.notifySubscribers();
        }
    };

    function CallbackGetCustomerDaLoyalPointsHistory(points) {
        self.selectedSearchCustomerLoyaltyHist([]);
        
        ko.utils.arrayFirst(points, function (row) {
            var loyaltyPointsHistoryModel = new LoyaltyPointsHistoryModel(row);
            self.selectedSearchCustomerLoyaltyHist.push(loyaltyPointsHistoryModel);
        });
        
        $("#showLoyaltyPoints").modal("show");
    }

    self.closeLoyaltyPoints = function () {
        $("#showLoyaltyPoints").modal("hide");
    }


    // Gets administrator staff information
    // ****************************** //
    function CallbackAddLoyaltyAdministratorAuthorizationConfirm(staffId) {
        $("#addLoyaltyAdministratorAuthorization").modal("hide");
        self.staffAdministratorUsername(null);
        self.staffAdministratorPassword(null);
        self.authorizingAdministrator = false;
        self.staffAdministratorId = staffId;
        $("#addLoyaltyPoints").modal("show");
    };
    // Informs on error at getting administrator staff information
    // ****************************** //
    function ErrorCallbackAddLoyaltyAdministratorAuthorizationConfirm(message) {
        self.authorizingAdministrator = false;
    };
    // Refreshes customer loyalty points
    // ****************************** //
    function CallbackAddLoyaltyPointsConfirm(points) {
        $("#addLoyaltyPoints").modal("hide");
        self.staffAdministratorId = 0;
        self.customerLoyaltyPoints(null);
        self.customerLoyaltyDescription(null);
        self.addingLoyaltyPoints = false;
        var customerId = self.selectedSearchCustomer().daCustomerModel.Id;
        GetLoyaltyPointsForCustomer(customerId);
    };
    // Informs on error at adding loyalty points to customer
    // ****************************** //
    function ErrorCallbackAddLoyaltyPointsConfirm(message) {
        self.addingLoyaltyPoints = false;
    };
    // #endregion
    // #region SignalR
    // Creates signalR connection
    // ****************************** //
    function ConnectSignalR() {
        self.signalR.SetProxyFunctions(ProxyOnGetCustPhone, ProxyOnClientsResponse);
        var server = localStorage.ApiAddress;
        var hubName = "DAHub";
        var group = "Agents";
        var name = "Agent_" + localStorage.Phone;
        self.signalR.SetConnectionCallback(GetPhoneOnHold);
        self.signalR.Connect(server, hubName, group, name);
    };
    // Proxy on new incoming call
    // ****************************** //
    function ProxyOnGetCustPhone(phone) {
        if (phone != null) {
            SearchCustomerByPhone(phone);
            ClearPhoneOnHold();
        }
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
    // Gets phone on hold from API
    // ****************************** //
    function GetPhoneOnHold() {
        var name = "Agent_" + localStorage.Phone;
        var url = localStorage.ApiAddress + "api/v3/da/PhoneCenter/getCustPhone/" + name;
        var showMessage = true;
        self.communication.Communicate(communicationTypesEnum.Get, url, null, CallbackGetPhoneOnHold, null, showMessage);
    };
    // Searches customer by phone on hold
    // ****************************** //
    function CallbackGetPhoneOnHold(phone) {
        if (phone != null) {
            SearchCustomerByPhone(phone);
            ClearPhoneOnHold();
        }
    };
    // Clears phone on hold
    // ****************************** //
    function ClearPhoneOnHold() {
        var name = "Agent_" + localStorage.Phone;
        var url = localStorage.ApiAddress + "api/v3/da/PhoneCenter/finishCall/" + name;
        var showMessage = true;
        self.communication.Communicate(communicationTypesEnum.Get, url, null, null, null, showMessage);
    };
    // #endregion

}
