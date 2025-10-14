import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
    const [currentMission, setCurrentMission] = useState(1);
    const [missions, setMissions] = useState([]);
    const [scores, setScores] = useState([]);
    const [error, setError] = useState(null);

    const formatTime = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }

    const missionName = Array.isArray(missions) ? missions.find(m => m.id === currentMission)?.name || "Unknown" : "Unknown";
    const getMissionName = () => {
        let ret = currentMission;
        if (Array.isArray(missions)) {
            let name = missions.find(m => m.id === currentMission)?.name;
            if (name) {
                ret += ` - ${name}`;
            }
        }
        return ret;
    }

    const computeScore = (entry) => {
        return entry.time_ms;
        // return entry.time_ms - entry.enemies_destroyed * 10;
    }

    const sortedScores = [...scores].sort((a, b) => computeScore(a) - computeScore(b));

    const handleClickPrevBtn = () => {
        setCurrentMission(prev => {
            const newMission = missions.length > 0 ? Math.max(1, prev - 1) : prev;
            const params = new URLSearchParams(window.location.search);

            params.set("mission_id", newMission);
            window.history.replaceState({}, "", `${window.location.pathname}?${params}`);

            return newMission;
        });
    }

    const handleClickNextBtn = () => {
        setCurrentMission(prev => {
            const newMission = missions.length > 0 ? Math.min(prev + 1, missions.length) : prev;
            const params = new URLSearchParams(window.location.search);

            params.set("mission_id", newMission);
            window.history.replaceState({}, "", `${window.location.pathname}?${params}`);

            return newMission;
        });
    }

    useEffect(() => {
        fetch("http://localhost:4000/missions")
        .then(res => res.json())
        .then(data => {
            setMissions(data);

            const params = new URLSearchParams(window.location.search);

            console.log("Full search string:", window.location.search);
            console.log("mission param:", params.get("mission_id"));

            const missionFromUrl = Number(params.get("mission_id"))

            if (!isNaN(missionFromUrl) && data.some(m => m.id === missionFromUrl)) {
                console.log("found mission: ", missionFromUrl);
                setCurrentMission(missionFromUrl);
            } else if (data.length > 0 && !isNaN(data[0].id)) {
                console.error("could not find mission: ", missionFromUrl);
                setCurrentMission(Number(data[0].id));
            }
        })
        .catch(err => console.error("Error fetching missions:", err));
    }, []);

    useEffect(() => {
        if (!currentMission) return;
        fetch(`http://localhost:4000/scores?mission_id=${currentMission}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const sorted = [...data].sort((a, b) => computeScore(a) - computeScore(b));
                    setScores(sorted);
                }
            })
            .catch(err => {
                console.error("Error fetching scores:", err);
                setError("Failed to fetch scores");
            });
    }, [currentMission]);

    if (error) return <p>{error}</p>;

    return (
        <div className="max-w-md mx-auto bg-gray-900 text-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
                <button onClick={ handleClickPrevBtn }
                    className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600">
                    ⬅
                </button>
                <h1 className="text-3xl font-bold text-center mb-6">{getMissionName()}</h1>
                <button onClick={ handleClickNextBtn }
                    className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600">
                    ➡
                </button>
            </div>

            {scores.length > 0 ? (
                <div className="grid grid-cols-4 gap-4 bg-gray-700 p-2 rounded-t-lg font-semibold">
                    <div>#</div>
                    <div>Player</div>
                    <div>Time</div>
                    <div>Enemies Destroyed</div>
                </div>
            ) : (
                <p className="text-center text-gray-400">No scores yet!</p>
            )}

            <ul className="space-y-2">
                {sortedScores.map((s, i) => (
                    <li key={i} className="grid grid-cols-4 gap-4 bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition">
                        <div className="mission_id">{i + 1}</div>
                        <div className="score-player truncate">{s.player_name}</div>
                        <div className="score-time text-yellow-400">{formatTime(s.time_ms)}</div>
                        <div className="score-enemies_destroyed text-green-400">{s.enemies_destroyed}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;