import {React, useEffect, useState} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import useWindowSize from './hooks/useWindow';
import { Route, Routes } from 'react-router-dom';
import { SearchClient as TypesenseSearchClient } from "typesense";

import ClusterInserts from './components/ClusterInserts';
import RetailerSeeMoreRecommendations from './pages/RetailerSeeMoreRecommendations';
import SearchResults from './pages/SearchResults';
import UserOnboarding from './pages/UserOnboarding';
import TailorAI from './pages/TailorAIHome';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';



function App() {


  const width = useWindowSize().width
  const height = useWindowSize().height
  const [model_initialiser, set_model_initialiser] = useState(0)

  let client = new TypesenseSearchClient({
    'nodes': [{
      'host': 'j1e5iohdgu2ya7nqp-1.a1.typesense.net', // For Typesense Cloud use xxx.a1.typesense.net
      'port': '443',      // For Typesense Cloud use 443
      'protocol': 'https'   // For Typesense Cloud use https
    }],
    'apiKey': 'qVEACzIepH6miYVADVgngiTOZOjxjKiR',
    'connectionTimeoutSeconds': 2
  })

  
  return (
    <div style={{"width": width}} className="App">

      <Routes>
        <Route path="/" element={<UserOnboarding />}/>

        <Route path="/search-results/:id" element={<SearchResults/>}/>

        <Route path="/cluster-inserts" element={<ClusterInserts/>}/>
        <Route path="/home/:id" element={<TailorAI/>} />

        <Route path="/signup" element={<SignUp/>} />
        <Route path="/login" element={<Login/>} />

        <Route path="/forgot-password" element={<ForgotPassword/>} />

        <Route path="/recommendation-results/:id" element={<RetailerSeeMoreRecommendations/>} />



      </Routes>
      
    </div>
  );
}

export default App;
