import React, { useState, useEffect, useRef } from 'react';
import words from './words';
import './App.css';
import html2canvas from 'html2canvas';

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

   const handleShare = async (platform) => {
    if (!gridRef.current) return;

    try {
        const canvas = await html2canvas(gridRef.current, { backgroundColor: null });
        const dataURL = canvas.toDataURL('image/png');

        if (platform === 'clipboard') {
            try {
                const blob = await fetch(dataURL).then(r => r.blob());

                if (navigator.clipboard && window.ClipboardItem) {
                    const clipboardItem = new ClipboardItem({
                        'image/png': blob,
                    });
                    await navigator.clipboard.write([clipboardItem]);
                    alert("Image copied to clipboard!");
                } else {
                    // Fallback if ClipboardItem is not supported
                    alert("Clipboard API not supported in this browser.");
                }
            } catch (err) {
                console.error("Failed to copy: ", err);
                alert("Failed to copy image to clipboard. Your browser may not support this feature.");
                // Optional: Offer the user to download the image instead
                const downloadLink = document.createElement('a');
                downloadLink.href = dataURL;
                downloadLink.download = 'soccrd_image.png';
                downloadLink.click();
            }
        } else if (platform === 'twitter') {
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent("I played Soccrd!")}`, '_blank');
        } else if (platform === 'facebook') {
            window.open(`https://www.facebook.com/sharer/sharer.php`, '_blank');
        }
    } catch (error) {
        console.error('Error capturing or sharing image:', error);
        alert("An error occurred while sharing.");
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
                        <button onClick={() => handleShare('clipboard')}>Copy Image</button>
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
