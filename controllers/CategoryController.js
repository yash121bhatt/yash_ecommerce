const CategoryModel = require('../models/Category')

const cloudinary = require('cloudinary').v2
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
})

class CategoryController{

	/**
	 * this function create a new category
	 * @param {*} req 
	 * @param {*} res 
	 * @author Rohit Kumar
	 */
	static categoryAdd = async (req, res) => {
		try {
			const { name, image } = req.body
			const file = req.files.image
			const image_upload = await cloudinary.uploader.upload(file.tempFilePath, {
				folder: 'rk-shop/categories/'
			})
			const result = new CategoryModel({
				name: name,
				image: {
					public_id: image_upload.public_id,
					url: image_upload.secure_url
				}
			})
			await result.save()
			res.status(201).json({
				status: 'true',
				message: 'Category added successfully.'
			})
		} catch (error) {
			console.log('categoryAdd(): catch error: %o', error)
			res.status(500).json({
				status: false,
				message: "Internal server error"
			})
		}
	}

	/**
	 * this function return list of all categories
	 * @param {*} req 
	 * @param {*} res 
	 * @author Rohit Kumar
	 */
	static categoriesList = async (req, res) => {
		try {
			const category = await CategoryModel.find()
			console.log(category)
			res.status(201).json({
				status: true,
				message: "Categories list fetch successfully.",
				data: category
			})
		} catch {
			console.log('categoriesList(): catch error: %o', error)
			res.status(500).json({
				status: false,
				message: "Internal server error"
			})
		}
	}
	
	/**
	 * this function return details of a categories
	 * @param {*} req 
	 * @param {*} res 
	 * @author Rohit Kumar
	 */
	static categoryDetails = async (req, res) => {
		try {
			console.log(req.params.id)
			const category = await CategoryModel.findById(req.params.id)
			console.log(category)
			res.status(201).json({
				status: true,
				message: "Category details fetch successfully.",
				data: category
			})
		} catch {
			console.log('categoryDetails(): catch error: %o', error)
			res.status(500).json({
				status: false,
				message: "Internal server error"
			})
		}
	}

	static categoryUpdate = async (req, res) => {
		try {
			if (req.files) {
				console.log(req.params.id)
				const { cname, image } = req.body
				const category = await CategoryModel.findById(req.params.id)
				const imageId = category.image.public_id
				console.log(imageId)
				await cloudinary.uploader.destroy(imageId)
				const file = req.files.image
			}
		} catch {
			console.log('categoryUpdate(): catch error: %o', error)
			res.status(500).json({
				status: false,
				message: "Internal server error"
			})
		}
	}
	
	/**
	 * this function delete a category
	 * @param {*} req 
	 * @param {*} res 
	 * @author Rohit Kumar
	 */
	static categoryDelete = async (req, res) => {
		try {
			const category = await CategoryModel.findById(req.params.id)
			if (!category) {
				return res.status(400).json({
					success: false,
					message: "Category not found"
				})
			}
			await cloudinary.uploader.destroy(category.image.public_id)
			await CategoryModel.findByIdAndDelete(req.params.id)
			res.status(201).json({
				status: true,
				message: "Category successfully deleted."
			})
		} catch (error) {
			console.log('categoryDelete(): catch error: %o', error)
			res.status(500).json({
				status: false,
				message: "Internal server error"
			})
		}
	}
}
module.exports = CategoryController