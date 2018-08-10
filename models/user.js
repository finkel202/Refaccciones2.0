const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  store: String,
  addres:{street: String, number: Number, city: String, state: String, postalCode: Number },
  phoneNumber: Number,
  facebookID: String,
  displayName: String,
  emails: [{value: String}, {type: String}],
  name: Object,
  role:{type: String, enum:['admin', 'provider', 'normalUser'], default:'normalUser'}
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
