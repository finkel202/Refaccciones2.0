const Store = require("../models/store")
const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const partSchema = new Schema({
  name: String,
  brand: String,
  carModel: String,
  year: String,
  store: [{type: Schema.ObjectId, ref: 'store'}]
},{
  timestamps:{
    createdAt: "createdAt",
    updatedAt: "updatedAt"
  }
});

const Parts = mongoose.model("Parts", partSchema);

module.exports = Parts;
