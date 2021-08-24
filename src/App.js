import "./App.css";
import { Typography } from "@material-ui/core";
import { TableMainContainer } from "./components/tableContainer/TableMainContainer";

function App() {
  return (
    <div className="App">
      <Typography variant="h2">Hotel review App</Typography>
      <TableMainContainer />
    </div>
  );
}

export default App;
