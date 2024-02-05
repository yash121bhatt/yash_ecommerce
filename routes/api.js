const express = require('express')
const router = express.Router()

const checkAuth = require('../middleware/auth')
const role = require('../middleware/role')

// ---> Controllers
const UserController = require('../controllers/UserController')
const ProductController = require('../controllers/ProductController')
const CategoryController = require('../controllers/CategoryController')

// ----------------------------------> All Routes

// ---> For non-register-users
router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.post('/logout', UserController.logout)

// ---> For logged-users
router.get('/user/details', [checkAuth, role.hasRole(["admin", "user"])], UserController.userDetails)
router.post('/user/change-password', [checkAuth, role.hasRole(["admin", "user"])], UserController.changePassword)

// ---> For Admin
router.get('/user/list', [checkAuth, role.hasRole(["admin"])], UserController.usersList)
router.get('/user/view/:id', [checkAuth, role.hasRole(["admin"])], UserController.getSingleUser)
router.delete('/user/delete/:id', [checkAuth, role.hasRole(["admin"])], UserController.deleteUser)

// ---> Category
router.post('/category/create', [checkAuth, role.hasRole(["admin"])], CategoryController.categoryAdd)
router.get('/category/list', [checkAuth, role.hasRole(["admin"])], CategoryController.categoriesList)
router.get('/category/view/:id', [checkAuth, role.hasRole(["admin"])], CategoryController.categoryDetails)
router.put('/category/update/:id', [checkAuth, role.hasRole(["admin"])], CategoryController.categoryAdd)
router.delete('/category/delete/:id', [checkAuth, role.hasRole(["admin"])], CategoryController.categoryDelete)

// ---> Product
router.post('/product/create', ProductController.productCreate)
router.get('/product/list', ProductController.productsList)
router.get('/product/view/:id', ProductController.productDetails)
// router.put('/product/update/:id', ProductController.productsList)
router.delete('/product/delete/:id', ProductController.productDelete)

// ---> Page not found
router.get('**', (req, res) => {
	res.send({
		status: true,
		message: 'Page not found',
	})
})

module.exports = router
