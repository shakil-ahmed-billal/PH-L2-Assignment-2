import { Router } from 'express';
import { userController } from './user.controller';



const router = Router();

// Define user routes here
router.get("/v1/users",  userController.getALlUsers);
router.put("/v1/users/:userId",  userController.updateUser);
router.delete("/v1/users/:userId",  userController.deleteUser);


export const userRouter = router;