import './App.css';
import Toolbar from './components/UI/Toolbar/Toolbar.tsx';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './containers/LoginPage/LoginPage.tsx';
import RegisterPage from './containers/RegisterPage/RegisterPage.tsx';


const App = () => {
  return <>
    <Toolbar/>
    <div className="container my-5">
      <Routes>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="*" element={<h2 className="text-center">Page not found</h2>}/>
      </Routes>
    </div>
  </>;
};

export default App;
