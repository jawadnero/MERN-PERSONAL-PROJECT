const productModel = require("../models/product.model")
const cloudinary = require("../config/cloudinary")


const getProducts = async (req, res) => {
    try{
        const products = await productModel.find({})
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}



const getProductById = async (req, res) => {
    try{
        const product = await productModel.findById(req.params.id)
        if(!product){
            return res.status(404).json({ message: "Product not found" })
        }
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}   

const createProduct = async (req, res) => {
    try{
        const { name, description, price, category, stock } = req.body;
        let imageUrl = "";
        if(req.file){   
            const result = await cloudinary.uploader.upload(req.file.path)
            imageUrl = result.secure_url;
         }
        const product = new productModel({
            name,
            description,
            price,
            category,
            stock,
            imageUrl
        });
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const updateProduct = async (req, res) => {
    try{
        const { name, description, price, category, stock } = req.body;
        const product = await productModel.findById(req.params.id);
        if(product){
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.category = category || product.category;
            product.stock = stock || product.stock;
            if(req.file){
                const result = await cloudinary.uploader.upload(req.file.path);
                product.imageUrl = result.secure_url;
            }
            const updatedProduct = await product.save();
            res.status(200).json(updatedProduct);
        }
        else{
            res.status(404).json({message: "Product not found"})
        }
    }catch(err){
       res.status(500).json({message: "server error"})
    }
 }


 const deleteProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await productModel.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Product deleted",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "server error",
      error: err.message,
    });
  }
};

module.exports = { getProducts, createProduct, getProductById, updateProduct, deleteProduct }