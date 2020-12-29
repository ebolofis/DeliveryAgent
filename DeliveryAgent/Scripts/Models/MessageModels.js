function CustomerMessageModel(model) {
    var customerMessage = this;
    customerMessage.Id = model != null ? model.Id : null;
    customerMessage.CustomerId = model != null ? model.CustomerId : null;
    customerMessage.OrderId = model != null ? model.OrderId : null;
    customerMessage.StoreId = model != null ? model.StoreId : null;
    customerMessage.StaffId = model != null ? model.StaffId : null;
    customerMessage.StaffFirstName = model != null ? model.StaffFirstName != null ? model.StaffFirstName : model.StaffName : null;
    customerMessage.StaffLastName = model != null ? model.StaffLastName != null ? model.StaffLastName : model.StaffLastname : null;
    customerMessage.MainMessageId = model != null ? model.MainMessageId != null ? model.MainMessageId : model.MainDAMessageID : null;
    customerMessage.MainMessage = model != null ? model.MainMessage != null ? model.MainMessage : model.MainMessageDesc : null;
    customerMessage.MessageId = model != null ? model.MessageId : null;
    customerMessage.Message = model != null ? model.Message != null ? model.Message : model.MessageDesc : null;
    customerMessage.MessageDetailId = model != null ? model.MessageDetailId != null ? model.MessageDetailId : model.MessageDetailsId : null;
    customerMessage.MessageDetail = model != null ? model.MessageDetail != null ? model.MessageDetail : model.MessageDetailsDesc : null;
    customerMessage.Description = model != null ? model.Description != null ? model.Description : model.MessageText : null;
    customerMessage.CreationDate = model != null ? model.CreationDate : null;
    customerMessage.IsTemporary = model != null ? model.IsTemporary : null;
};

function GeneralMessageModel(mainMessages) {
    var generalMessage = this;
    generalMessage.SelectedMainMessage = ko.observable(null);
    generalMessage.SelectedMessage = ko.observable(null);
    generalMessage.SelectedMessageDetail = ko.observable(null);
    generalMessage.MessageDescription = null;
    generalMessage.SelectedOrder = ko.observable(null);
    generalMessage.CustomerDescription = null;
    generalMessage.SelectedStore = ko.observable(null);
    generalMessage.MainMessages = [];
    if (mainMessages != null && mainMessages.length > 0) {
        ko.utils.arrayForEach(mainMessages, function (mm) {
            var mainMessage = new MainMessageModel(mm);
            generalMessage.MainMessages.push(mainMessage);
        });
    }
};

function MainMessageModel(model) {
    var mainMessage = this;
    mainMessage.Id = model != null ? model.Id : null;
    mainMessage.Description = model != null ? model.Description : null;
    mainMessage.Email = model != null ? model.Email : null;
    mainMessage.OnOrderCreate = model != null ? model.OnOrderCreate : null;
    mainMessage.OnOrderUpdate = model != null ? model.OnOrderUpdate : null;
    mainMessage.Messages = [];
    if (model != null && model.DA_MessagesModel != null && model.DA_MessagesModel.length > 0) {
        ko.utils.arrayForEach(model.DA_MessagesModel, function (m) {
            var message = new MessageModel(m);
            mainMessage.Messages.push(message);
        });
    }
};

function MessageModel(model) {
    var message = this;
    message.Id = model != null ? model.Id : null;
    message.Description = model != null ? model.Description : null;
    message.Email = model != null ? model.Email : null;
    message.OnOrderCreate = model != null ? model.OnOrderCreate : null;
    message.OnOrderUpdate = model != null ? model.OnOrderUpdate : null;
    message.MessageDetails = [];
    if (model != null && model.DA_MessagesDetailsModel != null && model.DA_MessagesDetailsModel.length > 0) {
        ko.utils.arrayForEach(model.DA_MessagesDetailsModel, function (md) {
            var messageDetail = new MessageDetailModel(md);
            message.MessageDetails.push(messageDetail);
        });
    }
};

function MessageDetailModel(model) {
    var messageDetail = this;
    messageDetail.Id = model != null ? model.Id : null;
    messageDetail.Description = model != null ? model.Description : null;
    messageDetail.Email = model != null ? model.Email : null;
    messageDetail.OnOrderCreate = model != null ? model.OnOrderCreate : null;
    messageDetail.OnOrderUpdate = model != null ? model.OnOrderUpdate : null;
    messageDetail.ToOrder = model != null ? model.ToOrder : false;
};

function PostCustomerMessageModel(customerMessageId, staffId, customerId, orderId, storeId, mainMessage, message, messageDetail, description, customerNote, isTemporary) {
    var customerMessage = this;
    customerMessage.Id = customerMessageId;
    customerMessage.StaffId = staffId;
    customerMessage.CreationDate = moment().format();
    customerMessage.CustomerId = customerId;
    customerMessage.OrderId = orderId;
    customerMessage.StoreId = storeId;
    customerMessage.MainDAMessageID = mainMessage != null ? mainMessage.Id : null;
    customerMessage.MessageId = message != null ? message.Id : null;
    customerMessage.MessageDetailsId = messageDetail != null ? messageDetail.Id : null;
    customerMessage.MessageText = description;
    customerMessage.LastOrderNote = customerNote;
    customerMessage.isTemporary = isTemporary;
};