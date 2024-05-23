import express from "express";
const app = express();

import cartRouter from "./src/routes/carts.routes.js";
import productsRouter from "./src/routes/products.routes.js";

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/api/carts", cartRouter);
app.use("/api/products", productsRouter);

const PORT = 8080;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));