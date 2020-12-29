function GoodysAppliedDiscountModel(model) {
    var goodysAppliedDiscount = this;
    goodysAppliedDiscount.Type = loyaltyTypeEnum.Goodys;
    goodysAppliedDiscount.ExternalOrderId = model != null ? model.ExternalOrderId : null;
    goodysAppliedDiscount.Loyalty = model != null ? model.Loyalty : null;
    goodysAppliedDiscount.Coupon = model != null ? model.Coupon : null;
};

function LoyaltyGoodysInformationModel(model) {
    var loyaltyGoodysInformation = this;
    loyaltyGoodysInformation.Name = model != null ? model.Name !== undefined ? model.Name : model.name : null;
    loyaltyGoodysInformation.Surname = model != null ? model.Surname !== undefined ? model.Surname : model.surname : null;
    loyaltyGoodysInformation.LoyaltyId = model != null ? model.LoyaltyId !== undefined ? model.LoyaltyId : model.loyaltyId : null;
    loyaltyGoodysInformation.Email = model != null ? model.Email !== undefined ? model.Email : model.email : null;
    loyaltyGoodysInformation.Points = model != null ? model.Points !== undefined ? model.Points : model.points : 0;
    loyaltyGoodysInformation.Remainder = model != null ? model.Remainder !== undefined ? model.Remainder : model.remainder : 0;
    loyaltyGoodysInformation.Birthday = model != null ? model.Birthday !== undefined ? model.Birthday : model.birthday : null;
    loyaltyGoodysInformation.Personas = model != null ? model.Personas !== undefined ? model.Personas : model.personnas : null;
    loyaltyGoodysInformation.AvailableCouponList = [];
    if (model != null && model.AvailableCouponList !== undefined && model.AvailableCouponList.length > 0) {
        ko.utils.arrayForEach(model.AvailableCouponList, function (c) {
            var coupon = new LoyaltyGoodysCouponModel(c);
            loyaltyGoodysInformation.AvailableCouponList.push(coupon);
        });
    }
    else if (model != null && model.availableCouponList !== undefined && model.availableCouponList.length > 0) {
        ko.utils.arrayForEach(model.availableCouponList, function (c) {
            var coupon = new LoyaltyGoodysCouponModel(c);
            loyaltyGoodysInformation.AvailableCouponList.push(coupon);
        });
    }
    loyaltyGoodysInformation.DefaultCouponList = [];
    if (model != null && model.DefaultCouponList !== undefined && model.DefaultCouponList.length > 0) {
        ko.utils.arrayForEach(model.DefaultCouponList, function (c) {
            var coupon = new LoyaltyGoodysCouponModel(c);
            loyaltyGoodysInformation.DefaultCouponList.push(coupon);
        });
    }
    else if (model != null && model.defaultCouponList !== undefined && model.defaultCouponList.length > 0) {
        ko.utils.arrayForEach(model.defaultCouponList, function (c) {
            var coupon = new LoyaltyGoodysCouponModel(c);
            loyaltyGoodysInformation.DefaultCouponList.push(coupon);
        });
    }
    loyaltyGoodysInformation.PersonalizedCouponList = [];
    if (model != null && model.PersonalizedCouponList !== undefined && model.PersonalizedCouponList.length > 0) {
        ko.utils.arrayForEach(model.PersonalizedCouponList, function (c) {
            var coupon = new LoyaltyGoodysCouponModel(c);
            loyaltyGoodysInformation.PersonalizedCouponList.push(coupon);
        });
    }
    else if (model != null && model.personalizedCouponList !== undefined && model.personalizedCouponList.length > 0) {
        ko.utils.arrayForEach(model.personalizedCouponList, function (c) {
            var coupon = new LoyaltyGoodysCouponModel(c);
            loyaltyGoodysInformation.PersonalizedCouponList.push(coupon);
        });
    }
    loyaltyGoodysInformation.result = model != null ? model.result : null;
    loyaltyGoodysInformation.status = model != null ? model.status : null;
    loyaltyGoodysInformation.apiResponseType = model != null ? model.apiResponseType : null;
    loyaltyGoodysInformation.referral = model != null ? model.referral : null;
};

