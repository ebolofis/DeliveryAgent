function ExternalModel(model) {
    var external = this;
    external.PriceListId = model != null ? model.PriceListId : 0;
    external.ProductId = model != null ? model.ProductId !== undefined ? model.ProductId : model.DefaultProductId : 0;
    external.RemoveRecipeExtras = model != null ? model.RemoveRecipeExtras : false;
    var customer = model != null ? model.Customer : null;
    external.Customer = new ExternalCustomerModel(customer);
    var shippingAddress = model != null ? model.ShippingAddress : null;
    external.ShippingAddress = new ExternalAddressModel(shippingAddress);
    var billingAddress = model != null ? model.BillingAddress : null;
    if (billingAddress != null) {
        external.BillingAddress = new ExternalAddressModel(billingAddress);
    }
    else {
        external.BillingAddress = null;
    }
    var order = model != null ? model.Order : null;
    external.Order = new ExternalOrderModel(order);
};

function ExternalCustomerModel(model) {
    var externalCustomer = this;
    externalCustomer.Id = model != null ? model.Id : 0;
    externalCustomer.FirstName = model != null ? model.FirstName : null;
    externalCustomer.LastName = model != null ? model.LastName : null;
    externalCustomer.Mobile = model != null ? model.Mobile : null;
    externalCustomer.Phone1 = model != null ? model.Phone1 : null;
    externalCustomer.Phone2 = model != null ? model.Phone2 : null;
    externalCustomer.Email = model != null ? model.Email : null;
    externalCustomer.Password = model != null ? model.Password : null;
    externalCustomer.Loyalty = model != null ? model.Loyalty : false;
    externalCustomer.Notes = model != null ? model.Notes : null;
    externalCustomer.SecretNotes = model != null ? model.SecretNotes : null;
    externalCustomer.LastOrderNote = model != null ? model.LastOrderNote : null;
    externalCustomer.SendSms = model != null ? model.SendSms : false;
    externalCustomer.SendEmail = model != null ? model.SendEmail : false;
    externalCustomer.LastAddressId = model != null ? model.LastAddressId : 0;
    externalCustomer.BillingAddressesId = model != null ? model.BillingAddressesId : 0;
    externalCustomer.CompanyName = model != null ? model.CompanyName !== undefined ? model.CompanyName : model.JobName : null;
    externalCustomer.CompanyPhone = model != null ? model.CompanyPhone !== undefined ? model.CompanyPhone : model.PhoneComp : null;
    externalCustomer.TaxNumber = model != null ? model.TaxNumber !== undefined ? model.TaxNumber : model.VatNo : null;
    externalCustomer.TaxOffice = model != null ? model.TaxNumber !== undefined ? model.TaxNumber : model.Doy : null;
    externalCustomer.Profession = model != null ? model.Profession !== undefined ? model.Profession : model.Proffesion : null;
    externalCustomer.GDPR_Marketing = model != null ? model.GDPR_Marketing !== undefined ? model.GDPR_Marketing : model.GTPR_Marketing : false;
    externalCustomer.GDPR_Returner = model != null ? model.GDPR_Returner !== undefined ? model.GDPR_Returner : model.GTPR_Returner : false;
    externalCustomer.IsDeleted = model != null ? model.IsDeleted : false;
    externalCustomer.ExtId1 = model != null ? model.ExtId1 : null;
    externalCustomer.ExtId2 = model != null ? model.ExtId2 : null;
    externalCustomer.ExtId3 = model != null ? model.ExtId3 : null;
    externalCustomer.ExtId4 = model != null ? model.ExtId4 : null;
    externalCustomer.ExtType = model != null ? model.ExtType : null;
    externalCustomer.SessionKey = model != null ? model.SessionKey : null;
};

