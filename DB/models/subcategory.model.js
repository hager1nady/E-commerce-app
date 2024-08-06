
import mongoose from "mongoose";
import { type } from "os";
const {model,Schema}=mongoose;

const subCategorySchema=new Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    slug:{
        type:String,
        require:true,
        unique:true
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User", // To Do user model
        required:false// TO DO change true after addding authentication
    },
    images:
        {
            secure_url:
            {
                type:String,
                required:true
            },
            
            public_id:
            {
                type:String,
                required:true,
                unique:true
            }
      },
      customId:{
        type:String,
        required:true,
        unique:true
      },
      categoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"category",
        required:true
      }
        
    
},{timestamps:true})



export const subCategoryModel=mongoose.models.subCategoryModel||model("subCategory",subCategorySchema)