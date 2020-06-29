const mongoose = require('mongoose');

const { Schema } = mongoose;
const roomSchema = new Schema({
  title: { // 방 제목
    type: String,
    required: true,
  },
  max: { // 최대 인원 수용
    type: Number,
    required: true,
    default: 10, // 기본 10명
    min: 2, //최소 2명
  },
  owner: { // 방장
    type: String,
    required: true,
  },
  password: String, // 비밀번호 필수가 아니므로 비밀번호 설정시 비밀방, 설정하지 않으면 공개방
  createdAt: { // 생성시간
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Room', roomSchema);
