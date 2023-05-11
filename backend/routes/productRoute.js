const express = require("express");
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview, getProductReviews, deleteReviews, getAdminProducts } = require("../controllers/productController");
const { isAuthenticatedUser ,authorizableRoles} = require("../middleware/auth");


const router = express.Router();

router.route("/products").get( getAllProducts);

router.route("/admin/products").get(isAuthenticatedUser,authorizableRoles("admin"),getAdminProducts);
router.route("/admin/product/new").post(isAuthenticatedUser,authorizableRoles("admin"), createProduct);
router.route("/admin/product/:id").put(isAuthenticatedUser,authorizableRoles("admin"), updateProduct)
.delete(isAuthenticatedUser,authorizableRoles("admin"), deleteProduct);
router.route("/product/:id").get(getProductDetails);

router.route("/review").put(isAuthenticatedUser,createProductReview);

router.route("/reviews").get(getProductReviews).delete(isAuthenticatedUser,deleteReviews);







module.exports = router;