$( document ).ready(function(){
    Droppit.Client.init();
});

var Droppit = Droppit || {};

Droppit.Client = (function() {
    var init,
        dirList,
        fileList,
        folderList
        ;

    init = function() {
        Droppit.Globals.dirList = dirList();
    };

    dirList = function() {

        var returnValue = '',
            request = {
            type: 'GET',
            url: Droppit.Globals.listUrl
        };

        $.ajax(request)
            .done(function(data) {
                console.log(data);
                returnValue = data;
            });
        return returnValue;

    };

    fileList = function(location) {
        var returnValue = '',
            request = {
                type: 'GET',
                url: Droppit.Globals.filesUrl,
                headers: {'X-working-dir': location}
            };

        $.ajax(request)
            .done(function(data) {
                console.log(data);
                returnValue = data;
            });
        return returnValue;
    };

    folderList = function(location) {
        var returnValue = '',
            request = {
                type: 'GET',
                url: Droppit.Globals.foldersUrl,
                headers: {'X-working-dir': location}
            };

        $.ajax(request)
            .done(function(data) {
                console.log(data);
                returnValue = data;
            });
        return returnValue;
    };


    return {
        init:init,
        fileList:fileList,
        folderList:folderList
    }
})();
