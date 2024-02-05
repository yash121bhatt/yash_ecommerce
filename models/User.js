const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	profile_image: {
		public_id: {
			type: String
		},
		url: {
			type: String
		}
	},
	role: {
		type: String,
		enum: ['admin', 'user'],
		default: 'inactive',
	},
	status: {
		type: String,
		enum: ['active', 'inactive', 'block'],
		default: 'inactive'
	}
}, {
	timestamps: true
})
const UserModel = mongoose.model('users', UserSchema)
module.exports = UserModel
