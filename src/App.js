import { useState } from "react";
import Taskbar from "./components/Taskbar";
import OtherButtons from "./components/OtherButtons";
import Clock from "./components/Clock";
import CalculationPanel from "./components/CalculationPanel";
import Grid from "./components/Grid";
import TemperatureReadings from "./components/TemperatureReadings";
import ResistanceReadings from "./components/ResistanceReadings";
import Modal from "./components/Modal";
import "./index.scss";

function App() {
  const [clockState, setClockState] = useState({
    mode: "temperature",
    timeIndex: 0,
    temperatureValue: 25,
    resistanceValue: 10,
    event: null,
  });

  // Modal state
  const [modal, setModal] = useState({
    open: false,
    title: "",
    content: ""
  });

  // ----------------------------
  // Last bird movement state
  // ----------------------------
  const [lastMove, setLastMove] = useState(null);

  return (
    <div>
      <Taskbar />
      <div className="container">
        <div className="left">
          <OtherButtons 
            setClockState={setClockState} 
            setModal={setModal}
          />

          <Clock clockState={clockState} setClockState={setClockState} />

          {/* Pass lastMove to CalculationPanel */}
          <CalculationPanel clockState={clockState} lastMove={lastMove} />
        </div>

        <div className="center">
          {/* Pass setLastMove callback to Grid */}
          <Grid clockState={clockState} onBirdMove={setLastMove} />
        </div>

        <div className="right">
          <TemperatureReadings value={clockState.temperatureValue} />
          <ResistanceReadings value={clockState.resistanceValue} />
        </div>
      </div>

      <Modal
        isOpen={modal.open}
        title={modal.title}
        content={modal.content}
        onClose={() => setModal({ open: false, title: "", content: "" })}
      />
    </div>
  );
}

export default App;
