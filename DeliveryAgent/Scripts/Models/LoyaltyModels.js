function LoyaltyOptionsModel(model, availablePoints, spentPoints) {
    var loyaltyOptions = this;
    var redeemDiscountObject = model != null ? model.DiscountRedeemModel : null;
    var redeemDiscount = new LoyaltyRedeemDiscountModel(redeemDiscountObject);
    loyaltyOptions.RedeemDiscount = redeemDiscount;
    loyaltyOptions.RedeemProduct = [];
    if (model != null && model.RedeemFreeProductModel != null && model.RedeemFreeProductModel.length > 0) {
        ko.utils.arrayForEach(model.RedeemFreeProductModel, function (p) {
            var redeemProduct = new LoyaltyRedeemProductModel(p);
            loyaltyOptions.RedeemProduct.push(redeemProduct);
        });
    }
    loyaltyOptions.AvailablePoints = availablePoints;
    loyaltyOptions.SpentPoints = ko.observable(spentPoints);
    loyaltyOptions.ProductOptions = [];
    if (model != null && model.ProductOptions != null && model.ProductOptions.length > 0) {
        ko.utils.arrayForEach(model.ProductOptions, function (o) {
            var productOption = new LoyaltyProductOptionModel(o);
            loyaltyOptions.ProductOptions.push(productOption);
        });
    }
};

function LoyaltyRedeemDiscountModel(model) {
    var loyaltyRedeemDiscount = this;
    loyaltyRedeemDiscount.MaxDiscountAmount = model != null ? model.MaxDiscountAmount : null;
    loyaltyRedeemDiscount.Points = model != null ? model.RedeemPoints : null;
    loyaltyRedeemDiscount.IsChecked = ko.observable(false);
};

function LoyaltyRedeemProductModel(model) {
    var loyaltyRedeemProduct = this;
    loyaltyRedeemProduct.Id = model != null ? model.Id : null;
    loyaltyRedeemProduct.ProductCategoryId = model != null ? model.ProdCategoryId : null;
    loyaltyRedeemProduct.ProductCategory = model != null ? model.ProdCategoryName : null;
    loyaltyRedeemProduct.ProductId = model != null ? model.ProductId : null;
    loyaltyRedeemProduct.Product = model != null ? model.ProductName : null;
    loyaltyRedeemProduct.Quantity = model != null ? model.Qnt : null;
    loyaltyRedeemProduct.Points = model != null ? model.Points : null;
    loyaltyRedeemProduct.IsChecked = ko.observable(false);
};

function LoyaltyProductOptionModel(model) {
    var loyaltyProductOption = this;
    loyaltyProductOption.ProductCategoryId = model != null ? model.ProductCategoryId : null;
    loyaltyProductOption.ProductCategory = model != null ? model.ProductCategory : null;
    loyaltyProductOption.Quantity = model != null ? model.Quantity : 0;
    loyaltyProductOption.InsertedQuantity = ko.observable(0);
    loyaltyProductOption.ProductList = [];
    if (model != null && model.ProductList != null && model.ProductList.length > 0) {
        ko.utils.arrayForEach(model.ProductList, function (l) {
            var pageButton = new PageButtonModel(l);
            loyaltyProductOption.ProductList.push(pageButton);
        });
    }
    loyaltyProductOption.InsertedProductList = ko.observableArray([]);
    if (model != null && model.InsertedProductList != null && typeof (model.InsertedProductList) == "function" && model.InsertedProductList().length > 0) {
        ko.utils.arrayForEach(model.InsertedProductList(), function (il) {
            var pageButton = new PageButtonModel(il);
            loyaltyProductOption.InsertedProductList.push(pageButton);
        });
    }
};

function LoyaltyDiscountTotalModel(model) {
    var loyaltyDiscountTotal = this;
    loyaltyDiscountTotal.Type = loyaltyTypeEnum.Hit;
    loyaltyDiscountTotal.Amount = model != null ? model.Amount : 0;
    loyaltyDiscountTotal.Points = model != null ? model.Points : 0;
    loyaltyDiscountTotal.Remark = model != null ? model.Remark : "Loyalty Discount";
};


function LoyaltyPointsHistoryModel(model) {
    var LoyaltyPointsHistory = this;
    LoyaltyPointsHistory.Id = model != null ? model.Id : 0;
    LoyaltyPointsHistory.CustomerId = model != null ? model.CustomerId : 0;
    LoyaltyPointsHistory.Points = model != null ? model.Points : 0;
    LoyaltyPointsHistory.Date = model != null ? model.Date : Date.now();
    LoyaltyPointsHistory.OrderId = model != null ? model.OrderId : 0;
    LoyaltyPointsHistory.StoreId = model != null ? model.StoreId : 0;
    LoyaltyPointsHistory.StaffId = model != null ? model.StaffId : null;
    LoyaltyPointsHistory.Description = model != null ? model.Description : null;
};

