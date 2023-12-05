"use client"

import React, { useState } from 'react';

type Hand = 'rock' | 'paper' | 'scissors';

function App() {
  const [userHand, setUserHand] = useState<Hand | null>(null);
  const [computerHand, setComputerHand] = useState<Hand | null>(null);
  const [result, setResult] = useState<string>('');

  const generateComputerHand = (): Hand => {
    const hands: Hand[] = ['rock', 'paper', 'scissors'];
    const randomIndex = Math.floor(Math.random() * hands.length);
    return hands[randomIndex];
  };

  const determineWinner = (user: Hand, computer: Hand): string => {
    if (user === computer) return 'Draw';
    if ((user === 'rock' && computer === 'scissors') ||
        (user === 'scissors' && computer === 'paper') ||
        (user === 'paper' && computer === 'rock')) {
      return 'You Win!';
    }
    return 'Computer Wins!';
  };

  const playGame = (userChoice: Hand) => {
    const computerChoice = generateComputerHand();
    setUserHand(userChoice);
    setComputerHand(computerChoice);
    setResult(determineWinner(userChoice, computerChoice));
  };

  return (
    <div className="App text-center">
      <h1 className="text-3xl font-bold my-6">Rock Paper Scissors</h1>
      <div className="my-4">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-2" onClick={() => playGame('rock')}>Rock</button>
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mx-2" onClick={() => playGame('paper')}>Paper</button>
        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mx-2" onClick={() => playGame('scissors')}>Scissors</button>
      </div>
      <p className="text-lg">Your choice: {userHand}</p>
      <p className="text-lg">Computer's choice: {computerHand}</p>
      <p className="text-xl font-semibold">{result}</p>
    </div>
  );
}

export default App;