function LoyaltyGoodysCouponModel(model) {
    var loyaltyGoodysCoupon = this;
    loyaltyGoodysCoupon.CampaignName = model != null ? model.CampaignName !== undefined ? model.CampaignName : model.campaignName : null;
    loyaltyGoodysCoupon.CouponName = model != null ? model.CouponName !== undefined ? model.CouponName : model.couponName : null;
    loyaltyGoodysCoupon.CouponDescription = model != null ? model.CouponDescription !== undefined ? model.CouponDescription : model.couponDescription : null;
    loyaltyGoodysCoupon.CouponCode = model != null ? model.CouponCode !== undefined ? model.CouponCode : model.couponCode : null;
    loyaltyGoodysCoupon.CouponType = model != null ? model.CouponType !== undefined ? model.CouponType : model.couponType : null;
    loyaltyGoodysCoupon.ValidFrom = model != null ? model.ValidFrom !== undefined ? model.ValidFrom : model.couponValidFrom : null;
    loyaltyGoodysCoupon.ExpirationDate = model != null ? model.ExpirationDate !== undefined ? model.ExpirationDate : model.couponExpirationDate : null;
    if (loyaltyGoodysCoupon.ExpirationDate != null) {
        var expirationDateComponents = loyaltyGoodysCoupon.ExpirationDate.split("/");
        expirationDateComponents.reverse();
        var formattedDate = expirationDateComponents.join("-");
    }
    else {
        var formattedDate = null;
    }
    loyaltyGoodysCoupon.ExpirationDateFormatted = formattedDate;
    loyaltyGoodysCoupon.IsValid = model != null ? model.IsValid !== undefined ? model.IsValid : model.isValid : null;
    loyaltyGoodysCoupon.CartNeeded = model != null ? model.CartNeeded !== undefined ? model.CartNeeded : model.cartNeeded : null;
    loyaltyGoodysCoupon.MinimumOrderValue = model != null ? model.MinimumOrderValue !== undefined ? parseFloat(model.MinimumOrderValue) : parseFloat(model.minimumOrderValue) : 0;
    loyaltyGoodysCoupon.Discount = model != null ? model.Discount !== undefined ? parseFloat(model.Discount) : parseFloat(model.discountNumber) : 0;
    loyaltyGoodysCoupon.VoucherId = model != null ? model.VoucherId !== undefined ? model.VoucherId : model.dummyVoucherId : 0;
    loyaltyGoodysCoupon.CouponApplied = ko.observable(false);
};

function LoyaltyGoodysRegisteredCustomerModel(model) {
    var loyaltyGoodysRegisteredCustomer = this;
    loyaltyGoodysRegisteredCustomer.Name = model != null ? model.Name !== undefined ? model.Name : model.name : null;
    loyaltyGoodysRegisteredCustomer.Surname = model != null ? model.Surname !== undefined ? model.Surname : model.surname : null;
    loyaltyGoodysRegisteredCustomer.LoyaltyId = model != null ? model.LoyaltyId !== undefined ? model.LoyaltyId : model.loyaltyId : null;
    loyaltyGoodysRegisteredCustomer.Email = model != null ? model.Email !== undefined ? model.Email : model.email : null;
};

function LoyaltyGoodysAppliedCouponsModel(model) {
    var loyaltyGoodysAppliedCoupons = this;
    loyaltyGoodysAppliedCoupons.LoyaltyId = model != null ? model.LoyaltyId : null;
    loyaltyGoodysAppliedCoupons.Coupons = [];
    if (model != null && model.Coupons !== undefined && model.Coupons.length > 0) {
        ko.utils.arrayForEach(model.Coupons, function (c) {
            var coupon = new LoyaltyGoodysAppliedCouponModel(c);
            loyaltyGoodysAppliedCoupons.Coupons.push(coupon);
        });
    }
};

