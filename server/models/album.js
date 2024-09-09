const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const albumSchema = mongoose.Schema({
    albumName: { type: String, required: true },
    userCreatorId: { type: String, ref: 'User', required: true },
    bannedPeople: [{ type: String, ref: 'User' }]
});

albumSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Album', albumSchema);