function ExternalAddressModel(model) {
    var externalAddress = this;
    externalAddress.Id = model != null ? model.Id : 0;
    externalAddress.AddressStreet = model != null ? model.AddressStreet : null;
    externalAddress.AddressNumber = model != null ? model.AddressNumber !== undefined ? model.AddressNumber : model.AddressNo : null;
    externalAddress.Area = model != null ? model.Area : null;
    externalAddress.ZipCode = model != null ? model.ZipCode !== undefined ? model.ZipCode : model.Zipcode : null;
    externalAddress.City = model != null ? model.City : null;
    externalAddress.VerticalStreet = model != null ? model.VerticalStreet : null;
    externalAddress.FriendlyName = model != null ? model.FriendlyName : null;
    externalAddress.SearchAddressString = model != null ? model.SearchAddressString : null;
    externalAddress.Latitude = model != null ? model.Latitude : null;
    externalAddress.Longitude = model != null ? model.Longitude !== undefined ? model.Longitude : model.Longtitude : null;
    if (model != null && model.Proximity !== undefined) {
        var proxomity = model.Proximity;
    }
    else if (model != null) {
        switch (model.AddressProximity) {
            case geocoderLocationTypeValueEnum.Rooftop:
                var proxomity = geocoderLocationTypeDescriptionEnum.Rooftop;
                break;
            case geocoderLocationTypeValueEnum.RangeInterpolated:
                var proxomity = geocoderLocationTypeDescriptionEnum.RangeInterpolated;
                break;
            case geocoderLocationTypeValueEnum.GeometricCenter:
                var proxomity = geocoderLocationTypeDescriptionEnum.GeometricCenter;
                break;
            case geocoderLocationTypeValueEnum.Approximate:
                var proxomity = geocoderLocationTypeDescriptionEnum.Approximate;
                break;
            case geocoderLocationTypeValueEnum.Unknown:
                var proxomity = geocoderLocationTypeDescriptionEnum.Unknown;
                break;
            default:
                var proxomity = null;
                break;
        }
    }
    else {
        var proxomity = null;
    }
    externalAddress.Proximity = proxomity;
    externalAddress.AddressType = model != null ? model.AddressType : addressTypeEnum.Shipping;
    externalAddress.IsShipping = model != null ? model.IsShipping !== undefined ? model.IsShipping : model.isShipping : null;
    externalAddress.Floor = model != null ? model.Floor : null;
    externalAddress.Bell = model != null ? model.Bell : null;
    externalAddress.Notes = model != null ? model.Notes : null;
    externalAddress.NotesHlp = model != null ? model.NotesHlp : null;
    externalAddress.OwnerId = model != null ? model.OwnerId : 0;
    externalAddress.IsDeleted = model != null ? model.IsDeleted : false;
    externalAddress.ExtId1 = model != null ? model.ExtId1 : null;
    externalAddress.ExtId2 = model != null ? model.ExtId2 : null;
    externalAddress.ExtObj = model != null ? model.ExtObj : null;
};

