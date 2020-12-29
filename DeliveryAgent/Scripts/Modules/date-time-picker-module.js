function CustomDateTimePicker() {
    var dateTimePicker = this;
    var dataElement = "";
    var dataInput = "";
    var dataButton = "";
    var dateTimePickerType = pickerTypesEnum.Date;
    var startDate = null;
    var dataToChange = null;
    var fieldToChange = "";
    var picker = null;
    var callback = null;
    var eventsAdded = false;

    dateTimePicker.InitializeDateTimePicker = function (element, input, button, pickerType, start, data, field, actionCallback) {
        dataElement = element;
        dataInput = input;
        dataButton = button;
        dateTimePickerType = pickerType;
        startDate = start;
        dataToChange = data;
        fieldToChange = field;
        callback = actionCallback;
        ShowDateTimePicker();
    };

    function ShowDateTimePicker() {
        picker = new WindowDatePicker({
            value: startDate,
            el: "#" + dataElement,
            inputEl: "#" + dataInput,
            toggleEl: "#" + dataButton,
            type: dateTimePickerType,
            dateType: "DD/MM/YYYY",
            hourType: "24",
            showButtons: true
        });
        picker.open();
        if (!eventsAdded) {
            picker.el.addEventListener("wdp.save", () => {
                ApplyDateTime();
                if (callback != null) {
                    callback();
                }
                DestroyDateTimePicker();
            });
            picker.el.addEventListener("wdp.cancel", () => {
                DestroyDateTimePicker();
            });
            eventsAdded = true;
        }
    };

    function ApplyDateTime() {
        var value = picker.get().value;
        if (typeof (dataToChange[fieldToChange]) == "function") {
            dataToChange[fieldToChange](value);
        }
        else {
            dataToChange[fieldToChange] = value;
        }
    };

    function DestroyDateTimePicker() {
        if (picker !== null) {
            picker.destroy();
        }
    };

};