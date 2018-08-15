const Parts = require("../models/parts");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const storeSchema = new Schema({
  name: String,
  address: {
    street: String,
    number: Number,
    City: String,
    Country: String,
  },
  location: { type: {type: String}, coordinates: [Number]},
  parts: [{type: Schema.ObjectId, ref: 'Parts'}]
},{
  timestamps:{
    createdAt: "createdAt",
    updatedAt: "updatedAt"
  }
});
storeSchema.index({ location: '2dsphere' });

const Store  = mongoose.model("Store", storeSchema);
module.exports = Store;
