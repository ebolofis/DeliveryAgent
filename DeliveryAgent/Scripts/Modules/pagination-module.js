function CustomPagination(communication) {
    var pagination = this;
    pagination.pageSize = 10;
    pagination.allEntities = [];
    pagination.entityList = ko.observableArray([]);
    pagination.totalResults = ko.observable(0);
    pagination.totalPages = ko.observable(0);
    pagination.activePage = ko.observable(0);
    pagination.hasLeft = ko.observable(false);
    pagination.hasRight = ko.observable(false);
    pagination.elementClass = null;
    pagination.scrollable = ko.observable(false);
    pagination.communication = communication;

    pagination.SearchEntities = function (searchUrl, pageSize, postExecuteHandleResponse, callback) {
        pagination.entityList([]);
        $(".customLoading").show();
        $.ajax({
            url: searchUrl,
            cache: false,
            type: "GET",
            crossdomain: true,
            dataType: "json",
            ContentType: "application/json; charset=utf-8",
            beforeSend: pagination.communication.SetHeaders,
            statusCode: {
                /*OK*/
                200: function (response) {
                    $(".customLoading").hide();
                    if (response) {
                        if (postExecuteHandleResponse) {
                            modifiedResponse = postExecuteHandleResponse(response);
                        }
                        else {
                            modifiedResponse = response;
                        }
                        pagination.allEntities = modifiedResponse;
                        pagination.pageSize = pageSize;
                        PageEntities();
                        if (callback) {
                            callback();
                        }
                    }
                }
            }
        }).fail(function () {
            $(".customLoading").hide();
            toastr.error(language.Translate("ErrorSearching", null));
            if (callback) {
                callback();
            }
        });
    };

    pagination.SearchEntitiesWithModel = function (searchUrl, model, pageSize, postExecuteHandleResponse, callback) {
        pagination.entityList([]);
        $(".customLoading").show();
        $.ajax({
            url: searchUrl,
            cache: false,
            type: "POST",
            crossdomain: true,
            dataType: "json",
            ContentType: "application/json; charset=utf-8",
            data: model,
            beforeSend: pagination.communication.SetHeaders,
            statusCode: {
                /*OK*/
                200: function (response) {
                    $(".customLoading").hide();
                    if (response) {
                        if (postExecuteHandleResponse) {
                            modifiedResponse = postExecuteHandleResponse(response);
                        }
                        else {
                            modifiedResponse = response;
                        }
                        pagination.allEntities = modifiedResponse;
                        pagination.pageSize = pageSize;
                        PageEntities();
                        if (callback) {
                            callback();
                        }
                    }
                }
            }
        }).fail(function () {
            $(".customLoading").hide();
            toastr.error(language.Translate("ErrorSearching", null));
            if (callback) {
                callback();
            }
        });
    };

    pagination.NoSearchEntities = function (entities, pageSize) {
        pagination.entityList([]);
        pagination.allEntities = entities;
        pagination.pageSize = pageSize;
        PageEntities();
    };

    pagination.MoveFirst = function () {
        pagination.entityList([]);
        var start = 0;
        var index = 0;
        for (i = start; i < pagination.allEntities.length; i++) {
            if (index == pagination.pageSize) {
                break;
            }
            pagination.entityList.push(pagination.allEntities[i]);
            index++;
        }
        pagination.activePage(0);
        pagination.hasLeft(false);
        if (pagination.totalPages() > 3) {
            pagination.hasRight(true);
        }
        else {
            pagination.hasRight(false);
        }
    };

    pagination.MoveLast = function () {
        pagination.entityList([]);
        var start = (pagination.totalPages() - 1) * pagination.pageSize;
        var index = 0;
        for (i = start; i < pagination.allEntities.length; i++) {
            if (index == pagination.pageSize) {
                break;
            }
            pagination.entityList.push(pagination.allEntities[i]);
            index++;
        }
        pagination.activePage(pagination.totalPages() - 1);
        if (pagination.totalPages() > 3) {
            pagination.hasLeft(true);
        }
        else {
            pagination.hasLeft(false);
        }
        pagination.hasRight(false);
    };

    pagination.MovePrevious = function () {
        if (pagination.activePage() == 0) {
            return;
        }
        pagination.entityList([]);
        var start = (pagination.activePage() - 1) * pagination.pageSize;
        var index = 0;
        for (i = start; i < pagination.allEntities.length; i++) {
            if (index == pagination.pageSize) {
                break;
            }
            pagination.entityList.push(pagination.allEntities[i]);
            index++;
        }
        var currentPage = pagination.activePage();
        pagination.activePage(currentPage - 1);
        if (pagination.activePage() > 2) {
            pagination.hasLeft(true);
        }
        else {
            pagination.hasLeft(false);
        }
        if (pagination.activePage() < pagination.totalPages() - 3) {
            pagination.hasRight(true);
        }
        else {
            pagination.hasRight(false);
        }
    };

    pagination.MoveNext = function () {
        if (pagination.activePage() == pagination.totalPages() - 1) {
            return;
        }
        pagination.entityList([]);
        var start = (pagination.activePage() + 1) * pagination.pageSize;
        var index = 0;
        for (i = start; i < pagination.allEntities.length; i++) {
            if (index == pagination.pageSize) {
                break;
            }
            pagination.entityList.push(pagination.allEntities[i]);
            index++;
        }
        var currentPage = pagination.activePage();
        pagination.activePage(currentPage + 1);
        if (pagination.activePage() > 2) {
            pagination.hasLeft(true);
        }
        else {
            pagination.hasLeft(false);
        }
        if (pagination.activePage() < pagination.totalPages() - 3) {
            pagination.hasRight(true);
        }
        else {
            pagination.hasRight(false);
        }
    };

    pagination.MoveSpecific = function (page) {
        pagination.entityList([]);
        var start = page * pagination.pageSize;
        var index = 0;
        for (i = start; i < pagination.allEntities.length; i++) {
            if (index == pagination.pageSize) {
                break;
            }
            pagination.entityList.push(pagination.allEntities[i]);
            index++;
        }
        pagination.activePage(page);
        if (pagination.activePage() > 2) {
            pagination.hasLeft(true);
        }
        else {
            pagination.hasLeft(false);
        }
        if (pagination.activePage() < pagination.totalPages() - 3) {
            pagination.hasRight(true);
        }
        else {
            pagination.hasRight(false);
        }
    };

    pagination.ScrollEntities = function (elementClass) {
        var entityListElements = document.getElementsByClassName(elementClass);
        if (entityListElements != null && entityListElements.length > 0) {
            pagination.elementClass = elementClass;
            pagination.scrollable(true);
            var entityListElement = entityListElements[0];
            entityListElement.addEventListener("scroll", ScrollEntities);
        }
    };

    pagination.Filter = function (key, innerKey, value) {
        pagination.entityList([]);
        if (innerKey == null) {
            if (typeof (value) == "number") {
                var filtered = pagination.allEntities.filter(b => b[key] == value);
            }
            else if (typeof (value) == "string") {
                var filtered = pagination.allEntities.filter(b => b[key].toLowerCase().includes(value.toLowerCase()));
            }
        }
        else {
            if (typeof (value) == "number") {
                var filtered = pagination.allEntities.filter(b => b[key][innerKey] == value);
            }
            else if (typeof (value) == "string") {
                var filtered = pagination.allEntities.filter(b => b[key][innerKey].toLowerCase().includes(value.toLowerCase()));
            }
        }
        ko.utils.arrayForEach(filtered, function (f) {
            pagination.entityList.push(f);
        });
    };

    pagination.FilterMultiple = function (filters) {
        pagination.entityList([]);
        var filtered = pagination.allEntities;
        ko.utils.arrayForEach(filters, function (f) {
            var subFiltered = [];
            if (f.InnerKey == null) {
                ko.utils.arrayForEach(f.Values, function (v) {
                    var temporaryFiltered = [];
                    if (typeof (v) == "number") {
                        temporaryFiltered = filtered.filter(b => b[f.Key] == v);
                    }
                    else if (typeof (v) == "string") {
                        temporaryFiltered = filtered.filter(b => b[f.Key].toLowerCase().includes(v.toLowerCase()));
                    }
                    else if (typeof (v) == "boolean") {
                        temporaryFiltered = filtered.filter(b => (typeof (b[f.Key]) == "boolean" ? b[f.Key] == v : v ? b[f.Key] != null : b[f.Key] == null));
                    }
                    else if (typeof (v) == "object") {
                        temporaryFiltered = filtered.filter(b => moment(b[f.Key]).isSame(moment(v), "year") && moment(b[f.Key]).isSame(moment(v), "month") && moment(b[f.Key]).isSame(moment(v), "day"));
                    }
                    if (temporaryFiltered != null && temporaryFiltered.length > 0) {
                        ko.utils.arrayForEach(temporaryFiltered, function (tf) {
                            if (!subFiltered.includes(tf)) {
                                subFiltered.push(tf);
                            }
                        });
                    }
                });
            }
            else {
                ko.utils.arrayForEach(f.Values, function (v) {
                    var temporaryFiltered = [];
                    if (typeof (v) == "number") {
                        temporaryFiltered = filtered.filter(b => b[f.Key][f.InnerKey] == v);
                    }
                    else if (typeof (v) == "string") {
                        temporaryFiltered = filtered.filter(b => b[f.Key][f.InnerKey].toLowerCase().includes(v.toLowerCase()));
                    }
                    else if (typeof (v) == "boolean") {
                        temporaryFiltered = filtered.filter(b => (typeof (b[f.Key][f.InnerKey]) == "boolean" ? b[f.Key][f.InnerKey] == v : v ? b[f.Key][f.InnerKey] != null : b[f.Key][f.InnerKey] == null));
                    }
                    else if (typeof (v) == "object") {
                        temporaryFiltered = filtered.filter(b => moment(b[f.Key][f.InnerKey]).isSame(moment(v), "year") && moment(b[f.Key][f.InnerKey]).isSame(moment(v), "month") && moment(b[f.Key][f.InnerKey]).isSame(moment(v), "day"));
                    }
                    if (temporaryFiltered != null && temporaryFiltered.length > 0) {
                        ko.utils.arrayForEach(temporaryFiltered, function (tf) {
                            if (!subFiltered.includes(tf)) {
                                subFiltered.push(tf);
                            }
                        });
                    }
                });
            }
            filtered = subFiltered;
        });
        pagination.allEntities = filtered;
        PageEntities();
    };

    pagination.Find = function (key, innerKey, value) {
        var found = ko.utils.arrayFirst(pagination.allEntities, function (e) {
            if (innerKey == null) {
                var foundEntity = e[key] == value;
            }
            else {
                var foundEntity = e[key][innerKey] == value;
            }
            return foundEntity;
        });
        return found;
    };

    pagination.Sort = function (key, innerKey, sortDirection) {
        pagination.entityList([]);
        if (innerKey == null) {
            switch (sortDirection) {
                case sortDirectionsEnum.Ascending:
                    pagination.allEntities.sort(function (left, right) {
                        if (left[key] == null) {
                            return 1;
                        }
                        if (right[key] == null) {
                            return -1;
                        }
                        if (typeof (left[key]) == "number") {
                            return (left[key] == right[key] ? 0 : (left[key] < right[key] ? -1 : 1));
                        }
                        else if (typeof (left[key]) == "string") {
                            return left[key].localeCompare(right[key]);
                        }
                        else if (typeof (left[key]) == "boolean") {
                            return (left[key] ? -1 : 1);
                        }
                        return 0;
                    });
                    break;
                case sortDirectionsEnum.Descending:
                    pagination.allEntities.sort(function (left, right) {
                        if (left[key] == null) {
                            return 1;
                        }
                        if (right[key] == null) {
                            return -1;
                        }
                        if (typeof (left[key]) == "number") {
                            return (left[key] == right[key] ? 0 : (left[key] < right[key] ? 1 : -1));
                        }
                        else if (typeof (left[key]) == "string") {
                            return left[key].localeCompare(right[key]) * (-1);
                        }
                        else if (typeof (left[key]) == "boolean") {
                            return (left[key] ? 1 : -1);
                        }
                        return 0;
                    });
                    break;
                default:
                    break;
            }
        }
        else {
            switch (sortDirection) {
                case sortDirectionsEnum.Ascending:
                    pagination.allEntities.sort(function (left, right) {
                        if (left[key][innerKey] == null) {
                            return 1;
                        }
                        if (right[key][innerKey] == null) {
                            return -1;
                        }
                        if (typeof (left[key][innerKey]) == "number") {
                            return (left[key][innerKey] == right[key][innerKey] ? 0 : (left[key][innerKey] < right[key][innerKey] ? -1 : 1));
                        }
                        else if (typeof (left[key][innerKey]) == "string") {
                            return left[key][innerKey].localeCompare(right[key][innerKey]);
                        }
                        else if (typeof (left[key][innerKey]) == "boolean") {
                            return (left[key][innerKey] ? -1 : 1);
                        }
                        return 0;
                    });
                    break;
                case sortDirectionsEnum.Descending:
                    pagination.allEntities.sort(function (left, right) {
                        if (left[key][innerKey] == null) {
                            return 1;
                        }
                        if (right[key][innerKey] == null) {
                            return -1;
                        }
                        if (typeof (left[key][innerKey]) == "number") {
                            return (left[key][innerKey] == right[key][innerKey] ? 0 : (left[key][innerKey] < right[key][innerKey] ? 1 : -1));
                        }
                        else if (typeof (left[key][innerKey]) == "string") {
                            return left[key][innerKey].localeCompare(right[key][innerKey]) * (-1);
                        }
                        else if (typeof (left[key][innerKey]) == "boolean") {
                            return (left[key][innerKey] ? 1 : -1);
                        }
                        return 0;
                    });
                    break;
                default:
                    break;
            }
        }
        PageEntities();
    };

    pagination.Initialize = function () {
        pagination.pageSize = 10;
        pagination.allEntities = [];
        pagination.entityList([]);
        pagination.totalResults(0);
        pagination.totalPages(0);
        pagination.activePage(0);
        pagination.hasLeft(false);
        pagination.hasRight(false);
        pagination.elementClass = null;
        pagination.scrollable(false);
    };

    function PageEntities() {
        if (pagination.allEntities.length == 0) {
            toastr.info(language.Translate("NoResults", null));
            return;
        }
        for (i = 0; i < pagination.allEntities.length; i++) {
            if (i == pagination.pageSize) {
                break;
            }
            pagination.entityList.push(pagination.allEntities[i]);
        }
        var items = pagination.allEntities.length;
        var pages = items / pagination.pageSize;
        var normalizedPages = Math.floor(pages);
        if (pages > Math.floor(pages)) {
            normalizedPages = normalizedPages + 1;
        }
        pagination.totalResults(pagination.allEntities.length);
        pagination.totalPages(normalizedPages);
        pagination.activePage(0);
        pagination.hasLeft(false);
        if (pagination.totalPages() > 3) {
            pagination.hasRight(true);
        }
        else {
            pagination.hasRight(false);
        }
    };

    function ScrollEntities() {
        var entityListElements = document.getElementsByClassName(pagination.elementClass);
        if (entityListElements != null && entityListElements.length > 0) {
            var entityListElement = entityListElements[0];
            if (entityListElement.scrollTop >= (entityListElement.scrollHeight - entityListElement.offsetHeight - 50)) {
                var previousPosition = entityListElement.scrollTop;
                var customerList = pagination.allEntities;
                var pageSize = pagination.pageSize + 10;
                var elementClass = pagination.elementClass;
                pagination.Initialize();
                pagination.NoSearchEntities(customerList, pageSize);
                pagination.ScrollEntities(elementClass);
                var refreshedEntityListElements = document.getElementsByClassName(pagination.elementClass);
                if (refreshedEntityListElements != null && refreshedEntityListElements.length > 0) {
                    var refreshedEntityListElement = refreshedEntityListElements[0];
                    refreshedEntityListElement.scrollTop = previousPosition;
                }
            }
        }
    };

}