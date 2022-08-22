import {BrowserRouter, Routes, Route} from 'react-router-dom';

import './styles/global.scss';

import {Home} from './pages/home/home';
import {Profile} from './pages/profile/profile';

import {AuthProvider} from './contexts/authContext';
import {PrivateRoute} from './components/privateRoute/privateRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/profile' element={<PrivateRoute><Profile /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
