import User from '../models/userModel.js';
import { StatusCodes } from 'http-status-codes';
import cloudinary from '../lib/cloudinary.js';
import DataURIParser from 'datauri/parser.js';
import path from 'path';

const parser = new DataURIParser();

const formatImage = (file) => {
  const fileExtension = path.extname(file.originalname).toString();
  return parser.format(fileExtension, file.buffer).content;
};

export const getCurrentUserController = async (req, res) => {

  const user = await User.findById(req.user.userId).select('-password');
  if (!user) {
    throw new Error('User not found');
  }
  res.status(StatusCodes.OK).json({ user });
};

export const registerController = async (req, res) => {

  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    throw new Error('Please provide all values');
  }

  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    throw new Error('Email already in use');
  }

  const user = await User.create({ name, email, password, role });
  const token = user.createJWT();
  user.password = undefined; 
  res.status(StatusCodes.CREATED).json({ user, token });
};

export const createCompanyProfileController = async (req, res) => {
    const { companyName } = req.body;
    const { userId } = req.user;

    const userToUpdate = { companyName, isProfileComplete: true };

    if (req.file) {
        const file = formatImage(req.file);
        const result = await cloudinary.uploader.upload(file, { folder: 'job_portal_logos' });
        userToUpdate.companyLogo = {
            public_id: result.public_id,
            url: result.secure_url,
        };
    }

    const updatedUser = await User.findByIdAndUpdate(userId, userToUpdate, { new: true });
    updatedUser.password = undefined;
    res.status(StatusCodes.OK).json({ user: updatedUser, msg: 'Profile created successfully' });
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new Error('Please provide all values');
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new Error('Invalid Credentials');
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new Error('Invalid Credentials');
  }
  user.password = undefined;
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user, token });
};