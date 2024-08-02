const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UsermodelSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },
  },
  {
    timestamps: true,
  }
);
UsermodelSchema.pre("save", async function (next) {
  //this function for hashing the password
  if (!this.isModified) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UsermodelSchema.methods.matchpassword = async function (enteredpassword) {
  return await bcrypt.compare(enteredpassword, this.password); //here this password means databasepassword.
};
const User = mongoose.model("User", UsermodelSchema);
module.exports = User;
