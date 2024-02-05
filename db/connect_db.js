const mongoose = require('mongoose')
const connectDB = () => {
	return mongoose.connect(`${process.env.MONGO_DB_URL_SERVER}`).then(() => {
		console.log('DB Connection Successfully')
	}).catch((err) => {
		console.log(err)
	})
}
module.exports = connectDB