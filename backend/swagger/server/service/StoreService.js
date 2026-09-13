'use strict';


/**
 * Delete purchase order by identifier.
 * For valid response try integer IDs with value < 1000. Anything above 1000 or nonintegers will generate API errors.
 *
 * orderId Long ID of the order that needs to be deleted
 * no response value expected for this operation
 **/
exports.deleteOrder = function(orderId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Returns pet inventories by status.
 * Returns a map of status codes to quantities.
 *
 * returns Map
 **/
exports.getInventory = function() {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "key" : 0
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Find purchase order by ID.
 * For valid response try integer IDs with value <= 5 or > 10. Other values will generate exceptions.
 *
 * orderId Long ID of order that needs to be fetched
 * returns Order
 **/
exports.getOrderById = function(orderId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "petId" : 198772,
  "quantity" : 7,
  "id" : 10,
  "shipDate" : "2000-01-23T04:56:07.000+00:00",
  "complete" : true,
  "status" : "approved"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Place an order for a pet.
 * Place a new order in the store.
 *
 * body Order  (optional)
 * returns Order
 **/
exports.placeOrder = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "petId" : 198772,
  "quantity" : 7,
  "id" : 10,
  "shipDate" : "2000-01-23T04:56:07.000+00:00",
  "complete" : true,
  "status" : "approved"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Place an order for a pet.
 * Place a new order in the store.
 *
 * body Order  (optional)
 * returns Order
 **/
exports.placeOrder = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "petId" : 198772,
  "quantity" : 7,
  "id" : 10,
  "shipDate" : "2000-01-23T04:56:07.000+00:00",
  "complete" : true,
  "status" : "approved"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

