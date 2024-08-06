

import slugify from "slugify";
import { nanoid } from "nanoid";
//utils
import { ErrorClass } from "../../utils/error-class.utils.js";
import { cloudinaryConfig, uploadFile } from "../../utils/index.js";
import { Brand, categoryModel, subCategoryModel} from "../../../DB/models/index.js";
/**
 * @api{post} /subCategory/create create sub-category
 */
const createSubCategory=async(req,res,next)=>{
    //1)check category id
    const category =await categoryModel.findById({_id:req.query.categoryId})
    if(!category){
        return next(
            new ErrorClass("Category not found", 404, "Category not found")
        )
    }
    console.log(category);
    const {name}=req.body
    const slug=slugify(name,{
        replacement:"_",
        lower:true
    })

    if(!req.file){
        return next("please uploaad an image", 400, "please uploaad an image")
    }

    const customId=nanoid(4)
    const{secure_url,public_id}=await uploadFile(
        {
        file:req.file.path,
        
        folder:`${process.env.UPLOADS_FOLDER}/Category/${category.customId}/SubCategory/${customId}`,
        
        }
    )

      // prepare Subcategory object
      const SubCategoryObject={
        name,
        slug,
        images:{
            secure_url,
           public_id
           
        },
        customId,
        categoryId:category._id
    }

    const newSubCategory=await subCategoryModel.create(SubCategoryObject)
    res.status(201).json({
        satus:"success",
        message:"created success",
        data:newSubCategory})
}


/**
 * @api{Get} /subCategory/ get sub-category
 */

const getSubCategory=async(req,res,next)=>{
    const {name,slug,id}=req.query
    const queryFilter={}
    if(id) {queryFilter._id=id}
    if(name){queryFilter.name=name}
    if(slug){queryFilter.slug=slug}

    const subCategory=await subCategoryModel.findOne(queryFilter)
    if(!subCategory){
        return next(
            new ErrorClass("SubCategory not found",404,"subCategory not found")
        )  
    }
    res.status(201).json({
        satus:"success",
        message:"created success",
        data:subCategory
    })
}

/**
 * @api{put} update/subCategory/ update sub-category
 */

const updateSubCategory=async(req,res,next)=>{
    const{_id}=req.params
    const {name}=req.body
    const subCategory=await subCategoryModel.findById(_id).populate("categoryId")
    if(!subCategory){
        return next("subcategory not found",404,"subcategory not found")
    }
     if(name){
        const slug=slugify(name,{
            replacement:"_",
            lower:true
        })
        subCategory.name=name
        subCategory.slug=slug
     }

     if (req.file) {
        const splitedPublicId =subCategory.images.public_id.split(
        `${subCategory.customId}/`
      )[1];
      let {secure_url} = await cloudinaryConfig().uploader.upload(
        
        req.file.path,
        {
          folder: `${process.env.UPLOADS_FOLDER}/Category/${subCategory.categoryId.customId}/subcategories/${subCategory.customId}`,
          public_id: splitedPublicId,
        }
      );
      secure_url = secure_url;
    }
    await subCategory.save()
    res.status(200).json({
        satus:"success",
        message:"updated success",
        data:subCategory
    })



}

/**
 * @api{delete} delete/subCategory/ delete sub-category
 */

const deleteSubCategory=async(req,res,next)=>{
    const{_id}=req.params
    const subCategory=await subCategoryModel.findByIdAndDelete(_id).populate("categoryId")
    if(!subCategory){
        return next(
            "subCategory not found",
            404,
            "subCategory not found"

        )
    } 
    // console.log({subcategoryis:subCategory}.categoryId);

    const SubCategoryPath=`${process.env.UPLOADS_FOLDER}/Category/${subCategory.categoryId.customId}/subcategories/${subCategory.customId}`
    await cloudinaryConfig().api.delete_resources_by_prefix(SubCategoryPath)
    await cloudinaryConfig().api.delete_folder(SubCategoryPath)

    // to do related brands
    await Brand.deleteMany({subCategoryId:subCategory._id})
    res.status(200).json({
        satus:"success",
        message:"deleted success",
        data:subCategory
    })
}


export{
    createSubCategory,
    getSubCategory,
    updateSubCategory,
    deleteSubCategory
}