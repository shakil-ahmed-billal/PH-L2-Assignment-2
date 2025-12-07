import { Router } from 'express';
import { userController } from './user.controller';
import auth from '../../middleware/auth';



const router = Router();

// Define user routes here
router.get("/v1/users",auth("admin") ,  userController.getALlUsers);
router.put("/v1/users/:userId",auth("admin" , "customer"),  userController.updateUser);
router.delete("/v1/users/:userId",auth("admin") ,  userController.deleteUser);


export const userRouter = router;