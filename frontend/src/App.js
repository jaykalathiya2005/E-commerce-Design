import './App.css';
import { configureStore } from './Redux/Store';
import { SnackbarProvider } from 'notistack';
import Login from './Pages/Login';
import { Route, Routes } from 'react-router-dom';
import Alert from './Pages/Alert';
import { Provider } from 'react-redux';
import Home from './Pages/Home';
import SingleDesignPage from './Pages/SingleDesignPage ';

function App() {
  const { store, persistor } = configureStore();
  return (
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={3000}
    >
      <Provider store={store}>
        <Alert />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/design/:id" element={<SingleDesignPage />} />
        </Routes>
      </Provider>
    </SnackbarProvider>
  );
}

export default App;
