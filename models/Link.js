const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
    from: {type: String, required: true}, // from - the original link
    to: {type: String, required: true, unique: true}, // to - the shortened link
    code: {type: String, required: true, unique: true}, // code - the code that will be added to the shortened link
    date: {type: Date, default: Date.now}, // date - the date when the link was created
    clicks: {type: Number, default: 0}, // clicks - the number of clicks on the link
    owner: {type: Types.ObjectId, ref: 'User'} // owner - the user who created the link
});

module.exports = model('Link', schema);