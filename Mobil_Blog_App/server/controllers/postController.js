const postModel = require('../models/postModel');

const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'posts',
    format: async (req, file) => 'jpeg',
    public_id: (req, file) => `${Date.now()}_${file.originalname}`,
  },
});

const upload = multer({ storage });

const createPostController = async (req, res) => {
  try {
    const { title, description } = req.body;
    const image = req.file ? req.file.path : null;

    if (!title || !description) {
      return res.status(500).send({
        success: false,
        message: 'Please Provide All Fields',
      });
    }

    const post = await postModel({
      title,
      description,
      image,
      postedBy: req.auth._id,
    }).save();

    res.status(201).send({
      success: true,
      message: 'Post Oluşturma Başarılı',
      post,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in Create Post API',
      error,
    });
  }
};

const getAllPostsContoller = async (req, res) => {
  try {
    const posts = await postModel
      .find()
      .populate('postedBy', '_id name')
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: 'All Posts Data',
      posts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error In GETALLPOSTS API',
      error,
    });
  }
};


const getUserPostsController = async (req, res) => {
  try {
    const userPosts = await postModel.find({ postedBy: req.auth._id });
    res.status(200).send({
      success: true,
      message: 'user posts',
      userPosts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: 'Error in User POST API',
      error,
    });
  }
};


const deletePostController = async (req, res) => {
  try {
    const { id } = req.params;
    await postModel.findByIdAndDelete({ _id: id });
    res.status(200).send({
      success: true,
      message: 'Postunuz Başarıyla Silindi!',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Post Silme Başarısız',
      error,
    });
  }
};


const updatePostController = async (req, res) => {
  try {
    const { title, description } = req.body;
    const image = req.file ? req.file.path : null;

    const post = await postModel.findById({ _id: req.params.id });

    if (!title || !description) {
      return res.status(500).send({
        success: false,
        message: 'Please Provide post title or description',
      });
    }

    const updatedPost = await postModel.findByIdAndUpdate(
      { _id: req.params.id },
      {
        title: title || post?.title,
        description: description || post?.description,
        image: image || post?.image,
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: 'Post Güncelleme Başarılı',
      updatedPost,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in update post API',
      error,
    });
  }
};

module.exports = {
  createPostController: [upload.single('image'), createPostController],
  updatePostController: [upload.single('image'), updatePostController],
  getAllPostsContoller,
  getUserPostsController,
  deletePostController,
};
