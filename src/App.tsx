import { useState } from "react";
import "./App.css";
import ColoredLineChart from "./components/ColoredLineChart";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <ColoredLineChart />
    </>
  );
}

export default App;
