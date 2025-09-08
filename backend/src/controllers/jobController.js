import Job from '../models/jobModel.js';
import { StatusCodes } from 'http-status-codes';
import cloudinary from '../lib/cloudinary.js';
import DataURIParser from 'datauri/parser.js';
import path from 'path';

const parser = new DataURIParser();

const formatImage = (file) => {
  const fileExtension = path.extname(file.originalname).toString();
  return parser.format(fileExtension, file.buffer).content;
};

export const createJobController = async (req, res) => {

  if (req.user.role === 'recruiter' && !req.user.isProfileComplete) {
    throw new Error('Please complete your company profile before posting a job.');
  }

  req.body.postedBy = req.user.userId;

  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

export const getAllJobsController = async (req, res) => {
  const { search, jobType, location } = req.query;
  
  const queryObject = {};
  if (search) queryObject.title = { $regex: search, $options: 'i' };
  if (jobType && jobType !== 'all') queryObject.jobType = jobType;
  if (location && location !== 'all') queryObject.location = { $regex: location, $options: 'i' };
  
  // Pagination logic
  const page = Number(req.query.page) || 1;
  const limit = 6;
  const skip = (page - 1) * limit;

  const totalJobs = await Job.countDocuments(queryObject);
  const totalPages = Math.ceil(totalJobs / limit);

  // Find jobs for the current page
  const jobs = await Job.find(queryObject)
    .populate('postedBy', 'companyName companyLogo')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.status(StatusCodes.OK).json({ 
    totalJobs, 
    totalPages,
    currentPage: page,
    jobs 
  });
};

export const updateJobController = async (req, res) => { 
  const { id: jobId } = req.params;
  const job = await Job.findOne({ _id: jobId });
  if (!job) throw new Error(`No job found with id: ${jobId}`);
  if (req.user.userId !== job.postedBy.toString()) throw new Error('You are not authorized');
  if (req.file) {
    if (job.companyLogo && job.companyLogo.public_id) {
      await cloudinary.uploader.destroy(job.companyLogo.public_id);
    }
    const file = formatImage(req.file);
    const result = await cloudinary.uploader.upload(file, { folder: 'job_portal_logos' });
    req.body.companyLogo = { public_id: result.public_id, url: result.secure_url };
  }
  const updatedJob = await Job.findByIdAndUpdate(jobId, req.body, { new: true, runValidators: true });
  res.status(StatusCodes.OK).json({ updatedJob });
};

export const deleteJobController = async (req, res) => {
  const { id: jobId } = req.params;
  const job = await Job.findOne({ _id: jobId });
  if (!job) throw new Error(`No job found with id: ${jobId}`);
  if (req.user.userId !== job.postedBy.toString()) throw new Error('You are not authorized');
  if (job.companyLogo && job.companyLogo.public_id) {
    await cloudinary.uploader.destroy(job.companyLogo.public_id);
  }
  await job.deleteOne();
  res.status(StatusCodes.OK).json({ msg: 'Success! Job removed.' });
};

export const applyToJobController = async (req, res) => {
  const { id: jobId } = req.params;
  const { userId } = req.user;
  if (!req.file) {
    throw new Error('Please upload your resume.');
  }
  const job = await Job.findById(jobId);
  if (!job) {
    throw new Error(`No job found with id: ${jobId}`);
  }
  const alreadyApplied = job.applicants.some((app) => app.user.toString() === userId);
  if (alreadyApplied) {
    throw new Error('You have already applied for this job.');
  }
  const file = formatImage(req.file);
  const result = await cloudinary.uploader.upload(file, { folder: 'job_portal_resumes', resource_type: 'raw' });
  const newApplicant = { user: userId, resume: { public_id: result.public_id, url: result.secure_url } };
  job.applicants.push(newApplicant);
  await job.save();
  res.status(StatusCodes.OK).json({ msg: 'Successfully applied for the job!' });
};

export const getMyJobsController = async (req, res) => {
  const myJobs = await Job.find({ postedBy: req.user.userId });
  res.status(StatusCodes.OK).json({ totalJobs: myJobs.length, jobs: myJobs });
};

export const viewApplicantsController = async (req, res) => {
  const { id: jobId } = req.params;
  const job = await Job.findById(jobId).populate({ path: 'applicants.user', select: 'name email' });
  if (!job) throw new Error(`No job found with id: ${jobId}`);
  if (req.user.userId !== job.postedBy.toString()) throw new Error('Not authorized');
  res.status(StatusCodes.OK).json({ applicants: job.applicants });
};

export const getJobByIdController = async (req, res) => {
  const { id: jobId } = req.params;
  const job = await Job.findById(jobId)
    .populate('postedBy', 'companyName companyLogo');
  if (!job) {
    throw new Error(`No job found with id: ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};


export const updateApplicantStatusController = async (req, res) => {
  const { jobId, applicantId } = req.params;
  const { status } = req.body;

  const job = await Job.findById(jobId);
  if (!job) throw new Error('Job not found');

  // Authorization: Ensure the requester is the recruiter who posted the job
  if (req.user.userId !== job.postedBy.toString()) {
    throw new Error('Not authorized to update this job');
  }

  // Find the specific applicant in the job's applicants array
  const applicant = job.applicants.id(applicantId);
  if (!applicant) throw new Error('Applicant not found');

  applicant.status = status;
  await job.save();

  res.status(StatusCodes.OK).json({ msg: 'Applicant status updated successfully' });
};

export const getMyApplicationsController = async (req, res) => {
  const { userId } = req.user;

  const jobs = await Job.find({ 'applicants.user': userId }).populate('postedBy', 'companyName');

  const myApplications = jobs.map(job => {
    const applicant = job.applicants.find(app => app.user.toString() === userId);
    return {
      jobId: job._id,
      jobTitle: job.title,
      company: job.postedBy.companyName,
      status: applicant.status,
      appliedAt: applicant.appliedAt,
    };
  });

  res.status(StatusCodes.OK).json({ applications: myApplications });
};