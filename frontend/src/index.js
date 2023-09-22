import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { Provider } from 'react-redux';
import store from './store';
import './index.css';
import App from './App';
import PrivateRoute from './components/PrivateRoute';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import ProfileScreen from './screens/ProfileScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import BuyScreen from './screens/BuyScreen';
import ShippingScreen from './screens/ShippingScreen';
import OrderScreen from './screens/OrderScreen';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} path='/' element={<HomeScreen />} />
      <Route path='/:productId' element={<ProductScreen />} />
      <Route path='/buy/:productId' element={<BuyScreen />} />
      <Route path='/favorites' element={<FavoritesScreen />} />

      <Route path='' element={<PrivateRoute />}>
        <Route path='/buy/:productId/shipping' element={<ShippingScreen />} />
        <Route path='/profile' element={<ProfileScreen />} />
        <Route path='/order/:id' element={<OrderScreen />} />
      </Route>
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PayPalScriptProvider deferLoading={true}>
        <RouterProvider router={router} />
      </PayPalScriptProvider>
    </Provider>
  </React.StrictMode>
);
