var orderStatusEnum = {
    Received: 0,
    Preparing: 1,
    Ready: 3,
    Onroad: 4,
    Canceled: 5,
    Complete: 6,
    Returned: 7,
    OnHold: 11
};

var orderOriginEnum = {
    Unknown: -1,
    Agent: 0,
    Website: 1,
    Mobile: 2,
    EFood: 3,
    ClickDelivery: 4,
    Deliveras: 5,
    Skroutz: 6,
    DineIn: 7
};

var accountTypeEnum = {
    Cash: 1,
    Complimentary: 2,
    RoomCharge: 3,
    CreditCard: 4,
    Barcode: 5,
    Voucher: 6,
    Allowance: 9
};

var saleTypeEnum = {
    Delivery: 20,
    Takeout: 21
};

var invoiceTypeEnum = {
    Receipt: 1,
    Order: 2,
    VoidReceipt: 3,
    Complimentary: 4,
    Allowance: 5,
    Bill: 7,
    VoidOrder: 8,
    PaymentReceipt: 11,
    RefundReceipt: 12,
    Credit: 13,
    Prebill: 14
};

var priceListTypeEnum = {
    Delivery: 20,
    Takeout: 21
};

var discountTypeEnum = {
    Percentage: 0,
    Amount: 1,
    OpenPercentage: 2,
    OpenAmount: 3
};

var discountOriginEnum = {
    Item: 0,
    Total: 1
};

var otherDiscountEnum = {
    Loyalty: 0,
    Goodys: 1,
    Vodafone: 2
};

var orderNumberEnum = {
    Agent: 0,
    Store: 1
};