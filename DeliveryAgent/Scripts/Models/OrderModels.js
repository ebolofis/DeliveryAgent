function OrderModel(model) {
    var order = this;
    order.Id = model != null ? model.Id : null;
    order.StoreId = model != null ? model.StoreId : null;
    order.StoreOrderId = model != null ? model.StoreOrderId : null;
    order.StoreOrderNumber = model != null ? model.StoreOrderNumber !== undefined ? model.StoreOrderNumber : model.StoreOrderNo : null;
    order.PosId = model != null ? model.PosId : null;
    order.PosInfoDetailId = model != null ? model.PosInfoDetailId !== undefined ? model.PosInfoDetailId : model.StorePosInfoDetail : null;
    order.CustomerId = model != null ? model.CustomerId : null;
    order.AccountType = model != null ? model.AccountType : null;
    order.SaleType = model != null ? model.SaleType !== undefined ? model.SaleType : model.OrderType : null;
    order.InvoiceType = model != null ? model.InvoiceType : null;
    order.Price = model != null ? model.Price : null;
    order.Discount = model != null ? model.Discount : null;
    order.Total = model != null ? model.Total : null;
    order.Tax = model != null ? model.Tax !== undefined ? model.Tax : model.TotalTax : null;
    order.Vat = model != null ? model.Vat !== undefined ? model.Vat : model.TotalVat : null;
    order.Net = model != null ? model.Net !== undefined ? model.Net : model.NetAmount : null;
    order.PointsGain = model != null ? model.PointsGain : null;
    order.PointsRedeem = model != null ? model.PointsRedeem : null;
    order.StartDate = model != null ? model.StartDate !== undefined ? model.StartDate : model.OrderDate : null;
    order.EstTakeoutDate = model != null ? model.EstTakeoutDate : null;
    order.TakeoutDate = model != null ? model.TakeoutDate : null;
    order.EstBillingDate = model != null ? model.EstBillingDate : null;
    order.BillingDate = model != null ? model.BillingDate : null;
    order.FinishDate = model != null ? model.FinishDate : null;
    order.Duration = model != null ? model.Duration : null;
    order.Remarks = model != null ? model.Remarks : null;
    order.LastOrderNote = model != null ? model.LastOrderNote : null;
    order.Status = model != null ? model.Status : null;
    order.StatusChange = model != null ? model.StatusChange : null;
    order.ShippingAddressId = model != null ? model.ShippingAddressId : null;
    order.BillingAddressId = model != null ? model.BillingAddressId : null;
    order.Origin = model != null ? model.Origin : null;
    order.Cover = model != null ? model.Cover : null;
    order.DiscountRemark = model != null ? model.DiscountRemark : null;
    order.OrderNo = model != null ? model.OrderNo : null;
    order.ItemsChanged = model != null ? model.ItemsChanged : null;
    order.IsPaid = model != null ? model.IsPaid : null;
    order.IsDelay = model != null ? model.IsDelay : null;
    order.IsSend = model != null ? model.IsSend : null;
    order.AgentNumber = model != null ? model.AgentNumber !== undefined ? model.AgentNumber : model.AgentNo : null;
    order.StaffId = model != null ? model.StaffId !== undefined ? model.StaffId : model.Staffid : null;
    order.StaffName = "";
    order.PaymentId = model != null ? model.PaymentId : null;
    order.CommunicationPhone = model != null ? model.CommunicationPhone !== undefined ? model.CommunicationPhone : model.TelephoneNumber : null;
    order.LoyaltyCode = model != null ? model.LoyaltyCode : null;
    order.ExtId1 = model != null ? model.ExtId1 : null;
    order.ExtId2 = model != null ? model.ExtId2 : null;
    order.ExtType = model != null ? model.ExtType : null;
    order.ExtData = model != null ? model.ExtData : null;
    order.ExtObj = model != null ? model.ExtObj : null;
    if (order.ExtObj != null && typeof (order.ExtObj) == "string") {
        var externalObject = JSON.parse(order.ExtObj);
        if (externalObject.Staff != null) {
            order.StaffName = (externalObject.Staff.FirstName != null ? externalObject.Staff.FirstName : "") + (externalObject.Staff.FirstName != null && externalObject.Staff.LastName != null ? " " : "") + (externalObject.Staff.LastName != null ? externalObject.Staff.LastName : "");
        }
    }
    order.Metadata = model != null ? model.Metadata : null;
    order.Details = [];
    if (model != null && model.Details != null && model.Details.length > 0) {
        ko.utils.arrayForEach(model.Details, function (d) {
            var detail = new OrderDetailModel(d);
            order.Details.push(detail);
        });
    }
};

