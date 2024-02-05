const errorMessages = require('../utils/error.messages')

/**
 * This method will validate token role for given grant roles.
 * @param {*} grantRoles An array of roles which you want to allow to access API
 * @author Rohit Kumar
 */
function hasRole(grantRoles) {
	return function (req, res, next) {
		if (req.decoded) {
			const role = req.decoded.role
			if (role && grantRoles.includes(role)) {
				next()
			} else {
				return res.status(403).json({
					success: false,
					message: errorMessages.NOT_AUTHORIZED
				})
			}
		} else {
			return res.status(401).json({
				success: false,
				message: errorMessages.AUTH_TOKEN_IS_NOT_VALID
			})
		}
	}
}
module.exports.hasRole = hasRole