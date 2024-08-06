import mongoose from "mongoose";
import { type } from "os";
const {model,Schema}=mongoose;

const categorySchema=new Schema({
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
      }
        
    
},{timestamps:true})



export const categoryModel=mongoose.models.categoryModel||model("category",categorySchema)