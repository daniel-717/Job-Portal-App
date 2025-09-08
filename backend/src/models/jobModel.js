import mongoose from 'mongoose';

const applicantSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resume: {
    public_id: { type: String, required: true },
    url: { type: String, required: true },
  },
  status: {
    type: String,
    enum: ['Applied', 'In Review', 'Accepted', 'Rejected'],
    default: 'Applied',
  },
  appliedAt: { type: Date, default: Date.now },
});

const jobSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Job title is required'], 
    maxlength: 100 
  },
  description: { 
    type: String, 
    required: [true, 'Job description is required'] 
  },
  salary: { 
    type: String, 
    required: [true, 'Salary is required'] 
  },
  location: { 
    type: String, 
    default: 'Work from home' 
  },
  jobType: { 
    type: String, 
    enum: ['Full-time', 'Part-time', 'Remote', 'Internship'], 
    default: 'Full-time' 
  },
  postedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  applicants: [applicantSchema],
}, { timestamps: true });

export default mongoose.model('Job', jobSchema);