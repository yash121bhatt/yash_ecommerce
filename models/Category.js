const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	image: {
		public_id: {
			type: String,
		},
		url: {
			type: String
		}
	},

}, { timestamps: true });
const CategoryModel = mongoose.model('category', CategorySchema)
module.exports = CategoryModel