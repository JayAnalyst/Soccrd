// netlify-functions/submitScore.js

const fs = require('fs');
const path = require('path');

exports.handler = async function (event, context) {
  const { username, score } = JSON.parse(event.body);
  const leaderboardFilePath = path.join(__dirname, '..', 'leaderboard.json');

  try {
    // Read the current leaderboard
    const data = fs.readFileSync(leaderboardFilePath);
    const leaderboard = JSON.parse(data);

    // Add the new score to the leaderboard
    leaderboard.push({
      username,
      score,
      date: new Date().toISOString(),
    });

    // Sort the leaderboard by score in descending order
    leaderboard.sort((a, b) => b.score - a.score);

    // Keep only the top 10 leaderboard entries
    if (leaderboard.length > 10) {
      leaderboard.length = 10;
    }

    // Write the updated leaderboard back to the file
    fs.writeFileSync(leaderboardFilePath, JSON.stringify(leaderboard, null, 2));

    // Return the updated leaderboard
    return {
      statusCode: 200,
      body: JSON.stringify(leaderboard),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to submit score' }),
    };
  }
};
