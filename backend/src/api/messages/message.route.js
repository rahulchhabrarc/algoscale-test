let express = require('express')
let message_controller = require('./message.controller')

const router = express.Router();

router.post("/add-message", message_controller.add);
router.post("/get-messages", message_controller.get);

module.exports = router;
