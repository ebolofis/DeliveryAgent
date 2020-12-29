function PageModel(model) {
    var page = this;
    page.Id = model != null ? model.Id : null;
    page.PageSetId = model != null ? model.PageSetId : null;
    page.Description = model != null ? model.Description : null;
    page.ExtendedDescription = model != null ? model.ExtendedDescription !== undefined ? model.ExtendedDescription : model.ExtendedDesc : null;
    page.Sort = model != null ? model.Sort : null;
    page.Status = model != null ? model.Status : null;
    page.PageButtons = [];
    if (model != null && model.PageButtons != null && model.PageButtons.length > 0) {
        ko.utils.arrayForEach(model.PageButtons, function (b) {
            var pageButton = new PageButtonModel(b);
            page.PageButtons.push(pageButton);
        });
    }
};

function PageButtonModel(model) {
    var pageButton = this;
    pageButton.Id = model != null ? model.Id : null;
    pageButton.PageId = model != null ? model.PageId : null;
    pageButton.PageSetId = model != null ? model.PageSetId : null;
    pageButton.ProductId = model != null ? model.ProductId : null;
    pageButton.ProductCategoryId = model != null ? model.ProductCategoryId : null;
    pageButton.Description = model != null ? model.Description : null;
    pageButton.ExtraDescription = model != null ? model.ExtraDescription : null;
    pageButton.SalesDescription = model != null ? model.SalesDescription : null;
    pageButton.Code = model != null ? model.Code : null;
    pageButton.Sort = model != null ? model.Sort : null;
    pageButton.KdsId = model != null ? model.KdsId : null;
    pageButton.KitchenId = model != null ? model.KitchenId : null;
    pageButton.KitchenCode = model != null ? model.KitchenCode : null;
    pageButton.PreparationTime = model != null ? model.PreparationTime : null;
    pageButton.Type = model != null ? model.Type : pageButtonType.Empty;
    pageButton.ShortageType = model != null ? model.ShortageType !== undefined ? model.ShortageType : null : null;
    pageButton.Background = model != null ? model.Background : null;
    pageButton.Color = model != null ? model.Color : null;
    pageButton.NavigateToPage = model != null ? model.NavigateToPage : null;
    pageButton.SetDefaultPriceList = model != null ? model.SetDefaultPriceList !== undefined ? model.SetDefaultPriceList : model.SetDefaultPriceListId : null;
    pageButton.SetDefaultSaleType = model != null ? model.SetDefaultSaleType !== undefined ? model.SetDefaultSaleType : model.SetDefaultSalesType : null;
    pageButton.PriceListDetails = [];
    if (model != null && model.PriceListDetails != null && model.PriceListDetails.length > 0) {
        ko.utils.arrayForEach(model.PriceListDetails, function (d) {
            var priceListDetail = new PriceListDetailModel(d);
            pageButton.PriceListDetails.push(priceListDetail);
        });
    }
    else if (model != null && model.PricelistDetails != null && model.PricelistDetails.length > 0) {
        ko.utils.arrayForEach(model.PricelistDetails, function (d) {
            var priceListDetail = new PriceListDetailModel(d);
            pageButton.PriceListDetails.push(priceListDetail);
        });
    }
    pageButton.PageButtonDetail = [];
    if (model != null && model.PageButtonDetail != null && model.PageButtonDetail.length > 0) {
        ko.utils.arrayForEach(model.PageButtonDetail, function (d) {
            var pageButtonDetail = new PageButtonDetailModel(d);
            pageButton.PageButtonDetail.push(pageButtonDetail);
        });
    }
};

function PageButtonDetailModel(model) {
    var pageButtonDetail = this;
    pageButtonDetail.Description = model != null ? model.Description : null;
    pageButtonDetail.PageButtonId = model != null ? model.PageButtonId : null;
    pageButtonDetail.IngredientId = model != null ? model.IngredientId : null;
    pageButtonDetail.IngredientCategoryId = model != null ? model.IngredientCategoryId : null;
    pageButtonDetail.MinQty = model != null ? model.MinQty : null;
    pageButtonDetail.MaxQty = model != null ? model.MaxQty : null;
    var minusEnabled = model != null ? model.minusEnabled !== undefined ? model.minusEnabled : false : false;
    pageButtonDetail.MinusEnabled = ko.observable(minusEnabled);
    var plusEnabled = model != null ? model.plusEnabled !== undefined ? model.plusEnabled : true : true;
    pageButtonDetail.PlusEnabled = ko.observable(plusEnabled);
    pageButtonDetail.Type = model != null ? model.Type : pageButtonDetailType.Extra;
    pageButtonDetail.Background = model != null ? model.Background : null;
    pageButtonDetail.Color = model != null ? model.Color : null;
    pageButtonDetail.Sort = model != null ? model.Sort : null;
    pageButtonDetail.PriceListDetails = [];
    if (model != null && model.PriceListDetails != null && model.PriceListDetails.length > 0) {
        ko.utils.arrayForEach(model.PriceListDetails, function (d) {
            var priceListDetail = new PriceListDetailModel(d);
            pageButtonDetail.PriceListDetails.push(priceListDetail);
        });
    }
    else if (model != null && model.PricelistDetails != null && model.PricelistDetails.length > 0) {
        ko.utils.arrayForEach(model.PricelistDetails, function (d) {
            var priceListDetail = new PriceListDetailModel(d);
            pageButtonDetail.PriceListDetails.push(priceListDetail);
        });
    }
};

function IngredientCategoryModel(model) {
    var ingredientCategory = this;
    ingredientCategory.Id = model != null ? model.Id : null;
    ingredientCategory.Description = model != null ? model.Description : null;
    ingredientCategory.Status = model != null ? model.Status : null;
    ingredientCategory.Code = model != null ? model.Code : null;
    ingredientCategory.IsUnique = model != null ? model.IsUnique != null ? model.IsUnique : false : false;
};

function PriceListDetailModel(model) {
    var priceListDetail = this;
    priceListDetail.Id = model != null ? model.Id : null;
    priceListDetail.PriceListId = model != null ? model.PriceListId !== undefined ? model.PriceListId : model.PricelistId : null;
    priceListDetail.ProductId = model != null ? model.ProductId : null;
    priceListDetail.IngredientId = model != null ? model.IngredientId : null;
    priceListDetail.VatId = model != null ? model.VatId : null;
    priceListDetail.Vat = model != null ? model.Vat !== undefined ? typeof (model.Vat) == "number" ? model.Vat : model.Vat.Percentage : null : null;
    priceListDetail.TaxId = model != null ? model.TaxId : null;
    priceListDetail.Tax = model != null ? model.Tax : null;
    priceListDetail.Price = model != null ? model.Price : null;
};

function DiscountModel(model) {
    var discount = this;
    discount.Id = model != null ? model.Id : null;
    discount.Description = ko.observable(model != null ? model.Description : null);
    discount.Type = model != null ? model.Type : discountTypeEnum.Percentage;
    discount.Amount = ko.observable(model != null ? model.Amount : null);
    discount.Sort = model != null ? model.Sort : null;
    discount.Status = model != null ? model.Status : null;
};

function DelayModel(model) {
    var delay = this;
    delay.IsDelay = ko.observable(model != null ? model.IsDelay : false);
    delay.TargetDate = ko.observable(model != null ? model.TargetDate : moment().format("HH:mm"));
};