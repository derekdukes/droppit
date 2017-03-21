var droppit = require('../droppit'),
    express = require('express'),
    router = express.Router(),
    formidable = require('formidable'),
    jetpack = require('fs-jetpack')
    ;

router.get('/', function(req, res) {
  res.send('respond with a resource');
});

// Get list of all files and folders in working dir
router.get('/list', function(req,res) {
    var workingDir = (req.header('X-working-dir') ? req.header('X-working-dir') : process.cwd());
    var theList = droppit.getFullDirList(workingDir);
    res.send(theList);
});

// Get list of files only
router.get('/files', function(req,res) {
    var workingDir = (req.header('X-working-dir') ? req.header('X-working-dir') : process.cwd());
    res.send(droppit.getFileList(workingDir));
});

// Get list of folders only
router.get('/folders', function(req,res) {
    var workingDir = (req.header('X-working-dir') ? req.header('X-working-dir') : process.cwd());
    res.send(droppit.getFolderList(workingDir));
});

router.get('/tree', function(req,res) {
    res.send(droppit.getTree(process.cwd()));
});

// Create new folder
router.post('/folders/:name', function(req,res) {
    var workingDir = (req.header('X-working-dir') ? req.header('X-working-dir') : process.cwd());
    var statusCode = droppit.createFolder(workingDir,req.params.name);
    res.sendStatus(statusCode);
});

router.delete('/folders/:name', function(req,res) {
    var workingDir = (req.header('X-working-dir') ? req.header('X-working-dir') : process.cwd());
    var statusCode = droppit.deleteAsset(workingDir,req.params.name);
    res.sendStatus(statusCode);
});

router.delete('/files/:name', function(req,res) {
    var workingDir = (req.header('X-working-dir') ? req.header('X-working-dir') : process.cwd());
    var statusCode = droppit.deleteAsset(workingDir,req.params.name);
    res.sendStatus(statusCode);
});


router.post("/files", function(req, res, next){
    if (req.files) {
        console.log(util.inspect(req.files));
        if (req.files.myFile.size === 0) {
            return next(new Error("Hey, first would you select a file?"));
        }
        fs.exists(req.files.myFile.path, function(exists) {
            if(exists) {
                res.end("Got your file!");
            } else {
                res.end("Well, there is no magic for those who don’t believe in it!");
            }
        });
    }
});


// Uploads must include the following headers on the POST request:
// X-working-dir: Directory where new file will be placed (relative to process working dir)
// X-file-name: File name (because obviously)

router.post("/upload", function(req, res, next){
    //check for required headers
    if (!req.header('X-working-dir') || !req.header('X-file-name')) {
        res.sendStatus(400);
    }

    var form = new formidable.IncomingForm();
    form.on('file', function(name,file) {
        droppit.processUpload(req,file.path);
    });
    form.parse(req, function(err, fields, files) {
        res.sendStatus(200);
    });
});

module.exports = router;
