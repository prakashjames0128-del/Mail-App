import mongoose from 'mongoose';

const mailSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  body: { type: String, required: true },
  recipients: [String],
  results: [{ email: String, ok: Boolean, error: String, _id: false }],
  status: { type: String, enum: ['pending', 'sent', 'partial', 'failed'], default: 'pending' },
  sentCount: { type: Number, default: 0 },
  failedCount: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Mail', mailSchema);
