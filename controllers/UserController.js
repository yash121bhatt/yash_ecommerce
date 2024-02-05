const UserModel = require("../models/User")
const fs = require('fs');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary').v2
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
})

class UserController {
	
	// Resister
	static register = async (req, res) => {
		try {
			// console.log(req.body, '------------------- req.body')
			const { name, email, password, confirmPassword } = req.body
			const image = req.files.image
			// console.log(image, '------------- image')
			const imageUpload = await cloudinary.uploader.upload(image.tempFilePath, {
				folder: 'rk-shop/profile_image'
			})
			// console.log(imageUpload, '----------------- imageUpload')
			// Delete the temporary file after the upload is complete
			fs.unlink(image.tempFilePath, (err) => {
				if (err) {
					console.error('Error deleting temporary file:', err);
				} else {
					console.log('Temporary file deleted successfully');
				}
			});

			const user = await UserModel.findOne({
				email: email
			})
			if (user) {
				res.status(409).json({
					status: false,
					message: "Email Already Exist"
				})
			} else {
				if (name && email && password && confirmPassword) {
					if (password == confirmPassword) {
						const hashPassword = await bcrypt.hash(password, 10)
						const result = new UserModel({
							name: name,
							email: email,
							password: hashPassword,
							profile_image: {
								public_id: imageUpload.public_id,
								url: imageUpload.secure_url
							},
							role: 'user',
							status: 'inactive'
						})
						await result.save()

						// Send a mail
						// this.sendEmail(req.body.email, req.body.name)

						res.status(200).json({
							status: true,
							message: "Registration Successfully, Please Login"
						})
					} else {
						res.status(400).json({
							status: false,
							message: "Password and Confirm Password does not match"
						})
					}
				} else {
					res.status(400).json({
						status: false,
						message: "All field are Required"
					})
				}
			}
		} catch (error) {
			console.log("register(): catch error: %o", error)
			res.status(500).json({
				status: true,
				message: "Internal sever error"
			})
		}
	}

	// Login
	static login = async (req, res) => {
		try {
			console.log(req.body)
			const { email, password } = req.body
			if (email && password) {
				const user = await UserModel.findOne({
					email
				})
				console.log(user)
				if (user != null) {
					const isMatched = await bcrypt.compare(password, user.password)
					if (isMatched) {
						if (user.role == 'admin') {
							const token = jwt.sign({ ID: user.id }, 'rk@76448')
							res.cookie('token', token)
						}
						if (user.role == 'user') {
							const token = jwt.sign({ ID: user.id }, 'rk@76448')
							res.cookie('token', token)
						}
						return res.status(200).json({
							status: true,
							message: "You are successfully logged in."
						})
					} else {
						res.status(400).json({
							status: false,
							message: "Email & Password does not Match, Try Again"
						})
					}
				} else {
					return res.status(400).json({
						status: false,
						message: "You are not Registered User, Please Register"
					})
				}
			} else {
				return res.status(400).json({
					status: false,
					message: "All field are Required"
				})
			}
		} catch (err) {
			console.log("login(): catch error: %o", error)
			return res.status(500).json({
				status: true,
				message: "Internal sever error"
			})
		}
	}

	// Logout
	static logout = async (req, res) => {
		try {
			res.clearCookie('token')
			return res.status(200).json({
				success: true,
				message: "You are successfully logged out."
			})
		} catch (error) {
			console.log("logout(): catch error: %o", error)
			res.status(500).json({
				status: true,
				message: "Internal sever error"
			})
		}
	}

	/**
	 * This function return a users details
	 * @param {*} req 
	 * @param {*} res 
	 * @author Rohit Kumar
	 */
	static userDetails = async (req, res) => {
		try {
			const userDetails = await UserModel.findById(req.decoded._id)
			if (!userDetails) {
				res.status(400).json({
					status: true,
					message: "User not found."
				})
			}
			res.status(201).json({
				status: true,
				message: "User details fetch successfully",
				data: userDetails
			})
		} catch (error) {
			console.log("userDetails(): catch error: %o", error)
			res.status(500).json({
				status: true,
				message: "Internal sever error"
			})
		}
	}

	/**
	 * This function return all users list
	 * @param {*} req 
	 * @param {*} res 
	 * @author Rohit Kumar
	 */
	static usersList = async (req, res) => {
		try {
			if (req.decoded.role == 'admin') {
				const users = await UserModel.find({
					role: "user"
				})
				return res.status(201).json({
					status: true,
					message: "Users list fetch successfully",
					data: users
				})
			} else {
				return res.status(201).json({
					status: true,
					message: "Access Denied, You are not admin",
					data: users
				})
			}
		} catch (error) {
			console.log("usersList(): catch error: %o", error)
			res.status(500).json({
				status: true,
				message: "Internal sever error"
			})
		}
	}

	/**
	 * This function return a single user data
	 * @param {*} req 
	 * @param {*} res 
	 * @author Rohit Kumar
	 */
	static getSingleUser = async (req, res) => {
		try {
			const user = await UserModel.findById(req.params.id)
			res.status(200).json({
				success: true,
				data: user
			})
		} catch (error) {
			console.log(error)
		}
	}

	/**
	 * This function update password
	 * @param {*} req 
	 * @param {*} res 
	 * @author Rohit Kumar
	 */
	static changePassword = async (req, res) => {
		try { 
			const { oldPassword, newPassword, confirmPassword } = req.body
			if (oldPassword && newPassword && confirmPassword) {
				const user = await UserModel.findById(req.decoded._id)
				const isMatched = await bcrypt.compare(oldPassword, user.password)
				if (!isMatched) {
					return res.status(400).json({
						success: false,
						message: "Current password is incorrect."
					})
				} else {
					if (newPassword != confirmPassword) {
						return res.status(400).json({
							success: false,
							message: "confirm password does not match."
						})
					} else {
						const newHashPassword = await bcrypt.hash(newPassword, 10)
						await UserModel.findByIdAndUpdate(req.decoded._id, {
							password: newHashPassword
						})
						return res.status(200).json({
							success: false,
							message: "Password successfully changed."
						})
					}
				}
			}
		} catch (error) {
			console.log('changePassword(): catch error: %o', error)
			return res.status(200).json({
				success: false,
				message: "Password successfully changed."
			})
		}
	}

	static updateProfile = async (req, res) => {

	}

	/**
	 * This function delete a user
	 * @param {*} req 
	 * @param {*} res 
	 * @author Rohit Kumar
	 */
	static deleteUser = async (req, res) => {
		try {
			const user = await UserModel.findById(req.params.id)
			if (!user) {
				return res.status(400).json({
					success: false,
					message: "User not found"
				})
			}
			console.log(user, '------ user')
			await cloudinary.uploader.destroy(user.profile_image.public_id)
			await UserModel.findByIdAndDelete(req.params.id)
			res.status(201).json({
				status: true,
				message: "User successfully deleted."
			})
		} catch (error) {
			console.log('deleteUser(): catch error: %o', error)
			res.status(500).json({
				status: false,
				message: "Internal server error"
			})
		}
	}
}
module.exports = UserController