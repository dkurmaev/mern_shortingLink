const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
    email: {type: String, required: true, unique: true}, // unique: true - means that there can't be two users with the same email
    password: {type: String, required: true},
    links: [{type: Types.ObjectId, ref: 'Link'}] // ref: 'Link' - means that the links array will contain objects of type 'Link'
});

module.exports = model('User', schema); // model('User', schema) - creates a model named 'User' based on the schema