const JWT = require('jsonwebtoken');
const { hashPassword, comparePassword } = require('../helpers/authHelper');
const userModel = require('../models/userModel');
var { expressjwt: jwt } = require('express-jwt');

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
    folder: 'avatar',
    format: async (req, file) => 'jpeg',
    public_id: (req, file) => `${Date.now()}_${file.originalname}`,
  },
});

const upload = multer({ storage });

const requireSingIn = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
});

const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const image = req.file ? req.file.path : null;
 
    if (!name) {
      return res.status(400).send({
        success: false,
        message: 'name is required',
      });
    }
    if (!email) {
      return res.status(400).send({
        success: false,
        message: 'email is required',
      });
    }
    if (!password || password.length < 6) {
      return res.status(400).send({
        success: false,
        message: 'password is required and 6 character long',
      });
    }
  
    const exisitingUser = await userModel.findOne({ email });
    if (exisitingUser) {
      return res.status(500).send({
        success: false,
        message: 'User Already Register With This EMail',
      });
    }
  
    const hashedPassword = await hashPassword(password);

  
    const user = await userModel({
      name,
      email,
      image,
      password: hashedPassword,
    }).save();

    return res.status(201).send({
      success: true,
      message: 'Kayıt başarılı giriş yapabilirsiniz',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: 'Error in Register API',
      error,
    });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(500).send({
        success: false,
        message: 'Please Provide Email Or Password',
      });
    }
  
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(500).send({
        success: false,
        message: 'Kullanıcı Bulunamadı',
      });
    }
  
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(500).send({
        success: false,
        message: 'Invalid usrname or password',
      });
    }
    //TOKEN JWT dönüştürücü
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });


    user.password = undefined;
    res.status(200).send({
      success: true,
      message: 'Giriş Başarılı',
      token,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: 'giriş APIsinde hata',
      error,
    });
  }
};

const updateUserController = async (req, res) => {
  try {
    const { name, password, email } = req.body;
    const image = req.file ? req.file.path : null;


    const user = await userModel.findOne({ email });
   
    if (password && password.length < 6) {
      return res.status(400).send({
        success: false,
        message: 'Password is required and should be 6 character long',
      });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;

    const updatedUser = await userModel.findOneAndUpdate(
      { email },
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        image: image || user?.image,
      },
      { new: true }
    );
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: 'Profil Güncellendi Lütfen Giriş Yapın',
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error In User Update Api',
      error,
    });
  }
};

module.exports = {
  requireSingIn,
  loginController,
  registerController: [upload.single('image'), registerController],
  updateUserController: [upload.single('image'), updateUserController],
};
