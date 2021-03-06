/**
 * Created by ddukes on 7/20/2015.
 */
var fs = require('fs'),
    jetpack = require('fs-jetpack'),
    path = require('path')
    ;


module.exports = {
    getFileList:getFileList,
    getFolderList:getFolderList,
    getFullDirList:getFullDirList,
    getTree:getTree,
    createFolder:createFolder,
    deleteAsset:deleteAsset,
    processUpload:processUpload
};

// Retrieves list of only files from working directory
// Returns JS array of file names
function getFileList(workingDir) {
    if(!workingDir) {
        workingDir = jetpack.cwd();
    }
    return getFullDirList(workingDir,"file");
}

// Retrieves list of only folders from working directory
// Returns JS array of folder names
function getFolderList(workingDir) {
    if(!workingDir) {
        workingDir = jetpack.cwd();
    }
    return getFullDirList(workingDir,"dir");
}

// Retrieves specified asset types (files, dirs, all)
// Returns array of file/folder names
function getFullDirList(workingDir,type) {
    if(!workingDir) {
        workingDir = jetpack.cwd();
    }
    if(!type) {
        return jetpack.list(workingDir);
    }
    var filteredList = [],
        dirList = jetpack.list(workingDir);
    dirList.forEach(function(item) {
        if (jetpack.exists(workingDir + path.sep + item) === type) {
            filteredList.push(item);
        }
    });
    return filteredList;
}

function getTree(workingDir) {
    if(!workingDir) {
        workingDir = jetpack.cwd();
    }
    console.log(workingDir);
    //using global var fullTree because recursion
    var fullTree = jetpack.inspectTree(workingDir,{absolutePath:true});
    // call function to iterate through tree and trim absolute paths
    //return fullTree;
    return trimTree(fullTree,workingDir);
}

// Creates new folder in working dir
// Returns HTTP status code
function createFolder(workingDir,folderName) {
    var parentFolder;
    if(!folderName) {
        return 400;
    }
    if (workingDir) {
        parentFolder = jetpack.cwd(workingDir);
    } else {
        parentFolder = jetpack.cwd('.');
    }
    if (parentFolder.exists(folderName)) {
        return 409;
    }
    parentFolder.dir(folderName);
    return 200;
}

// Deletes specified asset from working dir
// Returns HTTP status code
function deleteAsset(workingDir,assetName) {
    if(!workingDir) {
        return 400;
    }
    jetpack.cwd(workingDir);
    jetpack.remove(assetName);
    if(jetpack.exists(assetName)) {
        return 500;
    } else {
        return 200;
    }
}

// Move uploaded file from upload dir to the proper location
function processUpload(req, filePath) {
    var newPath = req.header('X-working-dir') + path.sep + req.header('X-file-name');
    fs.rename(filePath, newPath, function(err) {
        if (err) throw err;
        fs.unlink(filePath, function() {
            if (err) {
                throw err;
            }
        });
    });
}

function trimTree(obj,workingDir) {
    var oldPath,
        newPath
        ;
    if (obj.hasOwnProperty('children')) {
        var children = obj.children;
        var childLength = children.length;
        for (var i = 0; i < childLength; i++) {
            children[i] = trimTree(children[i],workingDir);
        }
    }
    oldPath = obj.absolutePath;
    newPath = oldPath.replace(workingDir,'');
    obj.absolutePath = newPath;
    return obj;
}




