import Survey from "./components/Survey";
import { survey } from "./survey_model";
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Error from "./components/Error";

function App() {

  return <Router>
    <Routes>
      <Route path="/" element={<Survey  {...survey} />} />
      <Route path="/error" element={<Error />} />
    </Routes>
  </Router>

}

export default App;
