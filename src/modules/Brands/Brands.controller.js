



      import slugify from "slugify";
      import { nanoid } from "nanoid";
      // models
    //   import { SubCategory, Brand } from "../../../DB/Models/index.js";

      // uitls
    //   import { cloudinaryConfig, ErrorClass, uploadFile } from "../../Utils/index.js";
    import { cloudinaryConfig, ErrorClass, uploadFile } from "../../utils/index.js";

        import { Brand, categoryModel, subCategoryModel} from "../../../DB/models/index.js";
     
      
      /**
       * @api {post} /brands/create  Create a brand
       */
       const createBrand = async (req, res, next) => {
        // check if the category and subcategory are exist
        const { category, subCategory } = req.query;
      
        const isSubcategoryExist = await subCategoryModel.findOne({
          _id: subCategory,
          categoryId: category,
        }).populate("categoryId");
      
        if (!isSubcategoryExist) {
          return next(
            new ErrorClass("Subcategory not found", 404, "Subcategory not found")
          );
        }
      
        // Generating brand slug
        const { name } = req.body;
        const slug = slugify(name, {
          replacement: "_",
          lower: true,
        });
      
        // Image
        if (!req.file) {
          return next(
            new ErrorClass("Please upload an image", 400, "Please upload an image")
          );
        }
        // upload the image to cloudinary
        const customId = nanoid(4);
        const { secure_url, public_id } = await uploadFile({
          file: req.file.path,
          folder: `${process.env.UPLOADS_FOLDER}/Categories/${isSubcategoryExist.categoryId.customId}/SubCategories/${isSubcategoryExist.customId}/Brands/${customId}`,
        });
      
        // prepare brand object
        const brand = {
          name,
          slug,
          logo: {
            secure_url,
            public_id,
          },
          customId,
          categoryId: isSubcategoryExist.categoryId._id,
          subCategoryId: isSubcategoryExist._id,
        };
        // create the brand in db
        const newBrand = await Brand.create(brand);
        // send the response
        res.status(201).json({
          status: "success",
          message: "Brand created successfully",
          data: newBrand,
        });
      };




      /**
 * @api {GET} /sub-categories Get category by name or id or slug
 */
 const getBrands = async (req, res, next) => {
    const { id, name, slug } = req.query;
    const queryFilter = {};
  
    // check if the query params are present
    if (id) queryFilter._id = id;
    if (name) queryFilter.name = name;
    if (slug) queryFilter.slug = slug;
  
    // find the category
    const brand = await Brand.findOne(queryFilter);
  
    if (!brand) {
      return next(new ErrorClass("brand not found", 404, "brand not found"));
    }
  
    res.status(200).json({
      status: "success",
      message: "brand found",
      data: brand,
    });
  };

  /**
   * @api{put}/update/_id update brand
   */
const updateBrand=async(req,res,next)=>{
    const {_id}=req.params
    const {name}=req.body

    const brand=await Brand.findById(_id).populate("categoryId").populate("subCategoryId")
    if(!brand){
        return next("brand not foun",404,"brand not foun")
    }

    if(name){
        const slug=slugify(name,{
            replacement:"_",
            lower:true
        })
        brand.name=name
        brand.slug=slug
    }

    if(req.file){
        const splitedPublicId = brand.logo.public_id.split(`${brand.customId}/`)[1];
        const { secure_url } = await uploadFile({
          file: req.file.path,
          folder: `${process.env.UPLOADS_FOLDER}/Categories/${brand.categoryId.customId}/SubCategories/${brand.subCategoryId.customId}/Brands/${brand.customId}`,
          publicId: splitedPublicId,
        });
        brand.logo.secure_url = secure_url;
    }
     // save the sub category with the new changes
  await brand.save();

  res.status(200).json({
    status: "success",
    message: "SubCategory updated successfully",
    data: brand,
  });
}

 /**
   * @api{delete}/delete/_id delete brand
*/

const deleteBrand=async(req,res,next)=>{
    const {_id}=req.params
    const brand=await  Brand.findByIdAndDelete(_id).populate("categoryId").populate("subCategoryId")
    if(!brand){
        return next("brand not found",404,"brand not found")
    }
    const brandPath=`${process.env.UPLOADS_FOLDER}/Categories/${brand.categoryId.customId}/SubCategories/${brand.subCategoryId.customId}/Brands/${brand.customId}`
    await cloudinaryConfig().api.delete_resources_by_prefix(brandPath)
    await cloudinaryConfig().api.delete_folder(brandPath)

    // TODO related products
    res.status(200).json({
        status: "success",
        message: "brand deleted successfully",
        data: brand,
      });

}





export {
    createBrand,
    getBrands,
    updateBrand,
    deleteBrand
}