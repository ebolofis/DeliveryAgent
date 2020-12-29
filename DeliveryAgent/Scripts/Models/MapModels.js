function MapConfigurationModel(model) {
    var mapConfiguration = this;
    mapConfiguration.Service = model != null ? model.Service !== undefined ? model.Service : model.Geolocation : null;
    mapConfiguration.Language = model != null ? model.Language !== undefined ? model.Language : model.IMapGeocode_Language : null;
    mapConfiguration.ApiScript = model != null ? model.ApiScript !== undefined ? model.ApiScript : model.IMapGeocode_ApiJs : null;
    mapConfiguration.ApiStyle = model != null ? model.ApiStyle !== undefined ? model.ApiStyle : model.IMapGeocode_MapCss : null;
    mapConfiguration.ApiFeature = model != null ? model.ApiFeature !== undefined ? model.ApiFeature : model.IMapGeocode_MapFeatures : null;
    mapConfiguration.ApiKey = model != null ? model.ApiKey !== undefined ? model.ApiKey : model.IMapGeocode_ApiKey : null;
    mapConfiguration.ApiJson = model != null ? model.ApiJson !== undefined ? model.ApiJson : model.IMapGeocode_MapInit : null;
    mapConfiguration.ApiAddressUrl = model != null ? model.ApiAddressUrl !== undefined ? model.ApiAddressUrl : model.IMapGeocode_RequestUrl : null;
    mapConfiguration.ApiLatitudeLongitudeUrl = model != null ? model.ApiLatitudeLongitudeUrl !== undefined ? model.ApiLatitudeLongitudeUrl : model.IMapGeocode_UrlLatLng : null;
    mapConfiguration.RemoveRegions = model != null ? model.RemoveRegions !== undefined ? model.RemoveRegions : model.IMapGeocode_RemoveRegions : null;
};