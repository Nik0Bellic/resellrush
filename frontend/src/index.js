import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import store from './store';
import './index.css';
import App from './App';
import PrivateRoute from './components/PrivateRoute';
import SellRoute from './components/SellRoute';
import AdminRoute from './components/AdminRoute';
import HomeScreen from './screens/HomeScreen';
import AboutScreen from './screens/AboutScreen';
import SupportScreen from './screens/SupportScreen';
import ProductScreen from './screens/ProductScreen';
import ProfileScreen from './screens/ProfileScreen';
import ProfileBuyingScreen from './screens/ProfileBuyingScreen';
import ProfileSellingScreen from './screens/ProfileSellingScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import BuyScreen from './screens/BuyScreen';
import PlaceBidScreen from './screens/PlaceBidScreen';
import SellScreen from './screens/SellScreen';
import PlaceAskScreen from './screens/PlaceAskScreen';
import DealListScreen from './screens/admin/DealListScreen';
import DealScreen from './screens/DealScreen';
import ProductListScreen from './screens/admin/ProductListScreen';
import ProductCreateScreen from './screens/admin/ProductCreateScreen';
import ProductEditScreen from './screens/admin/ProductEditScreen';
import UserListScreen from './screens/admin/UserListScreen';
import UserEditScreen from './screens/admin/UserEditScreen';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} path='/' element={<HomeScreen />} />
      <Route path='/search/:keyword' element={<HomeScreen />} />
      <Route path='/page/:pageNumber' element={<HomeScreen />} />
      <Route
        path='/search/:keyword/page/:pageNumber'
        element={<HomeScreen />}
      />
      <Route path='/about' element={<AboutScreen />} />
      <Route path='/support' element={<SupportScreen />} />
      <Route path='/:productId' element={<ProductScreen />} />
      <Route path='/buy/:productId' element={<BuyScreen />} />
      <Route path='/favorites' element={<FavoritesScreen />} />

      <Route path='' element={<PrivateRoute />}>
        <Route path='/buy/:productId/placeBid' element={<PlaceBidScreen />} />
        <Route path='/deal/:id' element={<DealScreen />} />
        <Route path='/profile' element={<ProfileScreen />} />
        <Route path='/profile/buying' element={<ProfileBuyingScreen />} />
        <Route path='/profile/selling' element={<ProfileSellingScreen />} />
      </Route>

      <Route path='' element={<SellRoute />}>
        <Route path='/sell/:productId' element={<SellScreen />} />
        <Route path='/sell/:productId/placeAsk' element={<PlaceAskScreen />} />
      </Route>

      <Route path='' element={<AdminRoute />}>
        <Route path='/admin/dealList' element={<DealListScreen />} />
        <Route path='/admin/productList' element={<ProductListScreen />} />
        <Route
          path='/admin/productList/:pageNumber'
          element={<ProductListScreen />}
        />
        <Route path='/admin/createProduct' element={<ProductCreateScreen />} />
        <Route
          path='/admin/product/:productId/edit'
          element={<ProductEditScreen />}
        />
        <Route path='/admin/userList' element={<UserListScreen />} />
        <Route path='/admin/user/:id/edit' element={<UserEditScreen />} />
      </Route>
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <PayPalScriptProvider deferLoading={true}>
          <RouterProvider router={router} />
        </PayPalScriptProvider>
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
);
