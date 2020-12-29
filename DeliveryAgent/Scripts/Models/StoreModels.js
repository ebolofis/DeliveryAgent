function StoreModel(model) {
    var store = this;
    store.Id = model != null ? model.Id : null;
    store.AddressId = model != null ? model.AddressId : null;
    store.PosId = model != null ? model.PosId : null;
    store.PosStaffId = model != null ? model.PosStaffId : null;
    store.Description = model != null ? model.Description : null;
    store.Description2 = model != null ? model.Description2 : null;
    store.Title = model != null ? model.Title : null;
    store.Title2 = model != null ? model.Title2 : null;
    store.Code = model != null ? model.Code : null;
    store.Phone1 = model != null ? model.Phone1 : null;
    store.Phone2 = model != null ? model.Phone2 : null;
    store.Fax = model != null ? model.Fax : null;
    store.Email = model != null ? model.Email : null;
    store.VatNo = model != null ? model.VatNo : null;
    store.Doy = model != null ? model.Doy : null;
    store.Thumbnail = model != null ? model.Thumbnail : null;
    store.Image = model != null ? model.Image : null;
    store.StoreStatus = model != null ? model.StoreStatus : storeStatusEnum.Full;
    store.DeliveryTime = model != null ? model.DeliveryTime : null;
    store.TakeOutTime = model != null ? model.TakeOutTime : null;
    store.Notes = model != null ? model.Notes : null;
    store.WebApi = model != null ? model.WebApi : null;
    store.StoreId = model != null ? model.StoreId : null;
    store.Username = model != null ? model.Username : null;
    store.Password = model != null ? model.Password : null;
    store.HasCreditCard = model != null ? model.HasCreditCard != null ? model.HasCreditCard : model.isAllowedToHaveCreditCard : true;
};

function StorePriceListAssociationModel(model) {
    var storePriceListAssociation = this;
    storePriceListAssociation.Id = model != null ? model.Id : null;
    storePriceListAssociation.PriceListId = model != null ? model.PriceListId : null;
    storePriceListAssociation.PriceListDescription = model != null ? model.PriceListDescription : null;
    storePriceListAssociation.PriceListType = model != null ? model.PriceListType : null;
    storePriceListAssociation.DAStoreId = model != null ? model.DAStoreId : null;
    storePriceListAssociation.StoreTitle = model != null ? model.StoreTitle : null;
};