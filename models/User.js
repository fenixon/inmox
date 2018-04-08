var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: {type: String, max: 80, required: true},
  password: {type: String, max: 100, required: true},
  names: {type: String, required: true},
  familynames: {type: String, required: true},
  birthdate: {type: Date},
  joiningdate: {type: Date},
  lastlogin: {type: Date, default: Date.now},
  rating: {type: Number, min: 0.00, max: 5.00},
  publications: [{type: Schema.Types.ObjectId, ref: 'Publication'}]
});

UserSchema.virtual('age').get(function () {
  return Math.round((new Date()-this.birthDate)/31536000000);
});

UserSchema.virtual('url').get(function () {
  return '/users/'+this._id;
});

module.exports = mongoose.model('User', UserSchema);

