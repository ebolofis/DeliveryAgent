function CustomLanguage() {
    var language = this;
    var cookieName = "customCulture";
    var translationOptions = {
        ns: "Localization",
        lng: implementedLanguagesEnum.Greek,
        fallbackLng: [implementedLanguagesEnum.Greek],
        resGetPath: "../../Content/Languages/__lng__/Localization.json"
    }
    language.Initialized = ko.observable(false);
    language.SelectedLanguage = localStorage.SiteLanguage !== undefined ? ko.observable(localStorage.SiteLanguage) : ko.observable(null);
    language.ImplementedCultures = ko.observableArray([
        { ImageClass: "greece-flag-logo custom-cursor", Code: implementedLanguagesEnum.Greek },
        { ImageClass: "united-kingdom-flag-logo custom-cursor", Code: implementedLanguagesEnum.English },
    ]);

    language.GetDefaultLanguage = function () {
        var defaultCulture = ko.utils.arrayForEach(language.ImplementedCultures(), function (c) {
            return c.Code == implementedLanguagesEnum.Greek;
        });
        if (defaultCulture != null) {
            var defaultCultureCode = defaultCulture.Code;
        }
        else {
            var defaultCultureCode = language.ImplementedCultures()[0].Code;
        }
        return defaultCultureCode;
    };

    language.InitializeTranslation = function () {
        if (language.SelectedLanguage() == null) {
            var defaultLanguage = language.GetDefaultLanguage();
            language.SelectedLanguage(defaultLanguage);
        }
        CreateCookie(language.SelectedLanguage());
        localStorage.SiteLanguage = "";
        localStorage.SiteLanguage = language.SelectedLanguage();
        translationOptions.lng = language.SelectedLanguage();
        window.i18n.init(translationOptions, function () {
            language.Initialized(true);
        });
    };

    language.ChangeLanguage = function (value) {
        language.Initialized(false);
        language.SelectedLanguage(value);
        CreateCookie(language.SelectedLanguage());
        localStorage.SiteLanguage = "";
        localStorage.SiteLanguage = language.SelectedLanguage();
        window.i18n.setLng(language.SelectedLanguage(), function () {
            language.Initialized(true);
        });
    };

    language.Translate = function (value, options) {
        var translatedText = window.i18n.translate(value, options);
        return translatedText;
    };

    function CreateCookie(value) {
        var expires = "";
        var path = "; path=/";
        document.cookie = encodeURIComponent(cookieName) + "=" + encodeURIComponent(value) + expires + path;
    };

}