import Survey from "./components/Survey";
import { survey } from "./survey_model";
require('dotenv').config()

function App() {

  return <Survey  {...survey} />;

}

export default App;
