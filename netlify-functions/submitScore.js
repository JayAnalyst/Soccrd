// netlify-functions/submitScore.js

const leaderboardFile = './leaderboard.json';  // Simulate a file, or use a DB

const fs = require('fs');

exports.handler = async function (event, context) {
  const { username, score } = JSON.parse(event.body);

  try {
    const data = fs.readFileSync(leaderboardFile);
    const leaderboard = JSON.parse(data);

    leaderboard.push({ username, score, date: new Date().toISOString() });

    // Sort leaderboard by score in descending order
    leaderboard.sort((a, b) => b.score - a.score);

    // Keep top 10 scores
    if (leaderboard.length > 10) {
      leaderboard.length = 10;
    }

    // Save updated leaderboard
    fs.writeFileSync(leaderboardFile, JSON.stringify(leaderboard));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Score submitted successfully!' }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to submit score' }),
    };
  }
};
