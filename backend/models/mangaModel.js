import mongoose from "mongoose";

const mangaSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String },
  currentChapter: { type: Number, default: 0 },
  totalChapters: { type: Number },
  website: { type: String, required: true },
  status: { type: String, enum: ["Reading","Completed","On-Hold","Dropped"], default: "Reading" },
  notes: { type: String },
  coverImage: { type: String },
  rating: { type: Number, min: 1, max: 10 },
  genre: [{ type: String }],            
  author: { type: String },
  publishedYear: { type: Number },
  language: { type: String, default: "English" },
  tags: [{ type: String }],
  readingProgress: { type: Number, default: 0 },
  lastReadDate: { type: Date },
  favorite: { type: Boolean, default: false },
  readingTime: { type: Number },
  embedding: { type: [Number], default: [] },  
  releaseDay: { type: String, enum: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'] ,
    required:true,
  },

}, { timestamps: true });

export default mongoose.model("Manga", mangaSchema);
