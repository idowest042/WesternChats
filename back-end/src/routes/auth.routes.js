import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js"
import { signup,login,checkAuth,UpdateProfilepic, logout } from "../controllers/auth.controller.js"
const router = express.Router()
router.post('/signup', signup)
router.post('/login',login)
router.post('/signout',logout)
router.put('/Update-Profile', protectRoute, UpdateProfilepic)
router.get('/check', protectRoute,checkAuth);
export default  router