const express = require("express");
const checkAuth = require("../middelware/check-auth");
const extractFile = require("../middelware/files");
const PostsController = require("../controller/posts");
const router = express.Router();


router.post('', checkAuth, extractFile, PostsController.post);
router.put('/:postId', checkAuth, extractFile, PostsController.update);
router.get("/:postId", PostsController.get);
router.get("", PostsController.list);
router.delete("/:id", checkAuth, PostsController.delete);
module.exports = router;