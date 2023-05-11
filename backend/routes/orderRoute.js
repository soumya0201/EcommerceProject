const express=require("express");
const {newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder}=require("../controllers/orderController");
const router=express.Router();

const { isAuthenticatedUser ,authorizableRoles} = require("../middleware/auth");

router.route("/order/new").post(isAuthenticatedUser,newOrder);
router.route("/order/:id").get(isAuthenticatedUser,getSingleOrder);
router.route("/orders/me").get(isAuthenticatedUser,myOrders);

router.route("/admin/orders").get(isAuthenticatedUser,authorizableRoles("admin"),getAllOrders);
router.route("/admin/order/:id").put(isAuthenticatedUser,authorizableRoles("admin"),updateOrder).delete(isAuthenticatedUser,authorizableRoles("admin"),deleteOrder);



module.exports=router;