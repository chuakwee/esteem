var config = require('../config/config.js').get(process.env.NODE_ENV);

var mysql = require('mysql');
var Promise = require('bluebird');
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);

var pool = mysql.createPool({
  host     : config.database.host, // Hostname 'localhost' If locally connected
  user     : config.database.username,      // Username
  password : config.database.password,          // Password
  database : config.database.database,           // Database name
  connectionLimit : 200
});

var getConnection = function () {
 return pool.getConnectionAsync().disposer(function (connection) {
   console.log("Releasing connection back to pool");
   return connection.destroy();
 });
};
var query = function (query, params) {
 return Promise.using(getConnection(), function (connection) {
   console.log("Got connection from pool");
   if (typeof params !== 'undefined'){
     return connection.queryAsync(query, params);
   } else {
     return connection.queryAsync(query);
   }
 });
};
module.exports = {
 query: query
};
