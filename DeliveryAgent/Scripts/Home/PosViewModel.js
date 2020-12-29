function PosViewModel() {
    // ----- PROPERTIES ----- //
    var self = this;
    self.currentStaff = ko.observable(null);
    self.selectedPhone = ko.observable(null);
    self.failedOrders = ko.observableArray([]);
    self.computedClock = ko.observable(moment().format("HH:mm"));
    self.activeLoyalty = ko.observable(loyaltyTypeEnum.Hit);
    self.storeSort = null;
    self.hasCommunicationPhone = ko.observable(false);
    self.hasLoyaltyCode = ko.observable(false);
    self.selectDeliveryStore = false;
    self.minimumOrderAmount = ko.observable(0);
    self.applyLoyaltyPoints = true;
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
    self.pageResizedForPages = ko.observable(false);
    self.pageResizedForPageButtons = ko.observable(false);
    self.pageResizedForPageButtonDetails = ko.observable(false);
    self.selectedCustomer = ko.observable(null);
    self.selectedOrder = ko.observable(null);
    self.cancelSelectedOrder = false;
    self.pages = ko.observableArray([]);
    self.selectedPage = ko.observable(null);
    self.productSearchInput = null;
    self.searchedProducts = ko.observableArray([]);
    self.dispayAllExtras = ko.observable(false);
    self.selectedPageButtonDetail = ko.observable(null);
    self.ingredientSearchInput = null;
    self.selectedQuantity = ko.observable(1);
    self.stores = ko.observableArray([]);
    self.ingredientCategories = [];
    self.priceLists = ko.observableArray([]);
    self.selectedPriceList = ko.observable(null);
    self.discounts = ko.observableArray([]);
    self.discountOrigin = null;
    self.selectedDiscount = ko.observable(null);
    self.selectedDiscountTotal = ko.observable(null);
    self.loyaltyOrigin = null;
    self.selectedLoyaltyDiscountTotal = ko.observable(null);
    self.orderItems = ko.observableArray([]);
    self.selectedOrderItem = ko.observable(null);
    self.selectedOrderItemAvailableExtras = ko.observableArray([]);
    self.showRecipe = ko.observable(false);
    self.selectedPageButton = ko.observable(null);
    self.orderItemsToRestore = [];
    self.vodafoneCodesToRestore = [];
    self.updatingCustomer = ko.observable(false);
    self.storeStatusOptions = ko.observable({
        0: language.Translate("Closed", null),
        1: language.Translate("Delivery", null),
        2: language.Translate("TakeOut", null),
        4: language.Translate("FullFunction", null)
    });
    self.accountTypes = ko.observableArray([
        { Description: language.Translate("Cash", null), Type: 1 },
        { Description: language.Translate("CreditCard", null), Type: 4 }
    ]);
    self.selectedAccountType = ko.observable(null);
    self.saleTypes = ko.observableArray([
        { Description: language.Translate("Delivery", null), Type: 20 },
        { Description: language.Translate("TakeOut", null), Type: 21 }
    ]);
    self.selectedSaleType = ko.observable(null);
    self.invoiceTypes = ko.observableArray([
        { Description: language.Translate("Receipt", null), Type: 1 },
        { Description: language.Translate("Bill", null), Type: 7 }
    ]);
    self.selectedInvoiceType = ko.observable(null);
    self.selectedDelay = ko.observable(null);
    self.isPaid = ko.observable(false);
    self.selectedOrderRemark = null;
    self.loyaltyOptions = ko.observable(null);
    self.vodafoneDiscounts = ko.observableArray([]);
    self.vodafoneCodeInput = ko.observable(null);
    self.insertedVodafoneCodes = [];
    self.sendingOrder = ko.observable(false);
    self.showMessages = ko.observable(true);
    self.createMessageOnClear = false;
    // ----- MODULES ----- //
    self.communication = new CustomCommunication();
    self.keyboard = new CustomKeyboard();
    self.dateTimePicker = new CustomDateTimePicker();
    self.navigation = new CustomNavigation();
    self.pagesPagination = new CustomPagination(self.communication);
    self.pageButtonsPagination = new CustomPagination(self.communication);
    self.pageButtonDetailsPagination = new CustomPagination(self.communication);
    self.signalR = new CustomSignalR();
    self.loyaltyGoodys = new CustomGoodys(self.communication, false, true);
    // ----- COMPUTED PROPERTIES ----- //
    // Defines page multitude
    // ****************************** //
    self.pageSize = ko.computed(function () {
        var resized = self.pageResizedForPages();
        var multitude = 6;
        var element = document.getElementById("pageContainer");
        if (element != null) {
            var width = element.clientWidth;
            var height = element.clientHeight;
            var widthMultitude = Math.floor(width / 95);
            var heightMultitude = Math.floor(height / height);
            multitude = widthMultitude * heightMultitude;
        }
        self.pageResizedForPages(false);
        return multitude;
    });
    // Defines page button multitude
    // ****************************** //
    self.pageButtonSize = ko.computed(function () {
        var resized = self.pageResizedForPageButtons();
        var multitude = 36;
        var element = document.getElementById("pageButtonContainer");
        if (element != null) {
            var width = element.clientWidth - (2 * (element.clientWidth * 0.005));
            var height = element.clientHeight - (2 * (element.clientHeight * 0.005));
            var widthMultitude = Math.floor(width / 95);
            var heightMultitude = Math.floor(height / 85);
            multitude = widthMultitude * heightMultitude;
        }
        self.pageResizedForPageButtons(false);
        return multitude;
    });
    // Defines page button detail multitude
    // ****************************** //
    self.pageButtonDetailSize = ko.computed(function () {
        if (self.dispayAllExtras()) {
            var resized = self.pageResizedForPageButtonDetails();
            var multitude = 999;
            self.pageResizedForPageButtonDetails(false);
            return multitude;
        }
        else {
            var resized = self.pageResizedForPageButtonDetails();
            var multitude = 12;
            var element = document.getElementById("pageButtonDetailContainer");
            if (element != null) {
                var width = element.clientWidth - (2 * (element.clientWidth * 0.005));
                var height = element.clientHeight - (2 * (element.clientHeight * 0.005));
                var widthMultitude = Math.floor(width / 120);
                var heightMultitude = Math.floor(height / 40);
                multitude = widthMultitude * heightMultitude;
            }
            self.pageResizedForPageButtonDetails(false);
            return multitude;
        }
    });
    // Calculates total amount to pay
    // ****************************** //
    self.total = ko.computed(function () {
        var items = self.orderItems();
        var total = 0;
        ko.utils.arrayForEach(items, function (i) {
            total = total + i.Total();
            ko.utils.arrayForEach(i.Extras(), function (e) {
                total = total + e.Total();
            });
        });
        if (self.selectedDiscountTotal() != null) {
            total = total - self.selectedDiscountTotal().Amount;
        }
        if (self.activeLoyalty() == loyaltyTypeEnum.Hit && self.selectedLoyaltyDiscountTotal() != null) {
            total = total - self.selectedLoyaltyDiscountTotal().Amount;
        }
        else if (self.activeLoyalty() == loyaltyTypeEnum.Goodys && self.loyaltyGoodys.couponDiscount() != 0) {
            total = total - self.loyaltyGoodys.couponDiscount();
        }
        return parseFloat(total.toFixed(2));
    });
    // Calculates total discount
    // ****************************** //
    self.discount = ko.computed(function () {
        var discount = 0;
        if (self.selectedDiscountTotal() != null) {
            discount = discount + self.selectedDiscountTotal().Amount;
        }
        if (self.activeLoyalty() == loyaltyTypeEnum.Hit && self.selectedLoyaltyDiscountTotal() != null) {
            discount = discount + self.selectedLoyaltyDiscountTotal().Amount;
        }
        else if (self.activeLoyalty() == loyaltyTypeEnum.Goodys && self.loyaltyGoodys.couponDiscount() != 0) {
            discount = discount + self.loyaltyGoodys.couponDiscount();
        }
        return parseFloat(discount.toFixed(2));
    });
    // Calculates change
    // ****************************** //
    self.change = ko.computed(function () {
        return 0;// TODO
    });
    // Checks if there are loyalty order items
    // ****************************** //
    self.hasLoyalty = ko.computed(function () {
        var foundLoyaltyItem = ko.utils.arrayFirst(self.orderItems(), function (i) {
            return i.IsLoyalty();
        });
        if (foundLoyaltyItem != null) {
            return true;
        }
        else {
            return false;
        }
    });
    // Checks if there are vodafone order items
    // ****************************** //
    self.hasVodafone = ko.computed(function () {
        var foundVodafoneItem = ko.utils.arrayFirst(self.orderItems(), function (i) {
            return i.IsVodafone();
        });
        if (foundVodafoneItem != null) {
            return true;
        }
        else {
            return false;
        }
    });
    // ----- INTERVAL FUNCTIONS ----- //
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
    // Redefines view
    // ****************************** //
    self.OnResize = function () {
        // TODO
    };
    // Searches for products in indexed DB
    // ****************************** //
    self.SearchProduct = function () {
        if (self.productSearchInput == null || self.productSearchInput == "") {
            return;
        }
        if (self.dispayAllExtras()) {
            self.HideAllPageButtonDetails();
        }
        self.searchedProducts([]);
        db.transaction("pageButtons").objectStore("pageButtons").openCursor().onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor != null) {
                var pageButton = new PageButtonModel(cursor.value);
                if (pageButton.Description.toLowerCase().startsWith(self.productSearchInput.toLowerCase()) || pageButton.Description.toLowerCase().includes(self.productSearchInput.toLowerCase())) {
                    self.searchedProducts.push(pageButton);
                }
                cursor.continue();
            }
            else {
                if (self.pagesPagination.allEntities[self.pagesPagination.allEntities.length - 1].Id == null) {
                    HideSearchedProducts(null);
                }
                DisplaySearchedProducts(self.productSearchInput);
                self.productSearchInput = null;
                var element = document.getElementById("searchProduct");
                if (element != null) {
                    element.value = self.productSearchInput;
                }
            }
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
    // Selects page
    // ****************************** //
    self.SelectPage = function (page) {
        page.PageButtons.sort(function (left, right) { return left.Sort == right.Sort ? 0 : (left.Sort < right.Sort ? -1 : 1) });
        self.selectedPage(page);
        self.pageButtonsPagination.Initialize();
        self.pageButtonsPagination.NoSearchEntities(page.PageButtons, self.pageButtonSize());
        if (page.Id != null && self.pagesPagination.allEntities[self.pagesPagination.allEntities.length - 1].Id == null) {
            HideSearchedProducts(page);
        }
    };
    // Selects page button
    // ****************************** //
    self.SelectPageButton = function (pageButton, showExtras) {
        // TODO add more logic
        switch (pageButton.Type) {
            case pageButtonType.Empty:
                break;
            case pageButtonType.Product:
                SelectProduct(pageButton, showExtras);
                break;
            case pageButtonType.SaleType:
                break;
            case pageButtonType.Navigate:
                SelectNavigate(pageButton);
                break;
            case pageButtonType.NavigateWithPriceList:
                break;
            case pageButtonType.PriceList:
                break;
            case pageButtonType.OpenItem:
                break;
            case pageButtonType.KitchenInstruction:
                break;
            case pageButtonType.WeightedItem:
                break;
            case pageButtonType.WeightedOpenItem:
                break;
            default:
                break;
        }
    };
    // Selects page button detail
    // ****************************** //
    self.SelectPageButtonDetail = function (pageButtonDetail, action) {
        if (self.selectedOrderItem().IsGoodys()) {
            toastr.info(language.Translate("DenyLoyaltyGoodysProductExtra", null));
            return;
        }
        self.selectedPageButtonDetail(pageButtonDetail);
        switch (action) {
            case extraAction.Add:
                AddExtra(pageButtonDetail);
                break;
            case extraAction.Remove:
                RemoveExtra(pageButtonDetail);
                break;
            default:
                break;
        }
    };
    // Shows all page button details
    // ****************************** //
    self.ShowAllPageButtonDetails = function () {
        if (self.pageButtonDetailsPagination.allEntities.length > 0) {
            self.dispayAllExtras(true);
            var pageButtonDetails = self.pageButtonDetailsPagination.allEntities;
            self.pageButtonDetailsPagination.Initialize();
            self.pageButtonDetailsPagination.NoSearchEntities(pageButtonDetails, self.pageButtonDetailSize());
            $("#allPageButtonDetails").slideToggle("750", "swing");
        }
    };
    // Filters ingredients
    // ****************************** //
    self.SearchIngredient = function () {
        var element = document.getElementById("searchIngredient");
        if (element != null) {
            self.ingredientSearchInput = element.value;
        }
        self.pageButtonDetailsPagination.Filter(filterKeysEnum.IngredientDescription, null, self.ingredientSearchInput);
    };
    // Hides all page button details
    // ****************************** //
    self.HideAllPageButtonDetails = function () {
        self.dispayAllExtras(false);
        var pageButtonDetails = self.pageButtonDetailsPagination.allEntities;
        self.pageButtonDetailsPagination.Initialize();
        self.pageButtonDetailsPagination.NoSearchEntities(pageButtonDetails, self.pageButtonDetailSize());
        $("#allPageButtonDetails").slideToggle("750", "swing");
    };
    // Selects quantity
    // ****************************** //
    self.SelectQuantity = function (quantity) {
        self.selectedQuantity(quantity);
    };
    // Selects price list
    // ****************************** //
    self.SelectPriceList = function (priceList) {
        self.selectedPriceList(priceList);
    };
    // Calculates selected order item total
    // ****************************** //
    self.CalculateSelectedOrderItemTotals = function () {
        if (self.selectedOrderItem().Quantity() == 0) {
            self.RemoveSelectedOrderItem();
        }
        else {
            var total = (self.selectedOrderItem().Quantity() * self.selectedOrderItem().Price()) - self.selectedOrderItem().Discount();
            self.selectedOrderItem().Total(parseFloat(total.toFixed(2)));
            var extrasDiscount = 0;
            var extrasTotal = 0;
            ko.utils.arrayForEach(self.selectedOrderItem().Extras(), function (e) {
                var extraTotal = e.Quantity() * e.Price() * self.selectedOrderItem().Quantity();
                e.Total(parseFloat(extraTotal.toFixed(2)));
                extrasDiscount = extrasDiscount + (e.StartPrice - e.Price());
                extrasTotal = extrasTotal + extraTotal;
            });
            var discountWithExtras = self.selectedOrderItem().Discount() + extrasDiscount;
            self.selectedOrderItem().DiscountWithExtras(parseFloat(discountWithExtras.toFixed(2)));
            var totalWithExtras = total + extrasTotal;
            self.selectedOrderItem().TotalWithExtras(parseFloat(totalWithExtras.toFixed(2)));
        }
    };
    // Changes quantity of order item
    // ****************************** //
    self.ChangeOrderItemQuantity = function (orderItem, row) {
        if (orderItem.IsLoyalty()) {
            toastr.info(language.Translate("DenyLoyaltyProductQuantityChange", null));
            return;
        }
        else if (orderItem.IsGoodys()) {
            toastr.info(language.Translate("DenyLoyaltyGoodysProductQuantityChange", null));
            return;
        }
        else if (orderItem.IsVodafone()) {
            toastr.info(language.Translate("DenyVodafoneProductQuantityChange", null));
            return;
        }
        self.keyboard.InitializeKeyboard(orderItem, 'Quantity', 'orderItemQuantityInputRow' + row, 'orderItemQuantityRow' + row, self.UpdateOrderItemQuantity.bind(this, orderItem), null, keyboardTypesEnum.Numeric);
    };
    // Updates quantity of order item
    // ****************************** //
    self.UpdateOrderItemQuantity = function (orderItem) {
        var previousOrderItem = self.selectedOrderItem();
        self.selectedOrderItem(orderItem);
        self.CalculateSelectedOrderItemTotals();
        self.selectedOrderItem(previousOrderItem);
    };
    // Opens modify order item modal
    // ****************************** //
    self.ModifyOrderItem = function (orderItem) {
        if (self.activeLoyalty() == loyaltyTypeEnum.Hit && self.selectedCustomer() != null && self.selectedCustomer().Customer.Loyalty) {
            GetLoyaltyOptions();
        }
        var objectStore = db.transaction(["pageButtons"], "readwrite").objectStore("pageButtons").index("ProductId");
        var request = objectStore.openCursor(orderItem.ProductId);
        request.onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor != null) {
                self.selectedOrderItem(orderItem);
                var pageButton = new PageButtonModel(cursor.value);
                self.selectedOrderItemAvailableExtras([]);
                if (pageButton.PageButtonDetail.length > 0) {
                    ko.utils.arrayForEach(pageButton.PageButtonDetail, function (d) {
                        var minusEnabled = d.Type == pageButtonDetailType.Recipe ? true : false;
                        d.MinusEnabled(minusEnabled);
                        var plusEnabled = true;
                        d.PlusEnabled(plusEnabled);
                        self.selectedOrderItemAvailableExtras.push(d);
                    });
                }
                if (self.selectedOrderItem().Extras().length > 0) {
                    ko.utils.arrayForEach(self.selectedOrderItem().Extras(), function (e) {
                        var foundExtra = ko.utils.arrayFirst(self.selectedOrderItemAvailableExtras(), function (ae) {
                            return e.IngredientId == ae.IngredientId;
                        });
                        if (foundExtra != null) {
                            if (e.Quantity() == foundExtra.MaxQty) {
                                foundExtra.PlusEnabled(false);
                            }
                            if (e.Quantity() == foundExtra.MinQty || e.Quantity() == -1) {
                                foundExtra.MinusEnabled(false);
                            }
                            if (e.Quantity() == 0 && pageButtonDetail.Type == pageButtonDetailType.Recipe) {
                                foundExtra.MinusEnabled(true);
                            }
                        }
                        if (e.IngredientCategoryId != null) {
                            ko.utils.arrayForEach(self.selectedOrderItemAvailableExtras(), function (eae) {
                                if (eae.IngredientCategoryId == e.IngredientCategoryId && eae.IngredientId != e.IngredientId) {
                                    eae.PlusEnabled(false);
                                }
                            });
                        }
                    });
                }
                self.selectedPageButtonDetail(null);
                $("#modifyOrderItem").modal("show");
            }
        };
    };
    // Clears extra from selected order item
    // ****************************** //
    self.ClearExtra = function (orderItemExtra) {
        var foundExtra = ko.utils.arrayFirst(self.selectedOrderItemAvailableExtras(), function (e) {
            return e.IngredientId == orderItemExtra.IngredientId;
        });
        if (foundExtra != null) {
            foundExtra.MinusEnabled(false);
            foundExtra.PlusEnabled(true);
            if (foundExtra.Type == pageButtonDetailType.Recipe) {
                foundExtra.MinusEnabled(true);
            }
        }
        self.selectedOrderItem().Extras.splice(self.selectedOrderItem().Extras.indexOf(orderItemExtra), 1);
        self.CalculateSelectedOrderItemTotals();
        ApplyExtrasCompatibility(null, orderItemExtra.IngredientCategoryId, orderItemExtra.IngredientId);
        RemoveVodafoneDiscounts();
    };
    // Opens discount modal
    // ****************************** //
    self.OpenDiscounts = function (discountOrigin) {
        self.discountOrigin = discountOrigin;
        if (self.discountOrigin == discountOriginEnum.Item && self.activeLoyalty() == loyaltyTypeEnum.Hit && self.selectedOrderItem().IsLoyalty()) {
            toastr.info(language.Translate("DenyLoyaltyProductDiscountAddition", null));
            return;
        }
        else if (self.discountOrigin == discountOriginEnum.Item && self.activeLoyalty() == loyaltyTypeEnum.Goodys && self.selectedOrderItem().IsGoodys()) {
            toastr.info(language.Translate("DenyLoyaltyGoodysProductDiscountAddition", null));
            return;
        }
        else if (self.discountOrigin == discountOriginEnum.Item && self.selectedOrderItem().IsVodafone()) {
            toastr.info(language.Translate("DenyVodafoneProductDiscountAddition", null));
            return;
        }
        else if (self.discountOrigin == discountOriginEnum.Total && self.activeLoyalty() == loyaltyTypeEnum.Hit && self.selectedLoyaltyDiscountTotal() != null && self.selectedLoyaltyDiscountTotal().Amount != 0) {
            toastr.info(language.Translate("IncompatibleDiscountLoyalty", null));
            return;
        }
        else if (self.discountOrigin == discountOriginEnum.Total && self.activeLoyalty() == loyaltyTypeEnum.Goodys && self.loyaltyGoodys.couponDiscount() != 0) {
            toastr.info(language.Translate("IncompatibleDiscountGoodysLoyalty", null));
            return;
        }
        $("#discounts").modal("show");
    };
    // Selects discount
    // ****************************** //
    self.SelectDiscount = function (discount) {
        self.selectedDiscount(discount);
    };
    // Applies selected discount
    // ****************************** //
    self.ApplyDiscount = function () {
        if (self.selectedDiscount() != null) {
            switch (self.discountOrigin) {
                case discountOriginEnum.Item:
                    ApplyItemDiscount();
                    break;
                case discountOriginEnum.Total:
                    ApplyTotalDiscount();
                    break;
                default:
                    break;
            }
        }
        self.CloseDiscounts();
    };
    // Removes discount
    // ****************************** //
    self.RemoveDiscount = function () {
        switch (self.discountOrigin) {
            case discountOriginEnum.Item:
                self.selectedOrderItem().Discount(0);
                self.selectedOrderItem().DiscountId = null;
                ko.utils.arrayForEach(self.selectedOrderItem().Extras(), function (e) {
                    e.Price(e.StartPrice);
                });
                self.CalculateSelectedOrderItemTotals();
                break;
            case discountOriginEnum.Total:
                self.selectedDiscountTotal(null);
                break;
            default:
                break;
        }
        self.CloseDiscounts();
    };
    // Closes discount modal
    // ****************************** //
    self.CloseDiscounts = function () {
        self.discountOrigin = null;
        self.selectedDiscount(null);
        $("#discounts").modal("hide");
    };
    // Removes selected order item
    // ****************************** //
    self.RemoveSelectedOrderItem = function () {
        if (self.selectedOrderItem().IsGoodys()) {
            toastr.info(language.Translate("DenyLoyaltyGoodysProductRemove", null));
            return;
        }
        RemoveOrderItem(self.selectedOrderItem());
        $("#modifyOrderItem").modal("hide");
    };
    // Returns selected order item
    // ****************************** //
    self.ReturnSelectedOrderItem = function () {
        if (self.selectedOrderItem().IsLoyalty()) {
            toastr.info(language.Translate("DenyLoyaltyProductReturn", null));
            return;
        }
        else if (self.selectedOrderItem().IsGoodys()) {
            toastr.info(language.Translate("DenyLoyaltyGoodysProductReturn", null));
            return;
        }
        else if (self.selectedOrderItem().IsVodafone()) {
            toastr.info(language.Translate("DenyVodafoneProductReturn", null));
            return;
        }
        ReturnOrderItem(self.selectedOrderItem());
        $("#modifyOrderItem").modal("hide");
    };
    // Closes modify order item modal
    // ****************************** //
    self.ModifyOrderItemComplete = function () {
        $("#modifyOrderItem").modal("hide");
        var lastItem = self.orderItems()[self.orderItems().length - 1];
        if (self.selectedOrderItem() == lastItem) {
            ko.utils.arrayForEach(self.pageButtonDetailsPagination.allEntities, function (e) {
                var foundExtra = ko.utils.arrayFirst(self.selectedOrderItemAvailableExtras(), function (ae) {
                    return e.IngredientId == ae.IngredientId;
                });
                if (foundExtra != null) {
                    e.MinusEnabled(foundExtra.MinusEnabled());
                    e.PlusEnabled(foundExtra.PlusEnabled());
                }
            });
        }
        self.selectedOrderItem(lastItem);
        self.selectedOrderItemAvailableExtras([]);
        self.selectedPageButtonDetail(null);
    };
    // Opens minimum amount notification modal or opens complete order modal
    // ****************************** //
    self.CompleteOrder = function () {
        if (self.sendingOrder()) {
            return;
        }
        if (self.selectedCustomer() != null && self.selectedCustomer().Store == null) {
            toastr.warning(language.Translate("ChooseStore", null));
            return;
        }
        if (self.orderItems().length > 0) {
            if (self.minimumOrderAmount() != 0 && self.total() < self.minimumOrderAmount()) {
                $("#minimumOrderNotification").modal("show");
            }
            else {
                ShowCurrentOrder();
            }
        }
    };
    // Closes minimum amount notification modal and opens complete order modal
    // ****************************** //
    self.MinimumOrderAmountConfirm = function () {
        $("#minimumOrderNotification").modal("hide");
        ShowCurrentOrder();
    };
    // Closes minimum amount notification modal
    // ****************************** //
    self.MinimumOrderAmountCancel = function () {
        $("#minimumOrderNotification").modal("hide");
    };
    // Selects account type
    // ****************************** //
    self.SelectAccountType = function (accountType) {
        self.selectedAccountType(accountType);
    };
    // Selects sale type
    // ****************************** //
    self.SelectSaleType = function (saleType) {
        self.selectedSaleType(saleType);
        if (saleType.Type == saleTypeEnum.Delivery) {
            if (self.selectedCustomer() != null) {
                self.selectedCustomer().Store = null;
                self.selectedCustomer.notifySubscribers();
                var address = self.selectedCustomer().Address;
                if (address != null) {
                    GetStoreForCustomerAddress(address.Id);
                }
                self.selectedPriceList(null);
            }
        }
        else if (saleType.Type == saleTypeEnum.Takeout) {
            toastr.warning(language.Translate("SelectStore", null));
            $("#customerAddressesStore").modal("show");
            GetPriceListForCustomerStoreSaleType();
        }
    };
    // Selects invoice type
    // ****************************** //
    self.SelectInvoiceType = function (invoiceType) {
        if (invoiceType.Type == invoiceTypeEnum.Bill && (self.selectedCustomer() == null || self.selectedCustomer().BillingAddress == null)) {
            toastr.info(language.Translate("BillWithoutBillingAddress", { description: invoiceType.Description }));
            return;
        }
        self.selectedInvoiceType(invoiceType);
        if (invoiceType.Type == invoiceTypeEnum.Bill) {
            toastr.warning(language.Translate("SelectBillingAddress", null));
            $("#customerAddressesStore").modal("show");
        }
    };
    // Selects delay time
    // ****************************** //
    self.SelectDelay = function () {
        var element = "delayDateTimePicker";
        var input = "delayDateTimePickerInput";
        var button = "delayDateTimePickerButton";
        var pickerType = pickerTypesEnum.Time;
        var startDate = self.selectedDelay().TargetDate();
        var dataToChange = self.selectedDelay();
        var fieldToChange = "TargetDate";
        self.dateTimePicker.InitializeDateTimePicker(element, input, button, pickerType, startDate, dataToChange, fieldToChange, null);
    };
    // Posts order to API
    // ****************************** //
    self.CompleteOrderConfirm = function () {
        if (self.sendingOrder()) {
            return;
        }
        self.sendingOrder(true);
        var orderId = self.selectedOrder() != null ? self.selectedOrder().Id : 0;
        var customer = self.selectedCustomer().Customer;
        var address = self.selectedCustomer().Address;
        var billingAddress = self.selectedInvoiceType().Type == invoiceTypeEnum.Bill ? self.selectedCustomer().BillingAddress : null;
        var communicationPhone = self.hasCommunicationPhone() ? self.selectedCustomer().CommunicationPhone : null;
        var store = self.selectedCustomer().Store;
        var invoice = self.selectedInvoiceType();
        var payment = self.selectedAccountType();
        var sale = self.selectedSaleType();
        var remarks = self.selectedOrderRemark;
        var total = self.total();
        var discount = {};
        discount.Amount = self.discount();
        discount.Remark = self.selectedDiscountTotal() != null ? self.selectedDiscountTotal().Remark : self.activeLoyalty() == loyaltyTypeEnum.Hit && self.selectedLoyaltyDiscountTotal() != null ? self.selectedLoyaltyDiscountTotal().Remark : "";
        var delay = self.selectedDelay();
        var isPaid = self.isPaid();
        var items = self.orderItems();
        switch (self.activeLoyalty()) {
            case loyaltyTypeEnum.Hit:
                var loyalty = self.selectedLoyaltyDiscountTotal();
                break;
            case loyaltyTypeEnum.Goodys:
                var loyalty = self.loyaltyGoodys.GetAppliedDiscount();
                break;
            default:
                var loyalty = null;
                break;
        }
        var loyaltyCode = self.hasLoyaltyCode() ? self.selectedCustomer().LoyaltyCode : null;
        var vodafone = self.insertedVodafoneCodes.length > 0 ? self.insertedVodafoneCodes : null;
        var applyLoyaltyPoints = self.applyLoyaltyPoints;
        var orderNo = self.selectedOrder() != null ? self.selectedOrder().OrderNo : null;
        var hasChanged = self.selectedOrder() != null ? true : false;
        var previousDate = self.selectedOrder() != null ? self.selectedOrder().StartDate : null;
        var staff = self.currentStaff();
        var agentPhone = self.selectedPhone();
        var paymentId = self.selectedOrder() != null ? self.selectedOrder().PaymentId : null;
        var metadata = self.selectedOrder() != null ? self.selectedOrder().Metadata : null;
        var order = new PostOrderModel(orderId, customer, address, billingAddress, communicationPhone, store, invoice, payment, sale, remarks, total, discount, delay, isPaid, items, loyalty, loyaltyCode, vodafone, applyLoyaltyPoints, orderNo, hasChanged, previousDate, staff, agentPhone, paymentId, metadata);
        if (self.selectedOrder() != null) {
            if (self.selectedOrder().StoreId == self.selectedCustomer().Store.Id) {
                var url = localStorage.ApiAddress + "api/v3/da/Orders/Update";
            }
            else {
                self.cancelSelectedOrder = true;
                var url = localStorage.ApiAddress + "api/v3/da/Orders/Add";
                CancelSelectedOrder();
            }
        }
        else {
            var url = localStorage.ApiAddress + "api/v3/da/Orders/Add";
        }
        var cancelSelectedOrderComplete = setInterval(function () {
            if (!self.cancelSelectedOrder) {
                clearInterval(cancelSelectedOrderComplete);
                var showMessage = true;
                self.communication.Communicate(communicationTypesEnum.Post, url, order, CallbackCompleteOrderConfirm, ErrorCallbackCompleteOrderConfirm, showMessage);
                if (self.activeLoyalty() == loyaltyTypeEnum.Goodys && self.loyaltyGoodys.isLoyalty()) {
                    self.loyaltyGoodys.HideLoyaltyInformation();
                }
                $("#completeOrder").modal("hide");
            }
        }, 50);
    };
    // Opens complete order modal
    // ****************************** //
    self.CompleteOrderCancel = function () {
        if (self.sendingOrder()) {
            return;
        }
        self.discountOrigin = discountOriginEnum.Total;
        self.RemoveDiscount();
        if (self.activeLoyalty() == loyaltyTypeEnum.Hit && self.loyaltyOptions() != null && self.loyaltyOptions().RedeemDiscount != null && self.loyaltyOptions().RedeemDiscount.IsChecked()) {
            var spentPoints = self.loyaltyOptions().SpentPoints() - self.loyaltyOptions().RedeemDiscount.Points;
            self.loyaltyOptions().SpentPoints(spentPoints);
            self.selectedLoyaltyDiscountTotal().Amount = self.selectedLoyaltyDiscountTotal().Amount - self.loyaltyOptions().RedeemDiscount.MaxDiscountAmount;
            self.selectedLoyaltyDiscountTotal().Points = self.selectedLoyaltyDiscountTotal().Points - self.loyaltyOptions().RedeemDiscount.Points;
            self.selectedLoyaltyDiscountTotal.notifySubscribers();
        }
        else if (self.activeLoyalty() == loyaltyTypeEnum.Goodys && self.loyaltyGoodys.isLoyalty()) {
            self.loyaltyGoodys.HideLoyaltyInformation();
        }
        $("#completeOrder").modal("hide");
    };
    // Opens clear order modal
    // ****************************** //
    self.ClearOrder = function () {
        self.selectedQuantity(1);
        self.showRecipe(false);
        $("#clearOrder").modal("show");
    };
    // Clears order modal
    // ****************************** //
    self.ClearOrderConfirm = function () {
        if (self.showMessages() && self.createMessageOnClear) {
            var clearedOrder = {};
            clearedOrder.CustomerPhone = self.selectedCustomer() != null && self.selectedCustomer().Customer != null ? self.selectedCustomer().Customer.Mobile != null ? self.selectedCustomer().Customer.Mobile : self.selectedCustomer().Customer.Phone1 != null ? self.selectedCustomer().Customer.Phone1 : self.selectedCustomer().Customer.Phone2 != null ? self.selectedCustomer().Customer.Phone2 : null : null;
            clearedOrder.CustomerId = self.selectedCustomer() != null && self.selectedCustomer().Customer != null ? self.selectedCustomer().Customer.Id : null;
            localStorage.ClearOrder = "";
            localStorage.ClearOrder = JSON.stringify(clearedOrder);
            localStorage.StageOrder = "";
            self.navigation.GoToModule(navigationViewsEnum.Customer, null);
        }
        else {
            self.orderItems([]);
            self.selectedOrderItem(null);
            self.pageButtonDetailsPagination.Initialize();
            if (self.activeLoyalty() == loyaltyTypeEnum.Hit) {
                self.loyaltyOptions(null);
                self.selectedLoyaltyDiscountTotal(null);
            }
            else if (self.activeLoyalty() == loyaltyTypeEnum.Goodys) {
                self.loyaltyGoodys.ClearOrderInformation();
            }
            self.insertedVodafoneCodes = [];
            self.sendingOrder(false);
            $("#clearOrder").modal("hide");
        }
    };
    // Opens clear order modal
    // ****************************** //
    self.ClearOrderCancel = function () {
        $("#clearOrder").modal("hide");
    };
    // Opens discount modal for last order item
    // ****************************** //
    self.OpenLastOrderItemDiscounts = function () {
        if (self.selectedOrderItem() != null) {
            self.OpenDiscounts(discountOriginEnum.Item);
        }
    };
    // Adds remarks to last order item
    // ****************************** //
    self.AddLastOrderItemRemarks = function () {
        if (self.selectedOrderItem() != null) {
            if (self.selectedOrderItem().Remarks() == null) {
                self.selectedOrderItem().Remarks("");
            }
            self.keyboard.InitializeKeyboard(self.selectedOrderItem(), "Remarks", "orderItemRemarksInputRow" + (self.orderItems().length - 1), "orderItemRemarksRow" + (self.orderItems().length - 1), self.ClearOrderItemEmptyRemarks.bind(this, self.selectedOrderItem()), self.ClearOrderItemEmptyRemarks.bind(this, self.selectedOrderItem()), keyboardTypesEnum.Alphanumeric);
        }
    };
    // Clears empty remarks of order item
    // ****************************** //
    self.ClearOrderItemEmptyRemarks = function (orderItem) {
        var previousOrderItem = self.selectedOrderItem();
        self.selectedOrderItem(orderItem);
        if (self.selectedOrderItem().Remarks() == "") {
            self.selectedOrderItem().Remarks(null);
        }
        self.selectedOrderItem(previousOrderItem);
    };
    // Toggles option for displaying recipe
    // ****************************** //
    self.ToggleRecipe = function () {
        self.showRecipe(!self.showRecipe());
    };
    // Closes recipe modal
    // ****************************** //
    self.CloseRecipe = function () {
        $("#recipe").modal("hide");
        self.selectedPageButton(null);
    };
    // Opens customer modal
    // ****************************** //
    self.OpenCustomerAndAddresses = function () {
        if (self.selectedCustomer() != null) {
            $("#customerAddressesStore").modal("show");
        }
    };
    // Selects customer communication phone
    // ****************************** //
    self.SelectCustomerCommunicationPhone = function (phone) {
        self.selectedCustomer().CommunicationPhone = phone;
        self.selectedCustomer.notifySubscribers();
    };
    // Selects customer shipping address
    // ****************************** //
    self.SelectCustomerShippingAddress = function (address) {
        self.selectedCustomer().Address = address;
        self.selectedCustomer.notifySubscribers();
        if (self.selectedSaleType().Type != saleTypeEnum.Takeout) {
            self.selectedCustomer().Store = null;
            self.selectedCustomer.notifySubscribers();
            GetStoreForCustomerAddress(address.Id);
        }
    };
    // Selects customer billing address
    // ****************************** //
    self.SelectCustomerBillingAddress = function (address) {
        self.selectedCustomer().BillingAddress = address;
        self.selectedCustomer.notifySubscribers();
    };
    // Selects customer store
    // ****************************** //
    self.SelectCustomerStore = function (store) {
        self.selectedCustomer().Store = store;
        self.selectedCustomer.notifySubscribers();
        GetPriceListForCustomerStoreSaleType();
        if (!self.selectedCustomer().Store.HasCreditCard && self.selectedAccountType() != null && self.selectedAccountType().Type == accountTypeEnum.CreditCard) {
            self.selectedAccountType(self.accountTypes()[0]);
        }
        self.orderItemsToRestore = [];
        ko.utils.arrayForEach(self.orderItems(), function (i) {
            self.orderItemsToRestore.push(i);
        });
        self.vodafoneCodesToRestore = [];
        ko.utils.arrayForEach(self.insertedVodafoneCodes, function (c) {
            self.vodafoneCodesToRestore.push(c);
        });
        self.orderItems([]);
        self.selectedOrderItem(null);
        self.pagesPagination.Initialize();
        self.pageButtonsPagination.Initialize();
        self.pageButtonDetailsPagination.Initialize();
        self.selectedLoyaltyDiscountTotal(null);
        self.insertedVodafoneCodes = [];
        GetProductShortages();
    };
    // Updates customer
    // ****************************** //
    self.CloseCustomerAndAddresses = function () {
        if (self.updatingCustomer()) {
            return;
        }
        self.updatingCustomer(true);
        if (self.selectedInvoiceType() != null && self.selectedInvoiceType().Type == invoiceTypeEnum.Bill && self.selectedCustomer() != null && self.selectedCustomer().Customer != null && self.selectedCustomer().BillingAddress != null && self.selectedCustomer().Customer.BillingAddressId != self.selectedCustomer().BillingAddress.Id) {
            self.selectedCustomer().Customer.BillingAddressId = self.selectedCustomer().BillingAddress.Id;
            var url = localStorage.ApiAddress + "api/v3/da/Customers/UpdateCustomer";
            var postCustomer = new PostCustomerModel(self.selectedCustomer().Customer);
            var showMessage = true;
            self.communication.Communicate(communicationTypesEnum.Post, url, postCustomer, CallbackCloseCustomerAndAddresses, ErrorCallbackCloseCustomerAndAddresses, showMessage);
        }
        else {
            $("#customerAddressesStore").modal("hide");
            self.updatingCustomer(false);
        }
    };
    // Modifies customer and its addresses
    // ****************************** //
    self.ModifyCustomerAndAddresses = function () {
        var stagedOrder = {};
        stagedOrder.Details = [];
        ko.utils.arrayForEach(self.orderItems(), function (i) {
            var detail = new StagedOrderItemModel(i);
            stagedOrder.Details.push(detail);
        });
        stagedOrder.LoyaltyPoints = self.activeLoyalty() == loyaltyTypeEnum.Hit ? self.selectedLoyaltyDiscountTotal() : null;
        stagedOrder.VodafoneCodes = self.insertedVodafoneCodes;
        stagedOrder.CustomerPhone = self.selectedCustomer() != null && self.selectedCustomer().Customer != null ? self.selectedCustomer().Customer.Mobile != null ? self.selectedCustomer().Customer.Mobile : self.selectedCustomer().Customer.Phone1 != null ? self.selectedCustomer().Customer.Phone1 : self.selectedCustomer().Customer.Phone2 != null ? self.selectedCustomer().Customer.Phone2 : null : null;
        stagedOrder.CustomerId = self.selectedCustomer() != null && self.selectedCustomer().Customer != null ? self.selectedCustomer().Customer.Id : null;
        localStorage.StageOrder = "";
        localStorage.StageOrder = JSON.stringify(stagedOrder);
        localStorage.ClearOrder = "";
        self.navigation.GoToModule(navigationViewsEnum.Customer, null);
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
        if (localStorage.GeneralCustomerOrder !== undefined && localStorage.GeneralCustomerOrder != "") {
            self.selectedCustomer(JSON.parse(localStorage.GeneralCustomerOrder));
        }
        if (self.activeLoyalty() == loyaltyTypeEnum.Goodys) {
            self.loyaltyGoodys.SetCallbackFunctions(self.SelectPageButton, self.CalculateSelectedOrderItemTotals, RemoveOrderItem);
        }
        if (self.selectedCustomer() != null) {
            var accountType = ko.utils.arrayFirst(self.accountTypes(), function (a) {
                return a.Type == self.selectedCustomer().Payment.Type;
            });
            if (accountType != null) {
                self.selectedAccountType(accountType);
            }
            var saleType = ko.utils.arrayFirst(self.saleTypes(), function (s) {
                return s.Type == self.selectedCustomer().Sale.Type;
            });
            if (saleType != null) {
                self.selectedSaleType(saleType);
            }
            var invoiceType = ko.utils.arrayFirst(self.invoiceTypes(), function (i) {
                return i.Type == self.selectedCustomer().Invoice.Type;
            });
            if (invoiceType != null) {
                self.selectedInvoiceType(invoiceType);
            }
            if (self.activeLoyalty() == loyaltyTypeEnum.Goodys) {
                var emailLoyaltyGoodys = null;
                var phoneLoyaltyGoodys = self.selectedCustomer().Customer.Mobile;
                self.loyaltyGoodys.GetLoyaltyPoints(emailLoyaltyGoodys, phoneLoyaltyGoodys);
            }
        }
        else {
            self.selectedAccountType(self.accountTypes()[0]);
            self.selectedSaleType(self.saleTypes()[0]);
            self.selectedInvoiceType(self.invoiceTypes()[0]);
        }
        self.selectedDelay(new DelayModel());
        var request = indexedDB.open(dbName);
        request.onsuccess = function (event) {
            console.log(request.result);
            db = request.result;
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
                }
            }
            db.transaction("ingredientCategories").objectStore("ingredientCategories").openCursor().onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor != null) {
                    var ingredientCategory = new IngredientCategoryModel(cursor.value);
                    self.ingredientCategories.push(ingredientCategory);
                    cursor.continue();
                }
            }
            db.transaction("priceLists").objectStore("priceLists").openCursor().onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor != null) {
                    var pricelist = new StorePriceListAssociationModel(cursor.value);
                    self.priceLists.push(pricelist);
                    cursor.continue();
                }
                else {
                    if (self.priceLists().length > 0) {
                        var priceList = ko.utils.arrayFirst(self.priceLists(), function (p) {
                            return (self.selectedCustomer() != null ? self.selectedCustomer().Store.Id == p.DAStoreId : false) && ((p.PriceListType == priceListTypeEnum.Delivery && self.selectedSaleType().Type == saleTypeEnum.Delivery) || (p.PriceListType == priceListTypeEnum.Takeout && self.selectedSaleType().Type == saleTypeEnum.Takeout));
                        });
                        if (priceList != null) {
                            self.selectedPriceList(priceList);
                        }
                        else {
                            toastr.info(language.Translate("PriceListUnavailable", null));
                        }
                    }
                }
            }
            db.transaction("discounts").objectStore("discounts").openCursor().onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor != null) {
                    var discount = new DiscountModel(cursor.value);
                    if (discount.Status == 1) {
                        self.discounts.push(discount);
                    }
                    cursor.continue();
                }
                else {
                    self.discounts().sort(function (left, right) { return left.Sort == right.Sort ? 0 : (left.Sort < right.Sort ? -1 : 1) });
                }
            }
            db.transaction("vodafone").objectStore("vodafone").openCursor().onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor != null) {
                    var vodafoneDiscount = new VodafoneOptionsModel(cursor.value);
                    self.vodafoneDiscounts.push(vodafoneDiscount);
                    cursor.continue();
                }
            }
            GetProductShortages();
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
        if (localStorage.HasCommunicationPhone !== undefined && localStorage.HasCommunicationPhone != "") {
            var hasCommunicationPhone = JSON.parse(localStorage.HasCommunicationPhone);
            self.hasCommunicationPhone(hasCommunicationPhone);
        }
        if (localStorage.HasLoyaltyCode !== undefined && localStorage.HasLoyaltyCode != "") {
            var hasLoyaltyCode = JSON.parse(localStorage.HasLoyaltyCode);
            self.hasLoyaltyCode(hasLoyaltyCode);
        }
        if (localStorage.SelectDeliveryStore !== undefined && localStorage.SelectDeliveryStore != "") {
            var selectDeliveryStore = JSON.parse(localStorage.SelectDeliveryStore);
            self.selectDeliveryStore = selectDeliveryStore;
        }
        if (localStorage.MinimumOrderAmount !== undefined && localStorage.MinimumOrderAmount != "") {
            var minimumOrderAmount = JSON.parse(localStorage.MinimumOrderAmount);
            self.minimumOrderAmount(minimumOrderAmount);
        }
        if (localStorage.ShowMessages !== undefined && localStorage.ShowMessages != "") {
            var showMessages = JSON.parse(localStorage.ShowMessages);
            self.showMessages(showMessages);
        }
        if (localStorage.CreateMessageOnClear !== undefined && localStorage.CreateMessageOnClear != "") {
            var createMessageOnClear = JSON.parse(localStorage.CreateMessageOnClear);
            self.createMessageOnClear = createMessageOnClear;
        }
        if (localStorage.ActiveLoyalty !== undefined && localStorage.ActiveLoyalty != "") {
            var activeLoyalty = JSON.parse(localStorage.ActiveLoyalty);
            self.activeLoyalty(activeLoyalty);
        }
        if (localStorage.ApplyLoyaltyPoints !== undefined && localStorage.ApplyLoyaltyPoints != "") {
            var applyLoyaltyPoints = JSON.parse(localStorage.ApplyLoyaltyPoints);
            self.applyLoyaltyPoints = applyLoyaltyPoints;
        }
        if (localStorage.SupplementaryLoyaltyProduct !== undefined && localStorage.SupplementaryLoyaltyProduct != "") {
            var supplementaryLoyaltyProduct = localStorage.SupplementaryLoyaltyProduct;
            self.loyaltyGoodys.SetSupplementaryLoyaltyProduct(supplementaryLoyaltyProduct);
        }
        if (localStorage.SupplementaryCouponProduct !== undefined && localStorage.SupplementaryCouponProduct != "") {
            var supplementaryCouponProduct = localStorage.SupplementaryCouponProduct;
            self.loyaltyGoodys.SetSupplementaryCouponProduct(supplementaryCouponProduct);
        }
    };
    // Gets product shortages from API
    // ****************************** //
    function GetProductShortages() {
        var updateShortagesTimer = JSON.parse(localStorage.UpdateShortagesTimer);
        var updateShortagesCount = JSON.parse(localStorage.UpdateShortagesCount);
        if (updateShortagesCount == updateShortagesTimer) {
            var productsFound = 0;
            var productsUpdated = 0;
            var objectStore = db.transaction("pageButtons", "readwrite").objectStore("pageButtons");
            var request = objectStore.openCursor();
            request.onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor != null) {
                    productsFound++;
                    var pageButton = cursor.value;
                    pageButton.ShortageType = null;
                    var secondRequest = cursor.update(pageButton);
                    secondRequest.onsuccess = function () {
                        productsUpdated++;
                    };
                    cursor.continue();
                }
                else {
                    var updateShortages = setInterval(function () {
                        if (productsFound == productsUpdated) {
                            clearInterval(updateShortages);
                            var url = localStorage.ApiAddress + "api/v3/da/Shortages/GetList";
                            var showMessage = true;
                            self.communication.Communicate(communicationTypesEnum.Get, url, null, CallbackGetProductShortages, null, showMessage);
                        }
                    }, 100);
                }
            };
        }
        else {
            localStorage.UpdateShortagesCount = updateShortagesCount + 1;
            GetPagesAndPageButtons();
        }
    };
    // Updates page buttons with shortage
    // ****************************** //
    function CallbackGetProductShortages(shortages) {
        if (shortages.length > 0) {
            var shortagesUpdated = 0;
            var productsFound = 0;
            var productsUpdated = 0;
            $.each(shortages, function (index, model) {
                var objectStore = db.transaction("pageButtons", "readwrite").objectStore("pageButtons").index("ProductId");
                var request = objectStore.openCursor(model.ProductId);
                request.onsuccess = function (event) {
                    var cursor = event.target.result;
                    if (cursor != null) {
                        productsFound++;
                        var pageButton = cursor.value;
                        if (model.StoreId == self.selectedCustomer().Store.Id) {
                            pageButton.ShortageType = model.ShortType;
                        }
                        var secondRequest = cursor.update(pageButton);
                        secondRequest.onsuccess = function () {
                            productsUpdated++;
                        };
                        cursor.continue();
                    }
                    else {
                        shortagesUpdated++;
                        if (shortagesUpdated == shortages.length) {
                            var updateShortages = setInterval(function () {
                                if (productsFound == productsUpdated) {
                                    clearInterval(updateShortages);
                                    localStorage.UpdateShortagesCount = 1;
                                    GetPagesAndPageButtons();
                                }
                            }, 100);
                        }
                    }
                };
            });
        }
        else {
            localStorage.UpdateShortagesCount = 1;
            GetPagesAndPageButtons();
        }
    };
    // Gets pages and page buttons from indexed DB
    // ****************************** //
    function GetPagesAndPageButtons() {
        self.pages([]);
        db.transaction("pages").objectStore("pages").openCursor().onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor != null) {
                var page = new PageModel(cursor.value);
                if (page.Status == 1) {
                    self.pages.push(page);
                }
                cursor.continue();
            }
            else {
                self.pages().sort(function (left, right) { return left.Sort == right.Sort ? 0 : (left.Sort < right.Sort ? -1 : 1) });
                db.transaction("pageButtons").objectStore("pageButtons").openCursor().onsuccess = function (event) {
                    var cursor = event.target.result;
                    if (cursor != null) {
                        var pageButton = new PageButtonModel(cursor.value);
                        var page = ko.utils.arrayFirst(self.pages(), function (p) {
                            return p.Id == pageButton.PageId;
                        });
                        if (page != null) {
                            page.PageButtons.push(pageButton);
                        }
                        cursor.continue();
                    }
                    else {
                        self.pagesPagination.NoSearchEntities(self.pages(), self.pageSize());
                        self.SelectPage(self.pagesPagination.entityList()[0]);
                        if (self.orderItemsToRestore.length > 0) {
                            RestoreOrder();
                        }
                        else if (localStorage.ModifyOrder !== undefined && localStorage.ModifyOrder != "") {
                            ModifyOrder();
                        }
                        else if (localStorage.RedoOrder !== undefined && localStorage.RedoOrder != "") {
                            RedoOrder();
                        }
                        else if (localStorage.StageOrder !== undefined && localStorage.StageOrder != "") {
                            UnstageOrder();
                        }
                    }
                }
            }
        }
    };
    // Restores previous order
    // ****************************** //
    function RestoreOrder() {
        var allRestoredProductsLength = self.orderItemsToRestore.length;
        var checkedRestoredProductsLength = 0;
        ko.utils.arrayForEach(self.orderItemsToRestore, function (i) {
            var objectStore = db.transaction(["pageButtons"], "readwrite").objectStore("pageButtons").index("ProductId");
            var request = objectStore.openCursor(i.ProductId);
            request.onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor != null) {
                    var pageButton = new PageButtonModel(cursor.value);
                    if (pageButton.ShortageType == null) {
                        var priceList = ko.utils.arrayFirst(self.priceLists(), function (p) {
                            return (i.PriceListId == p.PriceListId) && (self.selectedCustomer() != null ? self.selectedCustomer().Store.Id == p.DAStoreId : false) && ((p.PriceListType == priceListTypeEnum.Delivery && self.selectedSaleType().Type == saleTypeEnum.Delivery) || (p.PriceListType == priceListTypeEnum.Takeout && self.selectedSaleType().Type == saleTypeEnum.Takeout));
                        });
                        if (priceList != null) {
                            self.selectedPriceList(priceList);
                            self.selectedQuantity(i.Quantity());
                            self.SelectPageButton(pageButton, false);
                            self.selectedOrderItem().Discount(i.Discount());
                            self.selectedOrderItem().DiscountId = i.DiscountId;
                            self.selectedOrderItem().Remarks(i.Remarks());
                            ko.utils.arrayForEach(i.Extras(), function (e) {
                                var foundExtra = ko.utils.arrayFirst(pageButton.PageButtonDetail, function (d) {
                                    return d.IngredientId == e.IngredientId;
                                });
                                if (foundExtra != null) {
                                    if (e.Quantity() == -1) {
                                        self.SelectPageButtonDetail(foundExtra, extraAction.Remove);
                                    }
                                    else {
                                        self.SelectPageButtonDetail(foundExtra, extraAction.Add);
                                        self.selectedOrderItem().Extras()[self.selectedOrderItem().Extras().length - 1].Quantity(e.Quantity());
                                    }
                                }
                            });
                            self.CalculateSelectedOrderItemTotals();
                        }
                        else {
                            toastr.info(language.Translate("PriceListProductMismatch", { description: pageButton.Description }));
                        }
                    }
                    else {
                        toastr.info(language.Translate("ProductShortage", { description: pageButton.Description }));
                    }
                    checkedRestoredProductsLength++;
                }
            };
        });
        self.orderItemsToRestore = [];
        if (self.vodafoneCodesToRestore.length > 0) {
            var allRestoredProductsChecked = setInterval(function () {
                if (checkedRestoredProductsLength == allRestoredProductsLength) {
                    clearInterval(allRestoredProductsChecked);
                    self.insertedVodafoneCodes = [];
                    ko.utils.arrayForEach(self.vodafoneCodesToRestore, function (c) {
                        self.insertedVodafoneCodes.push(c);
                    });
                    RemoveVodafoneDiscounts();
                    self.vodafoneCodesToRestore = [];
                }
            }, 100);
        }
    };
    // Modifies past active order
    // ****************************** //
    function ModifyOrder() {
        self.selectedOrder(JSON.parse(localStorage.ModifyOrder));
        var allProductsLength = self.selectedOrder().Details.length;
        var checkedProductsLength = 0;
        ko.utils.arrayForEach(self.selectedOrder().Details, function (i) {
            var objectStore = db.transaction(["pageButtons"], "readwrite").objectStore("pageButtons").index("ProductId");
            var request = objectStore.openCursor(i.ProductId);
            request.onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor != null) {
                    var pageButton = new PageButtonModel(cursor.value);
                    var priceList = ko.utils.arrayFirst(self.priceLists(), function (p) {
                        return (i.PriceListId == p.PriceListId) && (self.selectedCustomer() != null ? self.selectedCustomer().Store.Id == p.DAStoreId : false) && ((p.PriceListType == priceListTypeEnum.Delivery && self.selectedSaleType().Type == saleTypeEnum.Delivery) || (p.PriceListType == priceListTypeEnum.Takeout && self.selectedSaleType().Type == saleTypeEnum.Takeout));
                    });
                    if (priceList != null) {
                        self.selectedPriceList(priceList);
                        self.selectedQuantity(i.Quantity);
                        self.SelectPageButton(pageButton, false);
                        self.selectedOrderItem().Price(i.Price);
                        self.selectedOrderItem().Discount(i.Discount);
                        self.selectedOrderItem().Remarks(i.ItemRemark != "" ? i.ItemRemark : null);
                        self.selectedOrderItem().Id = i.Id;
                        ko.utils.arrayForEach(i.Extras, function (e) {
                            var foundExtra = ko.utils.arrayFirst(pageButton.PageButtonDetail, function (d) {
                                return d.IngredientId == e.ExtraId;
                            });
                            if (foundExtra != null) {
                                if (e.Quantity == -1) {
                                    self.SelectPageButtonDetail(foundExtra, extraAction.Remove);
                                }
                                else {
                                    self.SelectPageButtonDetail(foundExtra, extraAction.Add);
                                    self.selectedOrderItem().Extras()[self.selectedOrderItem().Extras().length - 1].Quantity(e.Quantity);
                                }
                                self.selectedOrderItem().Extras()[self.selectedOrderItem().Extras().length - 1].Price(e.Price);
                                self.selectedOrderItem().Extras()[self.selectedOrderItem().Extras().length - 1].HasChanged = false;
                                self.selectedOrderItem().Extras()[self.selectedOrderItem().Extras().length - 1].Id = e.Id;
                            }
                        });
                        self.CalculateSelectedOrderItemTotals();
                    }
                    else {
                        toastr.info(language.Translate("PriceListProductMismatch", { description: pageButton.Description }));
                    }
                    checkedProductsLength++;
                }
            };
        });
        if (self.selectedOrder().IsDelay) {
            var delay = {};
            delay.IsDelay = self.selectedOrder().IsDelay;
            delay.TargetDate = moment(self.selectedOrder().EstTakeoutDate).format("HH:mm");
            self.selectedDelay(new DelayModel(delay));
        }
        self.isPaid(self.selectedOrder().IsPaid);
        self.selectedOrderRemark = self.selectedOrder().Remarks;
        if (self.selectedOrder().Discount != 0 && self.selectedOrder().DiscountRemark != "Loyalty Discount") {
            toastr.warning(language.Translate("DiscountRemovedAdd", null));
        }
        if (self.activeLoyalty() == loyaltyTypeEnum.Hit && self.selectedOrder().PointsRedeem != 0) {
            self.selectedLoyaltyDiscountTotal(new LoyaltyDiscountTotalModel());
            self.selectedLoyaltyDiscountTotal().Amount = self.selectedOrder().DiscountRemark == "Loyalty Discount" ? self.selectedOrder().Discount : 0;
            self.selectedLoyaltyDiscountTotal().Points = (self.selectedOrder().PointsRedeem * (-1));
            self.selectedLoyaltyDiscountTotal.notifySubscribers();
        }
        if (self.selectedOrder().ExtObj != null) {
            var externalObject = JSON.parse(self.selectedOrder().ExtObj);
            if (externalObject.Coupons != null && externalObject.Coupons.length > 0) {
                var allProductsChecked = setInterval(function () {
                    if (checkedProductsLength == allProductsLength) {
                        clearInterval(allProductsChecked);
                        self.insertedVodafoneCodes = [];
                        ko.utils.arrayForEach(externalObject.Coupons, function (c) {
                            var coupon = new VodafoneCodeModel();
                            coupon.VodafoneCode = c.Code;
                            coupon.VodafoneId = c.Id;
                            coupon.VodafonePromo = c.Description;
                            var option = ko.utils.arrayFirst(self.vodafoneDiscounts(), function (d) {
                                return c.Id == d.Id;
                            });
                            coupon.VodafoneOption = option;
                            self.insertedVodafoneCodes.push(coupon);
                        });
                        RemoveVodafoneDiscounts();
                    }
                }, 100);
            }
            if (self.activeLoyalty() == loyaltyTypeEnum.Goodys && externalObject.LoyaltyCouponInfo != null) {
                var couponInfo = externalObject.LoyaltyCouponInfo;
                self.loyaltyGoodys.RestoreAppliedDiscount(couponInfo);
            }
        }
    };
    // Adds past order products and its extras in current order
    // ****************************** //
    function RedoOrder() {
        var previousOrderItems = JSON.parse(localStorage.RedoOrder);
        ko.utils.arrayForEach(previousOrderItems, function (i) {
            var objectStore = db.transaction(["pageButtons"], "readwrite").objectStore("pageButtons").index("ProductId");
            var request = objectStore.openCursor(i.ProductId);
            request.onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor != null) {
                    var pageButton = new PageButtonModel(cursor.value);
                    if (pageButton.ShortageType == null) {
                        var priceList = ko.utils.arrayFirst(self.priceLists(), function (p) {
                            return (i.PriceListId == p.PriceListId) && (self.selectedCustomer() != null ? self.selectedCustomer().Store.Id == p.DAStoreId : false) && ((p.PriceListType == priceListTypeEnum.Delivery && self.selectedSaleType().Type == saleTypeEnum.Delivery) || (p.PriceListType == priceListTypeEnum.Takeout && self.selectedSaleType().Type == saleTypeEnum.Takeout));
                        });
                        if (priceList != null) {
                            self.selectedPriceList(priceList);
                            self.selectedQuantity(i.Quantity);
                            self.SelectPageButton(pageButton, false);
                            ko.utils.arrayForEach(i.Extras, function (e) {
                                var foundExtra = ko.utils.arrayFirst(pageButton.PageButtonDetail, function (d) {
                                    return d.IngredientId == e.ExtraId;
                                });
                                if (foundExtra != null) {
                                    if (e.Quantity == -1) {
                                        self.SelectPageButtonDetail(foundExtra, extraAction.Remove);
                                    }
                                    else {
                                        self.SelectPageButtonDetail(foundExtra, extraAction.Add);
                                        self.selectedOrderItem().Extras()[self.selectedOrderItem().Extras().length - 1].Quantity(e.Quantity);
                                    }
                                }
                            });
                            self.CalculateSelectedOrderItemTotals();
                        }
                        else {
                            toastr.info(language.Translate("PriceListProductMismatch", { description: pageButton.Description }));
                        }
                    }
                    else {
                        toastr.info(language.Translate("ProductShortage", { description: pageButton.Description }));
                    }
                }
            };
        });
    };
    // Continues order on hold
    // ****************************** //
    function UnstageOrder() {
        var stagedOrder = JSON.parse(localStorage.StageOrder);
        var itemsFound = stagedOrder.Details.length;
        var itemsAdded = 0;
        ko.utils.arrayForEach(stagedOrder.Details, function (i) {
            var objectStore = db.transaction(["pageButtons"], "readwrite").objectStore("pageButtons").index("ProductId");
            var request = objectStore.openCursor(i.ProductId);
            request.onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor != null) {
                    var pageButton = new PageButtonModel(cursor.value);
                    var priceList = ko.utils.arrayFirst(self.priceLists(), function (p) {
                        return (i.PriceListId == p.PriceListId) && (self.selectedCustomer() != null ? self.selectedCustomer().Store.Id == p.DAStoreId : false) && ((p.PriceListType == priceListTypeEnum.Delivery && self.selectedSaleType().Type == saleTypeEnum.Delivery) || (p.PriceListType == priceListTypeEnum.Takeout && self.selectedSaleType().Type == saleTypeEnum.Takeout));
                    });
                    if (priceList != null) {
                        self.selectedPriceList(priceList);
                        self.selectedQuantity(i.Quantity);
                        self.SelectPageButton(pageButton, false);
                        self.selectedOrderItem().Price(i.Price);
                        self.selectedOrderItem().Discount(i.Discount);
                        self.selectedOrderItem().Remarks(i.Remarks);
                        self.selectedOrderItem().IsLoyalty(i.IsLoyalty);
                        self.selectedOrderItem().IsVodafone(i.IsVodafone);
                        self.selectedOrderItem().IsVodafoneCalculated = i.IsVodafoneCalculated;
                        ko.utils.arrayForEach(i.Extras, function (e) {
                            var foundExtra = ko.utils.arrayFirst(pageButton.PageButtonDetail, function (d) {
                                return d.IngredientId == e.IngredientId;
                            });
                            if (foundExtra != null) {
                                if (e.Quantity == -1) {
                                    self.SelectPageButtonDetail(foundExtra, extraAction.Remove);
                                }
                                else {
                                    self.SelectPageButtonDetail(foundExtra, extraAction.Add);
                                    self.selectedOrderItem().Extras()[self.selectedOrderItem().Extras().length - 1].Quantity(e.Quantity);
                                }
                                self.selectedOrderItem().Extras()[self.selectedOrderItem().Extras().length - 1].Price(e.Price);
                            }
                        });
                        self.CalculateSelectedOrderItemTotals();
                        itemsAdded++;
                    }
                    else {
                        toastr.info(language.Translate("PriceListProductMismatch", { description: pageButton.Description }));
                    }
                }
            };
        });
        var applyDiscounts = setInterval(function () {
            if (itemsFound == itemsAdded) {
                clearInterval(applyDiscounts);
                if (self.activeLoyalty() == loyaltyTypeEnum.Hit) {
                    self.selectedLoyaltyDiscountTotal(stagedOrder.LoyaltyPoints);
                }
                self.insertedVodafoneCodes = stagedOrder.VodafoneCodes;
                RemoveVodafoneDiscounts();
            }
        }, 100);
    };
    // Displayes searched products in a new page
    // ****************************** //
    function DisplaySearchedProducts(searchProductInput) {
        var searchPage = new PageModel();
        searchPage.Description = searchProductInput;
        var lastSort = self.pagesPagination.allEntities[self.pagesPagination.allEntities.length - 1].Sort;
        searchPage.Sort = lastSort + 1;
        ko.utils.arrayForEach(self.searchedProducts(), function (p) {
            var pageButton = new PageButtonModel(p);
            searchPage.PageButtons.push(pageButton);
        });
        self.pages.push(searchPage);
        self.pagesPagination.Initialize();
        self.pagesPagination.NoSearchEntities(self.pages(), self.pageSize());
        self.SelectPage(self.pagesPagination.allEntities[self.pagesPagination.allEntities.length - 1]);
        self.pagesPagination.MoveLast();
    };
    // Deletes page of searched products
    // ****************************** //
    function HideSearchedProducts(currentPage) {
        var lastPage = self.pagesPagination.allEntities[self.pagesPagination.allEntities.length - 1];
        self.pages.splice(self.pages.indexOf(lastPage), 1);
        self.pagesPagination.Initialize();
        self.pagesPagination.NoSearchEntities(self.pages(), self.pageSize());
        if (currentPage != null) {
            self.SelectPage(currentPage);
        }
    };
    // Selects product
    // ****************************** //
    function SelectProduct(pageButton, showExtras) {
        if (self.showRecipe()) {
            self.showRecipe(false);
            self.selectedPageButton(pageButton);
            $("#recipe").modal("show");
        }
        else {
            if (self.selectedPriceList() == null) {
                return;
            }
            var orderItem = new OrderItemModel(pageButton, self.selectedQuantity(), self.selectedPriceList(), null);
            self.orderItems.push(orderItem);
            self.selectedOrderItem(orderItem);
            UpdateOrderItemsDisplay();
            self.selectedQuantity(1);
            self.pageButtonDetailsPagination.Initialize();
            if (pageButton.PageButtonDetail.length > 0) {
                ko.utils.arrayForEach(pageButton.PageButtonDetail, function (d) {
                    var minusEnabled = d.Type == pageButtonDetailType.Recipe ? true : false;
                    d.MinusEnabled(minusEnabled);
                    var plusEnabled = true;
                    d.PlusEnabled(plusEnabled);
                });
                self.pageButtonDetailsPagination.NoSearchEntities(pageButton.PageButtonDetail, self.pageButtonDetailSize());
            }
            if (showExtras) {
                self.ShowAllPageButtonDetails();
            }
            self.selectedPageButtonDetail(null);
            if (pageButton.NavigateToPage != null) {
                SelectNavigate(pageButton);
            }
            RemoveVodafoneDiscounts();
        }
    };
    // Updates order items view
    // ****************************** //
    function UpdateOrderItemsDisplay() {
        var elements = document.getElementsByClassName("order-container-body");
        if (elements != null && elements.length > 0) {
            var element = elements[0];
            element.scrollTop = 999999999;
        }
    };
    // Navigates to page
    // ****************************** //
    function SelectNavigate(pageButton) {
        var page = ko.utils.arrayFirst(self.pages(), function (p) {
            return p.Id == pageButton.NavigateToPage;
        });
        if (page != null) {
            self.SelectPage(page);
        }
    };
    // Adds extra to selected order item
    // ****************************** //
    function AddExtra(pageButtonDetail) {
        if (self.selectedOrderItem() != null) {
            var extra = ko.utils.arrayFirst(self.selectedOrderItem().Extras(), function (e) {
                return e.IngredientId == pageButtonDetail.IngredientId;
            });
            if (extra != null) {
                if (pageButtonDetail.MaxQty != null && extra.Quantity() < pageButtonDetail.MaxQty) {
                    extra.Quantity(extra.Quantity() + 1);
                    pageButtonDetail.MinusEnabled(true);
                }
                else if (pageButtonDetail.MaxQty == null) {
                    extra.Quantity(extra.Quantity() + 1);
                    pageButtonDetail.MinusEnabled(true);
                }
                if (extra.Quantity() == pageButtonDetail.MaxQty) {
                    pageButtonDetail.PlusEnabled(false);
                }
                if (self.selectedOrder() != null) {
                    extra.HasChanged = true;
                }
                if (extra.Quantity() == 0) {
                    self.selectedOrderItem().Extras.splice(self.selectedOrderItem().Extras.indexOf(extra), 1);
                }
            }
            else {
                var hasChanged = self.selectedOrder() != null ? true : false;
                var orderItemExtra = new OrderItemExtraModel(pageButtonDetail, self.selectedOrderItem().Quantity(), self.selectedOrderItem().PriceListId, hasChanged);
                self.selectedOrderItem().Extras.push(orderItemExtra);
                pageButtonDetail.MinusEnabled(true);
                if (orderItemExtra.Quantity() == pageButtonDetail.MaxQty) {
                    pageButtonDetail.PlusEnabled(false);
                }
            }
            UpdateOrderItemsDisplay();
            self.CalculateSelectedOrderItemTotals();
            ApplyExtrasCompatibility(extraAction.Add, pageButtonDetail.IngredientCategoryId, pageButtonDetail.IngredientId);
            RemoveVodafoneDiscounts();
        }
    };
    // Removes extra from selected order item
    // ****************************** //
    function RemoveExtra(pageButtonDetail) {
        if (self.selectedOrderItem() != null) {
            var extra = ko.utils.arrayFirst(self.selectedOrderItem().Extras(), function (e) {
                return e.IngredientId == pageButtonDetail.IngredientId;
            });
            if (extra != null) {
                if (pageButtonDetail.MinQty != null && extra.Quantity() > pageButtonDetail.MinQty) {
                    extra.Quantity(extra.Quantity() - 1);
                    pageButtonDetail.PlusEnabled(true);
                }
                else if (pageButtonDetail.MinQty == null) {
                    extra.Quantity(extra.Quantity() - 1);
                    pageButtonDetail.PlusEnabled(true);
                }
                if (extra.Quantity() == pageButtonDetail.MinQty) {
                    pageButtonDetail.MinusEnabled(false);
                }
                if (extra.Quantity() == 0 && pageButtonDetail.Type == pageButtonDetailType.Recipe) {
                    pageButtonDetail.MinusEnabled(true);
                }
                if (self.selectedOrder() != null) {
                    extra.HasChanged = true;
                }
                if (extra.Quantity() == 0) {
                    self.selectedOrderItem().Extras.splice(self.selectedOrderItem().Extras.indexOf(extra), 1);
                }
            }
            else {
                if (pageButtonDetail.Type == pageButtonDetailType.Recipe) {
                    var hasChanged = self.selectedOrder() != null ? true : false;
                    var orderItemExtra = new OrderItemExtraModel(pageButtonDetail, self.selectedOrderItem().Quantity(), self.selectedOrderItem().PriceListId, hasChanged);
                    orderItemExtra.Quantity(-1);
                    orderItemExtra.StartPrice = 0;
                    orderItemExtra.Price(0);
                    self.selectedOrderItem().Extras.push(orderItemExtra);
                    pageButtonDetail.MinusEnabled(false);
                    pageButtonDetail.PlusEnabled(true);
                }
            }
            UpdateOrderItemsDisplay();
            self.CalculateSelectedOrderItemTotals();
            ApplyExtrasCompatibility(extraAction.Remove, pageButtonDetail.IngredientCategoryId, pageButtonDetail.IngredientId);
            RemoveVodafoneDiscounts();
        }
    };
    // Applies extras compatibility
    // ****************************** //
    function ApplyExtrasCompatibility(action, ingredientCategoryId, ingredientId) {
        var ingredientCategory = ko.utils.arrayFirst(self.ingredientCategories, function (ic) {
            return ic.Id == ingredientCategoryId;
        });
        if (ingredientCategory != null && ingredientCategory.IsUnique) {
            switch (action) {
                case extraAction.Add:
                    if ($("#modifyOrderItem").is(":visible")) {
                        var items = self.selectedOrderItemAvailableExtras();
                    }
                    else {
                        var items = self.pageButtonDetailsPagination.allEntities;
                    }
                    ko.utils.arrayForEach(items, function (i) {
                        if (i.IngredientCategoryId == ingredientCategoryId && i.IngredientId != ingredientId) {
                            i.PlusEnabled(false);
                        }
                    });
                    break;
                case extraAction.Remove:
                    if ($("#modifyOrderItem").is(":visible")) {
                        var items = self.selectedOrderItemAvailableExtras();
                    }
                    else {
                        var items = self.pageButtonDetailsPagination.allEntities;
                    }
                    var foundExtra = ko.utils.arrayFirst(self.selectedOrderItem().Extras(), function (e) {
                        return e.IngredientId == ingredientId;
                    });
                    if (foundExtra == null) {
                        ko.utils.arrayForEach(items, function (i) {
                            if (i.IngredientCategoryId == ingredientCategoryId && i.IngredientId != ingredientId) {
                                i.PlusEnabled(true);
                            }
                        });
                    }
                    break;
                default:
                    if ($("#modifyOrderItem").is(":visible")) {
                        var items = self.selectedOrderItemAvailableExtras();
                    }
                    else {
                        var items = self.pageButtonDetailsPagination.allEntities;
                    }
                    ko.utils.arrayForEach(items, function (i) {
                        if (i.IngredientCategoryId == ingredientCategoryId && i.IngredientId != ingredientId) {
                            i.PlusEnabled(true);
                        }
                    });
                    break;
            }
        }
    };
    // Removes order item
    // ****************************** //
    function RemoveOrderItem(orderItem) {
        var lastItem = self.orderItems()[self.orderItems().length - 1];
        if (orderItem.IsLoyalty()) {
            if (lastItem.IsLoyalty()) {
                self.pageButtonDetailsPagination.Initialize();
            }
            RemoveLoyalty();
        }
        else {
            if (orderItem == lastItem) {
                self.pageButtonDetailsPagination.Initialize();
            }
            self.orderItems.splice(self.orderItems.indexOf(orderItem), 1);
        }
        UpdateOrderItemsDisplay();
        lastItem = self.orderItems()[self.orderItems().length - 1];
        self.selectedOrderItem(lastItem);
        self.selectedOrderItemAvailableExtras([]);
        RemoveVodafoneDiscounts();
    };
    // Returnes order item
    // ****************************** //
    function ReturnOrderItem(orderItem) {
        var returnPrice = orderItem.Price() * (-1);
        orderItem.Price(returnPrice);
        ko.utils.arrayForEach(orderItem.Extras(), function (e) {
            var returnExtraPrice = e.Price() * (-1);
            e.Price(returnExtraPrice);
        });
        self.CalculateSelectedOrderItemTotals();
    };
    // Applies selected discount on item
    // ****************************** //
    function ApplyItemDiscount() {
        switch (self.selectedDiscount().Type) {
            case discountTypeEnum.Percentage:
            case discountTypeEnum.OpenPercentage:
                var discountPercentAmount = self.selectedDiscount().Amount();
                if (discountPercentAmount > 100) {
                    toastr.info(language.Translate("DenyProductDiscount", { discountDescription: self.selectedDiscount().Description(), productDescription: self.selectedOrderItem().Description }));
                    return;
                }
                var itemTotal = self.selectedOrderItem().TotalWithExtras() + self.selectedOrderItem().Discount();
                var discountPercent = self.selectedDiscount().Amount() / 100;
                var discountAmount = itemTotal * discountPercent;
                break;
            case discountTypeEnum.Amount:
            case discountTypeEnum.OpenAmount:
                var itemTotal = self.selectedOrderItem().TotalWithExtras() + self.selectedOrderItem().Discount();
                var discountAmount = self.selectedDiscount().Amount();
                if (discountAmount > itemTotal) {
                    toastr.info(language.Translate("DenyProductDiscount", { discountDescription: self.selectedDiscount().Description(), productDescription: self.selectedOrderItem().Description }));
                    return;
                }
                break;
            default:
                break;
        }
        self.selectedOrderItem().Remarks(self.selectedDiscount().Description());
        self.selectedOrderItem().DiscountId = self.selectedDiscount().Id;
        var mainItemTotal = self.selectedOrderItem().Total();
        if (mainItemTotal >= discountAmount) {
            self.selectedOrderItem().Discount(parseFloat(discountAmount.toFixed(2)));
        }
        else {
            self.selectedOrderItem().Discount(parseFloat(mainItemTotal.toFixed(2)));
            var remainingDiscount = discountAmount - mainItemTotal;
            var extrasTotal = self.selectedOrderItem().TotalWithExtras() - self.selectedOrderItem().Total();
            var remainingDiscountPercent = remainingDiscount / extrasTotal;
            ko.utils.arrayForEach(self.selectedOrderItem().Extras(), function (e) {
                var extraDiscount = e.Price() * remainingDiscountPercent;
                var extraPrice = e.Price() - extraDiscount;
                e.Price(parseFloat(extraPrice.toFixed(2)));
            });
        }
        self.CalculateSelectedOrderItemTotals();
    };
    // Applies selected discount on total
    // ****************************** //
    function ApplyTotalDiscount() {
        switch (self.selectedDiscount().Type) {
            case discountTypeEnum.Percentage:
            case discountTypeEnum.OpenPercentage:
                var discountPercentAmount = self.selectedDiscount().Amount();
                if (discountPercentAmount > 100) {
                    toastr.info(language.Translate("DenyDiscount", { description: self.selectedDiscount().Description() }));
                    return;
                }
                var itemTotal = self.total() + (self.selectedDiscountTotal() != null ? self.selectedDiscountTotal().Amount : 0);
                var discountPercent = self.selectedDiscount().Amount() / 100;
                var discountAmount = itemTotal * discountPercent;
                var discountTotal = {};
                discountTotal.Id = self.selectedDiscount().Id;
                discountTotal.Amount = parseFloat(discountAmount.toFixed(2));
                discountTotal.Remark = self.selectedDiscount().Description();
                self.selectedDiscountTotal(discountTotal);
                break;
            case discountTypeEnum.Amount:
            case discountTypeEnum.OpenAmount:
                var itemTotal = self.total() + (self.selectedDiscountTotal() != null ? self.selectedDiscountTotal().Amount : 0);
                var discountAmount = self.selectedDiscount().Amount();
                if (discountAmount > itemTotal) {
                    toastr.info(language.Translate("DenyDiscount", { description: self.selectedDiscount().Description() }));
                    return;
                }
                var discountTotal = {};
                discountTotal.Id = self.selectedDiscount().Id;
                discountTotal.Amount = parseFloat(discountAmount.toFixed(2));
                discountTotal.Remark = self.selectedDiscount().Description();
                self.selectedDiscountTotal(discountTotal);
                break;
            default:
                break;
        }
    };
    // Matches address with store
    // ****************************** //
    function GetStoreForCustomerAddress(addressId) {
        var url = localStorage.ApiAddress + "api/v3/da/Polygons/Address/Id/" + addressId;
        var showMessage = true;
        self.communication.Communicate(communicationTypesEnum.Get, url, null, CallbackGetStoreForCustomerAddress, null, showMessage);
    };
    // Selects store
    // ****************************** //
    function CallbackGetStoreForCustomerAddress(storeId) {
        if (storeId >= 0) {
            var store = ko.utils.arrayFirst(self.stores(), function (s) {
                return s.Id == storeId;
            });
            if (store != null) {
                self.SelectCustomerStore(store);
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
    // Selects price list for store and sale type
    // ****************************** //
    function GetPriceListForCustomerStoreSaleType() {
        var priceList = ko.utils.arrayFirst(self.priceLists(), function (p) {
            return (self.selectedCustomer() != null && self.selectedCustomer().Store != null ? self.selectedCustomer().Store.Id == p.DAStoreId : false) && ((p.PriceListType == priceListTypeEnum.Delivery && self.selectedSaleType().Type == saleTypeEnum.Delivery) || (p.PriceListType == priceListTypeEnum.Takeout && self.selectedSaleType().Type == saleTypeEnum.Takeout));
        });
        if (priceList != null) {
            self.selectedPriceList(priceList);
        }
        else {
            self.selectedPriceList(null);
        }
    };
    // Closes customer modal
    // ****************************** //
    function CallbackCloseCustomerAndAddresses() {
        $("#customerAddressesStore").modal("hide");
        self.updatingCustomer(false);
    };
    // Informs on error at updating customer
    // ****************************** //
    function ErrorCallbackCloseCustomerAndAddresses(message) {
        self.updatingCustomer(false);
    };
    // Opens complete order modal
    // ****************************** //
    function ShowCurrentOrder() {
        if (self.activeLoyalty() == loyaltyTypeEnum.Hit && self.selectedCustomer() != null && self.selectedCustomer().Customer.Loyalty) {
            GetLoyaltyOptions();
        }
        else if (self.activeLoyalty() == loyaltyTypeEnum.Goodys) {
            var storeId = self.selectedCustomer().Store.Id;
            var priceListId = self.selectedPriceList().PriceListId;
            var total = self.total();
            var items = self.orderItems();
            self.loyaltyGoodys.SetOrderInformation(storeId, priceListId, total, items);
        }
        self.selectedQuantity(1);
        self.showRecipe(false);
        $("#completeOrder").modal("show");
        if (self.selectedOrder() != null) {
            var elements = document.getElementsByClassName("order-info-remark");
            if (elements != null && elements.length > 0) {
                var element = elements[0];
                element.value = self.selectedOrderRemark;
            }
        }
    };
    // Clears customer and order data
    // ****************************** //
    function CallbackCompleteOrderConfirm() {
        toastr.success(language.Translate("OrderAdded", null));
        localStorage.GeneralCustomerOrder = "";
        localStorage.ModifyOrder = "";
        localStorage.RedoOrder = "";
        localStorage.StageOrder = "";
        localStorage.ClearOrder = "";
        setTimeout(function () {
            self.navigation.GoToModule(navigationViewsEnum.Customer, null);
        }, 150);
    };
    // Informs on error at posting new order
    // ****************************** //
    function ErrorCallbackCompleteOrderConfirm(message) {
        self.sendingOrder(false);
    };
    // Cancels selected order
    // ****************************** //
    function CancelSelectedOrder() {
        var orderId = self.selectedOrder().Id;
        var url = localStorage.ApiAddress + "api/v3/da/Orders/Cancel/Id/" + orderId;
        var showMessage = true;
        self.communication.Communicate(communicationTypesEnum.Get, url, null, CallbackCancelSelectedOrder, null, showMessage);
    };
    // Cancels selected order
    // ****************************** //
    function CallbackCancelSelectedOrder() {
        self.cancelSelectedOrder = false;
    };
    // #endregion
    // #region Loyalty
    // Opens loyalty options modal
    // ****************************** //
    self.ShowLoyaltyOptions = function (loyaltyOrigin) {
        if (self.selectedCustomer() != null && self.selectedCustomer().Customer.Loyalty) {
            if (self.hasVodafone()) {
                toastr.info(language.Translate("IncompatibleLoyaltyVodafone", null));
                return;
            }
            if (loyaltyOrigin == loyaltyOriginEnum.Item && self.selectedOrderItem().IsLoyalty()) {
                toastr.info(language.Translate("ProductAlreadyLoyalty", { description: self.selectedOrderItem().Description }));
                return;
            }
            if (self.loyaltyOptions() != null) {
                self.loyaltyOrigin = loyaltyOrigin;
                ko.utils.arrayForEach(self.loyaltyOptions().RedeemProduct, function (p) {
                    p.IsChecked(false);
                });
                if (self.loyaltyOrigin == loyaltyOriginEnum.Item) {
                    self.loyaltyOptions().RedeemDiscount = null;
                    var filteredRedeemProducts = self.loyaltyOptions().RedeemProduct;
                    self.loyaltyOptions().RedeemProduct = [];
                    ko.utils.arrayForEach(filteredRedeemProducts, function (p) {
                        if (p.ProductId == self.selectedOrderItem().ProductId || p.ProductCategoryId == self.selectedOrderItem().ProductCategoryId) {
                            self.loyaltyOptions().RedeemProduct.push(p);
                        }
                    });
                    self.loyaltyOptions.notifySubscribers();
                }
                else if (self.loyaltyOrigin == loyaltyOriginEnum.Total) {
                    self.discountOrigin = discountOriginEnum.Total;
                    self.RemoveDiscount();
                }
                $("#loyaltyOptions").modal("show");
            }
        }
        else {
            toastr.info(language.Translate("CustomerWithoutLoyalty", null));
        }
    };
    // Toggles loyalty option
    // ****************************** //
    self.CheckLoyaltyOption = function (option) {
        if (self.loyaltyOrigin == loyaltyOriginEnum.Item) {
            if (option.ProductCategoryId != null && option.Quantity < self.selectedOrderItem().Quantity()) {
                toastr.info(language.Translate("DenyLoyaltyDiscount", { description: self.selectedOrderItem().Description, quantity: self.selectedOrderItem().Quantity() }));
                return;
            }
            ko.utils.arrayForEach(self.loyaltyOptions().RedeemProduct, function (p) {
                if (p.IsChecked() && p != option) {
                    p.IsChecked(false);
                    var previousPoints = option.ProductCategoryId != null ? p.Points : p.Points * self.selectedOrderItem().Quantity();
                    var total = self.loyaltyOptions().SpentPoints() - previousPoints;
                    self.loyaltyOptions().SpentPoints(total);
                }
            });
        }
        option.IsChecked(!option.IsChecked());
        var points = option.Points;
        if (self.loyaltyOrigin == loyaltyOriginEnum.Item) {
            points = option.ProductCategoryId != null ? points : points * self.selectedOrderItem().Quantity();
        }
        if (option.IsChecked()) {
            var total = self.loyaltyOptions().SpentPoints() + points;
            if (total <= self.loyaltyOptions().AvailablePoints) {
                self.loyaltyOptions().SpentPoints(total);
            }
            else {
                toastr.info(language.Translate("LoyaltyDiscountExceeded", null));
                option.IsChecked(!option.IsChecked());
            }
        }
        else {
            var total = self.loyaltyOptions().SpentPoints() - points;
            self.loyaltyOptions().SpentPoints(total);
        }
    };
    // Applies loyalty discount
    // ****************************** //
    self.ShowLoyaltyOptionsConfirm = function () {
        switch (self.loyaltyOrigin) {
            case loyaltyOriginEnum.Item:
                InsertLoyaltyItem();
                break;
            case loyaltyOriginEnum.Total:
                InsertLoyaltyTotal();
                break;
            default:
                break;
        }
    };
    // Toggles loyalty free products
    // ****************************** //
    self.ToggleLoyaltyProduct = function (pageButton, addition) {
        var productOption = ko.utils.arrayFirst(self.loyaltyOptions().ProductOptions, function (o) {
            return o.ProductCategoryId == pageButton.ProductCategoryId;
        });
        if (productOption != null) {
            var foundProduct = ko.utils.arrayFirst(productOption.ProductList, function (p) {
                return p == pageButton;
            });
            if (foundProduct != null) {
                if (addition) {
                    productOption.InsertedProductList.push(foundProduct);
                    productOption.InsertedQuantity(productOption.InsertedQuantity() + 1);
                }
                else {
                    productOption.InsertedProductList.splice(productOption.InsertedProductList.indexOf(foundProduct), 1);
                    productOption.InsertedQuantity(productOption.InsertedQuantity() - 1);
                }
            }
        }
    };
    // Inserts loyalty free products per product category
    // ****************************** //
    self.CloseLoyaltyProductOptions = function () {
        var incompleteProductOption = ko.utils.arrayFirst(self.loyaltyOptions().ProductOptions, function (o) {
            return o.Quantity != o.InsertedQuantity();
        });
        if (incompleteProductOption != null) {
            toastr.warning(language.Translate("ChooseLoyaltyProducts", null));
            return;
        }
        ko.utils.arrayForEach(self.loyaltyOptions().ProductOptions, function (o) {
            ko.utils.arrayForEach(o.InsertedProductList(), function (p) {
                self.selectedQuantity(1);
                self.SelectPageButton(p, false);
                self.selectedOrderItem().Price(0);
                self.selectedOrderItem().IsLoyalty(true);
                self.CalculateSelectedOrderItemTotals();
            });
        });
        self.loyaltyOrigin = null;
        $("#loyaltyProductOptions").modal("hide");
    };
    // Closes loyalty options modal
    // ****************************** //
    self.ShowLoyaltyOptionsCancel = function () {
        self.loyaltyOrigin = null;
        ko.utils.arrayForEach(self.loyaltyOptions().RedeemProduct, function (p) {
            if (p.IsChecked()) {
                var total = self.loyaltyOptions().SpentPoints() - p.Points;
                self.loyaltyOptions().SpentPoints(total);
            }
        });
        $("#loyaltyOptions").modal("hide");
    };
    // Gets loyalty options for selected customer for current order
    // ****************************** //
    function GetLoyaltyOptions() {
        var loyaltyModel = {};
        loyaltyModel.Id = self.selectedCustomer().Customer.Id;
        loyaltyModel.Amount = self.total();
        var url = localStorage.ApiAddress + "api/v3/da/Loyalty/RedeemOptions";
        var showMessage = true;
        self.communication.Communicate(communicationTypesEnum.Post, url, loyaltyModel, CallbackGetLoyaltyOptions, null, showMessage);
    };
    // Gets loyalty options
    // ****************************** //
    function CallbackGetLoyaltyOptions(loyaltyOptions) {
        var availablePoints = self.selectedCustomer().Customer.LoyaltyPoints;
        var spentPoints = self.loyaltyOptions() != null ? self.loyaltyOptions().SpentPoints() : 0;
        var loyalty = new LoyaltyOptionsModel(loyaltyOptions, availablePoints, spentPoints);
        self.loyaltyOptions(loyalty);
    };
    // Applies loyalty item discount
    // ****************************** //
    function InsertLoyaltyItem() {
        self.loyaltyOptions().ProductOptions = [];
        self.selectedLoyaltyDiscountTotal(new LoyaltyDiscountTotalModel(self.selectedLoyaltyDiscountTotal()));
        ko.utils.arrayForEach(self.loyaltyOptions().RedeemProduct, function (p) {
            if (p.IsChecked()) {
                var points = p.ProductCategoryId != null ? p.Points : p.Points * self.selectedOrderItem().Quantity();
                self.selectedLoyaltyDiscountTotal().Points = self.selectedLoyaltyDiscountTotal().Points + points;
                self.selectedOrderItem().Price(0);
                self.selectedOrderItem().IsLoyalty(true);
                self.CalculateSelectedOrderItemTotals();
                if (p.ProductId != null) {
                    self.loyaltyOrigin = null;
                }
                else if (p.ProductCategoryId != null) {
                    if (p.Quantity == self.selectedOrderItem().Quantity()) {
                        self.loyaltyOrigin = null;
                    }
                    else {
                        p.Quantity = p.Quantity - self.selectedOrderItem().Quantity();
                        var productOption = new LoyaltyProductOptionModel(p);
                        var objectStore = db.transaction("pageButtons", "readwrite").objectStore("pageButtons").index("ProductCategoryId");
                        var request = objectStore.openCursor(p.ProductCategoryId);
                        request.onsuccess = function (event) {
                            var cursor = event.target.result;
                            if (cursor != null) {
                                var pageButton = new PageButtonModel(cursor.value);
                                if (pageButton.ShortageType == null) {
                                    productOption.ProductList.push(pageButton);
                                }
                                cursor.continue();
                            }
                            else {
                                if (productOption.ProductList.length > 0) {
                                    self.loyaltyOptions().ProductOptions.push(productOption);
                                    self.loyaltyOptions.notifySubscribers();
                                    $("#loyaltyProductOptions").modal("show");
                                }
                                else {
                                    self.loyaltyOrigin = null;
                                }
                            }
                        };
                    }
                }
                self.selectedLoyaltyDiscountTotal.notifySubscribers();
            }
        });
        $("#loyaltyOptions").modal("hide");
    };
    // Applies loyalty total discount
    // ****************************** //
    function InsertLoyaltyTotal() {
        self.loyaltyOptions().ProductOptions = [];
        self.selectedLoyaltyDiscountTotal(new LoyaltyDiscountTotalModel(self.selectedLoyaltyDiscountTotal()));
        if (self.loyaltyOptions().RedeemDiscount.IsChecked() && self.selectedLoyaltyDiscountTotal().Amount == 0) {
            self.selectedLoyaltyDiscountTotal().Amount = self.loyaltyOptions().RedeemDiscount.MaxDiscountAmount;
            self.selectedLoyaltyDiscountTotal().Points = self.selectedLoyaltyDiscountTotal().Points + self.loyaltyOptions().RedeemDiscount.Points;
        }
        var insertedProducts = 0;
        var products = [];
        ko.utils.arrayForEach(self.loyaltyOptions().RedeemProduct, function (p) {
            if (p.IsChecked()) {
                insertedProducts++;
                self.selectedLoyaltyDiscountTotal().Points = self.selectedLoyaltyDiscountTotal().Points + p.Points;
                if (p.ProductId != null) {
                    var objectStore = db.transaction("pageButtons", "readwrite").objectStore("pageButtons").index("ProductId");
                    var request = objectStore.openCursor(p.ProductId);
                    request.onsuccess = function (event) {
                        var cursor = event.target.result;
                        if (cursor != null) {
                            var pageButton = new PageButtonModel(cursor.value);
                            if (pageButton.ShortageType == null) {
                                self.selectedQuantity(p.Quantity);
                                self.SelectPageButton(pageButton, false);
                                self.selectedOrderItem().Price(0);
                                self.selectedOrderItem().IsLoyalty(true);
                                self.CalculateSelectedOrderItemTotals();
                            }
                            else {
                                toastr.info(language.Translate("ProductShortage", { description: pageButton.Description }))
                                self.selectedLoyaltyDiscountTotal().Points = self.selectedLoyaltyDiscountTotal().Points - p.Points;
                                var spentPoints = self.loyaltyOptions().SpentPoints() - p.Points;
                                self.loyaltyOptions().SpentPoints(spentPoints);
                            }
                            insertedProducts--;
                        }
                        else {
                            self.selectedLoyaltyDiscountTotal().Points = self.selectedLoyaltyDiscountTotal().Points - p.Points;
                            var total = self.loyaltyOptions().SpentPoints() - p.Points;
                            self.loyaltyOptions().SpentPoints(total);
                            toastr.info(language.Translate("ProductNotFound", { description: p.Product }));
                            insertedProducts--;
                        }
                    };
                }
                else if (p.ProductCategoryId != null) {
                    var productOption = new LoyaltyProductOptionModel(p);
                    self.loyaltyOptions().ProductOptions.push(productOption);
                    var objectStore = db.transaction("pageButtons", "readwrite").objectStore("pageButtons").index("ProductCategoryId");
                    var request = objectStore.openCursor(p.ProductCategoryId);
                    request.onsuccess = function (event) {
                        var cursor = event.target.result;
                        if (cursor != null) {
                            var pageButton = new PageButtonModel(cursor.value);
                            if (pageButton.ShortageType == null) {
                                products.push(pageButton);
                            }
                            cursor.continue();
                        }
                        else {
                            insertedProducts--;
                        }
                    };
                }
            }
        });
        var insertedAllProducts = setInterval(function () {
            if (insertedProducts == 0) {
                clearInterval(insertedAllProducts);
                if (products.length > 0) {
                    ko.utils.arrayForEach(products, function (p) {
                        var respectiveProductOption = ko.utils.arrayFirst(self.loyaltyOptions().ProductOptions, function (o) {
                            return o.ProductCategoryId == p.ProductCategoryId;
                        });
                        if (respectiveProductOption != null) {
                            respectiveProductOption.ProductList.push(p);
                        }
                    });
                    self.loyaltyOptions.notifySubscribers();
                    $("#loyaltyProductOptions").modal("show");
                }
                else {
                    self.loyaltyOrigin = null;
                }
                self.selectedLoyaltyDiscountTotal.notifySubscribers();
            }
        }, 100);
        $("#loyaltyOptions").modal("hide");
    };
    // Removes applied loyalty options
    // ****************************** //
    function RemoveLoyalty() {
        var loyaltyItems = [];
        ko.utils.arrayForEach(self.orderItems(), function (i) {
            if (i.IsLoyalty()) {
                loyaltyItems.push(i);
            }
        });
        ko.utils.arrayForEach(loyaltyItems, function (i) {
            self.orderItems.splice(self.orderItems.indexOf(i), 1);
        });
        self.loyaltyOptions(null);
        self.selectedLoyaltyDiscountTotal(null);
    };
    // #endregion
    // #region Coupons
    // Opens vodafone discounts modal
    // ****************************** //
    self.OpenVodafoneDiscounts = function () {
        if (self.hasLoyalty()) {
            toastr.info(language.Translate("IncompatibleLoyaltyVodafone", null));
            return;
        }
        $("#vodafoneDiscounts").modal("show");
    };
    // Applies vodafone discount
    // ****************************** //
    self.ApplyVodafoneDiscount = function (discount) {
        if (self.vodafoneCodeInput() == null || self.vodafoneCodeInput() == "") {
            toastr.warning(language.Translate("InsertVodafoneCode", null));
            return;
        }
        var calculatedOrderItems = [];
        var calculatedOrderItemsCounter = 0;
        var invalidPriceList = false;
        ko.utils.arrayForEach(self.orderItems(), function (i) {
            if (!i.IsVodafone() || i.IsVodafoneCalculated) {
                var associatedWithDiscountItem = ko.utils.arrayFirst(self.orderItems(), function (ii) {
                    return i.ProductCategoryId == ii.ProductCategoryId && ii.IsVodafone();
                });
                if (associatedWithDiscountItem != null) {
                    calculatedOrderItems.push(i)
                    if (i.IsVodafoneCalculated) {
                        calculatedOrderItemsCounter++;
                    }
                }
                if (i.Quantity() > 1) {
                    var priceList = ko.utils.arrayFirst(self.priceLists(), function (p) {
                        return (i.PriceListId == p.PriceListId) && (self.selectedCustomer() != null ? self.selectedCustomer().Store.Id == p.DAStoreId : false) && ((p.PriceListType == priceListTypeEnum.Delivery && self.selectedSaleType().Type == saleTypeEnum.Delivery) || (p.PriceListType == priceListTypeEnum.Takeout && self.selectedSaleType().Type == saleTypeEnum.Takeout));
                    });
                    if (priceList != null) {
                        var remainingQuantity = i.Quantity() - 1;
                        self.selectedOrderItem(i);
                        self.selectedOrderItem().Quantity(1);
                        self.selectedOrderItem().Discount(0);
                        self.selectedOrderItem().DiscountId = null;
                        ko.utils.arrayForEach(self.selectedOrderItem().Extras(), function (e) {
                            e.Price(e.StartPrice);
                        });
                        self.CalculateSelectedOrderItemTotals();
                        for (j = 0; j < remainingQuantity; j++) {
                            var splittedOrderItem = new OrderItemModel(i, 1, priceList, null);
                            self.orderItems.push(splittedOrderItem);
                        }
                        UpdateOrderItemsDisplay();
                    }
                    else {
                        invalidPriceList = true;
                    }
                }
            }
        });
        if (invalidPriceList) {
            toastr.info(language.Translate("PriceListProductMismatch", { description: i.Description }));
            return;
        }
        calculatedOrderItems.sort(function (left, right) { return left.TotalWithExtras() == right.TotalWithExtras() ? 0 : (left.TotalWithExtras() > right.TotalWithExtras() ? -1 : 1) });
        ko.utils.arrayForEach(calculatedOrderItems, function (coi) {
            if (calculatedOrderItemsCounter != 0) {
                coi.IsVodafone(true);
                coi.IsVodafoneCalculated = true;
                calculatedOrderItemsCounter--;
            }
            else {
                coi.IsVodafone(false);
                coi.IsVodafoneCalculated = false;
            }
        });
        var currentDiscount = new VodafoneOptionsModel(discount);
        ko.utils.arrayForEach(self.orderItems(), function (i) {
            var foundDiscount = ko.utils.arrayFirst(currentDiscount.ProductCategories, function (c) {
                return c.ProductCategoryId == i.ProductCategoryId && !i.IsVodafone();
            });
            if (foundDiscount != null) {
                foundDiscount.Found = foundDiscount.Found + i.Quantity();
            }
        });
        var foundCompletedDiscount = ko.utils.arrayFirst(currentDiscount.ProductCategories, function (c) {
            return c.Found >= currentDiscount.FromItems;
        });
        if (foundCompletedDiscount != null) {
            ko.utils.arrayForEach(self.orderItems(), function (i) {
                if (i.ProductCategoryId == foundCompletedDiscount.ProductCategoryId) {
                    self.selectedOrderItem(i);
                    self.selectedOrderItem().Discount(0);
                    self.selectedOrderItem().DiscountId = null;
                    ko.utils.arrayForEach(self.selectedOrderItem().Extras(), function (e) {
                        e.Price(e.StartPrice);
                    });
                    self.CalculateSelectedOrderItemTotals();
                }
            });
            var foundItems = [];
            ko.utils.arrayForEach(self.orderItems(), function (i) {
                if (i.ProductCategoryId == foundCompletedDiscount.ProductCategoryId && !i.IsVodafone()) {
                    foundItems.push(i);
                }
            });
            foundItems.sort(function (left, right) { return left.TotalWithExtras() == right.TotalWithExtras() ? 0 : (left.TotalWithExtras() < right.TotalWithExtras() ? -1 : 1) });
            var nullified = 0;
            ko.utils.arrayForEach(foundItems, function (i) {
                self.selectedOrderItem(i);
                if (nullified < currentDiscount.RemoveItems) {
                    self.selectedOrderItem().Price(0);
                    self.selectedOrderItem().IsVodafone(true);
                    ko.utils.arrayForEach(self.selectedOrderItem().Extras(), function (e) {
                        e.StartPrice = 0;
                        e.Price(0);
                    });
                    self.CalculateSelectedOrderItemTotals();
                    nullified++;
                }
            });
            foundItems.sort(function (left, right) { return left.TotalWithExtras() == right.TotalWithExtras() ? 0 : (left.TotalWithExtras() > right.TotalWithExtras() ? -1 : 1) });
            ko.utils.arrayForEach(foundItems, function (i) {
                self.selectedOrderItem(i);
                if (nullified < currentDiscount.FromItems) {
                    self.selectedOrderItem().IsVodafone(true);
                    self.selectedOrderItem().IsVodafoneCalculated = true;
                    nullified++;
                }
            });
            var lastItem = self.orderItems()[self.orderItems().length - 1];
            self.selectedOrderItem(lastItem);
            var vodafoneCode = new VodafoneCodeModel();
            vodafoneCode.VodafoneCode = self.vodafoneCodeInput();
            vodafoneCode.VodafoneId = discount.Id;
            vodafoneCode.VodafonePromo = discount.Description;
            var vodafoneOption = new VodafoneOptionsModel(discount);
            vodafoneCode.VodafoneOption = vodafoneOption;
            self.insertedVodafoneCodes.push(vodafoneCode);
            $("#vodafoneDiscounts").modal("hide");
            self.vodafoneCodeInput(null);
        }
        else {
            toastr.info(language.Translate("VodafoneDiscountLacking", null));
        }
    };
    // Closes vodafone discounts modal
    // ****************************** //
    self.CloseVodafoneDiscounts = function () {
        $("#vodafoneDiscounts").modal("hide");
        self.vodafoneCodeInput(null);
    };
    // Removes vodafone discounts
    // ****************************** //
    function RemoveVodafoneDiscounts() {
        var previousItem = self.selectedOrderItem();
        ko.utils.arrayForEach(self.orderItems(), function (i) {
            if (i.IsVodafone()) {
                self.selectedOrderItem(i);
                if (i.IsVodafoneCalculated) {
                    i.IsVodafone(false);
                    i.IsVodafoneCalculated = false;
                }
                else {
                    i.IsVodafone(false);
                    var priceListDetail = ko.utils.arrayFirst(i.PriceListDetails, function (d) {
                        return d.PriceListId == i.PriceListId;
                    });
                    if (priceListDetail != null) {
                        i.Price(priceListDetail.Price);
                    }
                    ko.utils.arrayForEach(i.Extras(), function (e) {
                        var extraPriceListDetail = ko.utils.arrayFirst(e.PriceListDetails, function (d) {
                            return d.PriceListId == e.PriceListId;
                        });
                        if (extraPriceListDetail != null) {
                            e.Price(extraPriceListDetail.Price);
                            e.StartPrice = extraPriceListDetail.Price;
                        }
                    });
                }
                self.CalculateSelectedOrderItemTotals();
            }
        });
        self.selectedOrderItem(previousItem);
        ReApplyVodafoneDiscounts();
    };
    // Re-applies vodafone discounts
    // ****************************** //
    function ReApplyVodafoneDiscounts() {
        var previousItem = self.selectedOrderItem();
        var vodafoneCodesToApply = [];
        ko.utils.arrayForEach(self.insertedVodafoneCodes, function (c) {
            vodafoneCodesToApply.push(c);
        });
        self.insertedVodafoneCodes = [];
        ko.utils.arrayForEach(vodafoneCodesToApply, function (c) {
            self.vodafoneCodeInput(c.VodafoneCode);
            self.ApplyVodafoneDiscount(c.VodafoneOption);
            self.vodafoneCodeInput(null);
        });
        self.selectedOrderItem(previousItem);
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