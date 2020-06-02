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

exports.readAll = (callback) => {
  // let dataDir = this.dataDir;
  fs.readdir(this.dataDir, (err, fileArr) => {
    let files = [];
    for (let i = 0; i < fileArr.length; i++) {
      let data = fileArr[i].substring(0, 5);
      files.push({ id: data, text: data });
    }
    callback(null, files);

    // let returnData = [];
    // let index = 0;
    // if (fileArr.length) {
    //   readFile(fileArr[0].substring(0, 5));
    // } else {
    //   callback(null, returnData);
    // }

    // function readFile(id) {
    //   fs.readFile(path.join(dataDir, `${id}.txt`), (err, text) => {

    //     returnData.push({ id, text: id /* text.toString() */ });
    //     if (index < fileArr.length - 1) {
    //       readFile(fileArr[++index].substring(0, 5));
    //     } else {
    //       cb(null, returnData);
    //     }
    //   });
    // }
  });
};

exports.readOne = (id, callback) => {
  fs.readFile(path.join(this.dataDir, `${id}.txt`), (err, text) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text: text.toString() });
    }
  });
};

exports.update = (id, text, callback) => {
  fs.readFile(path.join(this.dataDir, `${id}.txt`), (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(path.join(this.dataDir, `${id}.txt`), text, (err) => {
        callback(null, { id, text });
      });
    }
  });
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
