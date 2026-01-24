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

// Birds
const birdLabels = ["W1","W2","W3","W4","W5","W6","W7","W8","W9"];

// Metrics for birds by season
const birdMetrics = {
  W1: { 1: { internal: 40.3, ambient: 30, resistance: 8037.15 },
        2: { internal: 30.3, ambient: 35.3, resistance: 6424.93 },
        3: { internal: 40.3, ambient: 40, resistance: 5237.85 } },
  W2: { 1: { internal: 40.3, ambient: 30, resistance: 8037.15 },
        2: { internal: 30, ambient: 35.3, resistance: 6424.93 },
        3: { internal: 40.3, ambient: 40, resistance: 5237.85 } },
  W3: { 1: { internal: 40.3, ambient: 30, resistance: 8037.15 },
        2: { internal: 30, ambient: 35.3, resistance: 6424.93 },
        3: { internal: 40.3, ambient: 40, resistance: 5237.85 } },
  W4: { 1: { internal: 40.3, ambient: 30, resistance: 8037.15 },
        2: { internal: 30, ambient: 35.3, resistance: 6424.93 },
        3: { internal: 40.3, ambient: 40, resistance: 5237.85 } },
  W5: { 1: { internal: 40.3, ambient: 30, resistance: 8037.15 },
        2: { internal: 35.3, ambient: 35.3, resistance: 6424.93 },
        3: { internal: 40.3, ambient: 40, resistance: 5237.85 } },
  W6: { 1: { internal: 40.3, ambient: 30, resistance: 8037.15 },
        2: { internal: 35.3, ambient: 30, resistance: 80.37 },
        3: { internal: 40.3, ambient: 40, resistance: 5237.85 } },
  W7: { 1: { internal: 40.3, ambient: 30, resistance: 8037.15 },
        2: { internal: 35.3, ambient: 30, resistance: 80.37 },
        3: { internal: 40.3, ambient: 40, resistance: 5237.85 } },
  W8: { 1: { internal: 40.3, ambient: 30, resistance: 8037.15 },
        2: { internal: 35.3, ambient: 30, resistance: 80.37 },
        3: { internal: 40.3, ambient: 40, resistance: 5237.85 } },
  W9: { 1: { internal: 40.3, ambient: 35.3, resistance: 6424.93 },
        2: { internal: 35.3, ambient: 30, resistance: 80.37 },
        3: { internal: 40.3, ambient: 40, resistance: 5237.85 } },
};

export default function App() {
  const [activeSeason, setActiveSeason] = useState(null);
  const [ambientTemp, setAmbientTemp] = useState(null);
  const [resistanceMap, setResistanceMap] = useState({});
  const [nodeColor, setNodeColor] = useState(null); // ✅ added
  const [modal, setModal] = useState({ open: false, title: "", content: "" });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingSeason, setPendingSeason] = useState(null);

  const [clockState, setClockState] = useState({
    birds: Array(9).fill().map(() => ({ internalTemperature: null, internalResistance: null })),
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
      resetBirds();
    }
  };

  const resetBirds = () => {
    setClockState({
      birds: Array(9).fill().map(() => ({ internalTemperature: null, internalResistance: null })),
      timeIndex: 0,
      event: null
    });
    setAmbientTemp(null);
    setResistanceMap({});
    setNodeColor(null); // ✅ reset colour
  };

  const confirmSeasonChange = () => {
    setActiveSeason(pendingSeason);
    setPendingSeason(null);
    setConfirmOpen(false);
    resetBirds();
  };

  // ─────────────────────────────
  // Handle bird movement
  // ─────────────────────────────
  const handleBirdMove = (move) => {
    const birdIndex = birdLabels.indexOf(move.bird);
    if (birdIndex === -1) return;

    const seasonNum = activeSeason?.replace("season", "");
    const metrics =
      birdMetrics[move.bird]?.[seasonNum] || {
        internal: null,
        ambient: null,
        resistance: null
      };

    setClockState(prev => {
      const birds = [...prev.birds];
      birds[birdIndex] = {
        internalTemperature: metrics.internal,
        internalResistance: metrics.resistance
      };
      return { ...prev, birds, timeIndex: birdIndex, event: move };
    });

    setAmbientTemp(metrics.ambient);
    setResistanceMap(prev => ({ ...prev, [move.bird]: metrics.resistance }));
    setNodeColor(move.nodeColor); // ✅ landed node colour
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
            key={activeSeason}
            activeSeason={activeSeason}
            onBirdMove={handleBirdMove}
            resistanceMap={resistanceMap}
          />
        </div>

        <div className="right">
          <ResistanceReadings
            value={clockState.birds[clockState.timeIndex]?.internalResistance}
            color={nodeColor}
          />
          <Clock clockState={clockState} />
          <TemperatureReadings value={ambientTemp} />
        </div>
      </div>

      <Modal
        isOpen={modal.open}
        title={modal.title}
        content={modal.content}
        onClose={() => setModal({ open: false, title: "", content: "" })}
      />

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
