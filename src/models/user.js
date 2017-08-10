import mongoose, { Schema }  from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import bcrypt from 'bcrypt';
import shortid from 'shortid';

const UserSchema = new Schema({
  fullname: {
    type: String,
    trim: true,
  },
  username: {
    type: String,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address'
    ],
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: function() {
      return new Date();
    },
  },
  emailValidated: {
    type: Boolean,
    default: false,
  },
  validationCode: {
    type: String,
    default: shortid.generate
  }
});


// methods ======================
// generating a hash
UserSchema.methods.generateHash = password => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.pre('save', function(next) {
  const user = this;
  // only hash the password if it has been modified (or is new)
  if (user.isModified('password')) {
    user.password = user.generateHash(user.password);
  }
  next();
});

UserSchema.plugin(uniqueValidator);
// create the model for users and expose it to our app
export default mongoose.model('User', UserSchema);
