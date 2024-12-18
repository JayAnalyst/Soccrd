import React, { useState, useEffect } from 'react';
import { db } from './firebase';  // Import Firebase Firestore

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    // Fetch the leaderboard from Firestore and sort by score
    const fetchLeaderboard = async () => {
      const snapshot = await db.collection('leaderboard').orderBy('score', 'desc').limit(10).get();
      const leaderboardData = snapshot.docs.map(doc => doc.data());
      setLeaderboard(leaderboardData);
    };

    fetchLeaderboard();
  }, []);  // Empty dependency array to fetch on mount

  return (
    <div>
      <h2>Global Leaderboard</h2>
      <ul>
        {leaderboard.map((score, index) => (
          <li key={index}>
            {index + 1}. {score.user} - {score.score} ({score.date})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Leaderboard;
