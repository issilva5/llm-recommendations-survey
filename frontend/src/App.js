import Survey from "./components/Survey";
import { survey } from "./survey_model";
import React, { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

function App() {

  useEffect(() => {
    let sessionId = localStorage.getItem('llm_rec_session_id');
    if (!sessionId) {
      sessionId = uuidv4();
      localStorage.setItem('llm_rec_session_id', sessionId);
    }
  }, []);

  return <Survey  {...survey} />;

}

export default App;
