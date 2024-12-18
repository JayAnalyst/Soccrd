// netlify-functions/getLeaderboard.js

const fs = require('fs');
const path = require('path');

exports.handler = async function (event, context) {
  const leaderboardFilePath = path.join(__dirname, '..', 'leaderboard.json');

  try {
    // Read the leaderboard data from the file
    const data = fs.readFileSync(leaderboardFilePath);
    const leaderboard = JSON.parse(data);

    // Return the leaderboard data
    return {
      statusCode: 200,
      body: JSON.stringify(leaderboard),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to retrieve leaderboard' }),
    };
  }
};
