

import { Router } from "express";
import * as controller from "./categories.controller.js";
import { multerHost } from "../../middleware/multer.meddleware.js";
import { errorHandler } from "../../middleware/error-handling.middleware.js";
import { extensions } from "../../utils/file-extentions-utils.js";
import { getDocumentByName } from "../../middleware/index.js";
import { categoryModel } from "../../../DB/models/category.model.js";


const categoryRouter=Router();
categoryRouter.post('/create',multerHost({allowedExtensions:extensions.Images}).single('image'),getDocumentByName(categoryModel),errorHandler(controller.createCategoty))
categoryRouter.get('/',errorHandler(controller.getCategoryByIdOrByName))
categoryRouter.put('/:_id',
    multerHost({allowedExtensions:extensions.Images}).single('image'),
    getDocumentByName(categoryModel),
    errorHandler(controller.updateCategory))
categoryRouter.delete('/delete/:_id',errorHandler(controller.deleteCategory))
export {categoryRouter};
