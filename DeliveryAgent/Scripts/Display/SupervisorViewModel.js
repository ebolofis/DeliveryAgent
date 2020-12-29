function SupervisorViewModel() {
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
    self.hasCommunicationPhone = ko.observable(false);
    self.hasLoyaltyCode = ko.observable(false);
    self.orderList = ko.observableArray([]);
    self.loadingOrders = ko.observable(false);
    self.DaOrdersMultitude = ko.observable(10);
    self.selectedOrder = ko.observable();
    self.receiptLoading = ko.observable(false);
    self.selectedStatusHist = ko.observable();
    self.currentFilter = ko.observableArray([]);
    self.allEntitiesOrders = ko.observableArray([]);
    self.timeFilteredEntities = ko.observableArray([]);
    self.displayOrderNumber = ko.observable(orderNumberEnum.Store);
    self.showMessages = ko.observable(true);
    // ----- MODULES ----- //
    self.communication = new CustomCommunication();
    self.keyboard = new CustomKeyboard();
    self.navigation = new CustomNavigation();
    self.pagination = new CustomPagination(self.communication);
    self.signalR = new CustomSignalR();
    // ----- COMPUTED PROPERTIES ----- //
    // ----- INTERVAL FUNCTIONS ----- //
    // Updates time
    // ****************************** //
    var visualClock = setInterval(function () {
        self.computedClock(moment().format("HH:mm"));
    }, 1000);
    // ----- FUNCTIONS ----- //
    // Checks version compatibility with API
    // ****************************** //
    self.CheckVersionCompatibility = function () {
        if (sessionStorage.Staff === undefined || sessionStorage.Staff == null || sessionStorage.Staff == "") {
            self.navigation.GoToModule(navigationViewsEnum.Login, null);
        }
        InitializeData();
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

    // Recent Order Times for Filter
    // ****************************** //
    self.LatestOrders = ko.observable();

    // Stores For Filter
    // ****************************** //
    self.StoresForFilter = ko.observableArray([]);
    self.storeSelection = ko.observable();

    // Order Type For Filter
    // ****************************** //
    self.saleOptions = ko.observableArray([
        { Description: "Delivery", Type: 20 },
        { Description: "Take Out", Type: 21 }
    ]);
    self.orderTypeSelection = ko.observable();

    // Order Status For Filter
    // ****************************** //
    self.statusOptions = ko.observable([
        { Status: 0, Description: "Νέα" },
        { Status: 1, Description: "Κουζίνα" },
        { Status: 3, Description: "Έτοιμη" },
        { Status: 4, Description: "Καθ'οδόν" },
        { Status: 5, Description: "Ακυρωμένη" },
        { Status: 6, Description: "Κλεισμένη" },
        { Status: 7, Description: "Επιστροφή" },
        { Status: 11, Description: "Σε αναμονή" }
    ]);
    self.orderStatusSelection = ko.observable();

    // Origin For Filter
    // ****************************** //
    self.originOptions = ko.observable([
        { Origin: 0, Description: "Agent" },
        { Origin: 1, Description: "Website" },
        { Origin: 2, Description: "Mobile" },
        { Origin: 3, Description: "Efood" },
        { Origin: 4, Description: "ClickDelivery" },
        { Origin: 5, Description: "Deliveras" },
        { Origin: 6, Description: "Skroutz" },
        { Origin: 7, Description: "DineIn" }
    ]);
    self.originSelection = ko.observable();

    // Payment Method For Filter
    // ****************************** //
    self.paymentOptions = ko.observableArray([
        { Description: "Μετρητά", Type: 1 },
        { Description: "Κάρτα", Type: 4 }
    ]);
    self.paymentMethodSelection = ko.observable();

    // Has Delay For Filter
    // ****************************** //
    self.delayOptions = ko.observableArray([
        { Description: "Με Καθυστέρηση", IsDelay: 1 },
        { Description: "Χωρίς Καθυστέρηση", IsDelay: 0 },
    ]);
    self.delaySelection = ko.observable();

    // Has Remark For Filter
    // ****************************** //
    self.noteOptions = ko.observableArray([
        { Description: "Με Σχόλιο", HasNotes: 1 },
        { Description: "Χωρίς Σχόλιο", HasNotes: 0 },
    ]);
    self.notesSelection = ko.observable();

    // Has Error For Filter
    // ****************************** //
    self.errorOptions = ko.observableArray([
        { Description: "Με Σφάλμα", HasErrorMessage: 1 },
        { Description: "Χωρίς Σφάλμα", HasErrorMessage: 0 },
    ]);
    self.errorSelection = ko.observable();

    // Has Delay in Same Status For Filter
    // ****************************** //
    self.delayInSameStatusOptions = ko.observableArray([
        { Description: "Ναι", HasDelay: 1 },
        { Description: "Όχι", HasDelay: 0 },
    ]);
    self.delayInSameStatusSelection = ko.observable();

    // Selects Store for Filter
    // ****************************** //
    self.SelectStore = function (Store) {
        self.storeSelection(Store);
    };

    // Selects Order Type for Filter
    // ****************************** //
    self.SelectOrderType = function (type) {
        self.orderTypeSelection(type);
    };

    // Selects Order Status for Filter
    // ****************************** //
    self.SelectOrderStatus = function (status) {
        self.orderStatusSelection(status);
    };

    // Selects Origin for Filter
    // ****************************** //
    self.SelectOriginStatus = function (origin) {
        self.originSelection(origin);
    };

    // Selects Payment Method for Filter
    // ****************************** //
    self.SelectPaymentMethod = function (method) {
        self.paymentMethodSelection(method);
    };

    // Selects if order Has Dalay or not for Filter
    // ****************************** //
    self.SelectDelay = function (delay) {
        self.delaySelection(delay);
    };

    // Selects if order Has Remark or not for Filter
    // ****************************** //
    self.SelectNotes = function (notes) {
        self.notesSelection(notes);
    };

    // Selects if order Has Error or not for Filter
    // ****************************** //
    self.SelectError = function (delayStatus) {
        self.errorSelection(delayStatus);
    };

    // Selects if order Has Delay in Same Status or not for Filter
    // ****************************** //
    self.SelectDelayInSameStatus = function (errors) {
        self.delayInSameStatusSelection(errors);
    };

    // Getting Orders
    // ****************************** //
    function CallbackGetDAOrdersByDate() {
        self.SelectOrdersMultitude(10);
        self.loadingOrders(false);
        ko.utils.arrayForEach(self.pagination.allEntities, function (e) {
            if (e.Notes != null) {
                e.HasNotes = true;
            }
            else {
                e.HasNotes = false;
            }
            if (e.ErrorMessage) {
                e.HasErrorMessage = true;
            }
            else {
                e.HasErrorMessage = false;
            }
            if (moment.duration(moment(new Date()).diff(e.StatusChange)).asMinutes() > 30) {
                e.HasDelay = true;
            }
            else {
                e.HasDelay = false;
            }
            self.allEntitiesOrders.push(e);
        });
    };

    // Searches Using Filters
    // ****************************** //
    self.FilterOrders = function () {
        self.pagination.NoSearchEntities(self.allEntitiesOrders(), self.DaOrdersMultitude());
        var dateControl = document.querySelector('input[type="date"]');
        var a = dateControl.value;
        if (a != "") {
            self.LatestOrders(a);

            if (self.LatestOrders() != null) {
                self.timeFilteredEntities([]);
                var pageLength = 10;
                self.allEntitiesOrders([]);
                self.loadingOrders(true);
                var url = localStorage.ApiAddress + "api/v3/da/Orders/GetOrdersByDate/" + self.LatestOrders();
                self.pagination.SearchEntities(url, pageLength, ModifyOrdersBeforePagination, CallbackGetDAOrdersByDate);
                self.pagination.entityList.valueHasMutated();
            }
        }
        if (self.storeSelection() != null) {
            self.pagination.Filter("StoreId", null, self.storeSelection().Id);
            var filtered = self.pagination.entityList();
            self.pagination.NoSearchEntities(filtered, self.DaOrdersMultitude());
        }
        if (self.orderTypeSelection() != null) {
            self.pagination.Filter("OrderType", null, self.orderTypeSelection().Type);
            var filtered = self.pagination.entityList();
            self.pagination.NoSearchEntities(filtered, self.DaOrdersMultitude());
        }
        if (self.orderStatusSelection() != null) {
            self.pagination.Filter("Status", null, self.orderStatusSelection().Status);
            var filtered = self.pagination.entityList();
            self.pagination.NoSearchEntities(filtered, self.DaOrdersMultitude());
        }
        if (self.originSelection() != null) {
            self.pagination.Filter("Origin", null, self.originSelection().Origin);
            var filtered = self.pagination.entityList();
            self.pagination.NoSearchEntities(filtered, self.DaOrdersMultitude());
        }
        if (self.paymentMethodSelection() != null) {
            self.pagination.Filter("AccountType", null, self.paymentMethodSelection().Type);
            var filtered = self.pagination.entityList();
            self.pagination.NoSearchEntities(filtered, self.DaOrdersMultitude());
        }
        if (self.delaySelection() != null) {
            self.pagination.Filter("IsDelay", null, self.delaySelection().IsDelay);
            var filtered = self.pagination.entityList();
            self.pagination.NoSearchEntities(filtered, self.DaOrdersMultitude());
        }
        if (self.notesSelection() != null) {
            self.pagination.Filter("HasNotes", null, self.notesSelection().HasNotes);
            var filtered = self.pagination.entityList();
            self.pagination.NoSearchEntities(filtered, self.DaOrdersMultitude());
        }
        if (self.errorSelection() != null) {
            self.pagination.Filter("HasErrorMessage", null, self.errorSelection().HasErrorMessage);
            var filtered = self.pagination.entityList();
            self.pagination.NoSearchEntities(filtered, self.DaOrdersMultitude());
        }
        if (self.delayInSameStatusSelection() != null) {
            self.pagination.Filter("HasDelay", null, self.delayInSameStatusSelection().HasDelay);
            var filtered = self.pagination.entityList();
            self.pagination.NoSearchEntities(filtered, self.DaOrdersMultitude());
        }
    };

    // Clears Filter inputs
    // ****************************** //
    self.ClearSearchValues = function () {
        self.LatestOrders(null);
        self.storeSelection(null);
        self.orderTypeSelection(null);
        self.orderStatusSelection(null);
        self.originSelection(null);
        self.paymentMethodSelection(null);
        self.delaySelection(null);
        self.notesSelection(null);
        self.errorSelection(null);
        self.delayInSameStatusSelection(null);
        self.timeFilteredEntities([]);
        var pageLength = 10;
        self.allEntitiesOrders([]);
        var url = localStorage.ApiAddress + "api/v3/da/Orders/GetAllOrders";
        self.pagination.SearchEntities(url, pageLength, ModifyOrdersBeforePagination, CallbackGetDAOrders);
        self.pagination.entityList.valueHasMutated();
    };

    // Initializes essential data
    // ****************************** //
    function InitializeData() {
        if (sessionStorage.Staff !== undefined && sessionStorage.Staff != null && sessionStorage.Staff != "") {
            var staff = JSON.parse(sessionStorage.Staff);
            var staffModel = new StaffModel(staff);
            self.currentStaff(staffModel);
        }
        if (localStorage.Phone !== undefined) {
            self.selectedPhone(localStorage.Phone);
        }
        sessionStorage.FailedOrders = "[]";
        InitializeConfiguration();
        var request = indexedDB.open(dbName);
        request.onsuccess = function (event) {
            console.log(request.result);
            db = request.result;
        };
        request.onerror = function (event) {
            console.log("Error: " + event.target.error.name + " , Description: " + event.target.error.message);
        };
        self.loadingOrders(true);
        self.GetDaOrders();
        self.GetDaStores();
        ConnectSignalR();
    };
    // Initializes configuration
    // ****************************** //
    function InitializeConfiguration() {
        if (localStorage.HasCommunicationPhone !== undefined && localStorage.HasCommunicationPhone != "") {
            var hasCommunicationPhone = JSON.parse(localStorage.HasCommunicationPhone);
            self.hasCommunicationPhone(hasCommunicationPhone);
        }
        if (localStorage.HasLoyaltyCode !== undefined && localStorage.HasLoyaltyCode != "") {
            var hasLoyaltyCode = JSON.parse(localStorage.HasLoyaltyCode);
            self.hasLoyaltyCode(hasLoyaltyCode);
        }
        if (localStorage.ShowMessages !== undefined && localStorage.ShowMessages != "") {
            var showMessages = JSON.parse(localStorage.ShowMessages);
            self.showMessages(showMessages);
        }
        if (localStorage.OrderNo !== undefined && localStorage.OrderNo != "") {
            var orderNo = JSON.parse(localStorage.OrderNo);
            self.displayOrderNumber(orderNo);
        }
    };

    // Load Da_Orders Data
    // ****************************** //
    self.GetDaOrders = function () {
        var pageLength = 10;
        self.pagination.Initialize();
        var url = localStorage.ApiAddress + "api/v3/da/Orders/GetAllOrders";
        self.pagination.SearchEntities(url, pageLength, ModifyOrdersBeforePagination, CallbackGetDAOrders);
    };

    // Getting Orders
    // ****************************** //
    function CallbackGetDAOrders() {
        self.SelectOrdersMultitude(10);
        self.loadingOrders(false);
        ko.utils.arrayForEach(self.pagination.allEntities, function (e) {
            self.allEntitiesOrders.push(e);
        });
    };

    // Load Da_Stores Data
    // ****************************** //
    self.GetDaStores = function () {
        var url = localStorage.ApiAddress + "api/v3/da/Stores/GetStores";
        var showMessage = true;
        self.communication.Communicate(communicationTypesEnum.Get, url, null, CallbackGetDa_Stores, ErrorCallbackGetDa_Stores, showMessage);
    };

    // Getting Stores
    // ****************************** //
    function CallbackGetDa_Stores(stores) {
        ko.utils.arrayForEach(stores, function (s) {
            obj = {};
            obj.Id = s.Id;
            obj.Description = s.Title;
            self.StoresForFilter.push(obj);
        });
    };

    // Informs on error at getting Stores
    // ****************************** //
    function ErrorCallbackGetDa_Stores(message) {
        toastr.error(message.responseText);
        console.log(message);
    };

    // Refreshes orders
    // ****************************** //
    self.RefreshOrders = function () {
        var pageLength = 10;
        self.pagination.Initialize();
        var url = localStorage.ApiAddress + "api/v3/da/Orders/GetAllOrders";
        self.pagination.SearchEntities(url, pageLength, ModifyOrdersBeforePagination, CallbackRefreshOrders);
    };
    // Applies selected filters after refresh
    // ****************************** //
    function CallbackRefreshOrders() {
        self.SelectOrdersMultitude(10);
        self.allEntitiesOrders([]);
        ko.utils.arrayForEach(self.pagination.allEntities, function (e) {
            self.allEntitiesOrders.push(e);
        });
        self.FilterOrders();
    };

    // Defines multitude of selected customer's last orders
    // ****************************** //
    self.SelectOrdersMultitude = function (multitude) {
        self.DaOrdersMultitude(multitude);
        self.pagination.entityList([]);
        self.pagination.NoSearchEntities(self.pagination.allEntities, multitude);
        ko.utils.arrayForEach(self.pagination.allEntities, function (o) {
            if (o.ExtObj != null) {
                var externalObject = JSON.parse(o.ExtObj);
                if (externalObject.Staff != null) {
                    o.AgentFirstName = externalObject.Staff.FirstName;
                    o.AgentLastName = externalObject.Staff.LastName;
                }
                else {
                    o.AgentFirstName = null;
                    o.AgentLastName = null;
                }
            }
        });
        self.pagination.entityList.valueHasMutated();
    };

    // Open Receipt Details Modal
    // ****************************** //
    self.OpenReceiptHandling = function (data) {
        ko.utils.arrayForEach(data.Details, function (d) {
            d.TotalWithExtras = d.Total;
            if (d.Extras != null) {
                ko.utils.arrayForEach(d.Extras, function (e) {
                    var totalWithExtras = d.TotalWithExtras + e.Qnt * e.Price;
                    d.TotalWithExtras = parseFloat(totalWithExtras.toFixed(2));
                });
            }
        });
        self.selectedOrder(data); //current row as selected order
        self.receiptLoading = (true);
        $('#ReceiptHandlingModal').modal('show');
    }

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
            htmlOrder += "<div style=\"width: 13%; align-items: center; text-align: center; justify-content: center; font-family: Roboto; font-weight: 400; font-size: 14px;\">" + d.Qnt + "x" + "</div>\n";
            htmlOrder += "<div style=\"width: 10%; align-items: center; text-align: center; justify-content: center; font-family: Roboto; font-weight: 400; font-size: 14px;\">" + d.Price.toFixed(2) + "</div>\n";
            htmlOrder += "<div style=\"width: 13%; align-items: center; text-align: center; justify-content: center; font-family: Roboto; font-weight: 400; font-size: 14px;\">" + (d.Discount != null && d.Discount != 0 ? "-" + d.Discount.toFixed(2) : "") + "</div>\n";
            htmlOrder += "<div style=\"width: 13%; padding-right: 2%; align-items: end; text-align: end; justify-content: flex-end; font-family: Roboto; font-weight: 700; font-size: 14px;\">" + d.TotalWithExtras.toFixed(2) + "€" + "</div>\n";
            htmlOrder += "</div>\n";
            ko.utils.arrayForEach(d.Extras, function (e) {
                htmlOrder += "<div style=\"display: flex; flex-direction: row;\">\n";
                htmlOrder += "<div style=\"width: 20%; padding-left: 2%;\"></div>\n";
                htmlOrder += "<div style=\"width: 31%; align-items: center; text-align: start; justify-content: flex-start; font-family: Roboto; font-weight: 400; font-size: 14px;\">" + e.Description + "</div>\n";
                if (e.Qnt == -1) {
                    htmlOrder += "<div style=\"width: 13%; align-items: center; text-align: center; justify-content: center; font-family: Roboto; font-weight: 400; font-size: 14px;\">" + "-" + "</div>\n";
                }
                else if (e.Qnt == 1) {
                    htmlOrder += "<div style=\"width: 13%; align-items: center; text-align: center; justify-content: center; font-family: Roboto; font-weight: 400; font-size: 14px;\">" + "+" + "</div>\n";
                }
                else {
                    htmlOrder += "<div style=\"width: 13%; align-items: center; text-align: center; justify-content: center; font-family: Roboto; font-weight: 400; font-size: 14px;\">" + e.Qnt + "x" + "</div>\n";
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
        htmlOrder += "<div style=\"width: 60%; padding-right: 2%; align-items: center; text-align: end; justify-content: flex-end; font-family: Roboto; font-weight: 400; font-size: 14px;\">" + (self.selectedOrder().AgentFirstName != null ? self.selectedOrder().AgentFirstName : "") + (self.selectedOrder().AgentFirstName != null && self.selectedOrder().AgentLastName != null ? " " : "") + (self.selectedOrder().AgentLastName != null ? self.selectedOrder().AgentLastName : "") + "</div>\n";
        htmlOrder += "</div>\n";
        htmlOrder += "<div style=\"display: flex; flex-direction: row; margin: 0.5%;\">\n";
        htmlOrder += "<div style=\"width: 40%; padding-left: 2%; align-items: center; text-align: start; justify-content: flex-start; font-family: Roboto; font-weight: 700; font-size: 14px;\">" + language.Translate("OrderIdColon", null) + "</div>\n";
        htmlOrder += "<div style=\"width: 60%; padding-right: 2%; align-items: center; text-align: end; justify-content: flex-end; font-family: Roboto; font-weight: 400; font-size: 14px;\">" + self.selectedOrder().Id + "</div>\n";
        htmlOrder += "</div>\n";
        htmlOrder += "<div style=\"display: flex; flex-direction: row; margin: 0.5%;\">\n";
        htmlOrder += "<div style=\"width: 40%; padding-left: 2%; align-items: center; text-align: start; justify-content: flex-start; font-family: Roboto; font-weight: 700; font-size: 14px;\">" + language.Translate("StoreColon", null) + "</div>\n";
        htmlOrder += "<div style=\"width: 60%; padding-right: 2%; align-items: center; text-align: end; justify-content: flex-end; font-family: Roboto; font-weight: 400; font-size: 14px;\">" + self.selectedOrder().StoreDescr + "</div>\n";
        htmlOrder += "</div>\n";
        htmlOrder += "<div style=\"display: flex; flex-direction: row; margin: 0.5%;\">\n";
        htmlOrder += "<div style=\"width: 40%; padding-left: 2%; align-items: center; text-align: start; justify-content: flex-start; font-family: Roboto; font-weight: 700; font-size: 14px;\">" + language.Translate("OrderNumberColon", null) + "</div>\n";
        htmlOrder += "<div style=\"width: 60%; padding-right: 2%; align-items: center; text-align: end; justify-content: flex-end; font-family: Roboto; font-weight: 400; font-size: 14px;\">" + (self.selectedOrder().StoreOrderNo != null ? self.selectedOrder().StoreOrderNo : "") + "</div>\n";
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
        htmlOrder += "<div style=\"width: 60%; padding-right: 2%; align-items: center; text-align: end; justify-content: flex-end; font-family: Roboto; font-weight: 400; font-size: 14px;\">" + self.saleTypeOptions()[self.selectedOrder().OrderType] + "</div>\n";
        htmlOrder += "</div>\n";
        htmlOrder += "<div style=\"display: flex; flex-direction: row; margin: 0.5%;\">\n";
        htmlOrder += "<div style=\"width: 40%; padding-left: 2%; align-items: center; text-align: start; justify-content: flex-start; font-family: Roboto; font-weight: 700; font-size: 14px;\">" + language.Translate("InvoiceTypeColon", null) + "</div>\n";
        htmlOrder += "<div style=\"width: 60%; padding-right: 2%; align-items: center; text-align: end; justify-content: flex-end; font-family: Roboto; font-weight: 400; font-size: 14px;\">" + self.invoiceTypeOptions()[self.selectedOrder().InvoiceType] + "</div>\n";
        htmlOrder += "</div>\n";
        htmlOrder += "<div style=\"display: flex; flex-direction: row; margin: 0.5%;\">\n";
        htmlOrder += "<div style=\"width: 40%; padding-left: 2%; align-items: center; text-align: start; justify-content: flex-start; font-family: Roboto; font-weight: 700; font-size: 14px;\">" + language.Translate("OrderNoteColon", null) + "</div>\n";
        htmlOrder += "<div style=\"width: 60%; padding-right: 2%; align-items: center; text-align: end; justify-content: flex-end; font-family: Roboto; font-weight: 400; font-size: 14px;\">" + (self.selectedOrder().Remarks != null ? self.selectedOrder().Remarks : "") + "</div>\n";
        htmlOrder += "</div>\n";
        htmlOrder += "<div style=\"display: flex; flex-direction: row; margin: 0.5%;\">\n";
        htmlOrder += "<div style=\"width: 40%; padding-left: 2%; align-items: center; text-align: start; justify-content: flex-start; font-family: Roboto; font-weight: 700; font-size: 14px;\">" + language.Translate("CustomerNoteColon", null) + "</div>\n";
        htmlOrder += "<div style=\"width: 60%; padding-right: 2%; align-items: center; text-align: end; justify-content: flex-end; font-family: Roboto; font-weight: 400; font-size: 14px;\">" + (self.selectedOrder().Notes != null ? self.selectedOrder().Notes : "") + "</div>\n";
        htmlOrder += "</div>\n";
        if (self.hasCommunicationPhone()) {
            htmlOrder += "<div style=\"display: flex; flex-direction: row; margin: 0.5%;\">\n";
            htmlOrder += "<div style=\"width: 40%; padding-left: 2%; align-items: center; text-align: start; justify-content: flex-start; font-family: Roboto; font-weight: 700; font-size: 14px;\">" + language.Translate("CommunicationPhoneColon", null) + "</div>\n";
            htmlOrder += "<div style=\"width: 60%; padding-right: 2%; align-items: center; text-align: end; justify-content: flex-end; font-family: Roboto; font-weight: 400; font-size: 14px;\">" + (self.selectedOrder().TelephoneNumber != null ? self.selectedOrder().TelephoneNumber : "") + "</div>\n";
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
        htmlOrder += "<div style=\"width: 60%; padding-right: 2%; align-items: center; text-align: end; justify-content: flex-end; font-family: Roboto; font-weight: 400; font-size: 14px;\">" + moment(self.selectedOrder().OrderDate).format("DD-MM-YYYY HH:mm") + "</div>\n";
        htmlOrder += "</div>\n";
        htmlOrder += "<div style=\"display: flex; flex-direction: row; margin: 0.5%;\">\n";
        htmlOrder += "<div style=\"width: 40%; padding-left: 2%; align-items: center; text-align: start; justify-content: flex-start; font-family: Roboto; font-weight: 700; font-size: 14px;\">" + language.Translate("EstimatedCompletionColon", null) + "</div>\n";
        htmlOrder += "<div style=\"width: 60%; padding-right: 2%; align-items: center; text-align: end; justify-content: flex-end; font-family: Roboto; font-weight: 400; font-size: 14px;\">" + "(" + (self.selectedOrder().OrderType == saleTypeEnum.Delivery ? moment.duration(moment(self.selectedOrder().EstBillingDate).diff(moment(self.selectedOrder().OrderDate))).asMinutes().toFixed(0) : moment.duration(moment(self.selectedOrder().EstTakeoutDate).diff(moment(self.selectedOrder().OrderDate))).asMinutes().toFixed(0)) + "') " + (self.selectedOrder().OrderType == saleTypeEnum.Delivery ? moment(self.selectedOrder().EstBillingDate).format("HH:mm") : moment(self.selectedOrder().EstTakeoutDate).format("HH:mm")) + "</div>\n";
        htmlOrder += "</div>\n";
        htmlOrder += "<div style=\"display: flex; flex-direction: row; margin: 0.5%;\">\n";
        htmlOrder += "<div style=\"width: 40%; padding-left: 2%; align-items: center; text-align: start; justify-content: flex-start; font-family: Roboto; font-weight: 700; font-size: 14px;\">" + language.Translate("DelayColon", null) + "</div>\n";
        htmlOrder += "<div style=\"width: 60%; padding-right: 2%; align-items: center; text-align: end; justify-content: flex-end; font-family: Roboto; font-weight: 400; font-size: 14px;\">" + (self.selectedOrder().OrderType == saleTypeEnum.Delivery ? moment.duration(moment().diff(moment(self.selectedOrder().EstBillingDate))).asMinutes() >= 1 ? moment.duration(moment().diff(moment(self.selectedOrder().EstBillingDate))).asMinutes().toFixed(0) + "'" : "" : moment.duration(moment().diff(moment(self.selectedOrder().EstTakeoutDate))).asMinutes() >= 1 ? moment.duration(moment().diff(moment(self.selectedOrder().EstTakeoutDate))).asMinutes().toFixed(0) + "'" : "") + "</div>\n";
        htmlOrder += "</div>\n";
        htmlOrder += "</div>\n";
        return htmlOrder;
    };

    //Close Receipt Details Modal
    // ****************************** //
    self.CloseReceiptHandling = function () {
        $('#ReceiptHandlingModal').modal('hide');
        self.receiptLoading = (false)
    }

    //Open Status Details Modal
    // ****************************** //
    self.OpenStatusHandling = function (data) {
        self.selectedOrder(data);
        self.receiptLoading = (true);
        var orderId = data.Id;
        var url = localStorage.ApiAddress + "api/v3/da/Orders/GetOrderStatusTimeChanges/OrderId/" + orderId;
        var showMessage = true;
        self.communication.Communicate(communicationTypesEnum.Get, url, null, CallbackGetOrderStatusHist, ErrorCallbackGetOrderStatusHist, showMessage);
        $('#StatusHandlingModal').modal('show');
    }

    // Getting Orders
    // ****************************** //
    function CallbackGetOrderStatusHist(status) {
        self.selectedStatusHist(status);
    };

    // Informs on error at getting Orders
    // ****************************** //
    function ErrorCallbackGetOrderStatusHist(message) {
        toastr.error(message.responseText);
        console.log(message);
    };

    //Close Status Details Modal
    // ****************************** //
    self.CloseStatusHandling = function () {
        $('#StatusHandlingModal').modal('hide');
        self.receiptLoading = (false)
    }

    //Open ErrorMessage Modal
    // ****************************** //
    self.OpenErrorMessage = function (data) {
        self.selectedOrder(data);
        $('#ErrorMessageModal').modal('show');
    }

    //Close ErrorMessage********** //
    self.CloseErrorMessage = function () {
        $('#ErrorMessageModal').modal('hide');
    }

    //Open LogicErrors Modal
    // ****************************** //
    self.OpenLogicErrors = function (data) {
        self.selectedOrder(data);
        $('#LogicErrorsModal').modal('show');
    }

    //Close LogicErrors Modal
    // ****************************** //
    self.CloseLogicErrors = function () {
        $('#LogicErrorsModal').modal('hide');
    }

    //Open Notes Modal
    // ****************************** //
    self.OpenNotes = function (data) {
        self.selectedOrder(data);
        $('#NotesModal').modal('show');
    }

    //Close Notes Modal
    // ****************************** //
    self.CloseNotes = function () {
        $('#NotesModal').modal('hide');
    }

    //transform deliveryStatus to Color
    // ****************************** //
    self.getStateColor = function (state) {
        var code = "";
        switch (state) {
            case -2:
                code = "#7800d1"; //DeliveryNew
                break;
            case -1:
                code = "#d10059"; // DeliveryOpened
                break;
            case 0:
                code = "#7800d1"; //DeliveryNew
                break;
            case 1:
                code = "#0080FF"; // DeliveryKitchen
                break;
            case 3:
                code = "#b30086"; //DeliveryReady
                break;
            case 4:
                code = "#808080"; // DeliveryOnRoad
                break;
            case 5:
                code = "#ff0000"; // DeliveryCanceled
                break;
            case 6:
                code = "#228B22"; // DeliveryClosed
                break;
            case 7:
                code = "#800000"; // DeliveryReturned
                break;
            case 11:
                code = "#DE872E"; // DeliveryOnHold
                break;
            default:
                code = "#7800d1"; // DeliveryNew
        }
        return code;
    };

    //transform SalesTypeId to Color
    // ****************************** //
    self.getSalesTypeColor = function (state) {
        var code = "";
        switch (state) {
            case 20:
                code = "#34495E";
                break;
            case 21:
                code = "#990000";
                break;
            default:
                code = "#228B22";
        }
        return code;
    };

    //Sort By Recieved Date Asc
    // ****************************** //
    self.sortByReceivedTimeAsc = function () {
        self.pagination.entityList().sort(function (d1, d2) {
            a = moment(d1.OrderDate).format("HH:mm");
            b = moment(d2.OrderDate).format("HH:mm");
            return a > b ? -1 : a < b ? 1 : 0;
        });
        self.pagination.entityList.valueHasMutated();
    };

    //Sort By Recieved Date Desc
    // ****************************** //
    self.sortByReceivedTimeDesc = function () {
        self.pagination.entityList().sort(function (d1, d2) {
            a = moment(d1.OrderDate).format("HH:mm");
            b = moment(d2.OrderDate).format("HH:mm");
            return a < b ? -1 : a > b ? 1 : 0;
        });
        self.pagination.entityList.valueHasMutated();
    };

    //Sort By Store Asc
    // ****************************** //
    self.sortByStoreAsc = function () {
        self.pagination.entityList().sort(function (left, right) {
            return left.StoreDescr == right.StoreDescr ? 0 : left.StoreDescr > right.StoreDescr ? -1 : 1;
        });
        self.pagination.entityList.valueHasMutated();
    };

    //Sort By Store Desc
    // ****************************** //
    self.sortByStoreDesc = function () {
        self.pagination.entityList().sort(function (left, right) {
            return left.StoreDescr == right.StoreDescr ? 0 : left.StoreDescr < right.StoreDescr ? -1 : 1;
        });
        self.pagination.entityList.valueHasMutated();
    };

    //Sort By Order Type Asc
    // ****************************** //
    self.sortByTypeAsc = function () {
        self.pagination.entityList().sort(function (left, right) {
            return left.OrderType == right.OrderType ? 0 : left.OrderType > right.OrderType ? -1 : 1;
        });
        self.pagination.entityList.valueHasMutated();
    };

    //Sort By Order Type Desc
    // ****************************** //
    self.sortByTypeDesc = function () {
        self.pagination.entityList().sort(function (left, right) {
            return left.OrderType == right.OrderType ? 0 : left.OrderType < right.OrderType ? -1 : 1;
        });
        self.pagination.entityList.valueHasMutated();
    };

    //Sort By Order Status Asc
    // ****************************** //
    self.sortByOrderStatusAsc = function () {
        self.pagination.entityList().sort(function (left, right) {
            return left.Status == right.Status ? 0 : left.Status > right.Status ? -1 : 1;
        });
        self.pagination.entityList.valueHasMutated();
    };

    //Sort By Order Status Desc
    // ****************************** //
    self.sortByOrderStatusDesc = function () {
        self.pagination.entityList().sort(function (left, right) {
            return left.Status == right.Status ? 0 : left.Status < right.Status ? -1 : 1;
        });
        self.pagination.entityList.valueHasMutated();
    };

    //Sort By Origin Asc
    // ****************************** //
    self.sortByOriginAsc = function () {
        self.pagination.entityList().sort(function (left, right) {
            return left.Origin == right.Origin ? 0 : left.Origin > right.Origin ? -1 : 1;
        });
        self.pagination.entityList.valueHasMutated();
    };

    //Sort By Origin Desc
    // ****************************** //
    self.sortByOriginDesc = function () {
        self.pagination.entityList().sort(function (left, right) {
            return left.Origin == right.Origin ? 0 : left.Origin < right.Origin ? -1 : 1;
        });
        self.pagination.entityList.valueHasMutated();
    };

    //Sort By Order Payment Method Asc
    // ****************************** //
    self.sortByPaymentMethodAsc = function () {
        self.pagination.entityList().sort(function (left, right) {
            return left.AccountType == right.AccountType ? 0 : left.AccountType > right.AccountType ? -1 : 1;
        });
        self.pagination.entityList.valueHasMutated();
    };

    //Sort By Order Payment Method Desc
    // ****************************** //
    self.sortByPaymentMethodDesc = function () {
        self.pagination.entityList().sort(function (left, right) {
            return left.AccountType == right.AccountType ? 0 : left.AccountType < right.AccountType ? -1 : 1;
        });
        self.pagination.entityList.valueHasMutated();
    };

    //Sort By Order Invoice Type Asc
    // ****************************** //
    self.sortByInvoiceTypeAsc = function () {
        self.pagination.entityList().sort(function (left, right) {
            return left.InvoiceType == right.InvoiceType ? 0 : left.InvoiceType > right.InvoiceType ? -1 : 1;
        });
        self.pagination.entityList.valueHasMutated();
    };

    //Sort By Order Invoice Type Desc
    // ****************************** //
    self.sortByInvoiceTypeDesc = function () {
        self.pagination.entityList().sort(function (left, right) {
            return left.InvoiceType == right.InvoiceType ? 0 : left.InvoiceType < right.InvoiceType ? -1 : 1;
        });
        self.pagination.entityList.valueHasMutated();
    };

    //Sort By Order Status Change Asc
    // ****************************** //
    self.sortByStatusChangeAsc = function () {
        self.pagination.entityList().sort(function (d1, d2) {
            a = moment(d1.StatusChange).format("HH:mm");
            b = moment(d2.StatusChange).format("HH:mm");
            return a > b ? -1 : a < b ? 1 : 0;
        });
        self.pagination.entityList.valueHasMutated();
    };

    //Sort By Order Status Change Desc
    // ****************************** //
    self.sortByStatusChangeDesc = function () {
        self.pagination.entityList().sort(function (d1, d2) {
            a = moment(d1.StatusChange).format("HH:mm");
            b = moment(d2.StatusChange).format("HH:mm");
            return a < b ? -1 : a > b ? 1 : 0;
        });
        self.pagination.entityList.valueHasMutated();
    };

    //Sort By Finish Date Change Asc
    // ****************************** //
    self.sortByFinishDateAsc = function () {
        self.pagination.entityList().sort(function (d1, d2) {
            a = moment(d1.FinishDate).format("HH:mm");
            b = moment(d2.FinishDate).format("HH:mm");
            return a > b ? -1 : a < b ? 1 : 0;
        });
        self.pagination.entityList.valueHasMutated();
    };

    //Sort By Finish Date Desc
    // ****************************** //
    self.sortByFinishDateDesc = function () {
        self.pagination.entityList().sort(function (d1, d2) {
            a = moment(d1.FinishDate).format("HH:mm");
            b = moment(d2.FinishDate).format("HH:mm");
            return a < b ? -1 : a > b ? 1 : 0;
        });
        self.pagination.entityList.valueHasMutated();
    };

    //Sort By Duration Asc
    // ****************************** //
    self.sortByDurationAsc = function () {
        self.pagination.entityList().sort(function (left, right) {
            return left.Duration == right.Duration ? 0 : left.Duration > right.Duration ? -1 : 1;
        });
        self.pagination.entityList.valueHasMutated();
    };

    //Sort By Duration Desc
    // ****************************** //
    self.sortByDurationDesc = function () {
        self.pagination.entityList().sort(function (left, right) {
            return left.Duration == right.Duration ? 0 : left.Duration < right.Duration ? -1 : 1;
        });
        self.pagination.entityList.valueHasMutated();
    };

    //Calculate Delay Time
    // ****************************** //
    self.DelayTime = function (order) {
        if (order.OrderType == 20) {
            var t = new Date;
            var s = moment(order.EstBillingDate).format('HH:mm');
            var start = moment.utc(s, "HH:mm");
            var e = moment(order.FinishDate).format('HH:mm');
            var end = moment.utc(e, "HH:mm");
            var ms = end.diff(start);
            var d = moment.duration(ms);
            if (d.asMinutes() > 0) {
                return d.asMinutes();
            }
            else {
                return '';
            }
        }
        else {
            var t = new Date;
            var s = moment(order.EstTakeoutDate).format('HH:mm');
            var start = moment.utc(s, "HH:mm");
            var e = moment(order.FinishDate).format('HH:mm');
            var end = moment.utc(e, "HH:mm");
            var ms = end.diff(start);
            var d = moment.duration(ms);
            if (d.asMinutes() > 0) {
                return d.asMinutes();
            }
            else {
                return '';
            }
        }
    };

    function ModifyOrdersBeforePagination(orders) {
        ko.utils.arrayForEach(orders, function (e) {
            if (e.Notes != null) {
                e.HasNotes = true;
            }
            else {
                e.HasNotes = false;
            }
            if (e.ErrorMessage) {
                e.HasErrorMessage = true;
            }
            else {
                e.HasErrorMessage = false;
            }
            if (moment.duration(moment(new Date()).diff(e.StatusChange)).asMinutes() > 30) {
                e.HasDelay = true;
            }
            else {
                e.HasDelay = false;
            }
            if (e.ExtObj != null) {
                var externalObject = JSON.parse(e.ExtObj);
                if (externalObject.Staff != null) {
                    e.AgentFirstName = externalObject.Staff.FirstName;
                    e.AgentLastName = externalObject.Staff.LastName;
                }
                else {
                    e.AgentFirstName = null;
                    e.AgentLastName = null;
                }
            }
            else {
                e.AgentFirstName = null;
                e.AgentLastName = null;
            }
        });
        return orders;
    };

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