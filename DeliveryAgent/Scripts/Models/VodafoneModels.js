function VodafoneOptionsModel(model) {
    var vodafoneOptions = this;
    vodafoneOptions.Id = model != null ? model.Id : null;
    vodafoneOptions.Description = model != null ? model.Description : null;
    vodafoneOptions.FromItems = model != null ? model.FromItems : null;
    vodafoneOptions.RemoveItems = model != null ? model.RemoveItems : null;
    vodafoneOptions.ProductCategories = [];
    if (model != null && model.ProductCategories != null && model.ProductCategories.length > 0) {
        ko.utils.arrayForEach(model.ProductCategories, function (c) {
            var productCategory = new VodafoneProductCategoryModel(c);
            vodafoneOptions.ProductCategories.push(productCategory);
        });
    }
};

function VodafoneProductCategoryModel(model) {
    var vodafoneProductCategory = this;
    vodafoneProductCategory.Id = model != null ? model.Id : null;
    vodafoneProductCategory.ProductCategoryId = model != null ? model.ProductCategoryId !== undefined ? model.ProductCategoryId : model.ProdCategoryId : null;
    vodafoneProductCategory.Found = 0;
};

function VodafoneCodeModel(model) {
    var vodafoneCode = this;
    vodafoneCode.VodafoneCode = model != null ? model.VodafoneCode : null;
    vodafoneCode.VodafoneId = model != null ? model.VodafoneId : null;
    vodafoneCode.VodafonePromo = model != null ? model.VodafonePromo : null;
    var vodafoneOptionObject = model != null ? model.VodafoneOption : null;
    var vodafoneOption = new VodafoneOptionsModel(vodafoneOptionObject);
    vodafoneCode.VodafoneOption = vodafoneOption;
};