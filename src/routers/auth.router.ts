import { Router } from "express";
import { LoginController, registerController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth";


const router = Router()

router.post('/auth/register',registerController)
router.post('/auth/login',LoginController)
router.get('/me',authMiddleware,(req,res)=>{
    res.json(req.user)
})


export default router;