const ProductModel = require("../models/Product")

const cloudinary = require('cloudinary').v2
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
})

class ProductController {

	/**
	 * This function return all products list
	 * @param {*} req 
	 * @param {*} res 
	 * @author Rohit Kumar
	 */
	static productsList = async (req, res) => {
		try {
			const products = await ProductModel.find()
			console.log(products)
			res.status(201).json({
				status: true,
				message: "Products list fetch successfully.",
				data: products
			})
		} catch (error) {
			console.log('productsList(): catch error: %o', error)
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
	static productDetails = async (req, res) => {
		try {
			console.log(req.params.id)
			const product = await ProductModel.findById(req.params.id)
			console.log(product)
			res.status(201).json({
				status: true,
				message: "Product details fetch successfully.",
				data: product
			})
		} catch {
			console.log('productDetails(): catch error: %o', error)
			res.status(500).json({
				status: false,
				message: "Internal server error"
			})
		}
	}

	/**
	 * This function create a product
	 * @param {*} req 
	 * @param {*} res 
	 * @author Rohit Kumar
	 */
	static productCreate = async (req, res) => {
		try {
			const { name, description, price, image, category, stock } = req.body
			const file = req.files.image
			const image_upload = await cloudinary.uploader.upload(file.tempFilePath, {
				folder: 'rk-shop/products/'
			})
			const result = await ProductModel({
				name, 
				description, 
				price, 
				image: {
					public_id: image_upload.public_id,
					url: image_upload.secure_url,
				}, 
				category, 
				stock
			})
			await result.save()
			res.status(201).json({
				status: true,
				message: "Product created successfully."
			})
		} catch (error) {
			console.log('productCreate(): catch error: %o', error)
			res.status(500).json({
				status: false,
				message: "Internal server error"
			})
		}
	}

	/**
	 * this function delete a product
	 * @param {*} req 
	 * @param {*} res 
	 * @author Rohit Kumar
	 */
	static productDelete = async (req, res) => {
		try {
			const product = await ProductModel.findById(req.params.id)
			if (!product) {
				return res.status(400).json({
					success: false,
					message: "Product not found"
				})
			}
			await cloudinary.uploader.destroy(product.image.public_id)
			await ProductModel.findByIdAndDelete(req.params.id)
			res.status(201).json({
				status: true,
				message: "Product successfully deleted."
			})
		} catch (error) {
			console.log('productDelete(): catch error: %o', error)
			res.status(500).json({
				status: false,
				message: "Internal server error"
			})
		}
	}
}
module.exports = ProductController