function ExternalOrderModel(model) {
    var externalOrder = this;
    externalOrder.Id = model != null ? model.Id : 0;
    externalOrder.ShippingAddressId = model != null ? model.ShippingAddressId : 0;
    externalOrder.BillingAddressId = model != null ? model.BillingAddressId : 0;
    externalOrder.StoreId = model != null ? model.StoreId : 0;
    externalOrder.StaffId = model != null ? model.StaffId !== undefined ? model.StaffId : model.Staffid : 0;
    externalOrder.CustomerId = model != null ? model.CustomerId : null;
    externalOrder.AgentNo = model != null ? model.AgentNo : null;
    externalOrder.Origin = model != null ? model.Origin : orderOriginEnum.Unknown;
    externalOrder.OrderDate = model != null ? model.OrderDate : null;
    externalOrder.EstTakeoutDate = model != null ? model.EstTakeoutDate : null;
    externalOrder.TakeoutDate = model != null ? model.TakeoutDate : null;
    externalOrder.EstBillingDate = model != null ? model.EstBillingDate : null;
    externalOrder.BillingDate = model != null ? model.BillingDate : null;
    externalOrder.FinishDate = model != null ? model.FinishDate : null;
    externalOrder.Duration = model != null ? model.Duration : null;
    externalOrder.Discount = model != null ? model.Discount : 0;
    externalOrder.DiscountRemark = model != null ? model.DiscountRemark : null;
    externalOrder.Price = model != null ? model.Price : 0;
    externalOrder.Total = model != null ? model.Total : 0;
    externalOrder.TotalTax = model != null ? model.TotalTax : 0;
    externalOrder.TotalVat = model != null ? model.TotalVat : 0;
    externalOrder.TotalNet = model != null ? model.TotalNet !== undefined ? model.TotalNet : model.NetAmount : 0;
    externalOrder.AccountType = model != null ? model.AccountType : accountTypeEnum.Cash;
    externalOrder.OrderType = model != null ? model.OrderType : saleTypeEnum.Delivery;
    externalOrder.InvoiceType = model != null ? model.InvoiceType : invoiceTypeEnum.Receipt;
    externalOrder.Status = model != null ? model.Status : orderStatusEnum.Received;
    externalOrder.StatusChange = model != null ? model.StatusChange : null;
    externalOrder.Cover = model != null ? model.Cover : null;
    externalOrder.IsDelay = model != null ? model.IsDelay : false;
    externalOrder.IsPaid = model != null ? model.IsPaid : false;
    externalOrder.IsSend = model != null ? model.IsSend : false;
    externalOrder.Remarks = model != null ? model.Remarks : null;
    externalOrder.LastOrderNote = model != null ? model.LastOrderNote : null;
    externalOrder.TelephoneNumber = model != null ? model.TelephoneNumber : null;
    externalOrder.LoyaltyCode = model != null ? model.LoyaltyCode : null;
    externalOrder.PaymentId = model != null ? model.PaymentId : null;
    externalOrder.GeoPolygonId = model != null ? model.GeoPolygonId : 0;
    externalOrder.PointsGain = model != null ? model.PointsGain : 0;
    externalOrder.PointsRedeem = model != null ? model.PointsRedeem : 0;
    externalOrder.AddLoyaltyPoints = model != null ? model.AddLoyaltyPoints : false;
    externalOrder.IgnoreShortages = model != null ? model.IgnoreShortages : false;
    externalOrder.ReduceRecipeQuantity = model != null ? model.ReduceRecipeQuantity !== undefined ? model.ReduceRecipeQuantity : model.ReduceRecipeQnt : false;
    externalOrder.ItemsChanged = model != null ? model.ItemsChanged : false;
    externalOrder.PosId = model != null ? model.PosId : 0;
    externalOrder.StorePosInfoDetail = model != null ? model.StorePosInfoDetail : 0;
    externalOrder.StoreOrderId = model != null ? model.StoreOrderId : 0;
    externalOrder.StoreOrderNo = model != null ? model.StoreOrderNo : null;
    externalOrder.ErrorMessage = model != null ? model.ErrorMessage : null;
    externalOrder.Flag = model != null ? model.Flag : false;
    externalOrder.LogicErrors = model != null ? model.LogicErrors : null;
    externalOrder.LogicErrorList = [];
    if (externalOrder.LogicErrors != null && externalOrder.LogicErrors != "") {
        var errors = externalOrder.LogicErrors.split("|");
        ko.utils.arrayForEach(errors, function (e) {
            externalOrder.LogicErrorList.push(e);
        });
    }
    externalOrder.Errors = model != null ? model.Errors !== undefined ? model.Errors : model.ExtDeliveryErrors : null;
    externalOrder.ErrorList = [];
    if (externalOrder.Errors != null && externalOrder.Errors != "") {
        var errors = externalOrder.Errors.split("|");
        ko.utils.arrayForEach(errors, function (e) {
            externalOrder.ErrorList.push(e);
        });
    }
    externalOrder.ExtDeliveryOrigin = model != null ? model.ExtDeliveryOrigin : null;
    externalOrder.ExtId1 = model != null ? model.ExtId1 : null;
    externalOrder.ExtId2 = model != null ? model.ExtId2 : null;
    externalOrder.ExtType = model != null ? model.ExtType : null;
    externalOrder.ExtObj = model != null ? model.ExtObj : null;
    externalOrder.ExtData = model != null ? model.ExtData : null;
    externalOrder.Metadata = model != null ? model.Metadata : null;
    externalOrder.Details = [];
    if (model != null && model.Details != null && model.Details.length > 0) {
        ko.utils.arrayForEach(model.Details, function (d) {
            var orderDetail = new ExternalOrderDetailModel(d);
            externalOrder.Details.push(orderDetail);
        });
    }
    externalOrder.CheckShippingAddress = true;
};

