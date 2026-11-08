const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    contentType: { type: String },
    size: { type: Number },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // Kept only so images uploaded with the old disk-storage flow still resolve.
    path: { type: String },
    // Excluded from queries by default so listing images never ships the bytes.
    imageData: { type: Buffer, required: true, select: false },
  },
  { timestamps: true }
);

// Serves GET /api/images: filter by owner, newest first.
ImageSchema.index({ owner: 1, createdAt: -1 });

const Image = mongoose.model('Image', ImageSchema);

module.exports = { Image };
