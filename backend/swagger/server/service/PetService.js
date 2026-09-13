'use strict';


/**
 * Add a new pet to the store.
 * Add a new pet to the store.
 *
 * body Pet Create a new pet in the store
 * returns Pet
 **/
exports.addPet = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "photoUrls" : [ "photoUrls", "photoUrls" ],
  "name" : "doggie",
  "id" : 10,
  "category" : {
    "name" : "Dogs",
    "id" : 1
  },
  "tags" : [ {
    "name" : "name",
    "id" : 0
  }, {
    "name" : "name",
    "id" : 0
  } ],
  "status" : "available"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Add a new pet to the store.
 * Add a new pet to the store.
 *
 * body Pet Create a new pet in the store
 * returns Pet
 **/
exports.addPet = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "photoUrls" : [ "photoUrls", "photoUrls" ],
  "name" : "doggie",
  "id" : 10,
  "category" : {
    "name" : "Dogs",
    "id" : 1
  },
  "tags" : [ {
    "name" : "name",
    "id" : 0
  }, {
    "name" : "name",
    "id" : 0
  } ],
  "status" : "available"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Deletes a pet.
 * Delete a pet.
 *
 * petId Long Pet id to delete
 * api_key String  (optional)
 * no response value expected for this operation
 **/
exports.deletePet = function(petId,api_key) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Finds Pets by status.
 * Multiple status values can be provided with comma separated strings.
 *
 * status String Status values that need to be considered for filter (optional)
 * returns List
 **/
exports.findPetsByStatus = function(status) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "photoUrls" : [ "photoUrls", "photoUrls" ],
  "name" : "doggie",
  "id" : 10,
  "category" : {
    "name" : "Dogs",
    "id" : 1
  },
  "tags" : [ {
    "name" : "name",
    "id" : 0
  }, {
    "name" : "name",
    "id" : 0
  } ],
  "status" : "available"
}, {
  "photoUrls" : [ "photoUrls", "photoUrls" ],
  "name" : "doggie",
  "id" : 10,
  "category" : {
    "name" : "Dogs",
    "id" : 1
  },
  "tags" : [ {
    "name" : "name",
    "id" : 0
  }, {
    "name" : "name",
    "id" : 0
  } ],
  "status" : "available"
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Finds Pets by tags.
 * Multiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.
 *
 * tags List Tags to filter by (optional)
 * returns List
 **/
exports.findPetsByTags = function(tags) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "photoUrls" : [ "photoUrls", "photoUrls" ],
  "name" : "doggie",
  "id" : 10,
  "category" : {
    "name" : "Dogs",
    "id" : 1
  },
  "tags" : [ {
    "name" : "name",
    "id" : 0
  }, {
    "name" : "name",
    "id" : 0
  } ],
  "status" : "available"
}, {
  "photoUrls" : [ "photoUrls", "photoUrls" ],
  "name" : "doggie",
  "id" : 10,
  "category" : {
    "name" : "Dogs",
    "id" : 1
  },
  "tags" : [ {
    "name" : "name",
    "id" : 0
  }, {
    "name" : "name",
    "id" : 0
  } ],
  "status" : "available"
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Find pet by ID.
 * Returns a single pet.
 *
 * petId Long ID of pet to return
 * returns Pet
 **/
exports.getPetById = function(petId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "photoUrls" : [ "photoUrls", "photoUrls" ],
  "name" : "doggie",
  "id" : 10,
  "category" : {
    "name" : "Dogs",
    "id" : 1
  },
  "tags" : [ {
    "name" : "name",
    "id" : 0
  }, {
    "name" : "name",
    "id" : 0
  } ],
  "status" : "available"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Update an existing pet.
 * Update an existing pet by Id.
 *
 * body Pet Update an existent pet in the store
 * returns Pet
 **/
exports.updatePet = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "photoUrls" : [ "photoUrls", "photoUrls" ],
  "name" : "doggie",
  "id" : 10,
  "category" : {
    "name" : "Dogs",
    "id" : 1
  },
  "tags" : [ {
    "name" : "name",
    "id" : 0
  }, {
    "name" : "name",
    "id" : 0
  } ],
  "status" : "available"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Update an existing pet.
 * Update an existing pet by Id.
 *
 * body Pet Update an existent pet in the store
 * returns Pet
 **/
exports.updatePet = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "photoUrls" : [ "photoUrls", "photoUrls" ],
  "name" : "doggie",
  "id" : 10,
  "category" : {
    "name" : "Dogs",
    "id" : 1
  },
  "tags" : [ {
    "name" : "name",
    "id" : 0
  }, {
    "name" : "name",
    "id" : 0
  } ],
  "status" : "available"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Updates a pet in the store with form data.
 * Updates a pet resource based on the form data.
 *
 * petId Long ID of pet that needs to be updated
 * name String Name of pet that needs to be updated (optional)
 * status String Status of pet that needs to be updated (optional)
 * returns Pet
 **/
exports.updatePetWithForm = function(petId,name,status) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "photoUrls" : [ "photoUrls", "photoUrls" ],
  "name" : "doggie",
  "id" : 10,
  "category" : {
    "name" : "Dogs",
    "id" : 1
  },
  "tags" : [ {
    "name" : "name",
    "id" : 0
  }, {
    "name" : "name",
    "id" : 0
  } ],
  "status" : "available"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Uploads an image.
 * Upload image of the pet.
 *
 * body Object  (optional)
 * additionalMetadata String Additional Metadata (optional)
 * petId Long ID of pet to update
 * returns ApiResponse
 **/
exports.uploadFile = function(body,additionalMetadata,petId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "code" : 0,
  "type" : "type",
  "message" : "message"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