function ExternalOrderDetailModel(model) {
    var externalOrderDetail = this;
    externalOrderDetail.Id = model != null ? model.Id : 0;
    externalOrderDetail.DAOrderId = model != null ? model.DAOrderId : 0;
    externalOrderDetail.PriceListId = model != null ? model.PriceListId : 0;
    externalOrderDetail.ProductId = model != null ? model.ProductId : 0;
    externalOrderDetail.ProductCode = model != null ? model.ProductCode : null;
    externalOrderDetail.Description = model != null ? model.Description : null;
    externalOrderDetail.Quantity = model != null ? model.Quantity !== undefined ? model.Quantity : model.Qnt : 1;
    externalOrderDetail.Price = model != null ? model.Price : 0;
    externalOrderDetail.Discount = model != null ? model.Discount : 0;
    externalOrderDetail.Total = model != null ? model.Total : 0;
    externalOrderDetail.TotalWithExtras = 0;
    var totalWithExtras = ((externalOrderDetail.Quantity * externalOrderDetail.Price) - externalOrderDetail.Discount);
    externalOrderDetail.RateTax = model != null ? model.RateTax : 0;
    externalOrderDetail.TotalTax = model != null ? model.TotalTax : 0;
    externalOrderDetail.RateVat = model != null ? model.RateVat : 0;
    externalOrderDetail.TotalVat = model != null ? model.TotalVat : 0;
    externalOrderDetail.TotalNet = model != null ? model.TotalNet !== undefined ? model.TotalNet : model.NetAmount : null;
    externalOrderDetail.ItemRemark = model != null ? model.ItemRemark : null;
    externalOrderDetail.Extras = [];
    if (model != null && model.Extras != null && model.Extras.length > 0) {
        ko.utils.arrayForEach(model.Extras, function (e) {
            var orderDetailExtra = new ExternalOrderDetailExtraModel(e);
            totalWithExtras += (orderDetailExtra.Quantity * orderDetailExtra.Price);
            externalOrderDetail.Extras.push(orderDetailExtra);
        });
    }
    externalOrderDetail.TotalWithExtras = totalWithExtras;
};

function ExternalOrderDetailExtraModel(model) {
    var externalOrderDetailExtra = this;
    externalOrderDetailExtra.Id = model != null ? model.Id : 0;
    externalOrderDetailExtra.OrderDetailId = model != null ? model.OrderDetailId : 0;
    externalOrderDetailExtra.ExtrasId = model != null ? model.ExtrasId : 0;
    externalOrderDetailExtra.ExtraCode = model != null ? model.ExtraCode : null;
    externalOrderDetailExtra.Description = model != null ? model.Description : null;
    externalOrderDetailExtra.Quantity = model != null ? model.Quantity !== undefined ? model.Quantity : model.Qnt : 1;
    externalOrderDetailExtra.Price = model != null ? model.Price : 0;
    externalOrderDetailExtra.RateTax = model != null ? model.RateTax : 0;
    externalOrderDetailExtra.TotalTax = model != null ? model.TotalTax : 0;
    externalOrderDetailExtra.RateVat = model != null ? model.RateVat : 0;
    externalOrderDetailExtra.TotalVat = model != null ? model.TotalVat : 0;
    externalOrderDetailExtra.TotalNet = model != null ? model.TotalNet !== undefined ? model.TotalNet : model.NetAmount : 0;
    externalOrderDetailExtra.ItemsChanged = model != null ? model.ItemsChanged : false;
};

