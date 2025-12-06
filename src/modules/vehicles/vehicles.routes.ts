import {  Router } from 'express';
import { vehiclesController } from './vehicles.controller';


const router = Router();

router.post("/v1/vehicles" ,  vehiclesController.createVehicle);
router.get("/v1/vehicles" ,  vehiclesController.getAllVehicles);

export const vehiclesRouter = router;