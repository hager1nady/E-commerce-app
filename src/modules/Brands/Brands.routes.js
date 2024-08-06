

import { Router } from "express";
import * as controller from './Brands.controller.js'
import { errorHandler, getDocumentByName, multerHost } from "../../middleware/index.js";
import { extensions } from "../../utils/index.js";
import { Brand } from "../../../DB/models/index.js";
const brandRouter=Router();


brandRouter.post('/create',multerHost({allowedExtensions:extensions.logo}).single('image'),errorHandler(controller.createBrand)
)
brandRouter.get('/',errorHandler(controller.getBrands))
brandRouter.put('/update/:_id',
    multerHost({allowedExtensions:extensions.logo}).single('image'),
    getDocumentByName(Brand),
    errorHandler(controller.updateBrand))
brandRouter.delete('/delete/:_id',errorHandler(controller.deleteBrand))

export  {brandRouter};