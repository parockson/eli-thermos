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

const birdLabels = ["A1","C1","E1","A4","C4","E4","E7","C7","A7"];

const birdTemperatureTable = {
  A1: [
    { from: "A1", to: "A2", ambient: 40.3, internal: 40.3 },
    { from: "A2", to: "alpha4", ambient: 40.3, internal: 40 }
  ],
  C1: [
    { from: "C1", to: "C2", ambient: 40.3, internal: 40.3 },
    { from: "C2", to: "alpha4", ambient: 40, internal: 40.3 }
  ],
  E1: [
    { from: "E1", to: "E2", ambient: 40.3, internal: 40.3 },
    { from: "E2", to: "alpha3", ambient: 40, internal: 40.3 }
  ],
  A4: [
    { from: "A4", to: "A5", ambient: 40.3, internal: 40.3 },
    { from: "A5", to: "alpha2", ambient: 40, internal: 40.3 }
  ],
  C4: [
    { from: "C4", to: "C5", ambient: 40.3, internal: 40.3 },
    { from: "C5", to: "alpha3", ambient: 40, internal: 40.3 }
  ],
  E4: [
    { from: "E4", to: "E5", ambient: 40.3, internal: 40.3 },
    { from: "E5", to: "alpha2", ambient: 40, internal: 40.3 }
  ],
  E7: [
    { from: "E7", to: "E6", ambient: 40.3, internal: 40.3 },
    { from: "E6", to: "alpha1", ambient: 35.3, internal: 35.3 }
  ],
  C7: [
    { from: "C7", to: "C6", ambient: 40.3, internal: 40.3 },
    { from: "C6", to: "alpha1", ambient: 35.3, internal: 35.3 }
  ],
  A7: [
    { from: "A7", to: "A6", ambient: 40.3, internal: 40.3 },
    { from: "A6", to: "alpha1", ambient: 35.3, internal: 35.3 }
  ]
};

function App() {
  const [clockState, setClockState] = useState({
    birds: Array(9).fill().map(() => ({
      internalTemperature: null,
      internalResistance: null
    })),
    timeIndex: 0,
    event: null
  });

  const [modal, setModal] = useState({
    open: false,
    title: "",
    content: ""
  });

  const [lastMove, setLastMove] = useState(null);

  return (
    <div>
      <Taskbar />
      <div className="container">
        <div className="left">
          <OtherButtons setClockState={setClockState} setModal={setModal} />

          <Clock clockState={clockState} />

          <CalculationPanel clockState={clockState} lastMove={lastMove} />
        </div>

        <div className="center">
          <Grid
            onBirdMove={(move) => {
              setLastMove(move);

              const birdIndex = birdLabels.indexOf(move.bird);
              if (birdIndex === -1) return;

              const steps = birdTemperatureTable[move.bird];
              const stepIndex = steps.findIndex(
                s => s.from === move.fromLabel && s.to === move.toLabel
              );
              const stepData = steps[stepIndex] || steps[0];

              setClockState(prev => {
                const updated = [...prev.birds];
                updated[birdIndex] = {
                  internalTemperature: stepData.internal,
                  internalResistance: stepData.internal
                };

                return {
                  ...prev,
                  birds: updated,
                  timeIndex: birdIndex,
                  event: move
                };
              });
            }}
          />
        </div>

        <div className="right">
          <TemperatureReadings value={null} />
          <ResistanceReadings value={null} />
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
