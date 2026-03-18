import { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import "./App.css";

function App() {
  const [data, setData] = useState({
    A: "",
    B: "",
    C: "",
    D: ""
  });

  const [activeRoad, setActiveRoad] = useState(null);
  const [timer, setTimer] = useState(0);
  const [queue, setQueue] = useState([]);
  const [report, setReport] = useState("");

  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);

  const [emergency, setEmergency] = useState("");

  const intervalRef = useRef(null);
  const indexRef = useRef(0);

  // Input
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // 🚑 Emergency priority
  const handleEmergency = (road) => {
    setEmergency(road);

    clearInterval(intervalRef.current);

    setActiveRoad(road);
    setTimer(10); // fixed emergency time

    let t = 10;

    intervalRef.current = setInterval(() => {
      t--;
      setTimer(t);

      if (t <= 0) {
        clearInterval(intervalRef.current);
        setEmergency("");
        runCycle();
      }
    }, 1000);
  };

  // Start simulation
  const startSimulation = () => {
    const roads = ["A", "B", "C", "D"];

    const sorted = roads.sort(
      (r1, r2) => (data[r2] || 0) - (data[r1] || 0)
    );

    setQueue(sorted);
    indexRef.current = 0;
    setRunning(true);
    setPaused(false);
  };

  const stopSimulation = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setTimer(0);
    setActiveRoad(null);
  };

  const pauseSimulation = () => {
    clearInterval(intervalRef.current);
    setPaused(true);
  };

  const resumeSimulation = () => {
    setPaused(false);
    runCycle();
  };

  // Core logic
  const runCycle = () => {
    if (emergency) return;

    const road = queue[indexRef.current];
    const vehicles = Number(data[road]) || 0;

    const greenTime = 10 + Math.floor(vehicles / 2);

    setActiveRoad(road);
    setTimer(greenTime);

    let t = greenTime;

    intervalRef.current = setInterval(() => {
      t--;
      setTimer(t);

      if (t <= 0) {
        clearInterval(intervalRef.current);

        indexRef.current =
          (indexRef.current + 1) % queue.length;

        runCycle();
      }
    }, 1000);
  };

  useEffect(() => {
    if (running && !paused && queue.length > 0) {
      runCycle();
    }

    return () => clearInterval(intervalRef.current);
  }, [running]);

  // 📄 Generate report
  const generateReport = () => {
    const roads = ["A", "B", "C", "D"];

    const sorted = roads.sort(
      (r1, r2) => (data[r2] || 0) - (data[r1] || 0)
    );

    let reportText = "Traffic Optimization Report\n\n";

    sorted.forEach((road, index) => {
      const vehicles = Number(data[road]) || 0;
      const time = 10 + Math.floor(vehicles / 2);

      reportText += `Cycle ${index + 1}:\n`;
      reportText += `Road: ${road}\n`;
      reportText += `Vehicles: ${vehicles}\n`;
      reportText += `Green Time: ${time}s\n\n`;
    });

    setReport(reportText);
  };

  const downloadPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Traffic Signal Optimization Report", 20, 20);

  doc.setFontSize(12);

  let y = 30;

  const lines = report.split("\n");

  lines.forEach((line) => {
    doc.text(line, 20, y);
    y += 7;
  });

  doc.save("Traffic_Report.pdf");
};

  return (
    <div className="app">

      <h1 className="title">🚦 Traffic Signal Optimizer</h1>

      <div className="container">

        {/* LEFT */}
        <div className="left">

          <div className="inputs">
            {["A", "B", "C", "D"].map((road) => (
              <div key={road}>
                <label>Road {road}</label>
                <input
                  type="number"
                  name={road}
                  value={data[road]}
                  onChange={handleChange}
                />

                {/* Emergency Button */}
                <button
                  onClick={() => handleEmergency(road)}
                  style={{ marginTop: "5px", background: "red", color: "white" }}
                >
                  🚑 Emergency
                </button>
              </div>
            ))}
          </div>

          <div className="buttons">
            <button onClick={startSimulation}>Start 🚦</button>
            <button onClick={pauseSimulation}>Pause</button>
            <button onClick={resumeSimulation}>Resume</button>
            <button onClick={stopSimulation}>Stop</button>
            <button onClick={generateReport}>Report 📄</button>
            <button onClick={downloadPDF}>Download PDF 📥</button>
          </div>

          <h3>⏱ Timer: {timer}s</h3>
          <h3>🚥 Active Road: {activeRoad}</h3>

          <div className="result">
            <pre>{report}</pre>
          </div>

        </div>

        {/* RIGHT */}
        <div className="right">
          <div className="intersection">

            <div className="road vertical"></div>
            <div className="road horizontal"></div>

            {["A","B","C","D"].map((r) => (
              <div key={r} className={`signal ${r}`}>
                <div className={`light ${
                  activeRoad === r ? "green" : "red"
                }`}></div>
              </div>
            ))}

          </div>
        </div>

      </div>

    </div>
  );
}

export default App;