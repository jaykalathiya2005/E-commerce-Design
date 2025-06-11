import './App.css';
import 'react-phone-input-2/lib/style.css';
import { configureStore } from './Redux/Store';
import { SnackbarProvider } from 'notistack';
import Login from './Pages/Login';
import { Route, Routes } from 'react-router-dom';
import Alert from './Pages/Alert';
import { Provider } from 'react-redux';
import Home from './Pages/Home';
import AuthRoutes from './routes/AuthRoutes';
import Cart from './Pages/Cart';
import SingleDesignPage from './Pages/SingleDesignPage ';

function App() {
  const { store, persistor } = configureStore();
  return (
    <Provider store={store}>
      <SnackbarProvider
        maxSnack={3}
        autoHideDuration={3000}
      >
        <Alert />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/design/:id" element={<SingleDesignPage />} />
          <Route path="/*" element={<AuthRoutes />}></Route>
        </Routes>
      </SnackbarProvider>
    </Provider>
  );
}

export default App;
