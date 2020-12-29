var geocoder = {
    Google: "GoogleMaps",
    Terra: "TerraMaps"
};

var geocoderStatusEnum = {
    Ok: "OK",
    ZeroResults: "ZERO_RESULTS",
    OverQueryLimit: "OVER_QUERY_LIMIT",
    RequestDenied: "REQUEST_DENIED",
    InvalidRequest: "INVALID_REQUEST",
    UnknownError: "UNKNOWN_ERROR",
    Error: "ERROR"
};

var geocoderLocationTypeDescriptionEnum = {
    Rooftop: "ROOFTOP",
    RangeInterpolated: "RANGE_INTERPOLATED",
    GeometricCenter: "GEOMETRIC_CENTER",
    Approximate: "APPROXIMATE",
    Unknown: "UNKNOWN"
};

var geocoderLocationTypeValueEnum = {
    Rooftop: 3,
    RangeInterpolated: 2,
    GeometricCenter: 1,
    Approximate: 0,
    Unknown: -1
};