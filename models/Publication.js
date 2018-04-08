var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');

var PublicationSchema = new Schema({
  creationdate: {type: Date, required: true},
  expirationdate: {type: Date, required: true},
  address: {type: String, required: true},
  publisher: {type: Schema.Types.ObjectId, ref: 'User'},
  status: {type: String, enum: ['Active', 'Paused', 'Finished']},
  price: {type: Number, min: 0.00, max: 999999999999999.99, required: true},
  currency: {type: String, enum: ['UYU', 'USD']},
  latitude: {type: Number, required: true},
  longitude: {type: Number, required: true}
});

PublicationSchema.virtual('url').get(function () {
  return '/publications/'+this._id;
});

PublicationSchema.virtual('creationdate_formatted').get(function () {
  return moment(this.creationdate).format('DD/MM/YYYY');
});

PublicationSchema.virtual('expirationdate_formatted').get(function () {
  return moment(this.expirationdate).format('DD/MM/YYYY');
});

module.exports = mongoose.model('Publication', PublicationSchema);