function OrderDetailModel(model) {
    var orderDetail = this;
    orderDetail.Id = model != null ? model.Id : null;
    orderDetail.OrderId = model != null ? model.OrderId !== undefined ? model.OrderId : model.DAOrderId : null;
    orderDetail.PriceListId = model != null ? model.PriceListId : null;
    orderDetail.ProductId = model != null ? model.ProductId : null;
    orderDetail.Description = model != null ? model.Description : null;
    orderDetail.Code = model != null ? model.Code !== undefined ? model.Code : model.ProductCode : null;
    orderDetail.Quantity = model != null ? model.Quantity !== undefined ? model.Quantity : model.Qnt : null;
    orderDetail.Price = model != null ? model.Price : null;
    orderDetail.Discount = model != null ? model.Discount : null;
    orderDetail.Total = model != null ? model.Total : null;
    orderDetail.TotalWithExtras = orderDetail.Total;
    orderDetail.RateTax = model != null ? model.RateTax : null;
    orderDetail.RateVat = model != null ? model.RateVat : null;
    orderDetail.Tax = model != null ? model.Tax !== undefined ? model.Tax : model.TotalTax : null;
    orderDetail.Vat = model != null ? model.Vat !== undefined ? model.Vat : model.TotalVat : null;
    orderDetail.Net = model != null ? model.Net !== undefined ? model.Net : model.NetAmount : null;
    orderDetail.ItemRemark = model != null ? model.ItemRemark : null;
    orderDetail.OtherDiscount = model != null ? model.OtherDiscount : null;
    orderDetail.Extras = [];
    if (model != null && model.Extras != null && model.Extras.length > 0) {
        ko.utils.arrayForEach(model.Extras, function (e) {
            var extra = new OrderDetailExtraModel(e);
            orderDetail.Extras.push(extra);
        });
    }
    ko.utils.arrayForEach(orderDetail.Extras, function (e) {
        var totalWithExtras = orderDetail.TotalWithExtras + e.Quantity * e.Price;
        orderDetail.TotalWithExtras = parseFloat(totalWithExtras.toFixed(2));
    });
};

function OrderDetailExtraModel(model) {
    var orderDetailExtra = this;
    orderDetailExtra.Id = model != null ? model.Id : null;
    orderDetailExtra.OrderDetailId = model != null ? model.OrderDetailId : null;
    orderDetailExtra.ExtraId = model != null ? model.ExtrasId : null;
    orderDetailExtra.Description = model != null ? model.Description : null;
    orderDetailExtra.Quantity = model != null ? model.Quantity !== undefined ? model.Quantity : model.Qnt : null;
    orderDetailExtra.Price = model != null ? model.Price : null;
    orderDetailExtra.RateTax = model != null ? model.RateTax : null;
    orderDetailExtra.RateVat = model != null ? model.RateVat : null;
    orderDetailExtra.Tax = model != null ? model.Tax !== undefined ? model.Tax : model.TotalTax : null;
    orderDetailExtra.Vat = model != null ? model.Vat !== undefined ? model.Vat : model.TotalVat : null;
    orderDetailExtra.Net = model != null ? model.Net !== undefined ? model.Net : model.NetAmount : null;
    orderDetailExtra.ItemsChanged = model != null ? model.ItemsChanged : null;
};

