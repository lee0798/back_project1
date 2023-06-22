const AuthController = require("./auth");
const UserController = require("./users");
const MapSearch = require("./map/mapController"); // Import the map controller To DDOng

const Controllers = [AuthController, UserController, MapSearch]; // Add the MapController to the Controllers array

module.exports = Controllers;