const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommunitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, 
    trim: true, 
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, 
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
    },
  ],
});

const Community = mongoose.models.Community || mongoose.model('Community', CommunitySchema);
export default Community;
