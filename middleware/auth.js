const jwt = require('jsonwebtoken')
const UserModel = require('../models/User')

const checkAuth = async (req, res, next) => {
	const { token } = req.cookies
	if (!token) {
		return res.status(400).json({
			success: false,
			message: "Unauthorized User Please Login"
		})
	} else {
		const verifyToken = jwt.verify(token, 'rk@76448')
		// console.log(verifyToken);
		// const data = await UserModel.findOne(_id:verifyToken.ID)
		const data = await UserModel.findOne({ _id: verifyToken.ID })
		req.decoded = data
		next()
	}
}
module.exports = checkAuth
