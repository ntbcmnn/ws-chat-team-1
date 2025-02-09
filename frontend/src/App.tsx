import './App.css';
import Toolbar from './components/UI/Toolbar/Toolbar.tsx';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './containers/LoginPage/LoginPage.tsx';
import RegisterPage from './containers/RegisterPage/RegisterPage.tsx';
import Home from './containers/Home/Home.tsx';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.tsx';
import { useAppSelector } from './app/hooks.ts';
import { selectUser } from './store/slices/usersSlice.ts';

const App = () => {
  const user = useAppSelector(selectUser);

  return <>
    <Toolbar/>
    <div className="container my-5">
      <Routes>
        <Route path="/"
               element={
                 <ProtectedRoute
                   isAllowed={user && user.role === 'user'}
                 >
                   <Home/>
                 </ProtectedRoute>
               }
        />
        <Route path="/chat"
               element={
                 <ProtectedRoute
                   isAllowed={user && user.role === 'user'}
                 >
                   <Home/>
                 </ProtectedRoute>
               }
        />

        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="*" element={<h2 className="text-center">Page not found</h2>}/>
      </Routes>
    </div>
  </>;
};

export default App;
