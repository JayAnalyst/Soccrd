import React, { useState, useEffect } from 'react';
import { db } from './firebase';  // Firebase configuration
import { collection, getDocs } from 'firebase/firestore'; // Firestore functions

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const querySnapshot = await getDocs(collection(db, "leaderboard"));
      const leaderboardData = querySnapshot.docs.map(doc => doc.data());
      setLeaderboard(leaderboardData);
    };

    fetchLeaderboard();
  }, []);  // Runs once when the component is mounted

  return (
    <div>
      <h2>Leaderboard</h2>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Guesses</th>
            <th>Score</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((score, index) => (
            <tr key={index}>
              <td>{score.user}</td>
              <td>{score.guesses}</td>
              <td>{score.score}</td>
              <td>{score.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
