import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import useWindowSize from './hooks/useWindow';
import ItemSelection from './pages/ItemSelection';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import PreferenceSelection from './pages/PreferenceSelection';
import PersonalisedResults from './pages/PersonalisedResults';


function App() {


  const width = useWindowSize().width
  const height = useWindowSize().height

  
  return (
    <div style={{"width": width}} className="App">

      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/preference-selection/:id" element={<PreferenceSelection/>}/>
        <Route path="/personalised-results/:id" element={<PersonalisedResults/>}/>
      </Routes>
      
    </div>
  );
}

export default App;
