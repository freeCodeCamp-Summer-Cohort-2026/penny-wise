/**
 * The UserController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/UserService');
const addUser = async (request, response) => {
  await Controller.handleRequest(request, response, service.addUser);
};

const deleteUser = async (request, response) => {
  await Controller.handleRequest(request, response, service.deleteUser);
};

const deleteUserByName = async (request, response) => {
  await Controller.handleRequest(request, response, service.deleteUserByName);
};

const deleteWallet = async (request, response) => {
  await Controller.handleRequest(request, response, service.deleteWallet);
};

const findUsersByStatus = async (request, response) => {
  await Controller.handleRequest(request, response, service.findUsersByStatus);
};

const findUsersByTags = async (request, response) => {
  await Controller.handleRequest(request, response, service.findUsersByTags);
};

const getUserById = async (request, response) => {
  await Controller.handleRequest(request, response, service.getUserById);
};

const getUserByName = async (request, response) => {
  await Controller.handleRequest(request, response, service.getUserByName);
};

const loginUser = async (request, response) => {
  await Controller.handleRequest(request, response, service.loginUser);
};

const logoutUser = async (request, response) => {
  await Controller.handleRequest(request, response, service.logoutUser);
};

const updateUser = async (request, response) => {
  await Controller.handleRequest(request, response, service.updateUser);
};

const updateUserByName = async (request, response) => {
  await Controller.handleRequest(request, response, service.updateUserByName);
};

const updateUserWithForm = async (request, response) => {
  await Controller.handleRequest(request, response, service.updateUserWithForm);
};

const uploadFile = async (request, response) => {
  await Controller.handleRequest(request, response, service.uploadFile);
};

module.exports = {
  addUser,
  deleteUser,
  deleteUserByName,
  deleteWallet,
  findUsersByStatus,
  findUsersByTags,
  getUserById,
  getUserByName,
  loginUser,
  logoutUser,
  updateUser,
  updateUserByName,
  updateUserWithForm,
  uploadFile,
};
