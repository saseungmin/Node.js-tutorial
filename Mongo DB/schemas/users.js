const mongoose = require('mongoose');

const { Schema } = mongoose;
// 몽구스 스키마 정의
const userSchema = new Schema({
  name: {
    // String타입, 필수, 고유한 값
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
  },
  married: {
    type: Boolean,
    required: true,
  },
  comment: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);
