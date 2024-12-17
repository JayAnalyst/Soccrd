import React, { useState, useEffect } from 'react';
import words from './words';
import './App.css'; // Import your CSS file

function App() {
  const [secretWord, setSecretWord] = useState('');
  const [guesses, setGuesses] = useState(['', '', '', '', '', '']);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * words.length);
    setSecretWord(words[randomIndex].toUpperCase());
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleInputChange = (e) => {
    setCurrentGuess(e.target.value.toUpperCase());
  };

  const handleGuessSubmit = () => {
    if (currentGuess.length !== secretWord.length) {
      alert(`Please enter a ${secretWord.length}-letter word.`);
      return;
    }

    const newGuesses = [...guesses];
    newGuesses[guesses.findIndex(guess => guess === '')] = currentGuess;
    setGuesses(newGuesses);
    setCurrentGuess('');

    if (currentGuess === secretWord) {
      setGameOver(true);
      setGameWon(true);
    } else if (newGuesses.every(guess => guess !== '')) {
      setGameOver(true);
    }
  };


  const getTileColor = (letter, index, guess) => {
    if (!guess) return '';
    if (secretWord[index] === letter) return 'green';
    if (secretWord.includes(letter)) return 'yellow';
    return 'red';
  };

  return (
    <div className="App">
      <h1>Soccrd</h1>
      {guesses.map((guess, guessIndex) => (
        <div key={guessIndex} className="guess-row">
          {secretWord.split('').map((letter, letterIndex) => (
            <div key={letterIndex} className={`tile ${getTileColor(guess[letterIndex], letterIndex, guess)}`}>
              {guess && guess[letterIndex]}
            </div>
          ))}
        </div>
      ))}
      {!gameOver && (
        <div>
          <input type="text" maxLength={secretWord.length} value={currentGuess} onChange={handleInputChange} />
          <button onClick={handleGuessSubmit}>Submit</button>
        </div>
      )}
      {gameOver && (
        <div>
          {gameWon ? <p>You Win! The word was {secretWord}</p> : <p>You Lose! The word was {secretWord}</p>}
        </div>
      )}
    </div>
  );
}

export default App;