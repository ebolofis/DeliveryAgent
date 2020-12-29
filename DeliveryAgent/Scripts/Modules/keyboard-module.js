function CustomKeyboard() {
    var keyboard = this;
    var dataToChange = null;
    var fieldToChange = "";
    var dataId = "";
    var dataPosition = "";
    var callBack = null;
    var errorCallBack = null;
    var keyBoardType = keyboardTypesEnum.Numeric;

    keyboard.InitializeKeyboard = function (data, field, id, position, callback, errorcallback, type) {
        dataToChange = data;
        fieldToChange = field;
        dataId = id;
        dataPosition = position;
        callBack = callback;
        errorCallBack = errorcallback;
        keyBoardType = type;
        showKeyBoard();
    };

    function showKeyBoard () {
        var options = {
            openOn: null,
            autoAccept: false,
            restrictInput: true,
            layout: "custom",
            css: {
                // keyboard container
                container: "custom-keyboard",
                // input field
                input: "custom-keyboard-input",
                // button
                buttonDefault: "custom-keyboard-button",
                // hovered button
                buttonHover: "custom-keyboard-button-hover",
                // action button
                buttonAction: "custom-keyboard-button-action",
                // disabled button
                buttonDisabled: "custom-keyboard-button-disabled"
            },
            position: {
                of: $("#" + dataPosition),
                my: "center top",
                at: "center bottom",
                collision: "fit fit"
            },
            visible: function (e, keyboard, el) {
                keyboard.$preview[0].select();
            },
            validate: function (e, keyboard, el) {
                if (keyBoardType == keyboardTypesEnum.Numeric || keyBoardType == keyboardTypesEnum.DecimalNumeric) {
                    var valid = true;
                    var value = parseFloat(keyboard);
                    valid = !isNaN(value);
                    if (!valid) {
                        toastr.error(language.Translate("InvalidInput", null));
                        $("#" + dataId).val("");
                    }
                    return valid;
                }
                else if (keyBoardType == keyboardTypesEnum.Alphanumeric) {
                    var valid = true;
                    if (!valid) {
                        toastr.error(language.Translate("InvalidInput", null));
                    }
                    return valid;
                }
            },
            canceled: function (e, keyboard, el) {
                if (errorCallBack != null) {
                    errorCallBack();
                }
            },
            accepted: function (e, keyboard, el) {
                var value = $("#" + dataId).val();
                if (keyBoardType == keyboardTypesEnum.Numeric || keyBoardType == keyboardTypesEnum.DecimalNumeric) {
                    var temp = parseFloat(value);
                    value = temp;
                }
                if (typeof (dataToChange[fieldToChange]) == "function") {
                    dataToChange[fieldToChange](value);
                }
                else {
                    dataToChange[fieldToChange] = value;
                }
                if (callBack != null) {
                    callBack();
                }
            }
        }
        if (keyBoardType == keyboardTypesEnum.Numeric) {
            options.customLayout = {
                "default": ["7 8 9",
                    "4 5 6",
                    "1 2 3",
                    "0 {b}",
                    "{a} {c}"]
            };
        }
        else if (keyBoardType == keyboardTypesEnum.DecimalNumeric) {
            options.customLayout = {
                "default": ["7 8 9",
                    "4 5 6",
                    "1 2 3",
                    "0 {dec} {b}",
                    "{a} {c}"]
            };
        }
        else if (keyBoardType == keyboardTypesEnum.Alphanumeric) {
            options.customLayout = {
                "default": ["` 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
                    "{tab} q w e r t y u i o p [ ] \\",
                    "a s d f g h j k l ; \' * {enter}",
                    "{shift} z x c v b n m , . / {shift}",
                    "{a} {alt} {space} {alt} {c} {extender} "],
                "shift": ["` 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
                    "{tab} ; ς ε ρ τ υ θ ι ο π [ ] \\",
                    "α σ δ φ γ η ξ κ λ ; \' * {enter}",
                    "{shift} ζ χ ψ ω β ν μ , . / {shift}",
                    "{a} {alt} {space} {alt} {c} {extender} "],
                "alt": ["` 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
                    "{tab} Q W E R T Y U I O P [ ] \\",
                    "A S D F G H J K L ; \' * {enter}",
                    "{shift} Z X C V B N M , . / {shift}",
                    "{a}  {alt} {space} {alt} {c} {extender} "],
                "alt-shift": ["` 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
                    "{tab} ; ς Ε Ρ Τ Υ Θ Ι Ο Π [ ] \\",
                    "A Σ Δ Φ Γ Η Ξ Κ Λ ; \' * {enter}",
                    "{shift} Ζ Χ Ψ Ω Β Ν Μ , . / {shift}",
                    "{a} {alt} {space} {alt} {c} {extender} "]
            };
        }
        if ($("#" + dataId).getkeyboard() === undefined) {
            $("#" + dataId).keyboard(options);
        }
        $("#" + dataId).getkeyboard().reveal();
    };

    keyboard.HideKeyboard = function () {
        if ($("#" + dataId).getkeyboard() !== undefined) {
            $("#" + dataId).getkeyboard().close();
        }
    };

}