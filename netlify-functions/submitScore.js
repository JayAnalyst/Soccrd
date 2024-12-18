const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  try {
    // Read the existing leaderboard file
    const leaderboardFilePath = path.resolve(__dirname, '../leaderboard.json');
    const leaderboardData = JSON.parse(fs.readFileSync(leaderboardFilePath, 'utf-8'));

    // Parse the incoming score from the request body
    const newScore = JSON.parse(event.body);

    // Add the new score to the leaderboard
    leaderboardData.push(newScore);

    // Save the updated leaderboard back to the file
    fs.writeFileSync(leaderboardFilePath, JSON.stringify(leaderboardData, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Score submitted successfully!' }),
    };
  } catch (error) {
    console.error('Error in submitScore function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to submit score' }),
    };
  }
};
