import logo from './logo.svg';
import './App.css';
import LoginPage from './pages/LoginPage';
import Dashboard from './components/Dashboard';
import { Routes ,Route } from 'react-router-dom';

function App() {

  const token = localStorage.getItem('token');

  return (
    <div className="App">
    {token ? <Dashboard/> : <LoginPage/>}

    
    
      
    </div>
  );
}

export default App;
