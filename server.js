import express from "express";
const app = express();

import { __dirname } from "./src/path.js";
app.use(express.static(`${__dirname}/public`));

import cartRouter from "./src/routes/carts.routes.js";
app.use("/api/carts", cartRouter);

import viewsRouter from "./src/routes/views.routes.js";
app.use('/', viewsRouter);

import productsRouter from "./src/routes/products.routes.js";
app.use("/api/products", productsRouter);

import ProductsManager from "./src/managers/products.manager.js";
const productManager = new ProductsManager(`${__dirname}/db/products.json`);

import handlebars from 'express-handlebars';
app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

import { Server } from "socket.io";

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const PORT = 8080;

const httpServer = app.listen(PORT, () => console.log(`Server OK port: ${PORT}`));

const socketServer = new Server(httpServer);

socketServer.on("connection", async (socket) => {
    console.log(`Client connected ID: ${socket.id}`);
    
    socket.emit("products", await productManager.getProducts());

    socket.on("disconnect", () => console.log("Client Disconnected"));

    socket.on("newProduct", async (newProduct) => {

        productManager.addNewProduct(newProduct);
        const products = await productManager.getProducts();
        socketServer.emit('products', products);
    });

    socket.on("deleteProduct", async (id) => {
        await productManager.deleteProduct(id);
        console.log("Product deleted");
        const products = await productManager.getProducts();
        socketServer.emit('products', products);
    });


})