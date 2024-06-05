// const { login, register } = require('../app/controllers/auth_controller');
const { login, register, logout } = require("#controllers/auth_controller");
const { isAuth } = require("#middlewares/auth");
const router = require("express").Router();

/**
 * Auth
 * - POST /auth/login
 * - POST /auth/register
 * - POST /auth/logout
 * - POST /auth/forgot-password
 * - POST /auth/reset-password
 * - POST /auth/refresh-token
 * - POST /auth/verify-email
 * - POST /auth/send-verification-email
 * - POST /auth/send-password-reset-email
 * - POST /auth/send-email-verification-notification
 * - POST /auth/send-password-reset-notification
 * - POST /auth/send-email-verification-notification
 * - POST /auth/verify-email
 * - POST /auth/verify-password-reset
 * - POST /auth/verify-email-verification
 */
router.post("/login", login);
router.post("/register", register);
router.post("/logout", isAuth, logout);

module.exports = router;
