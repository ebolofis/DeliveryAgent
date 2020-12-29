Array.prototype.group = function (key) {
    var groups = {};
    for (var i = 0; i < this.length; i++) {
        if (groups[this[i][key]] === undefined) {
            groups[this[i][key]] = []
        }
        groups[this[i][key]].push(this[i]);
    }
    return groups;
}