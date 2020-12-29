function CustomerModel(model) {
    var customer = this;
    customer.Id = model != null ? model.Id : 0;
    customer.Email = model != null ? model.Email : null;
    customer.Password = model != null ? model.Password : null;
    customer.FirstName = model != null ? model.FirstName : null;
    customer.LastName = model != null ? model.LastName : null;
    customer.Phone1 = model != null ? model.Phone1 : null;
    customer.Phone2 = model != null ? model.Phone2 : null;
    customer.Mobile = model != null ? model.Mobile : null;
    customer.Loyalty = model != null ? model.Loyalty : false;
    customer.LoyaltyPoints = model != null ? model.LoyaltyPoints : null;
    customer.JobName = model != null ? model.JobName : null;
    customer.CompanyPhone = model != null ? model.CompanyPhone !== undefined ? model.CompanyPhone : model.PhoneComp : null;
    customer.Profession = model != null ? model.Profession !== undefined ? model.Profession : model.Proffesion : null;
    customer.TaxNumber = model != null ? model.TaxNumber !== undefined ? model.TaxNumber : model.VatNo : null;
    customer.TaxOffice = model != null ? model.TaxOffice !== undefined ? model.TaxOffice : model.Doy : null;
    customer.Notes = model != null ? model.Notes : null;
    customer.SecretNotes = model != null ? model.SecretNotes : null;
    customer.LastOrderNote = model != null ? model.LastOrderNote : null;
    customer.SendSms = model != null ? model.SendSms : false;
    customer.SendEmail = model != null ? model.SendEmail : false;
    customer.BillingAddressId = model != null ? model.BillingAddressId !== undefined ? model.BillingAddressId : model.BillingAddressesId : 0;
    customer.LastAddressId = model != null ? model.LastAddressId : 0;
    customer.Addresses = [];
    customer.SelectedAddress = null;
    customer.SelectedBillingAddress = null;
    if (model != null && model.Addresses != null && model.Addresses.length > 0) {
        ko.utils.arrayForEach(model.Addresses, function (a) {
            var address = new AddressModel(a);
            customer.Addresses.push(address);
            if (address.Id == customer.BillingAddressId && customer.BillingAddressId != 0) {
                customer.SelectedBillingAddress = address;
            }
        });
        customer.SelectedAddress = customer.Addresses[0];
    }
    customer.IsAnonymous = model != null ? model.IsAnonymous : customerAnonymityStatusEnum.IsNotAnonymous;
    if (model != null) {
        switch (model.IsAnonymous) {
            case customerAnonymityStatusEnum.IsNotAnonymous:
                var isAnonymous = false;
                break;
            case customerAnonymityStatusEnum.WillBeAnonymous:
                var isAnonymous = true;
                break;
            case customerAnonymityStatusEnum.IsAnonymous:
                var isAnonymous = true;
                break;
            default:
                var isAnonymous = false;
                break;
        }
    }
    else {
        var isAnonymous = false;
    }
    customer.Anonymous = isAnonymous;
    customer.ExtId1 = model != null ? model.ExtId1 : null;
    customer.ExtId2 = model != null ? model.ExtId2 : null;
    customer.ExtId3 = model != null ? model.ExtId3 : null;
    customer.ExtId4 = model != null ? model.ExtId4 : null;
    customer.GDPR_Marketing = model != null ? model.GDPR_Marketing !== undefined ? model.GDPR_Marketing : model.GTPR_Marketing : null;
    customer.GDPR_Returner = model != null ? model.GDPR_Returner !== undefined ? model.GDPR_Returner : model.GTPR_Returner : null;
    customer.SessionKey = model != null ? model.SessionKey : null;
    customer.LastAddress = model != null ? model.LastAddress !== undefined ? model.LastAddress : null : null;
};

function AddressModel(model) {
    var address = this;
    address.Id = model != null ? model.Id : 0;
    address.CustomerId = model != null ? model.CustomerId !== undefined ? model.CustomerId : model.OwnerId : 0;
    address.AddressStreet = model != null ? model.AddressStreet : null;
    address.AddressNumber = model != null ? model.AddressNumber !== undefined ? model.AddressNumber : model.AddressNo : null;
    address.VerticalStreet = model != null ? model.VerticalStreet : null;
    address.Floor = model != null ? model.Floor : null;
    address.Bell = model != null ? model.Bell : null;
    address.Area = model != null ? model.Area : null;
    address.ZipCode = model != null ? model.ZipCode !== undefined ? model.ZipCode : model.Zipcode : null;
    address.City = model != null ? model.City : null;
    address.FriendlyName = model != null ? model.FriendlyName : null;
    address.Latitude = model != null ? model.Latitude : null;
    address.Longitude = model != null ? model.Longitude !== undefined ? model.Longitude : model.Longtitude : null;
    address.AddressType = model != null ? model.AddressType : addressTypeEnum.Shipping;
    address.Notes = model != null ? model.Notes : null;
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
    address.Proximity = proxomity;
    address.LastPhoneNumber = model != null ? model.LastPhoneNumber : null;
    address.Modified = model != null ? false : true;
    address.ExtObj = model != null ? model.ExtObj : null;
    address.ExtId1 = model != null ? model.ExtId1 : null;
    address.ExtId2 = model != null ? model.ExtId2 : null;
};

