//20170418 jinxin 下拉列表

var menuID;
var inputID;
function settingIDs(_inputID, _menuID) {
    menuID = _menuID;
    inputID = _inputID;
}
function showMenu() {
    var obj = $("#" + inputID);
    var offset = $("#" + inputID).offset();
    $("#" + menuID).css({ width: obj.outerWidth() + "px", left: offset.left + "px", top: offset.top + obj.outerHeight() + "px" }).slideDown("fast");

    $("body").bind("mousedown", onBodyDown);
}
function hideMenu() {
    $("#" + menuID).fadeOut("fast");
    $("body").unbind("mousedown", onBodyDown);
}
function onBodyDown(event) {
    if (!(event.target.id == menuID || $(event.target).parents("#" + menuID).length > 0)) {
        hideMenu();
    }
}