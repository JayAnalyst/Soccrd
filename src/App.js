import React, { useState, useEffect, useRef } from "react";
import words from "./words";
import netlifyIdentity from "netlify-identity-widget";
import "./App.css";
import Leaderboard from './Leaderboard';

function App() {
  const [secretWord, setSecretWord] = useState("");
  const [guesses, setGuesses] = useState(["", "", "", "", "", ""]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [user, setUser] = useState(null);
  const gridRef = useRef(null);

  const getWordOfTheDay = () => {
    const date = new Date();
    const dayOfYear = Math.floor(
      (date - new Date(date.getFullYear(), 0, 0)) / 86400000,
    );
    return words[dayOfYear % words.length].toUpperCase();
  };

  useEffect(() => {
    setSecretWord(getWordOfTheDay());

    netlifyIdentity.init();
    const currentUser = netlifyIdentity.currentUser();

    if (currentUser) {
      setUser({
        email: currentUser.email,
        username: currentUser.user_metadata.full_name || currentUser.email.split("@")[0],
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
        guessIndex === 0 ? 10 : guessIndex === 1 ? 8 : guessIndex === 2 ? 5 : guessIndex === 3 ? 3 : 1;

      const newScore = {
        user: user ? user.username : "Anonymous",
        guesses: guessIndex + 1,
        score,
        date: new Date().toLocaleDateString(),
      };

      // Submit score to the Netlify function
      fetch("/.netlify/functions/submitScore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newScore),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Score submitted:", data);
        })
        .catch((error) => {
          console.error("Error submitting score:", error);
        });

  

  const getTileColor = (letter, index, guess) => {
    if (!guess) return "";
    if (secretWord[index] === letter) return "green";
    if (secretWord.includes(letter)) return "yellow";
    return "red";
  };

  const generateShareString = () => {
    return guesses
      .filter((guess) => guess !== "")
      .map((guess, index) => {
        return guess
          .split(" ")
          .map((letter, letterIndex) => {
            const color = getTileColor(letter, letterIndex, guess);
            if (color === "green") return "🟩";
            if (color === "yellow") return "🟨";
            return "⬛";
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
      window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, "_blank");
    } else if (platform === "facebook") {
      const fbText = `I played Soccrd!\n\n${encodeURIComponent(shareText)}`;
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${fbText}`, "_blank");
    }
  };

  const handleLogin = () => {
    netlifyIdentity.open();
    netlifyIdentity.on("login", (user) => {
      setUser({
        email: user.email,
        username: user.user_metadata.full_name || user.email.split("@")[0],
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
              <div key={letterIndex} className={`tile ${getTileColor(guess[letterIndex], letterIndex, guess)}`}>
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
            <button onClick={() => handleShare("clipboard")}>Copy Game State</button>
            <button onClick={() => handleShare("twitter")}>Share on Twitter</button>
            <button onClick={() => handleShare("facebook")}>Share on Facebook</button>
            <Leaderboard />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
