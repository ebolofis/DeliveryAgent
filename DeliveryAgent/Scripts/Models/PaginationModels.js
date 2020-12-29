function PaginationFilterModel(model) {
    var paginationFilter = this;
    paginationFilter.Key = model != null ? model.Key : null
    paginationFilter.InnerKey = model != null ? model.InnerKey : null
    paginationFilter.Values = [];
    if (model != null && model.Values != null && model.Values.length > 0) {
        ko.utils.arrayForEach(model.Values, function (v) {
            paginationFilter.Values.push(v);
        });
    }
};