function PostExternalModel(model) {
    var postExternal = this;
    postExternal.PriceListId = model.PriceListId;
    postExternal.DefaultProductId = model.ProductId;
    postExternal.RemoveRecipeExtras = model.RemoveRecipeExtras;
    postExternal.Customer = new PostExternalCustomerModel(model.Customer);
    postExternal.ShippingAddress = new PostExternalAddressModel(model.ShippingAddress);
    if (model.BillingAddress != null) {
        postExternal.BillingAddress = new PostExternalAddressModel(model.BillingAddress);
    }
    else {
        postExternal.BillingAddress = null;
    }
    postExternal.Order = new PostExternalOrderModel(model.Order);
};

function PostExternalCustomerModel(model) {
    var postExternalCustomer = this;
    postExternalCustomer.Id = model.Id;
    postExternalCustomer.FirstName = model.FirstName;
    postExternalCustomer.LastName = model.LastName;
    postExternalCustomer.Mobile = model.Mobile;
    postExternalCustomer.Phone1 = model.Phone1;
    postExternalCustomer.Phone2 = model.Phone2;
    postExternalCustomer.Email = model.Email;
    postExternalCustomer.Password = model.Password;
    postExternalCustomer.Loyalty = model.Loyalty;
    postExternalCustomer.Notes = model.Notes;
    postExternalCustomer.SecretNotes = model.SecretNotes;
    postExternalCustomer.LastOrderNote = model.LastOrderNote;
    postExternalCustomer.SendSms = model.SendSms;
    postExternalCustomer.SendEmail = model.SendEmail;
    postExternalCustomer.LastAddressId = model.LastAddressId;
    postExternalCustomer.BillingAddressesId = model.BillingAddressesId;
    postExternalCustomer.JobName = model.CompanyName;
    postExternalCustomer.PhoneComp = model.CompanyPhone;
    postExternalCustomer.VatNo = model.TaxNumber;
    postExternalCustomer.Doy = model.TaxOffice;
    postExternalCustomer.Proffesion = model.Profession;
    postExternalCustomer.GTPR_Marketing = model.GDPR_Marketing;
    postExternalCustomer.GTPR_Returner = model.GDPR_Returner;
    postExternalCustomer.IsDeleted = model.IsDeleted;
    postExternalCustomer.ExtId1 = model.ExtId1;
    postExternalCustomer.ExtId2 = model.ExtId2;
    postExternalCustomer.ExtId3 = model.ExtId3;
    postExternalCustomer.ExtId4 = model.ExtId4;
    postExternalCustomer.ExtType = model.ExtType;
    postExternalCustomer.SessionKey = model.SessionKey;
};

