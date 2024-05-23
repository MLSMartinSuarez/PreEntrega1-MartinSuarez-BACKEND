

import { Router } from "express";
import { __dirname } from "../path.js";
import { productValidation } from "../middlewares/productValidation.js";
import { idValidation } from "../middlewares/idValidation.js";
import ProductManager from "../managers/products.manager.js";

const productRouter = Router();
const productManager = new ProductManager(`${__dirname}/db/products.json`);

productRouter.get("/", async (req, res) => {
    try {
        const {limit} = req.query;
        const products = await productManager.getProducts(limit);
        !products ? res.status(404).json({ error: "Products not found" }) : res.status(200).json(products);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
});

productRouter.get("/:productId", async (req, res) => {

    try {
        const { productId } = req.params;
        const product = await productManager.getProductById(productId);
        !product ? res.status(404).json({ error: "Product not found" }) : res.status(200).json(product);
    } catch (error) {
        res.status(500).json({msg: error.message}); 
    }
    
});

productRouter.post("/", productValidation, async (req, res) => {
    try {
        const productObj = req.body;
        const newProduct = await productManager.addNewProduct(productObj);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
});

productRouter.put("/:productId", idValidation, async (req, res) => {
    try {
        const {productId} = req.params;
        const productBody = req.body;
        const productUpdate = await productManager.modifyProduct(productId, productBody);
        !productUpdate ? res.status(404).json({ error: "Product not found" }) : res.status(200).json(productUpdate);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
})

productRouter.delete("/:productId", async (req, res) => {
    try {
        const { productId } = req.params;
        const prodToDelete = await productManager.deleteProduct(productId);
        !prodToDelete ? res.status(404).json({ error: "Product not found" }) : res.status(200).json(`product ${productId} deleted`);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
})

export default productRouter;