const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  userImage: String,
  email: String,
  storeID: {type: mongoose.Schema.Types.ObjectId, ref: 'Store'},
  address:{address: String, city: String, state: String, postalCode: Number },
  phoneNumber: Number,
  role:{type: String, enum:['admin', 'provider', 'normalUser'], default:'normalUser'}
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
