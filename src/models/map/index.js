const express = require('express');
const bodyParser = require('body-parser');
const mapController = require('./mapController');

const router = express.Router();

router.use('/', mapController); // 또는 원하는 HTTP 메서드(get, post 등)를 사용하세요.

module.exports = {
  path: '/chats',
  router: router,
};