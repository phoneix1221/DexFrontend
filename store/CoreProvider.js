import { StoreProvider } from 'easy-peasy';
import { store } from './stores';
const CoreProvider = ({ children }) => (
    <StoreProvider store={store}>{ children }</StoreProvider>
  );