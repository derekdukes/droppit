$( document ).ready(function(){
    Droppit.Client.init();
});

var Droppit = Droppit || {};

Droppit.Client = (function() {
    var init,
        updateFolderList,
        addFolderListeners,
        addFileListeners,
        updateFileList,
        fileListItem,
        folderList
        ;

    init = function() {
        updateFolderList();

    };

    updateFolderList = function() {
        var request = {
                type: 'GET',
                url: Droppit.Globals.foldersUrl
            };

        $.ajax(request)
            .done(function(data) {
                console.log(data);
                var folderListHtml = "";
                $.each(data, function(index,value){
                    folderListHtml = folderListHtml + '<a href="#" id="' + value + '" class="list-group-item folderLink"><i class="fa fa-fw fa-folder"></i> ' + value + '</a>';
                });
                folderListHtml = folderListHtml + '<a class="list-group-item" href="#" id="addNewFolder"><i class="fa fa-fw fa-plus"></i> Add New Folder</a>';
                console.log(folderListHtml);
                $('#folderList').html(folderListHtml);
                addFolderListeners();
            });
    };

    addFolderListeners = function() {
        $('.folderLink').on('click', function(evt) {
            evt.preventDefault();
            $('.folderLink').removeClass('active');
            Droppit.Globals.currentDir = $(this).attr('id');
            $(this).addClass('active');
            updateFileList($(this).attr('id'));
        });
    };

    addFileListeners = function() {

    };


    updateFileList = function(location) {
        var fileListHtml = '',
            request = {
                type: 'GET',
                url: Droppit.Globals.filesUrl,
                headers: {'X-working-dir': location}
            };

        $.ajax(request)
            .done(function(data) {
                console.log(data);
                if (data.length === 0) {
                    fileListHtml = '<li class="list-group-item">No Files in Selected Folder</li>';
                } else {
                    $.each(data,function(index,value) {
                        fileListHtml = fileListHtml + fileListItem(value);
                    });
                }
                $('#fileList').html(fileListHtml);
            });
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

    fileListItem = function(fileName) {
        var listItemHtml = '<li class="list-group-item">' + fileName;
        listItemHtml = listItemHtml + '<div class="pull-right">';
        listItemHtml = listItemHtml + '<i class="fa fa-fw fa-pencil fileLinkRename" data-filename="' + fileName + '"></i>';
        listItemHtml = listItemHtml + '<i class="fa fa-fw fa-trash-o fileLinkDelete" data-filename="' + fileName + '"></i>';


        listItemHtml = listItemHtml + '</div></li>';
        return listItemHtml;

    };


    return {
        init:init
    }
})();
