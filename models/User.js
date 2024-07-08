const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    lowercase: true,
    default: "",
  },
  lastName: {
    type: String,
    lowercase: true,
    default: "",
  },
  profileImage: {
    type: String,
    default: "",
  },
  memberSince: {
    type: Date,
    default: Date.now,
  },
  isAdmin: {
    type: Boolean,
    default: true,
  },
});

// pre-save hook to encrypt user passwords on signup
userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) return next(err);
    user.password = hash;
    next();
  });
});

// method to check encrypted password on login
userSchema.methods.checkPassword = function (passwordAttempt, callBack) {
  bcrypt.compare(passwordAttempt, this.password, (err, isMatch) => {
    if (err) return callBack(err);
    return callBack(null, isMatch);
  });
};

// method to remove user's password for token/sending the response
userSchema.methods.withoutPassword = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model("User", userSchema);