function LoyaltyGoodysAppliedCouponModel(model) {
    var loyaltyGoodysAppliedCoupon = this;
    loyaltyGoodysAppliedCoupon.CampaignName = model != null ? model.CampaignName : null;
    loyaltyGoodysAppliedCoupon.CouponCode = model != null ? model.CouponCode : null;
    loyaltyGoodysAppliedCoupon.CouponType = model != null ? model.CouponType : null;
};

function GoodysCouponModel(model) {
    var goodysCoupon = this;
    goodysCoupon.Campaign = model != null ? model.Campaign !== undefined ? model.Campaign : model.campaignName !== undefined ? model.campaignName : null : null;
    goodysCoupon.Name = model != null ? model.Name !== undefined ? model.Name : model.couponName : null;
    goodysCoupon.Description = model != null ? model.Description !== undefined ? model.Description : model.couponDescription : null;
    goodysCoupon.Code = model != null ? model.Code !== undefined ? model.Code : model.couponCode : null;
    goodysCoupon.Type = model != null ? model.Type !== undefined ? model.Type : model.couponType : null;
    goodysCoupon.ValidFrom = model != null ? model.ValidFrom !== undefined ? model.ValidFrom : model.couponValidFrom : null;
    goodysCoupon.ExpirationDate = model != null ? model.ExpirationDate !== undefined ? model.ExpirationDate : model.couponExpirationDate : null;
    if (goodysCoupon.ExpirationDate != null) {
        var expirationDateComponents = goodysCoupon.ExpirationDate.split("/");
        expirationDateComponents.reverse();
        var formattedDate = expirationDateComponents.join("-");
    }
    else {
        var formattedDate = null;
    }
    goodysCoupon.ExpirationDateFormatted = formattedDate;
    goodysCoupon.IsValid = model != null ? model.IsValid !== undefined ? model.IsValid : model.isValid : null;
    goodysCoupon.CartNeeded = model != null ? model.CartNeeded !== undefined ? model.CartNeeded : model.cartNeeded : null;
    goodysCoupon.MinimumOrderValue = model != null ? model.MinimumOrderValue !== undefined ? parseFloat(model.MinimumOrderValue) : parseFloat(model.minimumOrderValue) : null;
    goodysCoupon.Discount = model != null ? model.Discount !== undefined ? parseFloat(model.Discount) : parseFloat(model.discountNumber) : null;
    goodysCoupon.VoucherId = model != null ? model.VoucherId !== undefined ? model.VoucherId : model.dummyVoucherId : null;
    goodysCoupon.CouponApplied = ko.observable(false);
};

function GoodysApplyCouponInformationModel(model) {
    var goodysApplyCouponInfoModel = this;
    goodysApplyCouponInfoModel.Campaign = model != null ? model.Campaign !== undefined ? model.Campaign : model.campaignName : null;
    goodysApplyCouponInfoModel.Type = model != null ? model.Type !== undefined ? model.Type : model.couponType : null;
    goodysApplyCouponInfoModel.CartNeeded = model != null ? model.CartNeeded !== undefined ? model.CartNeeded : model.cartNeeded !== undefined ? model.cartNeeded : null : null;
    goodysApplyCouponInfoModel.MinimumOrderValue = model != null ? model.MinimumOrderValue !== undefined ? parseFloat(model.MinimumOrderValue) : parseFloat(model.minimumOrderValue) : null;
    goodysApplyCouponInfoModel.Discount = model != null ? model.Discount !== undefined ? parseFloat(model.Discount) : model.discountNumber !== undefined ? parseFloat(model.discountNumber) : null : null;
    goodysApplyCouponInfoModel.VoucherId = model != null ? model.VoucherId !== undefined ? model.VoucherId : model.dummyVoucherId : null;
    goodysApplyCouponInfoModel.OfferProducts = [];
    if (model != null && model.OfferProducts !== undefined && model.OfferProducts.length > 0) {
        ko.utils.arrayForEach(model.OfferProducts, function (p) {
            goodysApplyCouponInfoModel.OfferProducts.push(p);
        });
    }
    else if (model != null && model.offerProducts !== undefined && model.offerProducts.length > 0) {
        ko.utils.arrayForEach(model.offerProducts, function (p) {
            goodysApplyCouponInfoModel.OfferProducts.push(p);
        });
    }
    goodysApplyCouponInfoModel.FreeItems = [];
    if (model != null && model.FreeItems !== undefined && model.FreeItems.length > 0) {
        ko.utils.arrayForEach(model.FreeItems, function (i) {
            var freeItem = new GoodysApplyCouponFreeItemModel(i);
            goodysApplyCouponInfoModel.FreeItems.push(freeItem);
        });
    }
    else if (model != null && model.freeItems !== undefined && model.freeItems.length > 0) {
        ko.utils.arrayForEach(model.freeItems, function (i) {
            var freeItem = new GoodysApplyCouponFreeItemModel(i);
            goodysApplyCouponInfoModel.FreeItems.push(freeItem);
        });
    }
};

