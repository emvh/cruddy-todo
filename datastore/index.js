const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');

var fsPromisify = Promise.promisifyAll(fs);
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
  let fileIds = [];
  return fsPromisify.readdirAsync(this.dataDir)
    .then((fileArr) => {
      let fileReads = [];
      for (let i = 0; i < fileArr.length; i++) {
        fileReads.push(fsPromisify.readFileAsync(path.join(this.dataDir, `${fileArr[i]}`), 'utf8'));
        fileIds.push(fileArr[i].split('').splice(0, 5).join(''));
      }
      return fileReads.length ? Promise.all(fileReads) : [];
    })
    .then((filesData) => {
      let returnData = [];
      for (let i = 0; i < filesData.length; i++) {
        returnData.push({ id: fileIds[i], text: filesData[i] });
      }
      callback(null, returnData);
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
  fs.unlink(path.join(this.dataDir, `${id}.txt`), (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
    }
  });
};


//   var item = items[id];
//   delete items[id];
//   if (!item) {
//     // report an error if item not found
//     callback(new Error(`No item with id: ${id}`));
//   } else {
//     callback();
//   }
// };

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