function ComplaintsModel(model) {
    var complaint = this;
    complaint.OrderId = model != null ? model.OrderId : null;
    complaint.CustomerComplaint = model != null ? model.CustomerComplaint : null;
    complaint.StaffNote = model != null ? model.StaffNote : null;
};

function OrderItemModel(model, quantity, priceList, discountInfo) {
    var orderItem = this;
    orderItem.Id = 0;
    orderItem.ProductId = model != null ? model.ProductId : null;
    orderItem.ProductCategoryId = model != null ? model.ProductCategoryId : null;
    orderItem.PriceListId = priceList != null ? priceList.PriceListId : null;
    orderItem.Description = model != null ? model.Description : null;
    orderItem.Code = model != null ? model.Code : null;
    orderItem.Quantity = ko.observable(quantity);
    orderItem.PriceListDetails = [];
    var priceListDetail = null;
    if (model != null && model.PriceListDetails != null && model.PriceListDetails.length > 0) {
        ko.utils.arrayForEach(model.PriceListDetails, function (d) {
            orderItem.PriceListDetails.push(d);
        });
        priceListDetail = ko.utils.arrayFirst(model.PriceListDetails, function (d) {
            return d.PriceListId == priceList.PriceListId;
        }); 
    }
    orderItem.Price = ko.observable(priceListDetail != null ? priceListDetail.Price : 0);
    var discount = discountInfo != null ? discountInfo.Amount() : 0;
    orderItem.Discount = ko.observable(discount);
    orderItem.DiscountWithExtras = ko.observable(discount);
    orderItem.DiscountId = discountInfo != null ? discountInfo.Id : null;
    var total = (orderItem.Quantity() * orderItem.Price()) - orderItem.Discount();
    orderItem.Total = ko.observable(parseFloat(total.toFixed(2)));
    orderItem.TotalWithExtras = ko.observable(parseFloat(total.toFixed(2)));
    orderItem.VatId = priceListDetail != null ? priceListDetail.VatId : null;
    orderItem.Vat = priceListDetail != null ? priceListDetail.Vat : null;
    orderItem.TaxId = priceListDetail != null ? priceListDetail.TaxId : null;
    orderItem.Tax = priceListDetail != null ? priceListDetail.Tax : null;
    orderItem.Remarks = ko.observable(model != null ? typeof (model.Remarks) == "function" ? model.Remarks() : null : null);
    orderItem.IsLoyalty = ko.observable(false);
    orderItem.IsGoodys = ko.observable(false);
    orderItem.GoodysCouponCode = null;
    orderItem.IsVodafone = ko.observable(false);
    orderItem.IsVodafoneCalculated = false;
    orderItem.Extras = ko.observableArray([]);
    if (model != null && model.Extras != null && typeof (model.Extras) == "function" && model.Extras().length > 0) {
        var extrasDiscount = 0;
        var extrasTotal = 0;
        ko.utils.arrayForEach(model.Extras(), function (e) {
            var orderItemExtra = new OrderItemExtraModel(e, quantity, orderItem.PriceListId, e.HasChanged);
            orderItem.Extras.push(orderItemExtra);
            extrasDiscount = extrasDiscount + (orderItemExtra.StartPrice - orderItemExtra.Price());
            extrasTotal = extrasTotal + orderItemExtra.Total();
        });
        var discountWithExtras = discount + extrasDiscount;
        orderItem.DiscountWithExtras(parseFloat(discountWithExtras.toFixed(2)));
        var totalWithExtras = total + extrasTotal;
        orderItem.TotalWithExtras(parseFloat(totalWithExtras.toFixed(2)));
    }
};