function AddressStigmaModel(model) {
    var addressStigma = this;
    addressStigma.Street = model != null ? model.Street : null;
    addressStigma.Number = model != null ? model.Number : null;
    addressStigma.Area = model != null ? model.Area : null;
    addressStigma.ZipCode = model != null ? model.ZipCode : null;
    addressStigma.City = model != null ? model.City : null;
    addressStigma.Country = model != null ? model.Country : null;
    addressStigma.Latitude = model != null ? model.Latitude : null;
    addressStigma.Longitude = model != null ? model.Longitude : null;
    addressStigma.Proximity = model != null ? model.Proximity : null;
    addressStigma.Description = model != null ? model.Description : null;
};

function PostCustomerModel(model) {
    var customer = this;
    customer.Id = model.Id;
    customer.Email = model.Email;
    customer.Password = model.Password;
    customer.FirstName = model.FirstName != null ? model.FirstName.toUpperCase() : null;
    customer.LastName = model.LastName != null ? model.LastName.toUpperCase() : null;
    customer.Phone1 = model.Phone1;
    customer.Phone2 = model.Phone2;
    customer.Mobile = model.Mobile;
    customer.BillingAddressesId = model.BillingAddressId;
    customer.VatNo = model.TaxNumber;
    customer.Doy = model.TaxOffice;
    customer.JobName = model.JobName;
    customer.LastAddressId = model.LastAddressId;
    customer.Notes = model.Notes != null ? model.Notes.toUpperCase() : null;
    customer.SecretNotes = model.SecretNotes != null ? model.SecretNotes.toUpperCase() : null;
    customer.LastOrderNote = model.LastOrderNote;
    customer.GTPR_Marketing = model.GDPR_Marketing;
    customer.GTPR_Returner = model.GDPR_Returner;
    customer.SessionKey = model.SessionKey;
    customer.Loyalty = model.Loyalty;
    customer.ExtId1 = model.ExtId1;
    customer.ExtId2 = model.ExtId2;
    customer.ExtId3 = model.ExtId3;
    customer.ExtId4 = model.ExtId4;
    customer.PhoneComp = model.CompanyPhone;
    customer.SendSms = model.SendSms;
    customer.SendEmail = model.SendEmail;
    customer.Proffesion = model.Profession;
    switch (model.IsAnonymous) {
        case customerAnonymityStatusEnum.IsNotAnonymous:
            if (model.Anonymous) {
                var isAnonymous = customerAnonymityStatusEnum.WillBeAnonymous;
            }
            else {
                var isAnonymous = customerAnonymityStatusEnum.IsNotAnonymous;
            }
            break;
        case customerAnonymityStatusEnum.WillBeAnonymous:
            if (model.Anonymous) {
                var isAnonymous = customerAnonymityStatusEnum.WillBeAnonymous;
            }
            else {
                var isAnonymous = customerAnonymityStatusEnum.IsNotAnonymous;
            }
            break;
        case customerAnonymityStatusEnum.IsAnonymous:
            var isAnonymous = customerAnonymityStatusEnum.IsAnonymous;
            break;
        default:
            if (model.Anonymous) {
                var isAnonymous = customerAnonymityStatusEnum.WillBeAnonymous;
            }
            else {
                var isAnonymous = customerAnonymityStatusEnum.IsNotAnonymous;
            }
            break;
    }
    customer.IsAnonymous = isAnonymous;
};

function PostAddressModel(model) {
    var address = this;
    address.Id = model.Id;
    address.OwnerId = model.CustomerId;
    address.AddressStreet = model.AddressStreet;
    address.AddressNo = model.AddressNumber;
    address.VerticalStreet = model.VerticalStreet;
    address.Floor = model.Floor;
    address.Area = model.Area;
    address.City = model.City;
    address.Zipcode = model.ZipCode;
    address.Latitude = model.Latitude;
    address.Longtitude = model.Longitude;
    address.Notes = model.Notes;
    address.Bell = model.Bell;
    address.AddressType = model.AddressType;
    address.ExtObj = model.ExtObj;
    address.ExtId1 = model.ExtId1;
    address.ExtId2 = model.ExtId2;
    address.FriendlyName = model.FriendlyName;
    switch (model.Proximity) {
        case geocoderLocationTypeDescriptionEnum.Rooftop:
            address.AddressProximity = geocoderLocationTypeValueEnum.Rooftop;
            break;
        case geocoderLocationTypeDescriptionEnum.RangeInterpolated:
            address.AddressProximity = geocoderLocationTypeValueEnum.RangeInterpolated;
            break;
        case geocoderLocationTypeDescriptionEnum.GeometricCenter:
            address.AddressProximity = geocoderLocationTypeValueEnum.GeometricCenter;
            break;
        case geocoderLocationTypeDescriptionEnum.Approximate:
            address.AddressProximity = geocoderLocationTypeValueEnum.Approximate;
            break;
        case geocoderLocationTypeDescriptionEnum.Unknown:
            address.AddressProximity = geocoderLocationTypeValueEnum.Unknown;
            break;
        default:
            address.AddressProximity = geocoderLocationTypeValueEnum.Unknown;
            break;
    }
    address.LastPhoneNumber = model.LastPhoneNumber;
};