import { useRef, useState } from "react";
import "./App.css";

type Marker = { x: number; y: number };

type PlayState = "sign-up" | "playing" | "done";
type PlayerScore = { player: string; score: number | null };

function numberBetween(inclusiveStart: number, exclusiveEnd: number): number {
  return (
    inclusiveStart + Math.floor(Math.random() * (exclusiveEnd - inclusiveStart))
  );
}

function getDistance(target: Marker, actual: Marker): number {
  const deltaX = target.x - actual.x;
  const deltaY = target.y - actual.y;
  return Math.floor(Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2)));
}

const windowHeight = 400;
const windowWidth = 800;
const padding = 50;

const getInitialPlayers = (): string[] => [];
const getInitialMarkers = (): Record<string, Marker> => ({});
const getInitialTarget = (): Marker => ({
  x: numberBetween(0 + padding, windowWidth - padding),
  y: numberBetween(0 + padding, windowHeight - padding),
});

function getScoreboard(
  players: string[],
  markers: Record<string, Marker>,
  target: Marker
): PlayerScore[] {
  return players
    .map<PlayerScore>((player) => ({
      player,
      score: markers[player] ? getDistance(target, markers[player]) : null,
    }))
    .sort((a, b) => {
      if (a.score == null) {
        return 1;
      }
      if (b.score == null) {
        return 1;
      }

      const scoreCompared = a.score - b.score;
      if (scoreCompared !== 0) {
        return scoreCompared;
      }

      // if scores are level, return alphabetical
      return a.player.localeCompare(b.player);
    });
}

function App() {
  const [players, setPlayers] = useState(getInitialPlayers());
  const [markers, setMarkers] = useState(getInitialMarkers());
  const [target, setTarget] = useState<Marker>(getInitialTarget());

  const [playState, setPlayState] = useState<PlayState>("sign-up");
  const [currentPlayer, setCurrentPlayer] = useState<string | null>(null);

  const windowRef = useRef<HTMLDivElement>(null);

  const scoreBoard = getScoreboard(players, markers, target);

  const addPlayer = (name: string) => {
    setPlayers((prev) => {
      if (players.includes(name)) return prev;
      return [...prev, name];
    });
  };

  const removePlayer = (name: string) => {
    setPlayers((prev) => prev.filter((x) => x !== name));
    setMarkers((prev) =>
      Object.fromEntries(Object.entries(prev).filter(([n]) => n !== name))
    );
  };

  const addMarker = (name: string, marker: Marker) => {
    setMarkers((prev) => ({ ...prev, [name]: marker }));

    // this is a bit hacky, but so what
    const updatedMarkers = { ...markers, [name]: marker };
    nextPlayer(updatedMarkers);
  };

  const nextPlayer = (updatedMarkers: Record<string, Marker>) => {
    const playersWithoutScore = players.filter((player) => {
      console.log("filter", {
        player,
        updatedMarkers,
        updatedMarkersPlayer: updatedMarkers[player],
      });
      return updatedMarkers[player] === undefined;
    });
    console.log("nextPlayer", {
      currentPlayer,
      updatedMarkers,
      markers,
      playersWithoutScore,
    });
    if (playersWithoutScore.length === 0) {
      setCurrentPlayer(null);
      setPlayState("done");
      return;
    }

    setCurrentPlayer(playersWithoutScore[0]);
  };

  const reset = () => {
    setPlayers(getInitialPlayers());
    setMarkers(getInitialMarkers());
    setTarget(getInitialTarget());
    setPlayState("sign-up");
    setCurrentPlayer(null);
  };

  const startGame = () => {
    if (players.length === 0) return;
    setPlayState("playing");
    nextPlayer({});

    windowRef.current?.scrollIntoView();
  };

  const handleClickInSpace = (e: React.MouseEvent) => {
    if (!windowRef.current) {
      // shouldn't happen?
      return;
    }

    if (!currentPlayer) {
      return;
    }

    const windowRect = windowRef.current.getBoundingClientRect();
    const x = e.clientX - windowRect.left;
    const y = e.clientY - windowRect.top;

    addMarker(currentPlayer, { x, y });
  };

  const handleFormSubmission = (e: React.FormEvent) => {
    e.preventDefault();

    if (e.target instanceof HTMLFormElement) {
      const data = new FormData(e.target);

      const newPlayerName = data.get("new-player-name");
      if (typeof newPlayerName === "string") {
        addPlayer(newPlayerName);
      }

      if (e.target.elements.length > 0) {
        const input = e.target.elements[0] as HTMLInputElement;
        input.value = "";
        input.focus?.();
        input.scrollIntoView?.();
      }
    }
  };

  return (
    <>
      <div style={{ display: "flex", flexGrow: 1 }}>
        {players.length > 0 && (
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Score</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {scoreBoard.map((row) => (
                <ScoreboardRow
                  key={row.player}
                  player={row.player}
                  score={row.score}
                  playState={playState}
                  onRemove={removePlayer}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
      {playState !== "done" && (
        <div style={{ margin: 20 }}>
          <form onSubmit={handleFormSubmission}>
            <label>
              Add player:&nbsp;
              <input
                style={{ height: 24 }}
                autoComplete="off"
                name="new-player-name"
              />
              &nbsp;
              <button>+</button>
            </label>
          </form>
        </div>
      )}

      <div style={{ margin: 20 }}>
        {playState === "sign-up" ? (
          <button
            key="start"
            type="button"
            onClick={startGame}
            disabled={players.length === 0}
          >
            Start
          </button>
        ) : (
          <button key="reset" type="button" onClick={reset}>
            Reset
          </button>
        )}
      </div>

      {currentPlayer ? (
        <div>
          <strong>{currentPlayer}</strong>, you're up!
        </div>
      ) : (
        <></>
      )}

      <div
        ref={windowRef}
        style={{
          position: "relative",
          height: windowHeight,
          width: windowWidth,
          backgroundColor: "lightblue",
          margin: 20,
        }}
        onClick={handleClickInSpace}
      >
        {Object.entries(markers).map(([player, marker]) => (
          <VisualMarker
            key={player}
            x={marker.x}
            y={marker.y}
            fontSize={16}
            color="black"
            label={player}
          />
        ))}
        <VisualMarker
          x={target.x}
          y={target.y}
          fontSize={24}
          color="red"
          label="TARGET"
        />
      </div>
    </>
  );
}

interface ScoreboardRowProps {
  player: string;
  score: number | null;
  playState: PlayState;
  onRemove: (name: string) => void;
}
function ScoreboardRow({
  player,
  score,
  playState,
  onRemove,
}: ScoreboardRowProps) {
  return (
    <tr>
      <td>{player}</td>
      <td>{score ?? "-"}</td>
      <td>
        {playState === "playing" ? (
          ""
        ) : (
          <button type="button" onClick={() => onRemove(player)}>
            🗑️
          </button>
        )}
      </td>
    </tr>
  );
}

function VisualMarker({
  label,
  x,
  y,
  color,
  fontSize,
}: {
  label: string;
  x: number;
  y: number;
  color: string;
  fontSize: number;
}) {
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: y,
          left: x,
          pointerEvents: "none",
          height: 0,
          width: 0,
          border: `${fontSize / 6}px solid ${color}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: y - (fontSize * 2) / 3,
          left: x + fontSize / 2,
          pointerEvents: "none",
          overflow: "visible",
          color,
          fontSize,
        }}
      >
        {label}
      </div>
    </>
  );
}

export default App;
