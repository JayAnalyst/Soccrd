import React, { useEffect, useState } from "react";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    // Fetch leaderboard data from the Netlify function
    fetch("/.netlify/functions/getLeaderboard")
      .then((response) => response.json())
      .then((data) => {
        setLeaderboard(data);
      })
      .catch((error) => {
        console.error("Error fetching leaderboard:", error);
      });
  }, []);

  return (
    <div className="leaderboard">
      <h2>Leaderboard</h2>
      {leaderboard.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>Guesses</th>
              <th>Score</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{entry.user}</td>
                <td>{entry.guesses}</td>
                <td>{entry.score}</td>
                <td>{entry.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No leaderboard data yet.</p>
      )}
    </div>
  );
};

export default Leaderboard;
