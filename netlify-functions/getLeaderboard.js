// netlify-functions/getLeaderboard.js

const leaderboardFile = './leaderboard.json';  // Simulate a file, or use a DB

const fs = require('fs');

exports.handler = async function (event, context) {
  try {
    const data = fs.readFileSync(leaderboardFile);
    const leaderboard = JSON.parse(data);

    return {
      statusCode: 200,
      body: JSON.stringify(leaderboard),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not fetch leaderboard' }),
    };
  }
};