function OrderItemExtraModel(model, quantity, priceListId, hasChanged) {
    var orderItemExtra = this;
    orderItemExtra.Id = 0;
    orderItemExtra.IngredientId = model != null ? model.IngredientId : null;
    orderItemExtra.IngredientCategoryId = model != null ? model.IngredientCategoryId : null;
    orderItemExtra.PriceListId = priceListId;
    orderItemExtra.Description = model != null ? model.Description : null;
    if (model != null && model.Quantity != null && typeof (model.Quantity) == "function") {
        orderItemExtra.Quantity = ko.observable(model.Quantity());
    }
    else {
        orderItemExtra.Quantity = ko.observable(1);
    }
    orderItemExtra.PriceListDetails = [];
    if (model != null && model.PriceListDetails != null && model.PriceListDetails.length > 0) {
        ko.utils.arrayForEach(model.PriceListDetails, function (d) {
            orderItemExtra.PriceListDetails.push(d);
        });
    }
    var priceListDetail = null;
    if (model != null && model.Price != null && typeof (model.Price) == "function") {
        orderItemExtra.Price = ko.observable(model.Price());
    }
    else {
        if (model != null && model.PriceListDetails != null && model.PriceListDetails.length > 0) {
            priceListDetail = ko.utils.arrayFirst(model.PriceListDetails, function (d) {
                return d.PriceListId == priceListId;
            });
        }
        orderItemExtra.Price = ko.observable(priceListDetail != null ? priceListDetail.Price : 0);
    }
    if (model != null && model.StartPrice != null) {
        orderItemExtra.StartPrice = model.StartPrice;
    }
    else {
        orderItemExtra.StartPrice = orderItemExtra.Price();
    }
    var total = orderItemExtra.Quantity() * orderItemExtra.Price() * quantity;
    orderItemExtra.Total = ko.observable(parseFloat(total.toFixed(2)));
    if (model != null && model.Vat != null) {
        orderItemExtra.Vat = model.Vat;
    }
    else {
        orderItemExtra.Vat = priceListDetail != null ? priceListDetail.Vat : null;
    }
    if (model != null && model.Tax != null) {
        orderItemExtra.Tax = model.Tax;
    }
    else {
        orderItemExtra.Tax = priceListDetail != null ? priceListDetail.Tax : null;
    }
    orderItemExtra.HasChanged = hasChanged;
};

function StagedOrderItemModel(model) {
    var stagedOrderItem = this;
    stagedOrderItem.ProductId = model != null ? model.ProductId : null;
    stagedOrderItem.PriceListId = model != null ? model.PriceListId : null;
    stagedOrderItem.Quantity = model != null ? typeof (model.Quantity) != "function" ? model.Quantity : model.Quantity() : null;
    stagedOrderItem.Price = model != null ? typeof (model.Price) != "function" ? model.Price : model.Price() : null;
    stagedOrderItem.Discount = model != null ? typeof (model.Discount) != "function" ? model.Discount : model.Discount() : null;
    stagedOrderItem.Remarks = model != null ? typeof (model.Remarks) != "function" ? model.Remarks : model.Remarks() : null;
    stagedOrderItem.IsLoyalty = model != null ? typeof (model.IsLoyalty) != "function" ? model.IsLoyalty : model.IsLoyalty() : null;
    stagedOrderItem.IsVodafone = model != null ? typeof (model.IsVodafone) != "function" ? model.IsVodafone : model.IsVodafone() : null;
    stagedOrderItem.IsVodafoneCalculated = model != null ? model.IsVodafoneCalculated : null;
    stagedOrderItem.Extras = [];
    if (model != null && model.Extras != null && typeof (model.Extras) != "function" && model.Extras.length > 0) {
        ko.utils.arrayForEach(model.Extras, function (e) {
            var stagedOrderItemExtra = new StagedOrderItemExtraModel(e);
            stagedOrderItem.Extras.push(stagedOrderItemExtra);
        });
    }
    else if (model != null && model.Extras != null && typeof (model.Extras) == "function" && model.Extras().length > 0) {
        ko.utils.arrayForEach(model.Extras(), function (e) {
            var stagedOrderItemExtra = new StagedOrderItemExtraModel(e);
            stagedOrderItem.Extras.push(stagedOrderItemExtra);
        });
    }
};

