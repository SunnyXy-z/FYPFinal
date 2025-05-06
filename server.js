const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require("./config/db");
const authRoute = require('./Routes/userRoutes');
const categoryRoutes = require('./Routes/CategoryRoutes.js');
const productRoutes = require('./Routes/productRoutes.js');
dotenv.config();


connectDB();
const app = express()

//middleware
app.use(cors());
app.use(express.json())
app.use(morgan('dev'))

app.use("/api/auth", authRoute);
app.use("/api/category", categoryRoutes)
app.use("/api/product", productRoutes)
app.get('/', (req, res) => {
    res.send({
        message: 'welcome to buildsmart'
    })
})

const PORT = process.env.PORT || 8080;
//app run karni

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

})