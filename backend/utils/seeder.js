const products= require("../data/products.json");
const Product=require("../models/productModel");
const dotenv=require("dotenv") 
const connectDatabase=require("../config/database")

dotenv.config({path: 'backend/config/config.env'});
connectDatabase();

const seedProducts= async()=>{
    try{
    await Product.deleteMany();
    console.log("products deleted")

   await Product.insertMany(products)
   console.log("all products addded")
    }catch(e){
        console.log(e.message)
    }
    process.exit(0)
}

seedProducts()