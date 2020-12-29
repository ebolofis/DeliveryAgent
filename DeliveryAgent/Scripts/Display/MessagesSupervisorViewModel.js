function MessagesSupervisorViewModel() {
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
    self.customerMessages = [];
    self.stores = ko.observableArray([]);
    self.storeOptions = ko.observable(null);
    self.storeSort = null;
    self.staff = ko.observableArray([]);
    self.mainMessages = ko.observableArray([]);
    self.creationDateFilters = ko.observable(moment().format("DD/MM/YY"));
    self.selectedFilters = ko.observableArray([]);
    self.messagesMultitude = ko.observable(10);
    self.generalMessages = ko.observable(null);
    self.selectedMessage = ko.observable(null);
    self.customerOrders = ko.observableArray([]);
    self.updatingMessage = ko.observable(false);
    self.showMessages = ko.observable(true);
    // ----- MODULES ----- //
    self.communication = new CustomCommunication();
    self.dateTimePicker = new CustomDateTimePicker();
    self.navigation = new CustomNavigation();
    self.pagination = new CustomPagination(self.communication);
    self.signalR = new CustomSignalR();
    // ----- COMPUTED PROPERTIES ----- //
    // Calculates selected store filters
    // ****************************** //
    self.storeFiltersInserted = ko.computed(function () {
        var storeFound = ko.utils.arrayFirst(self.selectedFilters(), function (f) {
            return f.Key == filterKeysEnum.RequestStore;
        });
        if (storeFound != null) {
            return storeFound.Values;
        }
        else {
            return [];
        }
    });
    // Calculates selected staff filters
    // ****************************** //
    self.staffFiltersInserted = ko.computed(function () {
        var staffFound = ko.utils.arrayFirst(self.selectedFilters(), function (f) {
            return f.Key == filterKeysEnum.RequestStaff;
        });
        if (staffFound != null) {
            return staffFound.Values;
        }
        else {
            return [];
        }
    });
    // Calculates selected reason filters
    // ****************************** //
    self.reasonFiltersInserted = ko.computed(function () {
        var reasonFound = ko.utils.arrayFirst(self.selectedFilters(), function (f) {
            return f.Key == filterKeysEnum.RequestReason;
        });
        if (reasonFound != null) {
            return reasonFound.Values;
        }
        else {
            return [];
        }
    });
    // Calculates selected message filters
    // ****************************** //
    self.messageFiltersInserted = ko.computed(function () {
        var messageFound = ko.utils.arrayFirst(self.selectedFilters(), function (f) {
            return f.Key == filterKeysEnum.RequestMessage;
        });
        if (messageFound != null) {
            return messageFound.Values;
        }
        else {
            return [];
        }
    });
    // Calculates selected status filters
    // ****************************** //
    self.statusFiltersInserted = ko.computed(function () {
        var statusFound = ko.utils.arrayFirst(self.selectedFilters(), function (f) {
            return f.Key == filterKeysEnum.RequestStatus;
        });
        if (statusFound != null) {
            return statusFound.Values;
        }
        else {
            return [];
        }
    });
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
    // Selects customer message
    // ****************************** //
    self.EditCustomerMessage = function (customerMessage) {
        self.selectedMessage(customerMessage);
        ReinitializeMessages();
        GetLastCustomerOrders();
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
        $("#editCustomerMessageSupervisor").modal("hide");
        self.selectedMessage(null);
    };
    // Defines multitude of customer messages
    // ****************************** //
    self.SelectCustomerMessagesMultitude = function (multitude) {
        self.messagesMultitude(multitude);
        RefreshCustomerMessages();
        self.ApplyCustomerMessagesFilters();
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
        InitializeFilters();
        var request = indexedDB.open(dbName);
        request.onsuccess = function (event) {
            console.log(request.result);
            db = request.result;
            InitializeStores();
            InitializeStaff();
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
        if (localStorage.SortStores !== undefined && localStorage.SortStores != "") {
            var sortStores = JSON.parse(localStorage.SortStores);
            self.storeSort = sortStores;
        }
        if (localStorage.ShowMessages !== undefined && localStorage.ShowMessages != "") {
            var showMessages = JSON.parse(localStorage.ShowMessages);
            self.showMessages(showMessages);
        }
    };
    // Initializes filters
    // ****************************** //
    function InitializeFilters() {
        var storeFilter = new PaginationFilterModel();
        storeFilter.Key = filterKeysEnum.RequestStore;
        self.selectedFilters.push(storeFilter);
        var staffFilter = new PaginationFilterModel();
        staffFilter.Key = filterKeysEnum.RequestStaff;
        self.selectedFilters.push(staffFilter);
        var creationFilter = new PaginationFilterModel();
        creationFilter.Key = filterKeysEnum.RequestCreationDate;
        creationFilter.Values.push(moment(self.creationDateFilters(), "DD/MM/YYYY"));
        self.selectedFilters.push(creationFilter);
        var reasonFilter = new PaginationFilterModel();
        reasonFilter.Key = filterKeysEnum.RequestReason;
        self.selectedFilters.push(reasonFilter);
        var messageFilter = new PaginationFilterModel();
        messageFilter.Key = filterKeysEnum.RequestMessage;
        self.selectedFilters.push(messageFilter);
        var statusFilter = new PaginationFilterModel();
        statusFilter.Key = filterKeysEnum.RequestStatus;
        statusFilter.Values.push(true);
        self.selectedFilters.push(statusFilter);
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
                    GetAllCustomerMessages();
                }
            }
        }
    };
    // Initializes staff
    // ****************************** //
    function InitializeStaff() {
        if (db) {
            db.transaction("staff").objectStore("staff").openCursor().onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor != null) {
                    var staff = new StaffModel(cursor.value);
                    self.staff.push(staff);
                    cursor.continue();
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
                    var message = new MainMessageModel(cursor.value);
                    self.mainMessages.push(message);
                    temporaryMessages.push(cursor.value);
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
    // Gets customer messages from API
    // ****************************** //
    function GetAllCustomerMessages() {
        var url = localStorage.ApiAddress + "api/v3/da/CustomerMessages/GetAllCustomerMessage";
        var showMessage = true;
        self.communication.Communicate(communicationTypesEnum.Get, url, null, CallbackGetAllCustomerMessages, null, showMessage);
    };
    // Displays customer messages
    // ****************************** //
    function CallbackGetAllCustomerMessages(messages) {
        self.customerMessages = [];
        ko.utils.arrayForEach(messages, function (m) {
            var message = new CustomerMessageModel(m);
            if (self.currentStaff().IsAdmin || self.currentStaff().Id == m.StaffId) {
                self.customerMessages.push(message);
            }
        });
        RefreshCustomerMessages();
        self.ApplyCustomerMessagesFilters();
    };
    // Refreshes customer messages
    // ****************************** //
    function RefreshCustomerMessages() {
        self.pagination.Initialize();
        self.pagination.NoSearchEntities(self.customerMessages, self.messagesMultitude());
        self.pagination.Sort(sortKeysEnum.RequestId, null, sortDirectionsEnum.Descending);
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
            self.generalMessages().SelectedOrder(null);
            self.generalMessages().SelectedStore(null);
        }
    };
    // Reinitializes message description
    // ****************************** //
    function ReinitializeMessageDescriptionInput() {
        if (self.generalMessages() != null) {
            var modalElements = document.getElementsByClassName("messages-supervisor-edit-message-message-description-input");
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
            var modalElements = document.getElementsByClassName("messages-supervisor-edit-message-customer-description-input");
            if (modalElements != null && modalElements.length > 0) {
                var element = modalElements[0];
                element.value = self.generalMessages().CustomerDescription;
            }
        }
    };
    // Gets selected customer message's customer's last orders from API
    // ****************************** //
    function GetLastCustomerOrders() {
        self.customerOrders([]);
        var customerId = self.selectedMessage().CustomerId;
        var lastOrders = 10;
        var url = localStorage.ApiAddress + "api/v3/da/Orders/GetOrders/customer/" + customerId + /top/ + lastOrders;
        var showMessage = true;
        self.communication.Communicate(communicationTypesEnum.Get, url, null, CallbackGetLastCustomerOrders, null, showMessage);
    };
    // Opens edit customer message modal
    // ****************************** //
    function CallbackGetLastCustomerOrders(orders) {
        self.customerOrders(orders);
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
        $("#editCustomerMessageSupervisor").modal("show");
    };
    // Reinitializes customer message and closes edit customer message modal
    // ****************************** //
    function CallbackEditCustomerMessageConfirm() {
        toastr.success(language.Translate("RequestSubmitted", null));
        self.updatingMessage(false);
        ReinitializeMessages();
        $("#editCustomerMessageSupervisor").modal("hide");
        self.selectedMessage(null);
        GetAllCustomerMessages();
    };
    // Informs on error at updating customer message
    // ****************************** //
    function ErrorCallbackEditCustomerMessageConfirm() {
        self.updatingMessage(false);
    };
    // #endregion
    // #region Filter Messages
    // Opens store selection for filters modal
    // ****************************** //
    self.SetStoreFilters = function () {
        $("#storeFilters").modal("show");
    };
    // Manages store selection for filters
    // ****************************** //
    self.ManageStoreFilter = function (store) {
        var storeFound = ko.utils.arrayFirst(self.selectedFilters(), function (f) {
            return f.Key == filterKeysEnum.RequestStore;
        });
        if (storeFound != null) {
            var storeIdFound = ko.utils.arrayFirst(storeFound.Values, function (f) {
                return f == store.Id;
            });
            if (storeIdFound != null) {
                storeFound.Values.splice(storeFound.Values.indexOf(storeIdFound), 1);
            }
            else {
                storeFound.Values.push(store.Id);
            }
        }
        self.storeFiltersInserted.notifySubscribers();
    };
    // Closes store selection for filters modal
    // ****************************** //
    self.CloseStoreFilters = function () {
        $("#storeFilters").modal("hide");
    };
    // Opens staff selection for filters modal
    // ****************************** //
    self.SetStaffFilters = function () {
        if (!self.currentStaff().IsAdmin) {
            toastr.error(language.Translate("StaffInsufficientRights", null));
            return;
        }
        $("#staffFilters").modal("show");
    };
    // Manages staff selection for filters
    // ****************************** //
    self.ManageStaffFilter = function (staff) {
        var staffFound = ko.utils.arrayFirst(self.selectedFilters(), function (f) {
            return f.Key == filterKeysEnum.RequestStaff;
        });
        if (staffFound != null) {
            var staffIdFound = ko.utils.arrayFirst(staffFound.Values, function (f) {
                return f == staff.Id;
            });
            if (staffIdFound != null) {
                staffFound.Values.splice(staffFound.Values.indexOf(staffIdFound), 1);
            }
            else {
                staffFound.Values.push(staff.Id);
            }
        }
        self.staffFiltersInserted.notifySubscribers();
    };
    // Closes staff selection for filters modal
    // ****************************** //
    self.CloseStaffFilters = function () {
        $("#staffFilters").modal("hide");
    };
    // Opens creation date selection for filters modal
    // ****************************** //
    self.SetCreationDateFilters = function () {
        $("#creationDateFilters").modal("show");
    };
    // Clears creation date selection for filters
    // ****************************** //
    self.ClearCreationDateFilter = function () {
        self.creationDateFilters(null);
        ManageCreationDateFilter();
    };
    // Selects creation date selection for filters
    // ****************************** //
    self.SelectCreationDateFilter = function () {
        var element = "filterDateTimePicker";
        var input = "filterDateTimePickerInput";
        var button = "filterDateTimePickerButton";
        var pickerType = pickerTypesEnum.Date;
        var startDate = self.creationDateFilters() != null ? self.creationDateFilters() : moment().format("DD-MM-YYYY");
        var dataToChange = self;
        var fieldToChange = "creationDateFilters";
        self.dateTimePicker.InitializeDateTimePicker(element, input, button, pickerType, startDate, dataToChange, fieldToChange, ManageCreationDateFilter);
    };
    // Closes creation date selection for filters modal
    // ****************************** //
    self.CloseCreationDateFilters = function () {
        $("#creationDateFilters").modal("hide");
    };
    // Opens reason selection for filters modal
    // ****************************** //
    self.SetReasonFilters = function () {
        $("#reasonFilters").modal("show");
    };
    // Manages reason selection for filters
    // ****************************** //
    self.ManageReasonFilter = function (reason) {
        var reasonFound = ko.utils.arrayFirst(self.selectedFilters(), function (f) {
            return f.Key == filterKeysEnum.RequestReason;
        });
        if (reasonFound != null) {
            var reasonIdFound = ko.utils.arrayFirst(reasonFound.Values, function (f) {
                return f == reason.Id;
            });
            if (reasonIdFound != null) {
                reasonFound.Values.splice(reasonFound.Values.indexOf(reasonIdFound), 1);
            }
            else {
                reasonFound.Values.push(reason.Id);
            }
        }
        self.reasonFiltersInserted.notifySubscribers();
    };
    // Closes reason selection for filters modal
    // ****************************** //
    self.CloseReasonFilters = function () {
        $("#reasonFilters").modal("hide");
    };
    // Opens message selection for filters modal
    // ****************************** //
    self.SetMessageFilters = function () {
        $("#messageFilters").modal("show");
    };
    // Manages message selection for filters
    // ****************************** //
    self.ManageMessageFilter = function (hasDescription) {
        var messageFound = ko.utils.arrayFirst(self.selectedFilters(), function (f) {
            return f.Key == filterKeysEnum.RequestMessage;
        });
        if (messageFound != null) {
            var messageBooleanFound = ko.utils.arrayFirst(messageFound.Values, function (f) {
                return f == hasDescription;
            });
            if (messageBooleanFound != null) {
                messageFound.Values.splice(messageFound.Values.indexOf(messageBooleanFound), 1);
            }
            else {
                messageFound.Values.push(hasDescription);
            }
        }
        self.messageFiltersInserted.notifySubscribers();
    };
    // Closes message selection for filters modal
    // ****************************** //
    self.CloseMessageFilters = function () {
        $("#messageFilters").modal("hide");
    };
    // Opens status selection for filters modal
    // ****************************** //
    self.SetStatusFilters = function () {
        $("#statusFilters").modal("show");
    };
    // Manages status selection for filters
    // ****************************** //
    self.ManageStatusFilter = function (isTemporary) {
        var statusFound = ko.utils.arrayFirst(self.selectedFilters(), function (f) {
            return f.Key == filterKeysEnum.RequestStatus;
        });
        if (statusFound != null) {
            var statusBooleanFound = ko.utils.arrayFirst(statusFound.Values, function (f) {
                return f == isTemporary;
            });
            if (statusBooleanFound != null) {
                statusFound.Values.splice(statusFound.Values.indexOf(statusBooleanFound), 1);
            }
            else {
                statusFound.Values.push(isTemporary);
            }
        }
        self.statusFiltersInserted.notifySubscribers();
    };
    // Closes status selection for filters modal
    // ****************************** //
    self.CloseStatusFilters = function () {
        $("#statusFilters").modal("hide");
    };
    // Unfilters customer messages
    // ****************************** //
    self.ClearCustomerMessagesFilters = function () {
        self.creationDateFilters(null);
        ko.utils.arrayForEach(self.selectedFilters(), function (f) {
            f.Values = [];
        });
        self.selectedFilters.notifySubscribers();
        RefreshCustomerMessages();
    };
    // Filters customer messages
    // ****************************** //
    self.ApplyCustomerMessagesFilters = function () {
        var filtersToApply = [];
        ko.utils.arrayForEach(self.selectedFilters(), function (f) {
            if (f.Values.length > 0) {
                filtersToApply.push(f);
            }
        });
        RefreshCustomerMessages();
        if (filtersToApply.length > 0) {
            self.pagination.FilterMultiple(filtersToApply);
            self.pagination.Sort(sortKeysEnum.RequestId, null, sortDirectionsEnum.Descending);
        }
    };
    // Manages creation date selection for filters
    // ****************************** //
    function ManageCreationDateFilter() {
        var creationDateFound = ko.utils.arrayFirst(self.selectedFilters(), function (f) {
            return f.Key == filterKeysEnum.RequestCreationDate;
        });
        if (creationDateFound != null) {
            creationDateFound.Values.splice(0, creationDateFound.Values.length);
            if (self.creationDateFilters() != null) {
                creationDateFound.Values.push(moment(self.creationDateFilters(), "DD/MM/YYYY"));
            }
        }
    };
    // #endregion
    // #region Sort Messages
    // Sorts customer messages
    // ****************************** //
    self.SortCustomerMessages = function (key, direction) {
        self.pagination.Sort(key, null, direction);
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