function PostExternalAddressModel(model) {
    var postExternalAddress = this;
    postExternalAddress.Id = model.Id;
    postExternalAddress.AddressStreet = model.AddressStreet;
    postExternalAddress.AddressNo = model.AddressNumber;
    postExternalAddress.Area = model.Area;
    postExternalAddress.Zipcode = model.ZipCode;
    postExternalAddress.City = model.City;
    postExternalAddress.VerticalStreet = model.VerticalStreet;
    postExternalAddress.FriendlyName = model.FriendlyName;
    postExternalAddress.SearchAddressString = model.SearchAddressString;
    postExternalAddress.Latitude = model.Latitude;
    postExternalAddress.Longtitude = model.Longitude;
    switch (model.Proximity) {
        case geocoderLocationTypeDescriptionEnum.Rooftop:
            var proxomity = geocoderLocationTypeValueEnum.Rooftop;
            break;
        case geocoderLocationTypeDescriptionEnum.RangeInterpolated:
            var proxomity = geocoderLocationTypeValueEnum.RangeInterpolated;
            break;
        case geocoderLocationTypeDescriptionEnum.GeometricCenter:
            var proxomity = geocoderLocationTypeValueEnum.GeometricCenter;
            break;
        case geocoderLocationTypeDescriptionEnum.Approximate:
            var proxomity = geocoderLocationTypeValueEnum.Approximate;
            break;
        case geocoderLocationTypeDescriptionEnum.Unknown:
            var proxomity = geocoderLocationTypeValueEnum.Unknown;
            break;
        default:
            var proxomity = null;
            break;
    }
    postExternalAddress.AddressProximity = proxomity
    postExternalAddress.AddressType = model.AddressType;
    postExternalAddress.isShipping = model.IsShipping;
    postExternalAddress.Floor = model.Floor;
    postExternalAddress.Bell = model.Bell;
    postExternalAddress.NotesHlp = model.NotesHlp;
    postExternalAddress.OwnerId = model.OwnerId;
    postExternalAddress.IsDeleted = model.IsDeleted;
    postExternalAddress.ExtId1 = model.ExtId1;
    postExternalAddress.ExtId2 = model.ExtId2;
    postExternalAddress.ExtObj = model.ExtObj;
};

function PostExternalOrderModel(model) {
    var postExternalOrder = this;
    postExternalOrder.Id = model.Id;
    postExternalOrder.ShippingAddressId = model.ShippingAddressId;
    postExternalOrder.BillingAddressId = model.BillingAddressId;
    postExternalOrder.StoreId = model.StoreId;
    postExternalOrder.Staffid = model.StaffId;
    postExternalOrder.CustomerId = model.CustomerId;
    postExternalOrder.AgentNo = model.AgentNo;
    postExternalOrder.Origin = model.Origin;
    postExternalOrder.OrderDate = model.OrderDate;
    postExternalOrder.EstTakeoutDate = model.EstTakeoutDate;
    postExternalOrder.TakeoutDate = model.TakeoutDate;
    postExternalOrder.EstBillingDate = model.EstBillingDate;
    postExternalOrder.BillingDate = model.BillingDate;
    postExternalOrder.FinishDate = model.FinishDate;
    postExternalOrder.Duration = model.Duration;
    postExternalOrder.Discount = model.Discount;
    postExternalOrder.DiscountRemark = model.DiscountRemark;
    postExternalOrder.Price = model.Price;
    postExternalOrder.Total = model.Total;
    postExternalOrder.TotalTax = model.TotalTax;
    postExternalOrder.TotalVat = model.TotalVat;
    postExternalOrder.NetAmount = model.TotalNet;
    postExternalOrder.AccountType = model.AccountType;
    postExternalOrder.OrderType = model.OrderType;
    postExternalOrder.InvoiceType = model.InvoiceType;
    postExternalOrder.Status = model.Status;
    postExternalOrder.StatusChange = model.StatusChange;
    postExternalOrder.Cover = model.Cover;
    postExternalOrder.IsDelay = model.IsDelay;
    postExternalOrder.IsPaid = model.IsPaid;
    postExternalOrder.IsSend = model.IsSend;
    postExternalOrder.Remarks = model.Remarks;
    postExternalOrder.LastOrderNote = model.LastOrderNote;
    postExternalOrder.TelephoneNumber = model.TelephoneNumber;
    postExternalOrder.LoyaltyCode = model.LoyaltyCode;
    postExternalOrder.PaymentId = model.PaymentId;
    postExternalOrder.GeoPolygonId = model.GeoPolygonId;
    postExternalOrder.PointsGain = model.PointsGain;
    postExternalOrder.PointsRedeem = model.PointsRedeem;
    postExternalOrder.AddLoyaltyPoints = model.AddLoyaltyPoints;
    postExternalOrder.IgnoreShortages = model.IgnoreShortages;
    postExternalOrder.ReduceRecipeQnt = model.ReduceRecipeQuantity;
    postExternalOrder.ItemsChanged = model.ItemsChanged;
    postExternalOrder.StorePosInfoDetail = model.StorePosInfoDetail;
    postExternalOrder.StoreOrderId = model.StoreOrderId;
    postExternalOrder.StoreOrderNo = model.StoreOrderNo;
    postExternalOrder.ErrorMessage = model.ErrorMessage;
    postExternalOrder.Flag = model.Flag;
    postExternalOrder.LogicErrors = model.LogicErrors;
    postExternalOrder.ExtDeliveryErrors = model.Errors;
    postExternalOrder.ExtDeliveryOrigin = model.ExtDeliveryOrigin;
    postExternalOrder.ExtId1 = model.ExtId1;
    postExternalOrder.ExtId2 = model.ExtId2;
    postExternalOrder.ExtType = model.ExtType;
    postExternalOrder.ExtObj = model.ExtObj;
    postExternalOrder.ExtData = model.ExtData;
    postExternalOrder.Metadata = model.Metadata;
    postExternalOrder.Details = [];
    ko.utils.arrayForEach(model.Details, function (d) {
        var orderDetail = new PostExternalOrderDetailModel(d);
        postExternalOrder.Details.push(orderDetail);
    });
    postExternalOrder.CheckShippingAddress = model.CheckShippingAddress;
};

