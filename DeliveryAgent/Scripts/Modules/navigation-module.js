function CustomNavigation() {
    var navigation = this;

    navigation.GoToModule = function (moduleIndex, beforeExecute) {
        if (beforeExecute != null) {
            beforeExecute();
        }
        switch (moduleIndex) {
            case navigationViewsEnum.Login:
                window.location.href = "/Account/Login";
                break;
            case navigationViewsEnum.Customer:
                window.location.href = "/Home/Customer";
                break;
            case navigationViewsEnum.Pos:
                window.location.href = "/Home/Pos";
                break;
            case navigationViewsEnum.OrdersSupervisor:
                window.location.href = "/Display/Supervisor";
                break;
            case navigationViewsEnum.MessagesSupervisor:
                window.location.href = "/Display/MessagesSupervisor";
                break;
            case navigationViewsEnum.External:
                window.location.href = "/Display/External";
                break;
            default:
                break;
        }
    };

    navigation.ToggleFullscreen = function () {
        if ((document.fullScreenElement && document.fullScreenElement !== null) ||
               (!document.mozFullScreen && !document.webkitIsFullScreen)) {
            if (document.documentElement.requestFullScreen) {
                document.documentElement.requestFullScreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullScreen) {
                document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        } else {
            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
        }
    };

    navigation.RefreshPage = function () {
        window.location.reload();
    };

}