import React, { useState, useEffect } from 'react';
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

    const handleShare = () => {
        const guessesTaken = guesses.filter(guess => guess !== '').length + 1;
        const shareText = `I solved Soccrd in ${guessesTaken} guess${guessesTaken > 1 ? 'es' : ''}! The word was ${secretWord}. Play it here: [YOUR_DEPLOYED_URL]`;
        if (navigator.share) {
            navigator.share({
                title: 'Soccrd',
                text: shareText,
                url: '[YOUR_DEPLOYED_URL]',
            }).then(() => {
                console.log('Successful share');
            }).catch((error) => {
                console.log('Error sharing', error);
                navigator.clipboard.writeText(shareText).then(() => {
                    alert("Share text copied to clipboard. Please share manually.");
                })
            });
        } else {
            navigator.clipboard.writeText(shareText).then(() => {
                alert("Share text copied to clipboard. Please share manually.");
            })
        }
    };

    return (
        <div className="App">
            <h1>Soccrd</h1>
            <div className="guess-grid">
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
                    <button onClick={handleShare}>Share Score</button>
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