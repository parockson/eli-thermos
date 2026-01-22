import { useState } from "react";
import Taskbar from "./components/Taskbar";
import Clock from "./components/Clock";
import Grid from "./components/Grid";
import TemperatureReadings from "./components/TemperatureReadings";
import ResistanceReadings from "./components/ResistanceReadings";
import Modal from "./components/Modal";
import QuickModal from "./components/QuickModal";
import Quiz from "./components/Quiz";
import QuickControls from "./components/QuickControls";
import "./index.scss";

const birdLabels = ["A1","C1","E1","A4","C4","E4","E7","C7","A7"];

const birdTemperatureTable = {
  A1: [
    { from: "A1", to: "A2", ambient: 40.3, internal: 40.3, resistance: 5238 },
    { from: "A2", to: "alpha2", ambient: 30, internal: 40.3, resistance: 5238 }
  ],
  C1: [
    { from: "C1", to: "C2", ambient: 40.3, internal: 40.3, resistance: 5238 }
  ],
  E1: [
    { from: "E1", to: "E2", ambient: 40.3, internal: 40.3, resistance: 5238 },
    { from: "E2", to: "alpha3", ambient: 30, internal: 40.3, resistance: 5238 }
  ],
  A4: [{ from: "A4", to: "A4", ambient: 40, internal: 40.3, resistance: 5238 }],
  C4: [{ from: "C4", to: "C4", ambient: 40, internal: 40.3, resistance: 5238 }],
  E4: [{ from: "E4", to: "E4", ambient: 40, internal: 40.3, resistance: 5238 }],
  E7: [
    { from: "E7", to: "E6", ambient: 40.3, internal: 40.3, resistance: 5238 },
    { from: "E6", to: "alpha4", ambient: 30, internal: 40.3, resistance: 5238 }
  ],
  C7: [
    { from: "C7", to: "C6", ambient: 40.3, internal: 40.3, resistance: 5238 }
  ],
  A7: [
    { from: "A7", to: "A6", ambient: 40.3, internal: 40.3, resistance: 5238 },
    { from: "A6", to: "alpha1", ambient: 30, internal: 40.3, resistance: 5238 }
  ]
};

export default function App() {
  const [activeSeason, setActiveSeason] = useState(null);

  const [ambientTemp, setAmbientTemp] = useState(null);
  const [resistance, setResistance] = useState(null);
  const [resistanceColor, setResistanceColor] = useState("#9AD3A6");

  const [modal, setModal] = useState({ open: false, title: "", content: "" });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingSeason, setPendingSeason] = useState(null);

  const [clockState, setClockState] = useState({
    birds: Array(9).fill().map(() => ({
      internalTemperature: null,
      internalResistance: null
    })),
    timeIndex: 0,
    event: null
  });

  // ─────────────────────────────
  // Season selection handler
  // ─────────────────────────────
  const handleSeasonSelect = (season) => {
    if (activeSeason && activeSeason !== season) {
      setPendingSeason(season);
      setConfirmOpen(true);
    } else {
      setActiveSeason(season);
    }
  };

  const confirmSeasonChange = () => {
    setActiveSeason(pendingSeason);
    setPendingSeason(null);
    setConfirmOpen(false);

    // RESET birds & readings
    setClockState({
      birds: Array(9).fill().map(() => ({
        internalTemperature: null,
        internalResistance: null
      })),
      timeIndex: 0,
      event: null
    });

    setAmbientTemp(null);
    setResistance(null);
  };

  return (
    <div className="app-root">
      <video className="bg-video" autoPlay loop muted playsInline>
        <source src="/bg-bird.mp4" type="video/mp4" />
      </video>

      <Taskbar setModal={setModal} />

      <div className="container">
        <div className="left">
          <QuickControls
            activeSeason={activeSeason}
            onSelectSeason={handleSeasonSelect}
          />
          <Quiz />
        </div>

        <div className="center">
          <Grid
            key={activeSeason}   // forces reset on season change
            activeSeason={activeSeason}
            onBirdMove={(move) => {
              const birdIndex = birdLabels.indexOf(move.bird);
              if (birdIndex === -1) return;

              const steps = birdTemperatureTable[move.bird];
              const step =
                steps.find(
                  s =>
                    s.from === move.fromLabel &&
                    s.to === move.toLabel
                ) || steps[0];

              setClockState(prev => {
                const birds = [...prev.birds];
                birds[birdIndex] = {
                  internalTemperature: step.internal,
                  internalResistance: step.resistance
                };
                return {
                  ...prev,
                  birds,
                  timeIndex: birdIndex,
                  event: move
                };
              });

              setAmbientTemp(step.ambient);
              setResistance(step.resistance);
            }}
            onNodeColorChange={setResistanceColor}
          />
        </div>

        <div className="right">
          <ResistanceReadings value={resistance} color={resistanceColor} />
          <Clock clockState={clockState} />
          <TemperatureReadings value={ambientTemp} />
        </div>
      </div>

      {/* Existing informational modal */}
      <Modal
        isOpen={modal.open}
        title={modal.title}
        content={modal.content}
        onClose={() =>
          setModal({ open: false, title: "", content: "" })
        }
      />

      {/* Quick confirm modal */}
      <QuickModal
        open={confirmOpen}
        title="Change Season?"
        message="Continuing will reset the positions of all birds. Do you want to proceed?"
        onYes={confirmSeasonChange}
        onNo={() => {
          setPendingSeason(null);
          setConfirmOpen(false);
        }}
      />
    </div>
  );
}
