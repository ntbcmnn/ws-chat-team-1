import './App.css';
import Toolbar from './components/UI/Toolbar/Toolbar.tsx';
import { Route, Routes } from 'react-router-dom';

const App = () => {
  return <>
    <Toolbar/>
    <div className="container my-5">
      <Routes>
        <Route path="*" element={<h2 className="text-center">Page not found</h2>}/>
      </Routes>
    </div>
  </>;
};

export default App;