function StagedOrderItemExtraModel(model) {
    var stagedOrderItemExtra = this;
    stagedOrderItemExtra.IngredientId = model != null ? model.IngredientId : null;
    stagedOrderItemExtra.Quantity = model != null ? typeof (model.Quantity) != "function" ? model.Quantity : model.Quantity() : null;
    stagedOrderItemExtra.Price = model != null ? typeof (model.Price) != "function" ? model.Price : model.Price() : null;
};

function PostOrderModel(orderId, customer, address, billingAddress, communicationPhone, store, invoice, payment, sale, remarks, total, discount, delay, isPaid, items, loyalty, loyaltyCode, vodafone, applyLoyaltyPoints, orderNo, hasChanged, previousDate, staff, agentPhone, paymentId, metadata) {
    var order = this;
    order.Id = orderId;
    var currentDate = moment().format();
    order.OrderDate = previousDate != null ? previousDate : currentDate;
    order.FinishDate = null;
    order.Duration = null;
    order.CustomerId = customer.Id;
    order.ShippingAddressId = address.Id;
    order.BillingAddressId = billingAddress != null ? billingAddress.Id : null;
    order.BillingDate = null;
    if (sale.Type == saleTypeEnum.Delivery) {
        order.EstBillingDate = previousDate != null ? moment(previousDate).add(store.DeliveryTime, "minutes").format() : moment(currentDate).add(store.DeliveryTime, "minutes").format();
    }
    else {
        order.EstBillingDate = null;
    }
    order.TakeoutDate = null;
    order.EstTakeoutDate = previousDate != null ? moment(previousDate).add(store.TakeOutTime, "minutes").format() : moment(currentDate).add(store.TakeOutTime, "minutes").format();
    order.StoreId = store.Id;
    order.StoreOrderId = 0;
    order.StoreOrderNo = 0;
    order.InvoiceType = invoice.Type;
    order.AccountType = payment.Type;
    order.OrderType = sale.Type;
    order.Remarks = remarks;
    order.LastOrderNote = null;
    order.DiscountRemark = discount.Remark;
    order.Cover = 0;
    order.Origin = orderOriginEnum.Agent;
    order.Price = total + discount.Amount;
    order.Discount = discount.Amount;
    order.Total = total;
    if (loyalty != null) {
        switch (loyalty.Type) {
            case loyaltyTypeEnum.Hit:
                order.PointsGain = 0;
                order.PointsRedeem = loyalty.Points;
                var loyaltyCouponInfo = null;
                break;
            case loyaltyTypeEnum.Goodys:
                order.PointsGain = 0;
                order.PointsRedeem = 0;
                var loyaltyCouponInfo = loyalty;
                break;
            default:
                order.PointsGain = 0;
                order.PointsRedeem = 0;
                var loyaltyCouponInfo = null;
                break;
        }
    }
    else {
        order.PointsGain = 0;
        order.PointsRedeem = 0;
        var loyaltyCouponInfo = null;
    }
    order.Status = orderStatusEnum.Received;
    order.StatusChange = currentDate;
    order.OrderNo = orderNo;
    order.ItemsChanged = hasChanged;
    order.IsPaid = isPaid;
    order.IsDelay = delay != null ? delay.IsDelay() : false;
    if (order.IsDelay) {
        var time = delay.TargetDate().split(":");
        order.EstTakeoutDate = moment(currentDate).set({ hours: time[0], minutes: time[1], seconds: "00" }).format();
        if (sale.Type == saleTypeEnum.Delivery) {
            order.EstBillingDate = moment(currentDate).set({ hours: time[0], minutes: time[1], seconds: "00" }).format();
        }
    }
    order.IsSend = 1;
    order.Details = [];
    ko.utils.arrayForEach(items, function (i) {
        var orderDetail = new PostOrderDetailModel(i, order.Id);
        order.Details.push(orderDetail);
    });
    var net = 0;
    var vat = 0;
    var tax = 0;
    ko.utils.arrayForEach(order.Details, function (d) {
        net = net + d.NetAmount;
        vat = vat + d.TotalVat;
        tax = tax + d.TotalTax;
        ko.utils.arrayForEach(d.Extras, function (e) {
            net = net + e.NetAmount;
            vat = vat + e.TotalVat;
            tax = tax + e.TotalTax;
        });
    });
    order.NetAmount = parseFloat(net.toFixed(4));
    order.TotalVat = parseFloat(vat.toFixed(4));
    order.TotalTax = parseFloat(tax.toFixed(4));
    if (order.Discount != 0) {
        var amountRatio = 1 - (order.Discount / order.Price);
        net = order.NetAmount * amountRatio;
        order.NetAmount = parseFloat(net.toFixed(4));
        vat = order.TotalVat * amountRatio;
        order.TotalVat = parseFloat(vat.toFixed(4));
        tax = order.TotalTax * amountRatio;
        order.TotalTax = parseFloat(tax.toFixed(4));
    }
    order.Staffid = staff.Id;
    order.AgentNo = agentPhone;
    order.TelephoneNumber = communicationPhone;
    order.LoyaltyCode = loyaltyCode;
    var externalObjectModel = new PostExternalObjectModel(staff, vodafone, loyaltyCouponInfo);
    order.ExtObj = JSON.stringify(externalObjectModel);
    order.PaymentId = paymentId;
    order.Metadata = metadata;
    order.AddLoyaltyPoints = vodafone != null && vodafone.length > 0 ? applyLoyaltyPoints : true;
    order.CheckShippingAddress = false;
};

