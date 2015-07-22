var Droppit = Droppit || {};

Droppit.Globals = (function() {
    var currentDir,
        dirList,
        listUrl = "/api/list",
        filesUrl = "/api/files",
        foldersUrl = "/api/folders",
        uploadUrl = "/api/upload"
        ;


    return {
        currentDir:currentDir,
        dirList:dirList,
        listUrl:listUrl,
        filesUrl:filesUrl,
        foldersUrl:foldersUrl,
        uploadUrl:uploadUrl
    }


})();
