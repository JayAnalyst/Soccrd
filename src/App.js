import React, { useState, useEffect, useRef } from "react";
import words from "./words";
import "./App.css";
import netlifyIdentity from "netlify-identity-widget";
import { db } from "./firebase";
import Leaderboard from './Leaderboard'; 

function App() {
  const [secretWord, setSecretWord] = useState("");
  const [guesses, setGuesses] = useState(["", "", "", "", "", ""]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [leaderboard, setLeaderboard] = useState(() => {
    const storedLeaderboard = localStorage.getItem("soccrdLeaderboard");
    return storedLeaderboard ? JSON.parse(storedLeaderboard) : [];
  });
  const [user, setUser] = useState(null);
  const gridRef = useRef(null);

  // Function to generate the word of the day based on the current date
  const getWordOfTheDay = () => {
    const date = new Date();
    const dayOfYear = Math.floor(
      (date - new Date(date.getFullYear(), 0, 0)) / 86400000,
    ); // Day of the year
    return words[dayOfYear % words.length].toUpperCase(); // Ensure we always get a word from the list
  };

  useEffect(() => {
    setSecretWord(getWordOfTheDay()); // Set the word of the day on first render

    netlifyIdentity.init();
    const currentUser = netlifyIdentity.currentUser();

    if (currentUser) {
      setUser({
        email: currentUser.email,
        username:
          currentUser.user_metadata.full_name ||
          currentUser.email.split("@")[0],
      });
    }

    netlifyIdentity.on("login", (user) => {
      setUser({
        email: user.email,
        username: user.user_metadata.full_name || user.email.split("@")[0],
      });
      netlifyIdentity.close();
    });

    netlifyIdentity.on("logout", () => {
      setUser(null);
    });
  }, []);

  useEffect(() => {
    localStorage.setItem("soccrdLeaderboard", JSON.stringify(leaderboard));
  }, [leaderboard]);

  const handleInputChange = (e) => {
    setCurrentGuess(e.target.value.toUpperCase());
  };

  const handleGuessSubmit = () => {
    if (currentGuess.length !== secretWord.length) {
      alert(`Please enter a ${secretWord.length}-letter word.`);
      return;
    }

    const newGuesses = [...guesses];
    const guessIndex = guesses.findIndex((guess) => guess === "");
    newGuesses[guessIndex] = currentGuess;
    setGuesses(newGuesses);
    setCurrentGuess("");

    if (currentGuess === secretWord) {
      setGameOver(true);
      setGameWon(true);

      const score =
        guessIndex === 0
          ? 10
          : guessIndex === 1
            ? 8
            : guessIndex === 2
              ? 5
              : guessIndex === 3
                ? 3
                : 1;

      // Add score to Firebase Firestore
      const newScore = {
        user: user ? user.username : "Anonymous",
        guesses: guessIndex + 1,
        score,
        date: new Date().toLocaleDateString(),
      };

      // Store the new score in Firestore
      db.collection("leaderboard")
        .add(newScore)
        .then(() => {
          console.log("Score saved successfully!");
        })
        .catch((error) => {
          console.error("Error saving score: ", error);
        });
    } else if (newGuesses.every((guess) => guess !== "")) {
      setGameOver(true);
    }
  };

  const getTileColor = (letter, index, guess) => {
    if (!guess) return "";
    if (secretWord[index] === letter) return "green";
    if (secretWord.includes(letter)) return "yellow";
    return "red";
  };

  const generateShareString = () => {
    return guesses
      .filter((guess) => guess !== "") // Remove empty guesses
      .map((guess, index) => {
        return guess
          .split("")
          .map((letter, letterIndex) => {
            const color = getTileColor(letter, letterIndex, guess);
            if (color === "green") return "🟩";
            if (color === "yellow") return "🟨";
            return "⬛"; // red or incorrect letter
          })
          .join("");
      })
      .join("\n");
  };

  const handleShare = (platform) => {
    const shareText = generateShareString();

    if (platform === "clipboard") {
      navigator.clipboard
        .writeText(shareText)
        .then(() => {
          alert("Game state copied to clipboard!");
        })
        .catch((err) => {
          console.error("Failed to copy:", err);
          alert("Failed to copy game state to clipboard.");
        });
    } else if (platform === "twitter") {
      const tweetText = `I played Soccrd!\n\n${encodeURIComponent(shareText)}`;
      window.open(
        `https://twitter.com/intent/tweet?text=${tweetText}`,
        "_blank",
      );
    } else if (platform === "facebook") {
      const fbText = `I played Soccrd!\n\n${encodeURIComponent(shareText)}`;
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${fbText}`,
        "_blank",
      );
    }
  };

  const handleLogin = () => {
    netlifyIdentity.open();
    netlifyIdentity.on("login", (user) => {
      setUser({
        email: user.email,
        username: user.user_metadata.full_name || user.email.split("@")[0], // Use full name if available, otherwise part before @
      });
      netlifyIdentity.close();
    });
  };

  const handleLogout = () => {
    netlifyIdentity.logout();
    netlifyIdentity.on("logout", () => {
      setUser(null);
    });
  };

  return (
    <div className="App" style={{ "--word-length": secretWord.length }}>
      <h1>Soccrd - Guess the team</h1>

      {user ? (
        <div className="user-controls">
          <p>Welcome, {user.username}</p>
          <button onClick={handleLogout}>Log Out</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Log In / Register</button>
      )}

      <div className="guess-grid" ref={gridRef}>
        {guesses.map((guess, guessIndex) => (
          <div key={guessIndex} className="guess-row">
            {secretWord.split("").map((letter, letterIndex) => (
              <div
                key={letterIndex}
                className={`tile ${getTileColor(guess[letterIndex], letterIndex, guess)}`}
              >
                {guess && guess[letterIndex]}
              </div>
            ))}
          </div>
        ))}
      </div>

      {!gameOver && (
        <div>
          <input
            type="text"
            maxLength={secretWord.length}
            value={currentGuess}
            onChange={handleInputChange}
          />
          <button onClick={handleGuessSubmit}>Submit</button>
        </div>
      )}

      {gameOver && (
        <div>
          {gameWon ? (
            <p>You Win! The word was {secretWord}</p>
          ) : (
            <p>You Lose! The word was {secretWord}</p>
          )}
          <div>
            <button onClick={() => handleShare("clipboard")}>
              Copy Game State
            </button>
            <button onClick={() => handleShare("twitter")}>
              Share on Twitter
            </button>
            <button onClick={() => handleShare("facebook")}>
              Share on Facebook
            </button>
                <Leaderboard />
          </div>
        </div>
    </div>
  );
}

export default App;
