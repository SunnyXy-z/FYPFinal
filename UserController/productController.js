const productModel = require("../models/productModel.js");
const categoryModel = require("../models/Categorymodels.js");
const orderModel = require("../models/orderModel.js");
const fs = require("fs");
const slugify = require("slugify");
const braintree = require("braintree");
// const braintree = require("braintree");
const dotenv = require("dotenv");

dotenv.config();

//payment Gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});


// Create Product

const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, size, photo, modelURL, viewerURL } = req.body;

    // Validate required fields
    switch (true) {
      case !name:
        return res.status(400).send({ error: "Name is Required" });
      case !description:
        return res.status(400).send({ error: "Description is Required" });
      case !price:
        return res.status(400).send({ error: "Price is Required" });
      case !category:
        return res.status(400).send({ error: "Category is Required" });
      case !size:
        return res.status(400).send({ error: "Size is Required" });
    }

    // Create product
    const product = new productModel({
      name,
      description,
      price,
      category,
      size,
      slug: slugify(name),
      photo: Array.isArray(photo) ? photo : [],
      modelURL,
      viewerURL: viewerURL || "",  // <-- added here
    });

    await product.save();

    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in creating product",
      error: error.message,
    });
  }
};


// Get All Products
const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .limit(12)
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      counTotal: products.length,
      message: "All Products",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting products",
      error: error.message,
    });
  }
};


// Get Single Product
const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .populate("category"); // removed .select("-photo")

    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting single product",
      error,
    });
  }
};
/*
//get product photo
const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");

    const index = req.params.index || 0;

    if (product.photo && product.photo.length > index) {
      return res.status(200).send({
        success: true,
        url: product.photo[index], // now it's a string (URL)
      });
    } else {
      return res.status(404).send({
        success: false,
        message: "Photo not found at specified index",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting photo",
      error,
    });
  }
};

*/

// Delete Product
const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Product Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
};
// update product controller
const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, size, modelURL, photo, viewerURL } = req.body;

    // Validation
    switch (true) {
      case !name:
        return res.status(400).send({ error: "Name is Required" });
      case !description:
        return res.status(400).send({ error: "Description is Required" });
      case !price:
        return res.status(400).send({ error: "Price is Required" });
      case !category:
        return res.status(400).send({ error: "Category is Required" });
      case !size:
        return res.status(400).send({ error: "Size is Required" });
    }

    const product = await productModel.findByIdAndUpdate(
      req.params.pid,
      {
        name,
        description,
        price,
        category,
        size,
        modelURL,   // ✅ new field
        slug: slugify(name),
        viewerURL: viewerURL || "",
      },
      { new: true }
    );

    if (photo) {
      product.photo = Array.isArray(photo)
        ? photo.map((url) => ({ url }))
        : [{ url: photo }];
    }

    await product.save();

    res.status(200).send({
      success: true,
      message: "Product Updated Successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in updating product",
      error: error.message,
    });
  }
};


// filters
const productFiltersController = async (req, res) => {
  try {
    const { checked } = req.body; // radio removed
    let args = {};
    if (checked.length > 0) args.category = checked;

    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error While Filtering Products",
      error,
    });
  }
};


// Product Count
const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in product count",
      error,
      success: false,
    });
  }
};

// Product List by Page
const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .populate('category')
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in pagination",
      error,
    });
  }
};


// Search Product
const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
          { size: { $regex: keyword, $options: "i" } }, // size field ko bhi search me include kar diya
        ],
      })
      .populate("category"); // category ko populate kiya for more info
    res.status(200).json({
      success: true,
      results,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in search product API",
      error,
    });
  }
};


// Related Products
const realtedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid }, // Exclude the current product
      })
      .select("name slug description price size photo modelURL") // select important fields, don't select all
      .limit(3)
      .populate("category", "name"); // populate only the category name

    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while getting related products",
      error,
    });
  }
};


// Get Products by Category
const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error while getting category-wise products",
    });
  }
};


// const braintreeTokenController = () => { };
// const brainTreePaymentController = () => { };

// Braintree Payment (optional features)

const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const brainTreePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: { submitForSettlement: true },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};


module.exports = {
  createProductController,
  deleteProductController,
  getProductController,
  getSingleProductController,
  productCategoryController,
  productCountController,
  productFiltersController,
  productListController,
  // productPhotoController,
  realtedProductController,
  searchProductController,
  updateProductController,
  braintreeTokenController,
  brainTreePaymentController,
};
