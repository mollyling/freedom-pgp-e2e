
function store () {
  this.freedomStorage = freedom['core.storage']();
  this.memStorage = {};
  this.freedomStorage.get('UserKeyRing').then(function(value) {
    if (value) {
      this.memStorage.UserKeyRing = value;
    }
  });
}

store.prototype.set = function(key, val) {
  if (val === undefined) {
    this.freedomStorage.remove(key);
    delete this.memStorage[key];
    return val;
  }
  this.freedomStorage.set(key, val);
  this.memStorage[key] = val;
  return val;
};

store.prototype.get = function(key) {
  return this.memStorage[key];
};

store.prototype.remove = function(key) {
  delete this.memStorage[key];
  this.freedomStorage.remove(key);
};

store.prototype.clear = function() {
  this.memStorage = {};
  if (this.freedomStorage) {
    this.freedomStorage.clear();
  }
};

store.prototype.transact = function(key, defaultVal, transactionFn) {
  var val = this.memStorage.get(key);
  if (transactionFn === null) {
    transactionFn = defaultVal;
    defaultVal = null;
  }
  if (typeof val === 'undefined') {
    val = defaultVal || {};
  }
  transactionFn(val);
  this.set(key, val);
};

store.prototype.getAll = function() { return this.memStorage; };

store.prototype.forEach = function(callback) {
  for (var i in this.memStorage) {
    callback(i);
  }
};

store.prototype.serialize = function(value) {
  return JSON.stringify(value);
};

store.prototype.deserialize = function(value) {
  if (typeof value !== 'string') {
    return undefined;
  }
  try {
    return JSON.parse(value);
  } catch(e) {
    return value || undefined;
  }
};

goog.storage.mechanism.HTML5LocalStorage = store;
