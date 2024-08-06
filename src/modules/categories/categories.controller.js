
/**
 * @api // category/create getAllCategories
 */

import slugify from "slugify";
import { ErrorClass } from "../../utils/error-class.utils.js";
import { cloudinaryConfig, uploadFile } from "../../utils/index.js";
import { nanoid } from "nanoid";
import { Brand, categoryModel, subCategoryModel } from "../../../DB/models/index.js";

/**
 * @api {POST} /categories/create  Create a category
 */

const createCategoty=async(req,res,next)=>{
    // destruct data from req.bodyy
    const {name}=req.body;

    // generate category slug
    const slug=slugify(name,{
        replacement:'_',
        lower:true
    })

    // images
    if(!req.file){
        return next(
            new ErrorClass("please upliad an image",400,"please upload an image")
        )
    }
    // upload image
    const customId=nanoid(4)
    const {secure_url,public_id} = await cloudinaryConfig().uploader.upload(
        req.file.path,
        {
        folder: `${process.env.UPLOADS_FOLDER}/Category/${customId}`,
        }
    )
    // prepare category object
    const category={
        name,
        slug,
        images:{
           public_id,
           secure_url
        },
        customId
    }
    // create category in db
    const newCategory=await categoryModel.create(category)
    res.status(201).json({
        satus:"success",
        message:"added sucess",
        data:newCategory
    })  
}

/**
 * @api {get} /categories/  get a category
 */

const getCategoryByIdOrByName=async(req,res,next)=>{
    const {id,name,slug}=req.query
    const queryFilter={}
    if(id){queryFilter._id=id}
    if(name){queryFilter.name=name}
    if(slug){queryFilter.slug=slug}
    const category=await categoryModel.findOne(queryFilter)
    if(!category){
        return next(
            new ErrorClass("Category not found",400,"category not found")
        )
    }
    res.status(201).json({
        satus:"success",
        message:"get sucess",
        data:category
    })
}




/**
 * @api {PUT} /categories/update/:_id  Update a category
 */
 const updateCategory = async (req, res, next) => {
    // get the category id
    const { _id } = req.params;
    const { name ,public_id_new} = req.body; 

    // find the category by id
    const category = await categoryModel.findById(_id);
    if (!category) {
      return next(
        new ErrorClass("Category not found", 404, "Category not found")
      );
    }
    // name of the category  
    if (name) {
      const slug = slugify(name,{
        replacement: "_",
        lower: true,
      });
  
      category.name = name;
      category.slug = slug;
    }
  
    //Image
    if (req.file) {
        const splitedPublicId = public_id_new.split(
        `${category.customId}/`
      )[1];
      let {secure_url} = await cloudinaryConfig.uploadFile(
        
        req.file.path,
        {
          folder: `${process.env.UPLOADS_FOLDER}/Category/${category.customId}`,
          public_id: splitedPublicId,
        }
      );
      secure_url = secure_url;
    }
    // save the category with the new changes
    await category.save();
  
    res.status(200).json({
      status: "success",
      message: "Category updated successfully",
      data: category,
    });
  };


  /**
 * @api {DELETE} /categories/delete/:_id  delete a category
 */
const deleteCategory=async (req,res,next)=>{
    // get the category id
    const { _id } = req.params;
    const category = await categoryModel.findByIdAndDelete(_id);
    if (!category) {
      return next(
        new ErrorClass("Category not found", 404, "Category not found")
      );
    }
    const categoryPath=`${process.env.UPLOADS_FOLDER}/Category/${category.customId}`
    await cloudinaryConfig().api.delete_resources_by_prefix(categoryPath)
    await cloudinaryConfig().api.delete_folder(categoryPath)

    // todo delete relevent subcategory from db
    const deletedSubcategory=await subCategoryModel.deleteMany({
        categoryId:_id
    })
    if(deletedSubcategory.deletedCount){
        await Brand.deleteMany({
            categoryId:_id
        })
    }
    // todo delete relevent brands from db
    res.status(200).json({
        status: "success",
        message: "Category deleted successfully",
        data: category,
      });

}






export {
    createCategoty,
    getCategoryByIdOrByName,
    updateCategory,
    deleteCategory
}