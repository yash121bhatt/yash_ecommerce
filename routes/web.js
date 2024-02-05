const express = require('express')
const router = express.Router();

router.get('/get-all-categories', (req, res) => {
	return res.status(200).json({
		success: true,
		message: [
			{
				id: 1,
				name: "Cat 1"
			},
			{
				id: 2,
				name: "Cat 2"
			}
		]
	})
})

module.exports = router;