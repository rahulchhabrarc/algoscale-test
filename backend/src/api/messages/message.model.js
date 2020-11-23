const mongoose = require('mongoose')

const validator = require('validator')
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    first_name: {
        type: String,
        trim: true,
    },
    last_name: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        validate: value => {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid Email address')
            }
        }
    },
    message: {
        type: String,
        trim: true,
    },
    created: {
        type: Date,
        default: Date.now,
        required: [true, 'Created is required'],
    },
    modified: {
        type: Date,
        default: Date.now,
        required: [true, 'Modified is required'],
    }
});


module.exports = mongoose.model("message", messageSchema);