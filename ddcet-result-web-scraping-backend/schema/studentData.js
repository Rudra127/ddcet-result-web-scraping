import mongoose from "mongoose";

const candidateSchema = mongoose.Schema({
  programme: {
    type: String,
    required: true,
  },
  applicationNo: {
    type: String,
    required: true,
    unique: true,
  },
  seatNo: {
    type: Number,
    required: true,
  },
  candidateName: {
    type: String,
    required: true,
  },
  fathersName: {
    type: String,
    required: true,
  },
  marksSecured: {
    type: Number,
    required: true,
  },
  rank: {
    type: Number,
    required: true,
  },
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const student = mongoose.model("Candidate", candidateSchema);

export default student;