function GoodysApplyCouponFreeItemModel(model) {
    var goodysApplyCouponFreeItemModel = this;
    goodysApplyCouponFreeItemModel.Discount = model != null ? model.Discount !== undefined ? parseFloat(model.Discount) : model.dummyValue !== undefined ? parseFloat(model.dummyValue) : null : null;
    goodysApplyCouponFreeItemModel.VoucherId = model != null ? model.VoucherId !== undefined ? model.VoucherId : model.dummyProductId : null;
    goodysApplyCouponFreeItemModel.Value = model != null ? model.Value !== undefined ? parseFloat(model.Value) : model.value !== undefined ? parseFloat(model.value) : null : null;
    goodysApplyCouponFreeItemModel.ProductId = model != null ? model.ProductId !== undefined ? model.ProductId : model.productId : null;
};

function PostGoodysOrderInfoModel(storeId, code, items) {
    var postGoodysOrderInfoModel = this;
    postGoodysOrderInfoModel.daStoreId = storeId;
    postGoodysOrderInfoModel.couponCode = code;
    postGoodysOrderInfoModel.orderItems = [];
    ko.utils.arrayForEach(items, function (i) {
        var orderItem = new PostGoodysOrderInfoItemModel(i);
        postGoodysOrderInfoModel.orderItems.push(orderItem);
    });
};

function PostGoodysOrderInfoItemModel(item) {
    var postGoodysOrderInfoItemModel = this;
    postGoodysOrderInfoItemModel.productCode = item.Code;
    postGoodysOrderInfoItemModel.quantity = item.Quantity();
    postGoodysOrderInfoItemModel.cost = item.TotalWithExtras();
};

function GoodysAppliedCouponModel(model) {
    var goodysAppliedCoupon = this;
    goodysAppliedCoupon.CampaignName = model != null ? model.CampaignName : null;
    goodysAppliedCoupon.CouponCode = model != null ? model.CouponCode : null;
    goodysAppliedCoupon.CouponType = model != null ? model.CouponType : null;
};

function PreviousAppliedCouponsModel(model) {
    var previousAppliedCoupons = this;
    previousAppliedCoupons.CampaignName = model != null ? model.CampaignName : null;
    previousAppliedCoupons.CouponCode = model != null ? model.CouponCode : null;
    previousAppliedCoupons.CouponType = model != null ? model.CouponType : null;
    previousAppliedCoupons.LoyaltyId = model != null ? model.LoyaltyId : null;
    previousAppliedCoupons.Coupons = [];
    if (model != null && model.Coupons != null && model.Coupons.length > 0) {
        ko.utils.arrayForEach(model.Coupons, function (c) {
            var coupon = new PreviousAppliedCouponModel(c);
            previousAppliedCoupons.Coupons.push(coupon);
        });
    }
    previousAppliedCoupons.ExternalOrderId = model != null ? model.ExternalOrderId : null;
};

function PreviousAppliedCouponModel(model) {
    var previousAppliedCoupon = this;
    previousAppliedCoupon.CampaignName = model != null ? model.CampaignName : null;
    previousAppliedCoupon.CouponCode = model != null ? model.CouponCode : null;
    previousAppliedCoupon.CouponType = model != null ? model.CouponType : null;
};