function PostOrderDetailModel(item, orderId) {
    var orderDetail = this;
    orderDetail.Id = item.Id;
    orderDetail.DAOrderId = orderId;
    orderDetail.ProductId = item.ProductId;
    orderDetail.PriceListId = item.PriceListId;
    orderDetail.Description = item.Description;
    orderDetail.ProductCode = item.Code;
    orderDetail.Qnt = item.Quantity();
    orderDetail.Price = item.Price();
    orderDetail.Discount = item.Discount();
    orderDetail.Total = item.Total();
    orderDetail.ItemRemark = item.Remarks();
    orderDetail.RateVat = item.Vat;
    orderDetail.RateTax = item.Tax;
    if (orderDetail.RateVat != null) {
        var tempNet = (item.Total() / (1 + (item.Vat / 100)));
        var net = parseFloat(tempNet.toFixed(4));
        var tempVat = item.Total() - net;
        var vat = parseFloat(tempVat.toFixed(4));
    }
    else {
        orderDetail.RateVat = 0;
        var net = item.Total();
        var vat = 0;
    }
    if (orderDetail.RateTax != null) {
        // TODO
    }
    else {
        orderDetail.RateTax = 0;
    }
    orderDetail.NetAmount = net;
    orderDetail.TotalVat = vat;
    orderDetail.TotalTax = 0;//
    if (item.IsLoyalty()) {
        orderDetail.OtherDiscount = otherDiscountEnum.Loyalty;
    }
    else if (item.IsGoodys()) {
        orderDetail.OtherDiscount = otherDiscountEnum.Goodys;
    }
    else if (item.IsVodafone() && !item.IsVodafoneCalculated) {
        orderDetail.OtherDiscount = otherDiscountEnum.Vodafone;
    }
    else {
        orderDetail.OtherDiscount = null;
    }
    orderDetail.Extras = [];
    if (item.Extras().length > 0) {
        ko.utils.arrayForEach(item.Extras(), function (e) {
            var orderDetailExtra = new PostOrderDetailExtraModel(e, orderDetail.Id);
            orderDetail.Extras.push(orderDetailExtra);
        });
    }
};

