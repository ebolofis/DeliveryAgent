function ClientResponseModel(model) {
    var clientResponse = this;
    clientResponse.Id = model != null ? model.Id : 0;
    clientResponse.AgentId = model != null ? model.AgentId : 0;
    clientResponse.Origin = model != null ? model.Origin : orderOriginEnum.Agent;
    clientResponse.Success = model != null ? model.Success : false;
    clientResponse.Error = model != null ? model.Error : "";
};