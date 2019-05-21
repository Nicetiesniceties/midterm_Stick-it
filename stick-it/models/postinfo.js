const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Creating a schema, sort of like working with an ORM
const PostinfoSchema = new Schema({
	text: {
		type: String,
		required: [true, 'Name field is required.']
	},
	x: {
		type: Number,
		required: [true, 'Body field is required.']
	},
	y: {
		type: Number,
		required: [true, 'Body field is required.']
	},
	color: {
		type: String,
		required: [true, 'Body field is required.']
    },
    zIndex: {
        type: Number,
		required: [true, 'Body field is required.'] 
    },
    exist: {
        type: Number,
        required: [true, 'Body field is required.'] 
    }
})

// Creating a table within database with the defined schema
const Postinfo = mongoose.model('message', PostinfoSchema)

// Exporting table for querying and mutating
module.exports = Postinfo