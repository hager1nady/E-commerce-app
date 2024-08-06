

import { Router } from "express";
import * as controller from './subCategories.controller.js'
import { errorHandler, getDocumentByName, multerHost } from "../../middleware/index.js";
import { extensions } from "../../utils/index.js";
import { subCategoryModel } from "../../../DB/models/subcategory.model.js";

const subCategoryRouter=Router();

subCategoryRouter.post('/create',
    multerHost({allowedExtensions:extensions.Images}).single('image'),
    getDocumentByName(subCategoryModel),
    errorHandler(controller.createSubCategory))

subCategoryRouter.get('/',errorHandler(controller.getSubCategory))
subCategoryRouter.put('/update/:_id',
    multerHost({allowedExtensions:extensions.Images}).single('image'),
    getDocumentByName(subCategoryModel),
    errorHandler(controller.updateSubCategory))
subCategoryRouter.delete('/delete/:_id',errorHandler(controller.deleteSubCategory))


export  {subCategoryRouter};