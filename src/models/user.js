import mongoose, { Schema }  from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import bcrypt from 'bcrypt';


const SALT_WORK_FACTOR = 10;

const UserSchema = new Schema({
  email: { type: 'String', required: true , unique: true, lowercase: true, trim: true},
  password: { type: 'String', required: true },
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

/*
UserSchema.pre('save', next => {
  console.log(this);
  const user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);

        // override the cleartext password with the hashed one
        user.password = hash;
        next();
    });
  });
});*/

UserSchema.plugin(uniqueValidator);
// create the model for users and expose it to our app
export default mongoose.model('User', UserSchema);
