import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.css'; 
import { useEffect } from 'react';
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer';
import { StoreProvider } from 'easy-peasy';
import { createStore,action } from 'easy-peasy';
import store from '../store/stores';
function MyApp({ Component, pageProps }) {

 




  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");
  }, []);
  return <StoreProvider store={store}>
  <Header  {...pageProps}/>
  <Component {...pageProps} />
  <Footer/>
  </StoreProvider>
  
}

export default MyApp
