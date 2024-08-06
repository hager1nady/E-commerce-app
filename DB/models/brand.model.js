


// import mongoose from "mongoose";
// import { type } from "os";
// const {model,Schema}=mongoose;

/* const brandSchema=new Schema({
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
    logo:
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
      },
      subCategoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"subCategory",
        required:true
      }

        
    
},{timestamps:true}) */

import mongoose from "mongoose";
const { Schema, model } = mongoose;

const brandSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // TODO: Change to true after adding authentication
    },
    logo: {
      secure_url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
        unique: true,
      },
    },
    customId: {
      type: String,
      required: true,
      unique: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },
    subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subCategory",
      required: true,
    },
  },
  { timestamps: true }
);

export const Brand = mongoose.models.Brand || model("Brand", brandSchema);

// export const brandModel=mongoose.models.brandModel||model("brand",brandSchema)