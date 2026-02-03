import React from 'react';
import { useSelector } from 'react-redux';
import RouterPage from './components/Global/RouterPage';
import PageLoader from './components/Global/PageLoader';
import { ToastContainer } from 'react-toastify';

const App = () => {
  const { isLoading } = useSelector((state) => state.loading);
  const theme = useSelector((state)=> state?.toggleThemeSlice?.theme);

  return (
    <div className={`${theme}`}>
      {isLoading && <PageLoader />}
      <ToastContainer />
      <RouterPage />  
    </div>
  );
};

export default App;
