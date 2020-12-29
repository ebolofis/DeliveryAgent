function CustomGoodys(communication, allowCustomerManagement, allowApplyCoupon) {
    var goodys = this;
    goodys.communication = communication;
    goodys.allowCustomerManagement = allowCustomerManagement;
    goodys.allowApplyCoupon = allowApplyCoupon;
    goodys.applyCouponCallback = null;
    goodys.postApplyCouponCallback = null;
    goodys.removeCouponCallback = null;
    goodys.storeId = 0;
    goodys.priceListId = 0;
    goodys.total = 0;
    goodys.items = ko.observableArray([]);
    goodys.previousCoupons = null;
    // #region Loyalty
    goodys.loyaltyProductCode = null;
    goodys.loyaltyId = null;
    goodys.isLoyalty = ko.observable(false);
    goodys.loyaltyInfo = ko.observable(null);
    goodys.points = ko.observable(0);
    goodys.giftCards = ko.observable(0);
    goodys.loyaltyIdInput = null;
    goodys.notifyLoyaltyStatus = false;
    goodys.loyaltyStatusNotified = false;
    // #endregion
    // #region Coupons
    goodys.couponProductCode = null;
    goodys.couponTypes = ko.observableArray([
        { Description: language.Translate("GoodysCoupon", null), Type: 0 },
        { Description: language.Translate("GoodysGiftCard", null), Type: 1 }
    ]);
    goodys.couponCode = null;
    goodys.couponType = ko.observable(goodys.couponTypes()[0]);
    goodys.couponInfo = ko.observable(null);
    goodys.couponDiscount = ko.observable(0);
    goodys.suggestedProducts = ko.observableArray([]);
    goodys.suggestedProductsDiscount = [];
    goodys.validatingCoupon = false;
    goodys.applyingCoupon = false;
    // #endregion

    goodys.RestoreAppliedDiscount = function (couponInfo) {
        if (couponInfo.CouponCode != null || (couponInfo.Coupons != null && couponInfo.Coupons.length > 0)) {
            var previousAppliedCoupons = new PreviousAppliedCouponsModel(couponInfo);
            goodys.previousCoupons = previousAppliedCoupons;
        }
    };

    goodys.SetCallbackFunctions = function (applyCouponCallback, postApplyCouponCallback, removeCouponCallback) {
        goodys.applyCouponCallback = applyCouponCallback;
        goodys.postApplyCouponCallback = postApplyCouponCallback;
        goodys.removeCouponCallback = removeCouponCallback;
    };

    goodys.SetOrderInformation = function (storeId, priceListId, total, items) {
        goodys.storeId = storeId;
        goodys.priceListId = priceListId;
        goodys.total = total;
        goodys.items(items);
        goodys.ShowLoyaltyInformation();
        goodys.ShowCouponInformation();
    };

    goodys.GetAppliedDiscount = function () {
        var appliedDiscount = new GoodysAppliedDiscountModel();
        if (goodys.previousCoupons == null) {
            appliedDiscount.ExternalOrderId = null;
            appliedDiscount.Loyalty = GetAppliedLoyalty();
            appliedDiscount.Coupon = GetAppliedCoupon();
        }
        else {
            appliedDiscount.ExternalOrderId = goodys.previousCoupons.ExternalOrderId;
            if (goodys.previousCoupons.Coupons != null && goodys.previousCoupons.Coupons.length > 0) {
                var previousAppliedLoyalty = new LoyaltyGoodysAppliedCouponsModel();
                previousAppliedLoyalty.LoyaltyId = goodys.previousCoupons.LoyaltyId;
                ko.utils.arrayForEach(goodys.previousCoupons.Coupons, function (c) {
                    var previousLoyaltyCoupon = new LoyaltyGoodysAppliedCouponModel();
                    previousLoyaltyCoupon.CampaignName = c.CampaignName;
                    previousLoyaltyCoupon.CouponCode = c.CouponCode;
                    previousLoyaltyCoupon.CouponType = c.CouponType;
                    previousAppliedLoyalty.Coupons.push(previousLoyaltyCoupon);
                });
                appliedDiscount.Loyalty = previousAppliedLoyalty;
            }
            if (goodys.previousCoupons.CouponCode != null) {
                var previousAppliedCoupon = new GoodysAppliedCouponModel();
                previousAppliedCoupon.CampaignName = goodys.previousCoupons.CampaignName;
                previousAppliedCoupon.CouponCode = goodys.previousCoupons.CouponCode;
                previousAppliedCoupon.CouponType = goodys.previousCoupons.CouponType;
                appliedDiscount.Coupon = previousAppliedCoupon;
            }
        }
        return appliedDiscount;
    };

    goodys.ClearOrderInformation = function () {
        goodys.storeId = 0;
        goodys.priceListId = 0;
        goodys.total = 0;
        goodys.items([]);
        InitializeLoyaltyCoupons();
        InitializeCoupon();
    };

    // #region Loyalty

    goodys.GetLoyaltyPoints = function (email, phone) {
        InitializeLoyalty();
        GetPoints(email, phone);
    };

    goodys.GetLoyaltyPointsByOtherPhone = function () {
        if (goodys.loyaltyIdInput == null || goodys.loyaltyIdInput == "") {
            toastr.warning(language.Translate("InsertPhone", null));
            return;
        }
        InitializeLoyalty();
        var email = null;
        var phone = goodys.loyaltyIdInput;
        GetPoints(email, phone);
    };

    goodys.ShowLoyaltyInformation = function () {
        if (!$("#goodysLoyaltyCustomerInfo").is(":visible")) {
            $("#goodysLoyaltyCustomerInfo").show();
            $("#goodysLoyaltyCustomerInfo").draggable();
        }
    };

    goodys.ApplyLoyaltyCoupon = function (coupon) {
        if (goodys.previousCoupons != null) {
            toastr.info(language.Translate("GoodysPreviousCoupons", null));
            return;
        }
        if (!coupon.CouponApplied()) {
            ApplyLoyaltyCoupon(coupon);
        }
        else {
            RemoveLoyaltyCoupon(coupon);
        }
    };

    goodys.HideLoyaltyInformation = function () {
        if ($("#goodysLoyaltyCustomerInfo").is(":visible")) {
            $("#goodysLoyaltyCustomerInfo").hide();
        }
    };

    goodys.NotifyLoyaltyStatus = function () {
        if (goodys.allowCustomerManagement) {
            switch (goodys.loyaltyInfo().status) {
                case loyaltyGoodysCustomerStatus.Inactive:
                    $("#goodysLoyaltyRegisterCustomer").modal("show");
                    break;
                case loyaltyGoodysCustomerStatus.PendingExternal:
                    $("#goodysLoyaltyActivateCustomer").modal("show");
                    break;
                case loyaltyGoodysCustomerStatus.Pending:
                    $("#goodysLoyaltyPendingCustomer").modal("show");
                    break;
                default:
                    break;
            }
            goodys.loyaltyStatusNotified = true;
        }
    };

    goodys.RegisterLoyaltyCustomerConfirm = function () {
        var loyaltyId = goodys.loyaltyId;
        var url = localStorage.ApiAddress + "api/UpdateStatusOfInactiveRegisteredCustomer/" + loyaltyId;
        var showMessage = true;
        goodys.communication.Communicate(communicationTypesEnum.Post, url, null, CallbackRegisterLoyaltyCustomerConfirm, null, showMessage);
    };

    goodys.RegisterLoyaltyCustomerCancel = function () {
        $("#goodysLoyaltyRegisterCustomer").modal("hide");
    };

    goodys.ActivateLoyaltyCustomerConfirm = function () {
        var loyaltyId = goodys.loyaltyId;
        var url = localStorage.ApiAddress + "api/ResendSMStoPendingExternalCustomers/" + loyaltyId;
        var showMessage = true;
        goodys.communication.Communicate(communicationTypesEnum.Post, url, null, CallbackActivateLoyaltyCustomerConfirm, null, showMessage);
    };

    goodys.ActivateLoyaltyCustomerCancel = function () {
        $("#goodysLoyaltyActivateCustomer").modal("hide");
    };

    goodys.ActivatePendingCustomer = function () {
        $("#goodysLoyaltyPendingCustomer").modal("hide");
    };

    goodys.SetSupplementaryLoyaltyProduct = function (code) {
        goodys.loyaltyProductCode = code;
    };

    function InitializeLoyalty() {
        RefreshLoyalty();
        goodys.notifyLoyaltyStatus = false;
        goodys.loyaltyStatusNotified = false;
    };

    function RefreshLoyalty() {
        goodys.loyaltyId = null;
        goodys.isLoyalty(false);
        goodys.loyaltyInfo(null);
        goodys.points(0);
        goodys.giftCards(0);
    };

    function InitializeLoyaltyCoupons() {
        ko.utils.arrayForEach(goodys.loyaltyInfo().AvailableCouponList, function (c) {
            c.CouponApplied(false);
        });
        ko.utils.arrayForEach(goodys.loyaltyInfo().DefaultCouponList, function (c) {
            c.CouponApplied(false);
        });
        ko.utils.arrayForEach(goodys.loyaltyInfo().PersonalizedCouponList, function (c) {
            c.CouponApplied(false);
        });
    };

    function GetPoints(email, phone) {
        if (email != null || phone != null) {
            var url = localStorage.ApiAddress + "api/getLoyaltyMember/" + email + "/" + phone;
            var showMessage = true;
            goodys.communication.Communicate(communicationTypesEnum.Get, url, null, CallbackGetPoints, null, showMessage);
        }
    };

    function CallbackGetPoints(loyaltyInfoJson) {
        if (loyaltyInfoJson != null) {
            var loyaltyInfoRaw = JSON.parse(loyaltyInfoJson);
            switch (loyaltyInfoRaw.result) {
                case goodysResponseEnum.Success:
                    HandleLoyaltySuccessResult(loyaltyInfoRaw);
                    break;
                case goodysResponseEnum.Error:
                case goodysResponseEnum.Failure:
                    toastr.error(loyaltyInfoRaw.failReason);
                    break;
                default:
                    break;
            }
        }
    };

    function HandleLoyaltySuccessResult(loyaltyInfoRaw) {
        switch (loyaltyInfoRaw.status) {
            case loyaltyGoodysCustomerStatus.Active:
                HandleActiveStatus(loyaltyInfoRaw);
                break;
            case loyaltyGoodysCustomerStatus.Inactive:
                if (goodys.allowCustomerManagement) {
                    HandleInactiveStatus(loyaltyInfoRaw);
                }
                break;
            case loyaltyGoodysCustomerStatus.PendingExternal:
                if (goodys.allowCustomerManagement) {
                    HandlePendingExternalStatus(loyaltyInfoRaw);
                }
                break;
            case loyaltyGoodysCustomerStatus.Pending:
                if (goodys.allowCustomerManagement) {
                    HandlePendingStatus(loyaltyInfoRaw);
                }
                break;
            default:
                break;
        }
    };

    function HandleActiveStatus(loyaltyInfoRaw) {
        var loyaltyInfo = new LoyaltyGoodysInformationModel(loyaltyInfoRaw);
        goodys.loyaltyInfo(loyaltyInfo);
        var loyaltyId = loyaltyInfo.LoyaltyId;
        goodys.loyaltyId = loyaltyId;
        var loyaltyPoints = loyaltyInfo.Points;
        goodys.points(loyaltyPoints);
        var loyaltyGiftCardsMultitude = loyaltyInfo.AvailableCouponList.length + loyaltyInfo.DefaultCouponList.length + loyaltyInfo.PersonalizedCouponList.length;
        goodys.giftCards(loyaltyGiftCardsMultitude);
        goodys.isLoyalty(true);
        goodys.notifyLoyaltyStatus = false;
        ClearLoyaltyIdInput();
    };

    function HandleInactiveStatus(loyaltyInfoRaw) {
        var loyaltyInfo = new LoyaltyGoodysInformationModel(loyaltyInfoRaw);
        goodys.loyaltyInfo(loyaltyInfo);
        var loyaltyId = loyaltyInfo.LoyaltyId;
        goodys.loyaltyId = loyaltyId;
        var loyaltyPoints = loyaltyInfo.Points;
        goodys.points(loyaltyPoints);
        var loyaltyGiftCardsMultitude = loyaltyInfo.AvailableCouponList.length + loyaltyInfo.DefaultCouponList.length + loyaltyInfo.PersonalizedCouponList.length;
        goodys.giftCards(loyaltyGiftCardsMultitude);
        goodys.isLoyalty(false);
        goodys.notifyLoyaltyStatus = true;
        ClearLoyaltyIdInput();
    };

    function HandlePendingExternalStatus(loyaltyInfoRaw) {
        var loyaltyInfo = new LoyaltyGoodysInformationModel(loyaltyInfoRaw);
        goodys.loyaltyInfo(loyaltyInfo);
        var loyaltyId = loyaltyInfo.LoyaltyId;
        goodys.loyaltyId = loyaltyId;
        var loyaltyPoints = loyaltyInfo.Points;
        goodys.points(loyaltyPoints);
        var loyaltyGiftCardsMultitude = loyaltyInfo.AvailableCouponList.length + loyaltyInfo.DefaultCouponList.length + loyaltyInfo.PersonalizedCouponList.length;
        goodys.giftCards(loyaltyGiftCardsMultitude);
        goodys.isLoyalty(false);
        goodys.notifyLoyaltyStatus = true;
        ClearLoyaltyIdInput();
    };

    function HandlePendingStatus(loyaltyInfoRaw) {
        var loyaltyInfo = new LoyaltyGoodysInformationModel(loyaltyInfoRaw);
        goodys.loyaltyInfo(loyaltyInfo);
        var loyaltyId = loyaltyInfo.LoyaltyId;
        goodys.loyaltyId = loyaltyId;
        var loyaltyPoints = loyaltyInfo.Points;
        goodys.points(loyaltyPoints);
        var loyaltyGiftCardsMultitude = loyaltyInfo.AvailableCouponList.length + loyaltyInfo.DefaultCouponList.length + loyaltyInfo.PersonalizedCouponList.length;
        goodys.giftCards(loyaltyGiftCardsMultitude);
        goodys.isLoyalty(false);
        goodys.notifyLoyaltyStatus = true;
        ClearLoyaltyIdInput();
    };

    function ClearLoyaltyIdInput() {
        goodys.loyaltyIdInput = null;
        var element = document.getElementById("loyaltyId");
        if (element != null) {
            element.value = goodys.loyaltyIdInput;
        }
    };

    function CallbackRegisterLoyaltyCustomerConfirm(registeredCustomer) {
        $("#goodysLoyaltyRegisterCustomer").modal("hide");
        if (registeredCustomer != null) {
            var loyaltyRegisteredCustomerRaw = JSON.parse(registeredCustomer);
            var loyaltyRegisteredCustomer = new LoyaltyGoodysRegisteredCustomerModel(loyaltyRegisteredCustomerRaw);
            var email = loyaltyRegisteredCustomer.Email != "" ? loyaltyRegisteredCustomer.Email : null;
            var phone = loyaltyRegisteredCustomer.LoyaltyId != "" ? loyaltyRegisteredCustomer.LoyaltyId : null;
            RefreshLoyalty();
            GetPoints(email, phone);
        }
        else {
            var email = goodys.loyaltyInfo().Email != "" ? goodys.loyaltyInfo().Email : null;
            var phone = goodys.loyaltyInfo().LoyaltyId != "" ? goodys.loyaltyInfo().LoyaltyId : null;
            RefreshLoyalty();
            GetPoints(email, phone);
        }
    };

    function CallbackActivateLoyaltyCustomerConfirm(activatedCustomer) {
        $("#goodysLoyaltyActivateCustomer").modal("hide");
        var email = goodys.loyaltyInfo().Email != "" ? goodys.loyaltyInfo().Email : null;
        var phone = goodys.loyaltyInfo().LoyaltyId != "" ? goodys.loyaltyInfo().LoyaltyId : null;
        RefreshLoyalty();
        GetPoints(email, phone);
    };

    function ApplyLoyaltyCoupon(coupon) {
        if (!coupon.IsValid) {
            toastr.info(language.Translate("GoodysLoyaltyCouponInvalid", null));
            return;
        }
        else if (moment.duration(moment().diff(moment(coupon.ExpirationDateFormatted))).asDays() > 0) {
            toastr.info(language.Translate("GoodysLoyaltyCouponExpired", null));
            return;
        }
        else if (coupon.MinimumOrderValue > goodys.total) {
            toastr.info(language.Translate("GoodysLoyaltyCouponMinimumTotal", { total: coupon.MinimumOrderValue.toFixed(2) }));
            return;
        }
        else if (coupon.Discount > goodys.total) {
            toastr.info(language.Translate("GoodysLoyaltyCouponMinimumDiscount", null));
            return;
        }
        var dbTransaction = db.transaction("pageButtons");
        var dbObjectStore = dbTransaction.objectStore("pageButtons");
        var dbIndex = dbObjectStore.index("Code");
        var singleKeyRangeMain = IDBKeyRange.only(coupon.VoucherId);
        var dbRequestMain = dbIndex.openCursor(singleKeyRangeMain);
        dbRequestMain.onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor != null) {
                var pageButtonMain = new PageButtonModel(cursor.value);
                var priceListDetail = ko.utils.arrayFirst(pageButtonMain.PriceListDetails, function (pd) {
                    return pd.PriceListId == goodys.priceListId;
                });
                if (priceListDetail != null) {
                    var vatId = priceListDetail.VatId;
                    var itemsTotalWithVat = 0;
                    var itemsTotal = 0;
                    ko.utils.arrayForEach(goodys.items(), function (i) {
                        if (i.VatId == vatId) {
                            itemsTotalWithVat += i.TotalWithExtras();
                        }
                        itemsTotal += i.TotalWithExtras();
                    });
                    if (itemsTotal == itemsTotalWithVat) {
                        InsertLoyaltyItem(pageButtonMain, coupon.Discount, coupon.CouponCode);
                        coupon.CouponApplied(true);
                    }
                    else {
                        var singleKeyRangeSupplementary = IDBKeyRange.only(goodys.loyaltyProductCode);
                        var dbRequestSupplementary = dbIndex.openCursor(singleKeyRangeSupplementary);
                        dbRequestSupplementary.onsuccess = function (event) {
                            var cursor = event.target.result;
                            if (cursor != null) {
                                var pageButtonSupplementary = new PageButtonModel(cursor.value);
                                var priceListDetail = ko.utils.arrayFirst(pageButtonSupplementary.PriceListDetails, function (pd) {
                                    return pd.PriceListId == goodys.priceListId;
                                });
                                if (priceListDetail != null) {
                                    var totalDifference = itemsTotal - itemsTotalWithVat;
                                    if (totalDifference >= coupon.Discount) {
                                        InsertLoyaltyItem(pageButtonSupplementary, coupon.Discount, coupon.CouponCode);
                                        coupon.CouponApplied(true);
                                    }
                                    else {
                                        if (totalDifference > 0) {
                                            InsertLoyaltyItem(pageButtonSupplementary, totalDifference, coupon.CouponCode);
                                        }
                                        InsertLoyaltyItem(pageButtonMain, coupon.Discount - totalDifference, coupon.CouponCode);
                                        coupon.CouponApplied(true);
                                    }
                                }
                                else {
                                    toastr.info(language.Translate("GoodysProductPriceListNotFound", { code: goodys.loyaltyProductCode }));
                                }
                            }
                            else {
                                toastr.info(language.Translate("GoodysProductNotFound", { code: goodys.loyaltyProductCode }));
                            }
                        }
                    }
                }
                else {
                    toastr.info(language.Translate("GoodysProductPriceListNotFound", { code: coupon.VoucherId }));
                }
            }
            else {
                toastr.info(language.Translate("GoodysProductNotFound", { code: coupon.VoucherId }));
            }
        }
    };

    function RemoveLoyaltyCoupon(coupon) {
        var itemsToRemove = [];
        ko.utils.arrayForEach(goodys.items(), function (i) {
            if (i.GoodysCouponCode == coupon.CouponCode) {
                itemsToRemove.push(i);
            }
        });
        ko.utils.arrayForEach(itemsToRemove, function (i) {
            if (goodys.removeCouponCallback) {
                goodys.removeCouponCallback(i);
            }
            goodys.total += (i.TotalWithExtras() * (-1));
        });
        coupon.CouponApplied(false);
    };

    function InsertLoyaltyItem(pageButton, discount, code) {
        if (goodys.applyCouponCallback != null) {
            goodys.applyCouponCallback(pageButton, false);
            var lastItem = goodys.items()[goodys.items().length - 1];
            var discountPrice = discount * (-1);
            lastItem.Price(parseFloat(discountPrice.toFixed(2)));
            lastItem.IsGoodys(true);
            lastItem.GoodysCouponCode = code;
            if (goodys.postApplyCouponCallback != null) {
                goodys.postApplyCouponCallback();
            }
            goodys.total -= discount;
        }
    };

    function GetAppliedLoyalty() {
        if (goodys.loyaltyInfo() != null) {
            var appliedCoupons = new LoyaltyGoodysAppliedCouponsModel();
            appliedCoupons.LoyaltyId = goodys.loyaltyId;
            ko.utils.arrayForEach(goodys.loyaltyInfo().AvailableCouponList, function (c) {
                if (c.CouponApplied()) {
                    var appliedCoupon = new LoyaltyGoodysAppliedCouponModel();
                    appliedCoupon.CampaignName = c.CampaignName;
                    appliedCoupon.CouponCode = c.CouponCode;
                    appliedCoupon.CouponType = c.CouponType;
                    appliedCoupons.Coupons.push(appliedCoupon);
                }
            });
            ko.utils.arrayForEach(goodys.loyaltyInfo().DefaultCouponList, function (c) {
                if (c.CouponApplied()) {
                    var appliedCoupon = new LoyaltyGoodysAppliedCouponModel();
                    appliedCoupon.CampaignName = c.CampaignName;
                    appliedCoupon.CouponCode = c.CouponCode;
                    appliedCoupon.CouponType = c.CouponType;
                    appliedCoupons.Coupons.push(appliedCoupon);
                }
            });
            ko.utils.arrayForEach(goodys.loyaltyInfo().PersonalizedCouponList, function (c) {
                if (c.CouponApplied()) {
                    var appliedCoupon = new LoyaltyGoodysAppliedCouponModel();
                    appliedCoupon.CampaignName = c.CampaignName;
                    appliedCoupon.CouponCode = c.CouponCode;
                    appliedCoupon.CouponType = c.CouponType;
                    appliedCoupons.Coupons.push(appliedCoupon);
                }
            });
            return appliedCoupons;
        }
        else {
            return null;
        }
    };

    // #endregion

    // #region Coupons

    goodys.SetSupplementaryCouponProduct = function (code) {
        goodys.couponProductCode = code;
    };

    goodys.ShowCouponValidation = function () {
        if (goodys.previousCoupons != null) {
            toastr.info(language.Translate("GoodysPreviousCoupons", null));
            return;
        }
        $("#goodysValidateCoupon").modal("show");
        var elements = document.getElementsByClassName("goodys-coupon-input");
        if (elements != null && elements.length > 0) {
            var element = elements[0];
            element.value = goodys.couponCode;
        }
    };

    goodys.SelectCouponType = function (type) {
        goodys.couponType(type);
    };

    goodys.ValidateCoupon = function () {
        if (goodys.validatingCoupon) {
            return;
        }
        if (goodys.couponCode == null || goodys.couponCode == "") {
            toastr.warning(language.Translate("GoodysInsertCouponCode", null));
            return;
        }
        goodys.validatingCoupon = true;
        RemovePreviousCoupon();
        var couponCode = goodys.couponCode;
        var couponType = goodys.couponType().Type;
        var loyaltyId = goodys.loyaltyId;
        var url = localStorage.ApiAddress + "api/validateCoupon/" + couponCode + "/" + couponType + "/" + loyaltyId;
        var showMessage = true;
        goodys.communication.Communicate(communicationTypesEnum.Get, url, null, CallbackValidateCoupon, null, showMessage);
    };

    goodys.ShowCouponValidationConfirm = function () {
        if (goodys.couponInfo() == null) {
            toastr.info(language.Translate("GoodysCouponInsertCoupon", null));
            return;
        }
        else if (!goodys.couponInfo().IsValid) {
            toastr.info(language.Translate("GoodysCouponInvalid", null));
            return;
        }
        else if (moment.duration(moment().diff(moment(goodys.couponInfo().ExpirationDateFormatted))).asDays() > 0) {
            toastr.info(language.Translate("GoodysCouponExpired", null));
            return;
        }
        $("#goodysValidateCoupon").modal("hide");
    };

    goodys.ShowCouponValidationCancel = function () {
        InitializeCoupon();
        $("#goodysValidateCoupon").modal("hide");
    };

    goodys.ShowCouponInformation = function () {
        if (goodys.couponInfo() != null && !goodys.couponInfo().CouponApplied()) {
            $("#goodysApplyCoupon").modal("show");
        }
    };

    goodys.ShowCouponInformationConfirm = function () {
        if (goodys.applyingCoupon) {
            return;
        }
        if (goodys.couponInfo().MinimumOrderValue > goodys.total) {
            toastr.info(language.Translate("GoodysCouponMinimumTotal", { total: goodys.couponInfo().MinimumOrderValue.toFixed(2) }));
            return;
        }
        goodys.applyingCoupon = true;
        switch (goodys.couponInfo().Type) {
            case couponGoodysDiscountType.GiftCard:
                HandleGiftCardCoupon();
                break;
            case couponGoodysDiscountType.Percentage:
                HandlePercentageCoupon();
                break;
            case couponGoodysDiscountType.Absolute:
                HandleAbsoluteCoupon();
                break;
            case couponGoodysDiscountType.FreeItem:
                HandleFreeItemCoupon();
                break;
            case couponGoodysDiscountType.BuyXGetOne:
                HandleBuyXGetOneCoupon();
                break;
            default:
                break;
        }
    };

    goodys.ShowCouponInformationCancel = function () {
        if (goodys.applyingCoupon) {
            return;
        }
        $("#goodysApplyCoupon").modal("hide");
    };

    goodys.InsertCouponProduct = function (item) {
        var priceListDetailMain = ko.utils.arrayFirst(item.PriceListDetails, function (pd) {
            return pd.PriceListId == goodys.priceListId;
        });
        if (priceListDetailMain != null) {
            var supplementaryProduct = ko.utils.arrayFirst(goodys.suggestedProductsDiscount, function (d) {
                return d.ProductId == item.Code;
            });
            if (supplementaryProduct != null) {
                var dbTransaction = db.transaction("pageButtons");
                var dbObjectStore = dbTransaction.objectStore("pageButtons");
                var dbIndex = dbObjectStore.index("Code");
                var singleKeyRangeSupplementary = IDBKeyRange.only(supplementaryProduct.VoucherId);
                var dbRequestSupplementary = dbIndex.openCursor(singleKeyRangeSupplementary);
                dbRequestSupplementary.onsuccess = function (event) {
                    var cursor = event.target.result;
                    if (cursor != null) {
                        var pageButtonSupplementary = new PageButtonModel(cursor.value);
                        var priceListDetailSupplementary = ko.utils.arrayFirst(pageButtonSupplementary.PriceListDetails, function (pd) {
                            return pd.PriceListId == goodys.priceListId;
                        });
                        if (priceListDetailSupplementary != null) {
                            var mainItemPrice = priceListDetailMain.Price;
                            InsertCouponItem(item, mainItemPrice, goodys.couponInfo().Code);
                            var supplementaryItemPrice = priceListDetailMain.Price * (-1);
                            InsertCouponItem(pageButtonSupplementary, supplementaryItemPrice, goodys.couponInfo().Code);
                            $("#goodysCouponSuggestedProducts").modal("hide");
                            goodys.suggestedProducts([]);
                            goodys.suggestedProductsDiscount = [];
                            PostCouponInserted();
                        }
                        else {
                            toastr.info(language.Translate("GoodysProductPriceListNotFound", { code: supplementaryProduct.VoucherId }));
                        }
                    }
                    else {
                        toastr.info(language.Translate("GoodysProductNotFound", { code: supplementaryProduct.VoucherId }));
                    }
                }
            }
            else {
                toastr.info(language.Translate("GoodysProductNotMatched", { code: item.Code }));
            }
        }
        else {
            toastr.info(language.Translate("GoodysProductPriceListNotFound", { code: item.Code }));
        }
    };

    goodys.CloseCouponProductOptions = function () {
        $("#goodysCouponSuggestedProducts").modal("hide");
        goodys.suggestedProducts([]);
        goodys.suggestedProductsDiscount = [];
        goodys.applyingCoupon = false;
    };

    function InitializeCoupon() {
        goodys.couponCode = null;
        goodys.couponType(goodys.couponTypes()[0]);
        goodys.couponInfo(null);
        goodys.couponDiscount(0);
        goodys.suggestedProducts([]);
        goodys.suggestedProductsDiscount = [];
    };

    function RemovePreviousCoupon() {
        if (goodys.couponInfo() != null && goodys.couponInfo().CouponApplied()) {
            var couponCode = goodys.couponInfo().Code;
            var itemsToRemove = [];
            ko.utils.arrayForEach(goodys.items(), function (i) {
                if (i.GoodysCouponCode == couponCode) {
                    itemsToRemove.push(i);
                }
            });
            ko.utils.arrayForEach(itemsToRemove, function (i) {
                if (goodys.removeCouponCallback) {
                    goodys.removeCouponCallback(i);
                }
                goodys.total += (i.TotalWithExtras() * (-1));
            });
            if (goodys.couponInfo().Type == couponGoodysDiscountType.GiftCard && goodys.loyaltyInfo() != null) {
                var giftcard = ko.utils.arrayFirst(goodys.loyaltyInfo().AvailableCouponList, function (c) {
                    return c.CouponCode == couponCode;
                });
                if (giftcard == null) {
                    giftcard = ko.utils.arrayFirst(goodys.loyaltyInfo().DefaultCouponList, function (c) {
                        return c.CouponCode == couponCode;
                    });
                }
                if (giftcard == null) {
                    giftcard = ko.utils.arrayFirst(goodys.loyaltyInfo().PersonalizedCouponList, function (c) {
                        return c.CouponCode == couponCode;
                    });
                }
                if (giftcard != null) {
                    giftcard.CouponApplied(false);
                }
            }
        }
        goodys.couponDiscount(0);
        goodys.suggestedProducts([]);
        goodys.suggestedProductsDiscount = [];
        goodys.couponInfo(null);
    };

    function CallbackValidateCoupon(couponInfoJson) {
        if (couponInfoJson != null) {
            try {
                var couponInfoRaw = JSON.parse(couponInfoJson);
                switch (couponInfoRaw.result) {
                    case goodysResponseEnum.Success:
                        HandleCouponSuccessResult(couponInfoRaw);
                        break;
                    case goodysResponseEnum.Error:
                    case goodysResponseEnum.Failure:
                        toastr.error(couponInfoRaw.failReason);
                        break;
                    default:
                        break;
                }
            } catch (exception) {
                toastr.error(couponInfoJson);
            }
        }
        goodys.validatingCoupon = false;
    };

    function HandleCouponSuccessResult(couponInfoRaw) {
        if (couponInfoRaw.availableCoupons.length > 0) {
            var firstCouponRaw = couponInfoRaw.availableCoupons[0];
            var firstCoupon = new GoodysCouponModel(firstCouponRaw);
            goodys.couponInfo(firstCoupon);
        }
        toastr.success(language.Translate("GoodysCouponValidated", null));
    };

    function HandleGiftCardCoupon() {
        if (goodys.loyaltyInfo() != null) {
            var loyaltyCoupon = ko.utils.arrayFirst(goodys.loyaltyInfo().AvailableCouponList, function (c) {
                return c.CouponCode == goodys.couponInfo().Code;
            });
            if (loyaltyCoupon == null) {
                loyaltyCoupon = ko.utils.arrayFirst(goodys.loyaltyInfo().DefaultCouponList, function (c) {
                    return c.CouponCode == goodys.couponInfo().Code;
                });
            }
            if (loyaltyCoupon == null) {
                loyaltyCoupon = ko.utils.arrayFirst(goodys.loyaltyInfo().PersonalizedCouponList, function (c) {
                    return c.CouponCode == goodys.couponInfo().Code;
                });
            }
            if (loyaltyCoupon != null) {
                CheckInsertGiftCardCoupon(loyaltyCoupon);
            }
            else {
                toastr.error(language.Translate("GoodysLoyaltyCouponNotFound", null));
                goodys.applyingCoupon = false;
            }
        }
        else {
            toastr.error(language.Translate("GoodysLoyaltyCouponCustomerNotLoyalty", null));
            goodys.applyingCoupon = false;
        }
    };

    function CheckInsertGiftCardCoupon(giftCard) {
        if (!giftCard.CouponApplied()) {
            var dbTransaction = db.transaction("pageButtons");
            var dbObjectStore = dbTransaction.objectStore("pageButtons");
            var dbIndex = dbObjectStore.index("Code");
            var singleKeyRangeMain = IDBKeyRange.only(giftCard.VoucherId);
            var dbRequestMain = dbIndex.openCursor(singleKeyRangeMain);
            dbRequestMain.onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor != null) {
                    var pageButtonMain = new PageButtonModel(cursor.value);
                    var priceListDetail = ko.utils.arrayFirst(pageButtonMain.PriceListDetails, function (pd) {
                        return pd.PriceListId == goodys.priceListId;
                    });
                    if (priceListDetail != null) {
                        var vatId = priceListDetail.VatId;
                        var itemsTotalWithVat = 0;
                        var itemsTotal = 0;
                        ko.utils.arrayForEach(goodys.items(), function (i) {
                            if (i.VatId == vatId) {
                                itemsTotalWithVat += i.TotalWithExtras();
                            }
                            itemsTotal += i.TotalWithExtras();
                        });
                        if (itemsTotal == itemsTotalWithVat) {
                            InsertLoyaltyItem(pageButtonMain, giftCard.Discount, giftCard.CouponCode);
                            giftCard.CouponApplied(true);
                            PostCouponInserted();
                        }
                        else {
                            var singleKeyRangeSupplementary = IDBKeyRange.only(goodys.loyaltyProductCode);
                            var dbRequestSupplementary = dbIndex.openCursor(singleKeyRangeSupplementary);
                            dbRequestSupplementary.onsuccess = function (event) {
                                var cursor = event.target.result;
                                if (cursor != null) {
                                    var pageButtonSupplementary = new PageButtonModel(cursor.value);
                                    var priceListDetail = ko.utils.arrayFirst(pageButtonSupplementary.PriceListDetails, function (pd) {
                                        return pd.PriceListId == goodys.priceListId;
                                    });
                                    if (priceListDetail != null) {
                                        var totalDifference = itemsTotal - itemsTotalWithVat;
                                        if (totalDifference >= giftCard.Discount) {
                                            InsertLoyaltyItem(pageButtonSupplementary, giftCard.Discount, giftCard.CouponCode);
                                            giftCard.CouponApplied(true);
                                            PostCouponInserted();
                                        }
                                        else {
                                            if (totalDifference > 0) {
                                                InsertLoyaltyItem(pageButtonSupplementary, totalDifference, giftCard.CouponCode);
                                            }
                                            InsertLoyaltyItem(pageButtonMain, giftCard.Discount - totalDifference, giftCard.CouponCode);
                                            giftCard.CouponApplied(true);
                                            PostCouponInserted();
                                        }
                                    }
                                    else {
                                        toastr.info(language.Translate("GoodysProductPriceListNotFound", { code: goodys.loyaltyProductCode }));
                                        goodys.applyingCoupon = false;
                                    }
                                }
                                else {
                                    toastr.info(language.Translate("GoodysProductNotFound", { code: goodys.loyaltyProductCode }));
                                    goodys.applyingCoupon = false;
                                }
                            }
                        }
                    }
                    else {
                        toastr.info(language.Translate("GoodysProductPriceListNotFound", { code: giftCard.VoucherId }));
                        goodys.applyingCoupon = false;
                    }
                }
                else {
                    toastr.info(language.Translate("GoodysProductNotFound", { code: giftCard.VoucherId }));
                    goodys.applyingCoupon = false;
                }
            }
        }
        else {
            toastr.error(language.Translate("GoodysLoyaltyCouponApplied", null));
            goodys.applyingCoupon = false;
        }
    };

    function HandlePercentageCoupon() {
        if (goodys.couponInfo().CartNeeded) {
            var storeId = goodys.storeId;
            var code = goodys.couponInfo().Code;
            var items = goodys.items();
            var orderInfo = new PostGoodysOrderInfoModel(storeId, code, items);
            var url = localStorage.ApiAddress + "api/v3/Goodys/GetCouponDetails";
            var showMessage = true;
            goodys.communication.Communicate(communicationTypesEnum.Post, url, orderInfo, CallbackHandlePercentageCoupon, null, showMessage);
        }
        else {
            var discount = goodys.total * (goodys.couponInfo().Discount / 100);
            goodys.couponDiscount(parseFloat(discount.toFixed(2)));
            PostCouponInserted();
        }
    };

    function CallbackHandlePercentageCoupon(couponJson) {
        if (couponJson != null) {
            var couponRaw = JSON.parse(couponJson);
            switch (couponRaw.result) {
                case goodysResponseEnum.Success:
                    var couponInfo = new GoodysApplyCouponInformationModel(couponRaw);
                    var totalForDiscount = 0;
                    ko.utils.arrayForEach(goodys.items(), function (i) {
                        var discountItem = ko.utils.arrayFirst(couponInfo.OfferProducts, function (p) {
                            return p == i.Code;
                        });
                        if (discountItem != null) {
                            totalForDiscount += i.TotalWithExtras();
                        }
                    });
                    var discount = totalForDiscount * (couponInfo.Discount / 100);
                    goodys.couponDiscount(parseFloat(discount.toFixed(2)));
                    PostCouponInserted();
                    break;
                case goodysResponseEnum.Error:
                case goodysResponseEnum.Failure:
                    toastr.error(couponRaw.failReason);
                    goodys.applyingCoupon = false;
                    break;
                default:
                    break;
            }
        }
    };

    function HandleAbsoluteCoupon() {
        if (goodys.couponInfo().CartNeeded) {
            var storeId = goodys.storeId;
            var code = goodys.couponInfo().Code;
            var items = goodys.items();
            var orderInfo = new PostGoodysOrderInfoModel(storeId, code, items);
            var url = localStorage.ApiAddress + "api/v3/Goodys/GetCouponDetails";
            var showMessage = true;
            goodys.communication.Communicate(communicationTypesEnum.Post, url, orderInfo, CallbackHandleAbsoluteCoupon, null, showMessage);
        }
        else {
            if (goodys.total >= goodys.couponInfo().Discount) {
                CheckInsertAbsoluteCouponItems();
            }
            else {
                toastr.error(language.Translate("GoodysCouponMinimumDiscount", null));
                goodys.applyingCoupon = false;
            }
        }
    };

    function CallbackHandleAbsoluteCoupon(couponJson) {
        if (couponJson != null) {
            var couponRaw = JSON.parse(couponJson);
            switch (couponRaw.result) {
                case goodysResponseEnum.Success:
                    var couponInfo = new GoodysApplyCouponInformationModel(couponRaw);
                    var totalForDiscount = 0;
                    ko.utils.arrayForEach(goodys.items(), function (i) {
                        var discountItem = ko.utils.arrayFirst(couponInfo.OfferProducts, function (p) {
                            return p == i.Code;
                        });
                        if (discountItem != null) {
                            totalForDiscount += i.TotalWithExtras();
                        }
                    });
                    if (totalForDiscount >= goodys.couponInfo().Discount) {
                        CheckInsertAbsoluteCouponItems();
                    }
                    else {
                        toastr.error(language.Translate("GoodysCouponMinimumDiscount", null));
                        goodys.applyingCoupon = false;
                    }
                    break;
                case goodysResponseEnum.Error:
                case goodysResponseEnum.Failure:
                    toastr.error(couponRaw.failReason);
                    goodys.applyingCoupon = false;
                    break;
                default:
                    break;
            }
        }
    };

    function CheckInsertAbsoluteCouponItems() {
        var dbTransaction = db.transaction("pageButtons");
        var dbObjectStore = dbTransaction.objectStore("pageButtons");
        var dbIndex = dbObjectStore.index("Code");
        var singleKeyRangeMain = IDBKeyRange.only(goodys.couponInfo().VoucherId);
        var dbRequestMain = dbIndex.openCursor(singleKeyRangeMain);
        dbRequestMain.onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor != null) {
                var pageButtonMain = new PageButtonModel(cursor.value);
                var priceListDetail = ko.utils.arrayFirst(pageButtonMain.PriceListDetails, function (pd) {
                    return pd.PriceListId == goodys.priceListId;
                });
                if (priceListDetail != null) {
                    var vatId = priceListDetail.VatId;
                    var itemsTotalWithVat = 0;
                    var itemsTotal = 0;
                    ko.utils.arrayForEach(goodys.items(), function (i) {
                        if (i.VatId == vatId) {
                            itemsTotalWithVat += i.TotalWithExtras();
                        }
                        itemsTotal += i.TotalWithExtras();
                    });
                    if (itemsTotal == itemsTotalWithVat) {
                        InsertCouponItem(pageButtonMain, goodys.couponInfo().Discount, goodys.couponInfo().Code);
                        PostCouponInserted();
                    }
                    else {
                        var singleKeyRangeSupplementary = IDBKeyRange.only(goodys.couponProductCode);
                        var dbRequestSupplementary = dbIndex.openCursor(singleKeyRangeSupplementary);
                        dbRequestSupplementary.onsuccess = function (event) {
                            var cursor = event.target.result;
                            if (cursor != null) {
                                var pageButtonSupplementary = new PageButtonModel(cursor.value);
                                var priceListDetail = ko.utils.arrayFirst(pageButtonSupplementary.PriceListDetails, function (pd) {
                                    return pd.PriceListId == goodys.priceListId;
                                });
                                if (priceListDetail != null) {
                                    var totalDifference = itemsTotal - itemsTotalWithVat;
                                    if (totalDifference >= goodys.couponInfo().Discount) {
                                        InsertCouponItem(pageButtonSupplementary, goodys.couponInfo().Discount, goodys.couponInfo().Code);
                                        PostCouponInserted();
                                    }
                                    else {
                                        if (totalDifference > 0) {
                                            InsertCouponItem(pageButtonSupplementary, totalDifference, goodys.couponInfo().Code);
                                        }
                                        InsertCouponItem(pageButtonMain, goodys.couponInfo().Discount - totalDifference, goodys.couponInfo().Code);
                                        PostCouponInserted();
                                    }
                                }
                                else {
                                    toastr.info(language.Translate("GoodysProductPriceListNotFound", { code: goodys.couponProductCode }));
                                    goodys.applyingCoupon = false;
                                }
                            }
                            else {
                                toastr.info(language.Translate("GoodysProductNotFound", { code: goodys.couponProductCode }));
                                goodys.applyingCoupon = false;
                            }
                        }
                    }
                }
                else {
                    toastr.info(language.Translate("GoodysProductPriceListNotFound", { code: goodys.couponInfo().VoucherId }));
                    goodys.applyingCoupon = false;
                }
            }
            else {
                toastr.info(language.Translate("GoodysProductNotFound", { code: goodys.couponInfo().VoucherId }));
                goodys.applyingCoupon = false;
            }
        }
    };

    function HandleFreeItemCoupon() {
        var storeId = goodys.storeId;
        var code = goodys.couponInfo().Code;
        var items = goodys.items();
        var orderInfo = new PostGoodysOrderInfoModel(storeId, code, items);
        var url = localStorage.ApiAddress + "api/v3/Goodys/GetCouponDetails";
        var showMessage = true;
        goodys.communication.Communicate(communicationTypesEnum.Post, url, orderInfo, CallbackHandleFreeItemCoupon, null, showMessage);
    };

    function CallbackHandleFreeItemCoupon(couponJson) {
        if (couponJson != null) {
            var couponRaw = JSON.parse(couponJson);
            switch (couponRaw.result) {
                case goodysResponseEnum.Success:
                    var couponInfo = new GoodysApplyCouponInformationModel(couponRaw);
                    var freeItems = couponInfo.FreeItems;
                    CheckInsertFreeItemCouponItems(freeItems);
                    break;
                case goodysResponseEnum.Error:
                case goodysResponseEnum.Failure:
                    toastr.error(couponRaw.failReason);
                    goodys.applyingCoupon = false;
                    break;
                default:
                    break;
            }
        }
    };

    function CheckInsertFreeItemCouponItems(freeItems) {
        var allFreeItems = freeItems.length;
        var suggestedFreeItems = 0;
        ko.utils.arrayForEach(freeItems, function (i) {
            var dbTransaction = db.transaction("pageButtons");
            var dbObjectStore = dbTransaction.objectStore("pageButtons");
            var dbIndex = dbObjectStore.index("Code");
            var singleKeyRange = IDBKeyRange.only(i.ProductId);
            var dbRequest = dbIndex.openCursor(singleKeyRange);
            dbRequest.onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor != null) {
                    var pageButton = new PageButtonModel(cursor.value);
                    goodys.suggestedProducts.push(pageButton);
                    goodys.suggestedProductsDiscount.push(i);
                    suggestedFreeItems++;
                }
                else {
                    toastr.info(language.Translate("GoodysProductNotFound", { code: i.ProductId }));
                    suggestedFreeItems++;
                }
            }
        });
        var allItemsSuggested = setInterval(function () {
            if (suggestedFreeItems == allFreeItems) {
                clearInterval(allItemsSuggested);
                $("#goodysCouponSuggestedProducts").modal("show");
                goodys.applyingCoupon = false;
            }
        }, 100);
    };

    function HandleBuyXGetOneCoupon() {
        var storeId = goodys.storeId;
        var code = goodys.couponInfo().Code;
        var items = goodys.items();
        var orderInfo = new PostGoodysOrderInfoModel(storeId, code, items);
        var url = localStorage.ApiAddress + "api/v3/Goodys/GetCouponDetails";
        var showMessage = true;
        goodys.communication.Communicate(communicationTypesEnum.Post, url, orderInfo, CallbackHandleBuyXGetOneCoupon, null, showMessage);
    };

    function CallbackHandleBuyXGetOneCoupon(couponJson) {
        if (couponJson != null) {
            var couponRaw = JSON.parse(couponJson);
            switch (couponRaw.result) {
                case goodysResponseEnum.Success:
                    var couponInfo = new GoodysApplyCouponInformationModel(couponRaw);
                    var firstFreeItem = couponInfo.FreeItems[0];
                    CheckInsertBuyXGetOneCouponItems(firstFreeItem);
                    break;
                case goodysResponseEnum.Error:
                case goodysResponseEnum.Failure:
                    toastr.error(couponRaw.failReason);
                    goodys.applyingCoupon = false;
                    break;
                default:
                    break;
            }
        }
    };

    function CheckInsertBuyXGetOneCouponItems(freeItem) {
        var dbTransaction = db.transaction("pageButtons");
        var dbObjectStore = dbTransaction.objectStore("pageButtons");
        var dbIndex = dbObjectStore.index("Code");
        var singleKeyRangeMain = IDBKeyRange.only(freeItem.VoucherId);
        var dbRequestMain = dbIndex.openCursor(singleKeyRangeMain);
        dbRequestMain.onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor != null) {
                var pageButtonMain = new PageButtonModel(cursor.value);
                var priceListDetail = ko.utils.arrayFirst(pageButtonMain.PriceListDetails, function (pd) {
                    return pd.PriceListId == goodys.priceListId;
                });
                if (priceListDetail != null) {
                    var freeItemCouponDiscount = freeItem.Discount * (-1);
                    InsertCouponItem(pageButtonMain, freeItemCouponDiscount, goodys.couponInfo().Code);
                    PostCouponInserted();
                }
                else {
                    toastr.info(language.Translate("GoodysProductPriceListNotFound", { code: freeItem.VoucherId }));
                    goodys.applyingCoupon = false;
                }
            }
            else {
                toastr.info(language.Translate("GoodysProductNotFound", { code: freeItem.VoucherId }));
                goodys.applyingCoupon = false;
            }
        }
    };

    function InsertCouponItem(pageButton, discount, code) {
        if (goodys.applyCouponCallback != null) {
            goodys.applyCouponCallback(pageButton, false);
            var lastItem = goodys.items()[goodys.items().length - 1];
            var discountPrice = discount * (-1);
            lastItem.Price(parseFloat(discountPrice.toFixed(2)));
            lastItem.IsGoodys(true);
            lastItem.GoodysCouponCode = code;
            if (goodys.postApplyCouponCallback != null) {
                goodys.postApplyCouponCallback();
            }
            goodys.total -= discount;
        }
    };

    function PostCouponInserted() {
        goodys.couponInfo().CouponApplied(true);
        $("#goodysApplyCoupon").modal("hide");
        goodys.applyingCoupon = false;
        toastr.success(language.Translate("GoodysCouponDiscountApplied", { code: goodys.couponInfo().Code }));
    };

    function GetAppliedCoupon() {
        if (goodys.couponInfo() != null && goodys.couponInfo().CouponApplied() && goodys.couponInfo().Type != couponGoodysDiscountType.GiftCard) {
            var appliedCoupon = new GoodysAppliedCouponModel();
            appliedCoupon.CampaignName = goodys.couponInfo().Campaign;
            appliedCoupon.CouponCode = goodys.couponInfo().Code;
            appliedCoupon.CouponType = goodys.couponInfo().Type;
            return appliedCoupon;
        }
        else {
            return null;
        }
    };

    // #endregion

}