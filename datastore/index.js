const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    items[id] = text;
    fs.writeFile(path.join(this.dataDir, `${id}.txt`), text, (err) => {
      callback(null, { id, text });
    });
  });
};

// fs.readdir(path[, options], callback)



exports.readAll = (callback) => {
  let dataDir = this.dataDir;
  let cb = callback;
  fs.readdir(dataDir, (err, fileArr) => {
    let returnData = [];
    let index = 0;
    if (fileArr.length) {
      readFile(fileArr[0].substring(0, 5));
    } else {
      callback(null, returnData);
    }

    function readFile(id) {
      fs.readFile(path.join(dataDir, `${id}.txt`), (err, text) => {
        returnData.push({ id, text: id /* text.toString() */ });
        if (index < fileArr.length - 1) {
          readFile(fileArr[++index].substring(0, 5));
        } else {
          cb(null, returnData);
        }
      });
    }
  });
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
