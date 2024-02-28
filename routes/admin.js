const express = require("express");
const {getUsers, postKey, getKeys, deleteKey, blockUser, messageFrequency} = require('../controllers/adminController')

const router = express.Router();

router.get("/get-users", getUsers);
router.post("/post-key", postKey)
router.get("/get-keys",getKeys)
router.delete("/delete-key/:id",deleteKey)
router.patch("/block-user/:userId", blockUser)
router.post("/message-frequency", messageFrequency)
// router.patch("/", updateUser);

module.exports = router;
