function LoginViewModel() {
    // ----- PROPERTIES ----- //
    var self = this;
    self.failedOrders = ko.observableArray([]);
    self.clientVersion = localStorage.ClientVersion !== undefined ? ko.observable("v" + localStorage.ClientVersion) : ko.observable(null);
    self.registerState = ko.observable(0);
    self.incompatibilityError = ko.observable(language.Translate("CheckingCompatibility", null));
    self.OpenIndexedDBCompleted = ko.observable(false);
    self.GetStaffCompleted = ko.observable(false);
    self.GetConfigurationCompleted = ko.observable(false);
    self.GetExternalCustomerCompleted = ko.observable(false);
    self.GetExternalLoyaltyCompleted = ko.observable(false);
    self.GetMapGeocodeCompleted = ko.observable(false);
    self.GetStorePosCompleted = ko.observable(false);
    self.GetStatusCancelsCompleted = ko.observable(false);
    self.GetPagesCompleted = ko.observable(false);
    self.GetPageButtonsCompleted = ko.observable(false);
    self.GetDiscountsCompleted = ko.observable(false);
    self.GetStoresCompleted = ko.observable(false);
    self.GetStaffCompleted = ko.observable(false);
    self.GetIngredientCategoriesCompleted = ko.observable(false);
    self.GetPriceListsCompleted = ko.observable(false);
    self.GetMessagesCompleted = ko.observable(false);
    self.GetVodafoneCompleted = ko.observable(false);
    self.registerUsername = null;
    self.registerPassword = null;
    self.registerPhone = null;
    self.registerLanguage = ko.observable(null);
    self.lockRegister = ko.observable(false);
    self.storeId = "";
    self.posId = 0;
    self.pagesLength = 0;
    // ----- MODULES ----- //
    self.communication = new CustomCommunication();
    self.keyboard = new CustomKeyboard();
    self.navigation = new CustomNavigation();
    self.signalR = new CustomSignalR();
    // ----- COMPUTED PROPERTIES ----- //
    // Returns data loading state
    // ****************************** //
    self.downloadingCompleted = ko.computed(function () {
        var completed = (self.OpenIndexedDBCompleted() && self.GetStaffCompleted() && self.GetConfigurationCompleted() && self.GetExternalCustomerCompleted() && self.GetExternalLoyaltyCompleted() && self.GetMapGeocodeCompleted() && self.GetStorePosCompleted() && self.GetStatusCancelsCompleted() && self.GetPagesCompleted() && self.GetPageButtonsCompleted() && self.GetDiscountsCompleted() && self.GetStoresCompleted() && self.GetStaffCompleted() && self.GetIngredientCategoriesCompleted() && self.GetPriceListsCompleted() && self.GetMessagesCompleted() && self.GetVodafoneCompleted());
        return completed;
    });
    // Updates data loading progress
    // ****************************** //
    self.downloadingPercent = ko.computed(function () {
        var percent = 0;
        if (self.OpenIndexedDBCompleted()) {
            percent += 2;
        }
        if (self.GetStaffCompleted()) {
            percent += 5;
        }
        if (self.GetConfigurationCompleted()) {
            percent += 1;
        }
        if (self.GetExternalCustomerCompleted()) {
            percent += 1;
        }
        if (self.GetExternalLoyaltyCompleted()) {
            percent += 1;
        }
        if (self.GetMapGeocodeCompleted()) {
            percent += 1;
        }
        if (self.GetStorePosCompleted()) {
            percent += 1;
        }
        if (self.GetStatusCancelsCompleted()) {
            percent += 1;
        }
        if (self.GetPagesCompleted()) {
            percent += 7;
        }
        if (self.GetPageButtonsCompleted()) {
            percent += 31;
        }
        if (self.GetDiscountsCompleted) {
            percent += 7;
        }
        if (self.GetStoresCompleted()) {
            percent += 7;
        }
        if (self.GetStaffCompleted()) {
            percent += 7;
        }
        if (self.GetIngredientCategoriesCompleted()) {
            percent += 7;
        }
        if (self.GetPriceListsCompleted()) {
            percent += 7;
        }
        if (self.GetMessagesCompleted()) {
            percent += 7;
        }
        if (self.GetVodafoneCompleted()) {
            percent += 7;
        }
        var element = document.getElementById("downloadingProgress");
        if (element != null) {
            element.style.width = percent + "%";
        }
    });
    // ----- INTERVAL FUNCTIONS ----- //
    // Checks data loading state
    // ****************************** //
    var dataLoading = setInterval(function () {
        if (self.downloadingCompleted()) {
            clearInterval(dataLoading);
            var dataSaving = setTimeout(function () {
                self.navigation.GoToModule(navigationViewsEnum.Customer, null);
            }, 2000);
        }
    }, 1000);
    // ----- FUNCTIONS ----- //
    // #region Main Body
    // Checks version compatibility with API
    // ****************************** //
    self.CheckVersionCompatibility = function () {
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
                    toastr.success(language.Translate("CompatibilityChecked", null));
                    if (sessionStorage.FailedOrders !== undefined && sessionStorage.FailedOrders != "") {
                        var failedOrders = JSON.parse(sessionStorage.FailedOrders);
                        ko.utils.arrayForEach(failedOrders, function (o) {
                            self.failedOrders.push(o);
                        });
                    }
                    if (localStorage.Phone !== undefined && localStorage.Phone != "") {
                        var insertedPhone = localStorage.Phone;
                        self.registerPhone = insertedPhone;
                    }
                    localStorage.GeneralCustomerOrder = "";
                    localStorage.ModifyOrder = "";
                    localStorage.RedoOrder = "";
                    localStorage.StageOrder = "";
                    localStorage.ClearOrder = "";
                    self.registerLanguage(language.GetDefaultLanguage());
                    self.registerState(1);
                    ConnectSignalR();
                },
                /*Error*/
                500: function (response) {
                    self.incompatibilityError(response.responseJSON.ExceptionMessage);
                }
            }
        }).fail(function (message) {
            if (message.status != 200 && message.status != 500) {
                var errorMessage = message.responseJSON !== undefined ? (message.responseJSON.ExceptionMessage !== undefined ? message.responseJSON.ExceptionMessage : (message.responseJSON.ModelState !== undefined ? message.responseText : message.responseJSON.Message)) : (message.responseText != undefined ? message.responseText : message.statusText);
                toastr.error(errorMessage);
                console.log(message);
            }
        });
    };
    // Selects site's language
    // ****************************** //
    self.SelectLanguage = function (languageCode) {
        self.registerLanguage(languageCode);
    };
    // Registers user
    // ****************************** //
    self.RegisterUser = function () {
        if (self.lockRegister()) {
            toastr.info(language.Translate("AuthenticatingUser", null));
            return;
        }
        if (self.registerUsername == null || self.registerUsername == "") {
            toastr.warning(language.Translate("InsertUsername", null));
            return;
        }
        else if (self.registerPassword == null || self.registerPassword == "") {
            toastr.warning(language.Translate("InsertPassword", null));
            return;
        }
        else if (self.registerPhone == null || self.registerPhone == "") {
            toastr.warning(language.Translate("InsertPhone", null));
            return;
        }
        else if (self.registerLanguage() == null) {
            toastr.warning(language.Translate("ChooseLanguage", null));
            return;
        }
        self.lockRegister(true);
        var staff = {};
        staff.Username = self.registerUsername;
        staff.Password = self.registerPassword;
        $.ajax({
            url: localStorage.ApiAddress + "api/v3/da/Staff/Login",
            cache: false,
            type: "POST",
            crossdomain: true,
            dataType: "json",
            ContentType: "application/json; charset=utf-8",
            data: staff,
            statusCode: {
                /*OK*/
                200: function (response) {
                    staff.Id = response;
                    CreateAuthenticationHeader(staff);
                }
            }
        }).fail(function (message) {
            if (message.status != 200) {
                var errorMessage = message.responseJSON !== undefined ? (message.responseJSON.ExceptionMessage !== undefined ? message.responseJSON.ExceptionMessage : (message.responseJSON.ModelState !== undefined ? message.responseText : message.responseJSON.Message)) : (message.responseText != undefined ? message.responseText : message.statusText);
                toastr.error(errorMessage);
                console.log(message);
                self.lockRegister(false);
            }
        });
    };
    // Continues without maps
    // ****************************** //
    self.CallbackGetConfigurationConfirm = function () {
        self.GetMapGeocodeCompleted(true);
        $("#emptyMap").modal("hide");
    };
    // Stalls without maps
    // ****************************** //
    self.CallbackGetConfigurationCancel = function () {
        $("#emptyMap").modal("hide");
    };
    // Creates authentication header
    // ****************************** //
    function CreateAuthenticationHeader(staff) {
        $.ajax({
            url: "/Account/CreateAuthentication",
            cache: false,
            type: "GET",
            crossdomain: false,
            dataType: "json",
            ContentType: "application/json; charset=utf-8",
            data: staff,
            success: function (response) {
                if (response.error) {
                    toastr.error(response.error);
                    self.lockRegister(false);
                }
                else {
                    localStorage.Authorization = response.auth;
                    localStorage.Phone = self.registerPhone;
                    GetStaff(staff);
                    language.ChangeLanguage(self.registerLanguage());
                    var languageReInitialized = setInterval(function () {
                        if (language.Initialized()) {
                            clearInterval(languageReInitialized);
                            self.registerState(2);
                            InitializeData();
                        }
                    });
                }
            }
        }).fail(function () {
            toastr.error(language.Translate("ErrorAuthenticatingUser", null));
            self.lockRegister(false);
        });
    };
    // Gets staff from API
    // ****************************** //
    function GetStaff(staff) {
        var staffId = staff.Id;
        var url = localStorage.ApiAddress + "api/v3/da/Staff/Id/" + staffId;
        var showMessage = true;
        self.communication.Communicate(communicationTypesEnum.Get, url, null, CallbackGetStaff, null, showMessage);
    };
    // Progresses initialization
    // ****************************** //
    function CallbackGetStaff(staff) {
        var currentStaff = new StaffModel(staff);
        sessionStorage.Staff = JSON.stringify(currentStaff);
        self.GetStaffCompleted(true);
    };
    // Initializes database and essential data
    // ****************************** //
    function InitializeData() {
        var request = indexedDB.open(dbName, localStorage.DBVersion);
        request.onupgradeneeded = function (event) {
            var db = event.target.result;
            if ($.inArray("stores", db.objectStoreNames) == -1) {
                var objectStoreMyStores = db.createObjectStore("stores", { keyPath: "Id" });
            }
            if ($.inArray("staff", db.objectStoreNames) == -1) {
                var objectStoreMyStaff = db.createObjectStore("staff", { keyPath: "Id" });
            }
            if ($.inArray("pages", db.objectStoreNames) == -1) {
                var objectStoreMyPages = db.createObjectStore("pages", { keyPath: "Id" });
            }
            if ($.inArray("pageButtons", db.objectStoreNames) == -1) {
                var objectStoreMyPageButtons = db.createObjectStore("pageButtons", { keyPath: "Id" });
                objectStoreMyPageButtons.createIndex("PageId", "PageId", { unique: false });
                objectStoreMyPageButtons.createIndex("ProductId", "ProductId", { unique: false });
                objectStoreMyPageButtons.createIndex("ProductCategoryId", "ProductCategoryId", { unique: false });
                objectStoreMyPageButtons.createIndex("Code", "Code", { unique: false });
            }
            if ($.inArray("ingredientCategories", db.objectStoreNames) == -1) {
                var objectStoreMyIngredientCategories = db.createObjectStore("ingredientCategories", { keyPath: "Id" });
            }
            if ($.inArray("priceLists", db.objectStoreNames) == -1) {
                var objectStoreMyPriceLists = db.createObjectStore("priceLists", { keyPath: "Id" });
                objectStoreMyPriceLists.createIndex("StoreId", "DAStoreId", { unique: false });
            }
            if ($.inArray("discounts", db.objectStoreNames) == -1) {
                var objectStoreMyDiscounts = db.createObjectStore("discounts", { keyPath: "Id" });
            }
            if ($.inArray("messages", db.objectStoreNames) == -1) {
                var objectStoreMyVodafone = db.createObjectStore("messages", { keyPath: "Id" });
            }
            if ($.inArray("vodafone", db.objectStoreNames) == -1) {
                var objectStoreMyVodafone = db.createObjectStore("vodafone", { keyPath: "Id" });
            }
        };
        request.onsuccess = function (event) {
            console.log(request.result);
            db = request.result;
            self.OpenIndexedDBCompleted(true);
            GetConfiguration();
            GetPluginConfiguration();
            GetStorePos();
            GetStatusCancels();
            GetStores();
            GetAllStaff();
            GetIngredientCategories();
            GetPriceLists();
            GetMessages();
            GetVodafone();
        };
        request.onerror = function (event) {
            console.log("Error: " + event.target.error.name + " , Description: " + event.target.error.message);
        };
    };
    // Gets general configuration from API
    // ****************************** //
    function GetConfiguration() {
        var url = localStorage.ApiAddress + "api/v3/Configuration/GetConfiguration/Key/agent";
        var showMessage = true;
        self.communication.Communicate(communicationTypesEnum.Get, url, null, CallbackGetConfiguration, null, showMessage);
    };
    // Progresses initialization
    // ****************************** //
    function CallbackGetConfiguration(configuration) {
        if (configuration.AdministratorPassword !== undefined) {
            localStorage.AdministratorPassword = configuration.AdministratorPassword;
        }
        if (configuration.UpdateShortagesTimer !== undefined) {
            localStorage.UpdateShortagesTimer = configuration.UpdateShortagesTimer;
            localStorage.UpdateShortagesCount = configuration.UpdateShortagesTimer;
        }
        if (configuration.SortStores !== undefined) {
            localStorage.SortStores = configuration.SortStores;
        }
        if (configuration.ScrollableCustomers !== undefined) {
            localStorage.ScrollableCustomers = configuration.ScrollableCustomers;
        }
        if (configuration.AddressInformation !== undefined) {
            localStorage.AddressInformation = configuration.AddressInformation;
        }
        if (configuration.ShowLoyalty !== undefined) {
            localStorage.ShowLoyalty = configuration.ShowLoyalty;
        }
        if (configuration.ShowTelephones !== undefined) {
            localStorage.ShowTelephones = configuration.ShowTelephones;
        }
        if (configuration.ShowEditCustomer !== undefined) {
            localStorage.ShowEditCustomer = configuration.ShowEditCustomer;
        }
        if (configuration.HasTelephoneNumber !== undefined) {
            localStorage.HasCommunicationPhone = configuration.HasTelephoneNumber;
        }
        if (configuration.HasLoyaltyCode !== undefined) {
            localStorage.HasLoyaltyCode = configuration.HasLoyaltyCode;
        }
        if (configuration.NotifyLastOrderNote !== undefined) {
            localStorage.NotifyLastOrderNote = configuration.NotifyLastOrderNote;
        }
        if (configuration.MatchNewAddress !== undefined) {
            localStorage.MatchNewAddressStore = configuration.MatchNewAddress;
        }
        if (configuration.UpdateAddressFromMap !== undefined) {
            localStorage.UpdateAddressMap = configuration.UpdateAddressFromMap;
        }
        if (configuration.ShowAddressOptions !== undefined) {
            localStorage.ShowAddressOptions = configuration.ShowAddressOptions;
        }
        if (configuration.SetAddressPriority !== undefined) {
            localStorage.SetAddressPriority = configuration.SetAddressPriority;
        }
        if (configuration.SelectDeliveryStore !== undefined) {
            localStorage.SelectDeliveryStore = configuration.SelectDeliveryStore;
        }
        if (configuration.ShowModifyOrder !== undefined) {
            localStorage.ShowModifyOrder = configuration.ShowModifyOrder;
        }
        if (configuration.MinimumOrderAmount !== undefined) {
            localStorage.MinimumOrderAmount = configuration.MinimumOrderAmount;
        }
        if (configuration.ShowMessages !== undefined) {
            localStorage.ShowMessages = configuration.ShowMessages;
        }
        if (configuration.CreateMessageOnClear !== undefined) {
            localStorage.CreateMessageOnClear = configuration.CreateMessageOnClear;
        }
        if (configuration.ActiveLoyalty !== undefined) {
            localStorage.ActiveLoyalty = configuration.ActiveLoyalty;
        }
        if (configuration.ApplyLoyaltyPoints !== undefined) {
            localStorage.ApplyLoyaltyPoints = configuration.ApplyLoyaltyPoints;
        }
        if (configuration.OrderNo !== undefined) {
            localStorage.OrderNo = configuration.OrderNo;
        }
        self.GetConfigurationCompleted(true);
    };
    // Gets plugin configuration from API
    // ****************************** //
    function GetPluginConfiguration() {
        GetExternalCustomerConfiguration();
        GetExternalLoyaltyConfiguration();
        GetMapGeocodeConfiguration();
    };
    // Gets external customer configuration from API
    // ****************************** //
    function GetExternalCustomerConfiguration() {
        var url = localStorage.ApiAddress + "api/v3/Configuration/GetConfiguration/Key/" + pluginsEnum.ExternalCustomer;
        var showMessage = false;
        self.communication.Communicate(communicationTypesEnum.Get, url, null, CallbackGetExternalCustomerConfiguration, ErrorCallbackGetExternalCustomerConfiguration, showMessage);
    };
    // Progresses initialization
    // ****************************** //
    function CallbackGetExternalCustomerConfiguration(configuration) {
        if (configuration.GetCustomerData !== undefined) {
            localStorage.NewCustomerData = configuration.GetCustomerData;
        }
        self.GetExternalCustomerCompleted(true);
    };
    // Informs on error at getting external customer configuration from API
    // ****************************** //
    function ErrorCallbackGetExternalCustomerConfiguration(message) {
        localStorage.NewCustomerData = "";
        self.GetExternalCustomerCompleted(true);
    };
    // Gets external loyalty configuration from API
    // ****************************** //
    function GetExternalLoyaltyConfiguration() {
        var url = localStorage.ApiAddress + "api/v3/Configuration/GetConfiguration/Key/" + pluginsEnum.ExternalLoyalty;
        var showMessage = false;
        self.communication.Communicate(communicationTypesEnum.Get, url, null, CallbackGetExternalLoyaltyConfiguration, ErrorCallbackGetExternalLoyaltyConfiguration, showMessage);
    };
    // Progresses initialization
    // ****************************** //
    function CallbackGetExternalLoyaltyConfiguration(configuration) {
        if (configuration.SupplementaryLoyaltyProduct !== undefined) {
            localStorage.SupplementaryLoyaltyProduct = configuration.SupplementaryLoyaltyProduct;
        }
        if (configuration.SupplementaryCouponProduct !== undefined) {
            localStorage.SupplementaryCouponProduct = configuration.SupplementaryCouponProduct;
        }
        self.GetExternalLoyaltyCompleted(true);
    };
    // Informs on error at getting external loyalty configuration from API
    // ****************************** //
    function ErrorCallbackGetExternalLoyaltyConfiguration(message) {
        localStorage.SupplementaryLoyaltyProduct = "";
        localStorage.SupplementaryCouponProduct = "";
        self.GetExternalLoyaltyCompleted(true);
    };
    // Gets map geocode configuration from API
    // ****************************** //
    function GetMapGeocodeConfiguration() {
        var url = localStorage.ApiAddress + "api/v3/Configuration/GetConfiguration/Key/" + pluginsEnum.MapGeocode;
        var showMessage = true;
        self.communication.Communicate(communicationTypesEnum.Get, url, null, CallbackGetMapGeocodeConfiguration, ErrorCallbackGetMapGeocodeConfiguration, showMessage);
    };
    // Progresses initialization
    // ****************************** //
    function CallbackGetMapGeocodeConfiguration(configuration) {
        if (configuration.Geolocation !== undefined) {
            var mapConfiguration = new MapConfigurationModel();
            mapConfiguration.Service = configuration.Geolocation;
            mapConfiguration.Language = configuration.IMapGeocode_Language;
            mapConfiguration.ApiScript = configuration.IMapGeocode_ApiJs;
            mapConfiguration.ApiStyle = configuration.IMapGeocode_MapCss;
            mapConfiguration.ApiFeature = configuration.IMapGeocode_MapFeatures;
            mapConfiguration.ApiKey = configuration.IMapGeocode_ApiKey;
            mapConfiguration.ApiJson = configuration.IMapGeocode_MapInit;
            mapConfiguration.ApiAddressUrl = configuration.IMapGeocode_RequestUrl;
            mapConfiguration.ApiLatitudeLongitudeUrl = configuration.IMapGeocode_UrlLatLng;
            mapConfiguration.RemoveRegions = configuration.IMapGeocode_RemoveRegions;
            localStorage.MapConfiguration = JSON.stringify(mapConfiguration);
        }
        self.GetMapGeocodeCompleted(true);
    };
    // Informs on error at getting map geocode configuration from API
    // ****************************** //
    function ErrorCallbackGetMapGeocodeConfiguration(message) {
        localStorage.MapConfiguration = "";
        $("#emptyMap").modal("show");
    };
    // Gets store and pos configuration from API
    // ****************************** //
    function GetStorePos() {
        var url = localStorage.ApiAddress + "api/v3/Configuration/GetStorePos";
        var showMessage = true;
        self.communication.Communicate(communicationTypesEnum.Get, url, null, CallbackGetStorePos, null, showMessage);
    };
    // Progresses initialization
    // ****************************** //
    function CallbackGetStorePos(storePos) {
        self.storeId = storePos.StoreId;
        self.posId = storePos.PosId;
        self.GetStorePosCompleted(true);
        GetPages();
        GetDiscounts();
    };
    // Gets pages from API
    // ****************************** //
    function GetPages() {
        db.transaction("pages", "readwrite").objectStore("pages").clear();
        var storeId = self.storeId;
        var posId = self.posId;
        var url = localStorage.ApiAddress + "api/pages?storeid=" + storeId + "&posid=" + posId;
        var showMessage = true;
        self.communication.Communicate(communicationTypesEnum.Get, url, null, CallbackGetPages, null, showMessage);
    };
    // Progresses initialization
    // ****************************** //
    function CallbackGetPages(pages) {
        if (pages.length > 0) {
            $.each(pages, function (index, model) {
                var objectStore = db.transaction("pages", "readwrite").objectStore("pages");
                var request = objectStore.put(model);
                request.onsuccess = function (event) {
                    if (index == pages.length - 1) {
                        self.GetPagesCompleted(true);
                    }
                };
            });
        }
        else {
            self.GetPagesCompleted(true);
        }
        GetPageButtons(pages);
    };
    // Gets page buttons from API
    // ****************************** //
    function GetPageButtons(pages) {
        db.transaction("pageButtons", "readwrite").objectStore("pageButtons").clear();
        if (pages.length > 0) {
            self.pagesLength = pages.length;
            ko.utils.arrayForEach(pages, function (p) {
                var storeId = self.storeId;
                var posId = self.posId;
                var pageId = p.Id;
                var priceListId = p.DefaultPriceList;
                var isPos = true;
                var url = localStorage.ApiAddress + "api/pagebutton?storeid=" + storeId + "&pageid=" + pageId + "&pricelistid=" + priceListId + "&posid=" + posId + "&isPos=true";
                var showMessage = true;
                self.communication.Communicate(communicationTypesEnum.Get, url, null, CallbackGetPageButtons, null, showMessage);
            });
        }
        else {
            self.GetPageButtonsCompleted(true);
        }
    };
    // Progresses initialization
    // ****************************** //
    function CallbackGetPageButtons(pagebuttons) {
        if (pagebuttons.length > 0) {
            $.each(pagebuttons, function (index, model) {
                var objectStore = db.transaction("pageButtons", "readwrite").objectStore("pageButtons");
                var request = objectStore.put(model);
                request.onsuccess = function (event) {
                    if (index == pagebuttons.length - 1) {
                        self.pagesLength--;
                        if (self.pagesLength == 0) {
                            self.GetPageButtonsCompleted(true);
                        }
                    }
                };
            });
        }
        else {
            self.GetPageButtonsCompleted(true);
        }
    };
    // Gets discounts from API
    // ****************************** //
    function GetDiscounts() {
        db.transaction("discounts", "readwrite").objectStore("discounts").clear();
        var storeId = self.storeId;
        var url = localStorage.ApiAddress + "api/discount?storeid=" + storeId;
        var showMessage = true;
        self.communication.Communicate(communicationTypesEnum.Get, url, null, CallbackGetDiscounts, null, showMessage);
    };
    // Progresses initialization
    // ****************************** //
    function CallbackGetDiscounts(discounts) {
        if (discounts.length > 0) {
            $.each(discounts, function (index, model) {
                var objectStore = db.transaction("discounts", "readwrite").objectStore("discounts");
                var request = objectStore.put(model);
                request.onsuccess = function (event) {
                    if (index == discounts.length - 1) {
                        self.GetDiscountsCompleted(true);
                    }
                };
            });
        }
        else {
            self.GetDiscountsCompleted(true);
        }
    };
    // Gets statuses available for cancel from API
    // ****************************** //
    function GetStatusCancels() {
        var url = localStorage.ApiAddress + "api/v3/Configuration/GetCancelStatus";
        var showMessage = true;
        self.communication.Communicate(communicationTypesEnum.Get, url, null, CallbackGetStatusCancels, null, showMessage);
    };
    // Progresses initialization
    // ****************************** //
    function CallbackGetStatusCancels(statuses) {
        localStorage.CancelStatuses = JSON.stringify(statuses);
        self.GetStatusCancelsCompleted(true);
    };
    // Gets stores from API
    // ****************************** //
    function GetStores() {
        db.transaction("stores", "readwrite").objectStore("stores").clear();
        var url = localStorage.ApiAddress + "api/v3/da/Stores/GetStores";
        var showMessage = true;
        self.communication.Communicate(communicationTypesEnum.Get, url, null, CallbackGetStores, null, showMessage);
    };
    // Progresses initialization
    // ****************************** //
    function CallbackGetStores(stores) {
        if (stores.length > 0) {
            $.each(stores, function (index, model) {
                var objectStore = db.transaction("stores", "readwrite").objectStore("stores");
                var request = objectStore.put(model);
                request.onsuccess = function (event) {
                    if (index == stores.length - 1) {
                        self.GetStoresCompleted(true);
                    }
                };
            });
        }
        else {
            self.GetStoresCompleted(true);
        }
    };
    // Gets all staff from API
    // ****************************** //
    function GetAllStaff() {
        db.transaction("staff", "readwrite").objectStore("staff").clear();
        var url = localStorage.ApiAddress + "api/v3/Staff/GetAllStaff";
        var showMessage = true;
        self.communication.Communicate(communicationTypesEnum.Get, url, null, CallbackGetAllStaff, null, showMessage);
    };
    // Progresses initialization
    // ****************************** //
    function CallbackGetAllStaff(staff) {
        if (staff.length > 0) {
            $.each(staff, function (index, model) {
                var objectStore = db.transaction("staff", "readwrite").objectStore("staff");
                var request = objectStore.put(model);
                request.onsuccess = function (event) {
                    if (index == staff.length - 1) {
                        self.GetStaffCompleted(true);
                    }
                };
            });
        }
        else {
            self.GetStaffCompleted(true);
        }
    };
    // Gets ingredient categories from API
    // ****************************** //
    function GetIngredientCategories() {
        db.transaction("ingredientCategories", "readwrite").objectStore("ingredientCategories").clear();
        var url = localStorage.ApiAddress + "api/v3/IngredientCategories/GetAllIngredientCategories";
        var showMessage = true;
        self.communication.Communicate(communicationTypesEnum.Get, url, null, CallbackGetIngredientCategories, null, showMessage);
    };
    // Progresses initialization
    // ****************************** //
    function CallbackGetIngredientCategories(ingredientCategories) {
        if (ingredientCategories.length > 0) {
            $.each(ingredientCategories, function (index, model) {
                var objectStore = db.transaction("ingredientCategories", "readwrite").objectStore("ingredientCategories");
                var request = objectStore.put(model);
                request.onsuccess = function (event) {
                    if (index == ingredientCategories.length - 1) {
                        self.GetIngredientCategoriesCompleted(true);
                    }
                };
            });
        }
        else {
            self.GetIngredientCategoriesCompleted(true);
        }
    };
    // Gets pricelists per store from API
    // ****************************** //
    function GetPriceLists() {
        db.transaction("priceLists", "readwrite").objectStore("priceLists").clear();
        var url = localStorage.ApiAddress + "api/v3/da/PricelistStore/GetList";
        var showMessage = true;
        self.communication.Communicate(communicationTypesEnum.Get, url, null, CallbackGetPriceLists, null, showMessage);
    };
    // Progresses initialization
    // ****************************** //
    function CallbackGetPriceLists(priceLists) {
        if (priceLists.length > 0) {
            $.each(priceLists, function (index, model) {
                var objectStore = db.transaction("priceLists", "readwrite").objectStore("priceLists");
                var request = objectStore.put(model);
                request.onsuccess = function (event) {
                    if (index == priceLists.length - 1) {
                        self.GetPriceListsCompleted(true);
                    }
                };
            });
        }
        else {
            self.GetPriceListsCompleted(true);
        }
    };
    // Gets messages from API
    // ****************************** //
    function GetMessages() {
        db.transaction("messages", "readwrite").objectStore("messages").clear();
        var url = localStorage.ApiAddress + "api/v3/da/CustomerMessages/GetAllMessages";
        var showMessage = true;
        self.communication.Communicate(communicationTypesEnum.Get, url, null, CallbackGetMessages, null, showMessage);
    };
    // Progresses initialization
    // ****************************** //
    function CallbackGetMessages(messages) {
        if (messages.length > 0) {
            $.each(messages, function (index, model) {
                var objectStore = db.transaction("messages", "readwrite").objectStore("messages");
                var request = objectStore.put(model);
                request.onsuccess = function (event) {
                    if (index == messages.length - 1) {
                        self.GetMessagesCompleted(true);
                    }
                };
            });
        }
        else {
            self.GetMessagesCompleted(true);
        }
    };
    // Gets vodafone discounts
    // ****************************** //
    function GetVodafone() {
        var url = localStorage.ApiAddress + "api/v3/da/promos/vodafone11";
        var showMessage = true;
        self.communication.Communicate(communicationTypesEnum.Get, url, null, CallbackGetVodafone, null, showMessage);
    };
    // Progresses initialization
    // ****************************** //
    function CallbackGetVodafone(vodafoneDiscounts) {
        if (vodafoneDiscounts.length > 0) {
            $.each(vodafoneDiscounts, function (index, model) {
                var objectStore = db.transaction("vodafone", "readwrite").objectStore("vodafone");
                var request = objectStore.put(model);
                request.onsuccess = function (event) {
                    if (index == vodafoneDiscounts.length - 1) {
                        self.GetVodafoneCompleted(true);
                    }
                };
            });
        }
        else {
            self.GetVodafoneCompleted(true);
        }
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
        var name = "Agent_0";
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