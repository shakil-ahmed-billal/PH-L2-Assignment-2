import {  Router } from 'express';
import { vehiclesController } from './vehicles.controller';


const router = Router();

router.post("/v1/vehicles" ,  vehiclesController.createVehicle);
router.get("/v1/vehicles" ,  vehiclesController.getAllVehicles);
router.get("/v1/vehicles/:vehicleId" , vehiclesController.getVehicleById);
router.put("/v1/vehicles/:vehicleId" , vehiclesController.updateVehicle);
router.delete("/v1/vehicles/:vehicleId" , vehiclesController.deleteVehicle);

export const vehiclesRouter = router;