function PostOrderDetailExtraModel(extra, orderDetailId) {
    var orderDetailExtra = this;
    orderDetailExtra.Id = extra.Id;
    orderDetailExtra.OrderDetailId = orderDetailId;
    orderDetailExtra.ExtrasId = extra.IngredientId;
    orderDetailExtra.Description = extra.Description;
    orderDetailExtra.Qnt = extra.Quantity();
    orderDetailExtra.Price = extra.Price();
    orderDetailExtra.RateVat = extra.Vat;
    orderDetailExtra.RateTax = extra.Tax;
    if (orderDetailExtra.RateVat != null) {
        var tempNet = (extra.Total() / (1 + (extra.Vat / 100)));
        var net = parseFloat(tempNet.toFixed(4));
        var tempVat = extra.Total() - net;
        var vat = parseFloat(tempVat.toFixed(4));
    }
    else {
        orderDetailExtra.RateVat = 0;
        var net = extra.Total();
        var vat = 0;
    }
    if (orderDetailExtra.RateTax != null) {
        // TODO
    }
    else {
        orderDetailExtra.RateTax = 0;
    }
    orderDetailExtra.NetAmount = net;
    orderDetailExtra.TotalVat = vat;
    orderDetailExtra.TotalTax = 0;//
    orderDetailExtra.ItemsChanged = extra.HasChanged;
};

function PostExternalObjectModel(staff, vodafone, loyalty) {
    var externalObject = this;
    var staff = new PostExternalObjectStaffModel(staff);
    externalObject.Staff = staff;
    externalObject.Coupons = [];
    if (vodafone != null && vodafone.length > 0) {
        ko.utils.arrayForEach(vodafone, function (v) {
            var coupon = new PostExternalObjectCouponVodafoneModel(v);
            externalObject.Coupons.push(coupon);
        });
    }
    externalObject.LoyaltyCouponInfo = null;
    if (loyalty != null) {
        var loyaltyCouponInfo = new PostExternalLoyaltyModel(loyalty);
        externalObject.LoyaltyCouponInfo = loyaltyCouponInfo;
    }
};

function PostExternalObjectStaffModel(staff) {
    var externalObjectStaff = this;
    externalObjectStaff.Id = staff.Id;
    externalObjectStaff.Username = staff.Username;
    externalObjectStaff.Password = staff.Password;
    externalObjectStaff.FirstName = staff.FirstName;
    externalObjectStaff.LastName = staff.LastName;
    externalObjectStaff.Image = staff.Image;
    externalObjectStaff.Identification = staff.Identification;
};

function PostExternalObjectCouponVodafoneModel(vodafone) {
    var externalObjectCoupon = this;
    externalObjectCoupon.Id = vodafone.VodafoneId;
    externalObjectCoupon.Description = vodafone.VodafonePromo;
    externalObjectCoupon.Code = vodafone.VodafoneCode;
};

function PostExternalLoyaltyModel(discount) {
    var postExternalLoyalty = this;
    postExternalLoyalty.CampaignName = discount.Coupon != null ? discount.Coupon.CampaignName : null;
    postExternalLoyalty.CouponCode = discount.Coupon != null ? discount.Coupon.CouponCode : null;
    postExternalLoyalty.CouponType = discount.Coupon != null ? discount.Coupon.CouponType : null;
    postExternalLoyalty.LoyaltyId = discount.Loyalty != null ? discount.Loyalty.LoyaltyId : null;
    postExternalLoyalty.Coupons = [];
    if (discount.Loyalty != null && discount.Loyalty.Coupons.length > 0) {
        ko.utils.arrayForEach(discount.Loyalty.Coupons, function (c) {
            var coupon = new PostExternalLoyaltyCouponModel(c);
            postExternalLoyalty.Coupons.push(coupon);
        });
    }
    postExternalLoyalty.ExternalOrderId = discount.ExternalOrderId;
};

function PostExternalLoyaltyCouponModel(coupon) {
    var postExternalLoyaltyCoupon = this;
    postExternalLoyaltyCoupon.CampaignName = coupon.CampaignName;
    postExternalLoyaltyCoupon.CouponCode = coupon.CouponCode;
    postExternalLoyaltyCoupon.CouponType = coupon.CouponType;
};