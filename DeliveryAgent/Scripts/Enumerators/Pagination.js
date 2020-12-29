var sortDirectionsEnum = {
    Ascending: 0,
    Descending: 1
};

var sortKeysEnum = {
    RequestCategory: "Message",
    RequestCreationDate: "CreationDate",
    RequestId: "Id",
    RequestReason: "MainMessage",
    RequestStaff: "StaffId",
    RequestStatus: "IsTemporary",
    RequestStore: "StoreId",
    RequestSubcategory: "MessageDetail",
    SearchCustomer: "daCustomerModel"
};

var sortInnerKeysEnum = {
    SearchCustomerName: "FirstName",
    SearchCustomerSurname: "LastName"
};

var findKeysEnum = {
    SearchCustomer: "daCustomerModel"
};

var findInnerKeysEnum = {
    SearchCustomerId: "Id"
};

var filterKeysEnum = {
    RequestCreationDate: "CreationDate",
    RequestMessage: "Description",
    RequestReason: "MainMessageId",
    RequestStaff: "StaffId",
    RequestStatus: "IsTemporary",
    RequestStore: "StoreId",
    IngredientDescription: "Description"
};