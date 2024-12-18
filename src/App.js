import React, { useState, useEffect, useRef } from 'react';
import words from './words';
import './App.css';

function App() {
    const [secretWord, setSecretWord] = useState('');
    const [guesses, setGuesses] = useState(['', '', '', '', '', '']);
    const [currentGuess, setCurrentGuess] = useState('');
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [leaderboard, setLeaderboard] = useState(() => {
        const storedLeaderboard = localStorage.getItem('soccrdLeaderboard');
        return storedLeaderboard ? JSON.parse(storedLeaderboard) : [];
    });
    const gridRef = useRef(null);

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * words.length);
        setSecretWord(words[randomIndex].toUpperCase());
    }, []);

    useEffect(() => {
        localStorage.setItem('soccrdLeaderboard', JSON.stringify(leaderboard));
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
        newGuesses[guesses.findIndex(guess => guess === '')] = currentGuess;
        setGuesses(newGuesses);
        setCurrentGuess('');

        if (currentGuess === secretWord) {
            setGameOver(true);
            setGameWon(true);
            const newScore = { guesses: guesses.filter(guess => guess !== '').length + 1, date: new Date().toLocaleDateString() };
            setLeaderboard(prevLeaderboard => [...prevLeaderboard, newScore].sort((a, b) => a.guesses - b.guesses));
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

    // Create a Wordle-style share string
    const generateShareString = () => {
        return guesses
            .filter(guess => guess !== '') // Remove empty guesses
            .map((guess, index) => {
                return guess.split('')
                    .map((letter, letterIndex) => {
                        const color = getTileColor(letter, letterIndex, guess);
                        if (color === 'green') return '🟩';
                        if (color === 'yellow') return '🟨';
                        return '⬛'; // red or incorrect letter
                    })
                    .join('');
            })
            .join('\n');
    };

    const handleShare = (platform) => {
        const shareText = generateShareString();

        if (platform === 'clipboard') {
            navigator.clipboard.writeText(shareText)
                .then(() => {
                    alert('Game state copied to clipboard!');
                })
                .catch(err => {
                    console.error('Failed to copy:', err);
                    alert('Failed to copy game state to clipboard.');
                });
        } else if (platform === 'twitter') {
            const tweetText = `I played Soccrd!\n\n${encodeURIComponent(shareText)}`;
            window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank');
        } else if (platform === 'facebook') {
            const fbText = `I played Soccrd!\n\n${encodeURIComponent(shareText)}`;
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${fbText}`, '_blank');
        }
    };

    return (
        <div className="App" style={{ "--word-length": secretWord.length }}>
            <h1>Soccrd</h1>
            <div className="guess-grid" ref={gridRef}>
                {guesses.map((guess, guessIndex) => (
                    <div key={guessIndex} className="guess-row">
                        {secretWord.split('').map((letter, letterIndex) => (
                            <div key={letterIndex} className={`tile ${getTileColor(guess[letterIndex], letterIndex, guess)}`}>
                                {guess && guess[letterIndex]}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            {!gameOver && (
                <div>
                    <input type="text" maxLength={secretWord.length} value={currentGuess} onChange={handleInputChange} />
                    <button onClick={handleGuessSubmit}>Submit</button>
                </div>
            )}
            {gameOver && (
                <div>
                    {gameWon ? <p>You Win! The word was {secretWord}</p> : <p>You Lose! The word was {secretWord}</p>}
                    <div>
                        <button onClick={() => handleShare('clipboard')}>Copy Game State</button>
                        <button onClick={() => handleShare('twitter')}>Share on Twitter</button>
                        <button onClick={() => handleShare('facebook')}>Share on Facebook</button>
                    </div>
                </div>
            )}
            <h2>Leaderboard</h2>
            <ul>
                {leaderboard.map((score, index) => (
                    <li key={index}>
                        {score.date}: Solved in {score.guesses} guess{score.guesses > 1 ? 'es' : ''}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
