const express = require('express');
const auth = require('./auth/index.js');
const api = require('./api/index.js');

const router = express.Router();

router.use('/auth', auth.router);
router.use('/api/v1', api);

module.exports = router;
