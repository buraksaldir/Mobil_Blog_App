const express = require("express");
const { requireSingIn } = require("../controllers/userController");
const {
  createPostController,
  getAllPostsContoller,
  getUserPostsController,
  deletePostController,
  updatePostController,
} = require("../controllers/postController");

const router = express.Router();


router.post("/create-post", requireSingIn, createPostController);


router.get("/get-all-post", getAllPostsContoller);


router.get("/get-user-post", requireSingIn, getUserPostsController);


router.delete("/delete-post/:id", requireSingIn, deletePostController);


router.put("/update-post/:id", requireSingIn, updatePostController);


module.exports = router;
