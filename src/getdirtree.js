var fs = require('fs');
var path = require('path');
var Promise = require('bluebird');
var readdir = Promise.promisify(fs.readdir);
var stat = Promise.promisify(fs.stat);

var readDirTree = module.exports = function(dir, mode){
    mode = mode || {flat:false};

    if (mode.flat === true) {
        return readFlat(dir);
    } else {
        return readNested(dir);
    }
};

var readFlat = function(dir, files){
    files = files || [ ];
    return readdir(dir).then(processDirEntriesFlat(dir, files));
};

var processDirEntriesFlat = function(dir, files){
  return function(list){
    list = list.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item));
    var promises = list.map(function(entry){
      var entryPath = path.resolve(dir, entry);
      return processDirEntryFlat(entryPath, files);
    });

    return Promise.all(promises).then(function(content){
      return files;
    });
  };
};

var processDirEntryFlat = function(entry, files){
    return stat(entry).then(function(entryState){
        if(entryState.isDirectory()){
            files.push({
                path: entry,
                name: path.basename(entry),
                type: 'folder'
            });
            return readFlat(entry, files);
        } else {
            files.push({
                path: entry,
                name: path.basename(entry),
                type: 'file'
            });
        }
    });
};

var readNested = function(dir){
    return readdir(dir).then(processDirEntries(dir));
};

var processDirEntries = function(dir){
  return function(list){
    list = list.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item));
    var promises = list.map(function(entry){
        var entryPath = path.resolve(dir, entry);
        return processDirEntry(entryPath);
    });

    return Promise.all(promises).then(function(content){
      return {
        path: dir,
        name: path.basename(dir),
        type: 'folder',
        content: content
      };
    });
  };
};

var processDirEntry = function(entry){
    return stat(entry).then(function(entryState){
        if(entryState.isDirectory()){
            return readNested(entry);
        } else {
            return {
                path: entry,
                name: path.basename(entry),
                type: 'file'
            };
        }
    });
};
