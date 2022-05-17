const express = require('express');
const { handleCreateInvoice } = require('../handlers/invoice');

const router = express.Router();

router.post('/', handleCreateInvoice);

module.exports = router;
