import './App.css';
import {useState,useEffect} from 'react'
import Header from './layout/Header/Header';
import { BrowserRouter  as Router, Route,Switch} from 'react-router-dom';
import WebFont from 'webfontloader';
import React from 'react';
import Footer from './layout/Footer/Footer';
import Home from './component/Home/Home';
import ProductDetails  from './component/Home/Product/ProductDetails';
import Products from './component/Home/Product/Products';
import Search from './component/Home/Product/Search';
import LoginSignUp from './component/Home/User/LoginSignUp';
import store from './store';
import { loadUser } from './actions/userAction';
import UserOptions from './layout/Header/UserOptions';
import { useSelector } from 'react-redux';
import Profile from './component/Home/User/Profile';
import ProtectedRoute from './component/Home/Route/ProtectedRoute';
import UpdateProfile from './component/Home/User/UpdateProfile';
import UpdatePassword from './component/Home/User/UpdatePassword';
import ForgotPassword from './component/Home/User/ForgotPassword';
import Cart from './component/Home/Cart/Cart';
import Shipping from './component/Home/Cart/Shipping';
import ConfirmOrder from './component/Home/Cart/ConfirmOrder';
import axios from 'axios';
import Payment from './component/Home/Cart/Payment';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import OrderSuccess from './component/Home/Cart/OrderSuccess';
import MyOrders from './component/Home/Order/MyOrders';
import OrderDetails from './component/Home/Order/OrderDetails';
import Dashboard from './component/Home/admin/Dashboard';
import ProductList from './component/Home/admin/ProductList';
import NewProduct from './component/Home/admin/NewProduct';
import UpdateProduct from './component/Home/admin/UpdateProduct';
import OrderList from './component/Home/admin/OrderList';
import ProcessOrder from './component/Home/admin/ProcessOrder';
import UsersList from './component/Home/admin/UsersList';
import UpdateUser from './component/Home/admin/UpdateUser';
import ProductReviews from './component/Home/admin/ProductReviews';
import Contact from './layout/Contact/Contact';
import About from './layout/About/About';



function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    const { data } = await axios.get("/api/v1/stripeapikey");

    setStripeApiKey(data.stripeApiKey);
  }

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });

    store.dispatch(loadUser());

    getStripeApiKey();
  }, []);

 

  return (
    <Router>
      <Header />

      {isAuthenticated && <UserOptions user={user} />}

      {stripeApiKey && (
        <Elements stripe={loadStripe(stripeApiKey)}>
          <ProtectedRoute exact path="/process/payment" component={Payment} />
        </Elements>
      )}

      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/product/:id" component={ProductDetails} />
        <Route exact path="/products" component={Products} />
        <Route path="/products/:keyword" component={Products} />

        <Route exact path="/search" component={Search} />
        <Route exact path="/contact" component={Contact} />
        
        <Route exact path="/about" component={About} />

        

        

        <ProtectedRoute exact path="/account" component={Profile} />

        <ProtectedRoute exact path="/me/update" component={UpdateProfile} />

        <ProtectedRoute
          exact
          path="/password/update"
          component={UpdatePassword}
        />

        <Route exact path="/password/forgot" component={ForgotPassword} />

        

        <Route exact path="/login" component={LoginSignUp} />

        <Route exact path="/cart" component={Cart} />

        <ProtectedRoute exact path="/shipping" component={Shipping} />

        <ProtectedRoute exact path="/success" component={OrderSuccess} />

        <ProtectedRoute exact path="/orders" component={MyOrders} />

        <ProtectedRoute exact path="/order/confirm" component={ConfirmOrder} />

        <ProtectedRoute exact path="/order/:id" component={OrderDetails} />

        <ProtectedRoute
          isAdmin={true}
          exact
          path="/admin/dashboard"
          component={Dashboard}
        />
        <ProtectedRoute
          exact
          path="/admin/products"
          isAdmin={true}
          component={ProductList}
        />
        <ProtectedRoute
          exact
          path="/admin/product"
          isAdmin={true}
          component={NewProduct}
        />

        <ProtectedRoute
          exact
          path="/admin/product/:id"
          isAdmin={true}
          component={UpdateProduct}
        />
        <ProtectedRoute
          exact
          path="/admin/orders"
          isAdmin={true}
          component={OrderList}
        />

        <ProtectedRoute
          exact
          path="/admin/order/:id"
          isAdmin={true}
          component={ProcessOrder}
        />
        <ProtectedRoute
          exact
          path="/admin/users"
          isAdmin={true}
          component={UsersList}
        />

        <ProtectedRoute
          exact
          path="/admin/user/:id"
          isAdmin={true}
          component={UpdateUser}
        />

        <ProtectedRoute
          exact
          path="/admin/reviews"
          isAdmin={true}
          component={ProductReviews}
        />

        {/* <Route
          component={
            window.location.pathname === "/process/payment" ? null : NotFound
          }
        /> */}
      </Switch>

      <Footer />
    </Router>
  );
}

export default App;