function PostExternalOrderDetailModel(model) {
    var postExternalOrderDetail = this;
    postExternalOrderDetail.Id = model.Id;
    postExternalOrderDetail.DAOrderId = model.DAOrderId;
    postExternalOrderDetail.PriceListId = model.PriceListId;
    postExternalOrderDetail.ProductId = model.ProductId;
    postExternalOrderDetail.ProductCode = model.ProductCode;
    postExternalOrderDetail.Description = model.Description;
    postExternalOrderDetail.Qnt = model.Quantity;
    postExternalOrderDetail.Price = model.Price;
    postExternalOrderDetail.Discount = model.Discount;
    postExternalOrderDetail.Total = model.Total;
    postExternalOrderDetail.RateTax = model.RateTax;
    postExternalOrderDetail.TotalTax = model.TotalTax;
    postExternalOrderDetail.RateVat = model.RateVat;
    postExternalOrderDetail.TotalVat = model.TotalVat;
    postExternalOrderDetail.NetAmount = model.TotalNet;
    postExternalOrderDetail.ItemRemark = model.ItemRemark;
    postExternalOrderDetail.Extras = [];
    ko.utils.arrayForEach(model.Extras, function (e) {
        var orderDetailExtra = new PostExternalOrderDetailExtraModel(e);
        postExternalOrderDetail.Extras.push(orderDetailExtra);
    });
};

function PostExternalOrderDetailExtraModel(model) {
    var postExternalOrderDetailExtra = this;
    postExternalOrderDetailExtra.Id = model.Id;
    postExternalOrderDetailExtra.OrderDetailId = model.OrderDetailId;
    postExternalOrderDetailExtra.ExtrasId = model.ExtrasId;
    postExternalOrderDetailExtra.ExtraCode = model.ExtraCode;
    postExternalOrderDetailExtra.Description = model.Description;
    postExternalOrderDetailExtra.Qnt = model.Quantity;
    postExternalOrderDetailExtra.Price = model.Price;
    postExternalOrderDetailExtra.RateTax = model.RateTax;
    postExternalOrderDetailExtra.TotalTax = model.TotalTax;
    postExternalOrderDetailExtra.RateVat = model.RateVat;
    postExternalOrderDetailExtra.TotalVat = model.TotalVat;
    postExternalOrderDetailExtra.NetAmount = model.TotalNet;
    postExternalOrderDetailExtra.ItemsChanged = model.ItemsChanged;
};