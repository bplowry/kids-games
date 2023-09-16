import { useState } from "react";
import "./App.css";

const segments = Array.from({ length: 36 }, (_, i) => {
  if (i % 36 === 0) return "peachpuff";
  if (i % 12 === 0) return "pink";
  if (i % 8 === 0) return "palegreen";
  if (i % 6 === 0) return "lightcyan";
  if (i % 2 === 0) return "powderblue";
  return "thistle";
});
const degreesEach = 360 / segments.length;

function buildConicGradient(segments: string[]): string {
  return (
    "conic-gradient(" +
    `${segments[0]} ${degreesEach}deg` +
    segments
      .slice(1)
      .map(
        (s, i) =>
          `, ${s} ${(i + 1) * degreesEach}deg ${(i + 2) * degreesEach}deg`
      )
      .join("") +
    ")"
  );
}
const conicGradient = buildConicGradient(segments);

function numberBetween(start: number, end: number) {
  return start + Math.floor(Math.random() * (end - start));
}

function App() {
  const [angle, setAngle] = useState(-(degreesEach / 2));
  const spin = () => {
    setAngle((prev) => prev + numberBetween(1080, 1440));
  };

  return (
    <>
      <button onClick={spin}>Spin</button>
      <br />
      <br />
      <br />
      <div></div>
      <div style={{ position: "relative", width: 600, height: 50 }}>
        <div
          style={{
            position: "absolute",
            left: 280,
            top: 10,
            fontSize: 40,
            zIndex: 1,
          }}
        >
          👇
        </div>
      </div>
      <div
        style={{
          position: "relative",
          width: 600,
          height: 600,
          borderRadius: "50%",
          transition: "rotate 4s cubic-bezier(.6,-0.14,0,.99)",
          background: conicGradient,
          rotate: `${angle}deg`,
        }}
      ></div>
    </>
  );
}

export default App;
