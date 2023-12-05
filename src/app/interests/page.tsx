"use client"

import React, { useState } from 'react';
import { Client, Wallet, xrpToDrops } from 'xrpl';

type Hand = 'rock' | 'paper' | 'scissors';

function App() {
  const [userHand, setUserHand] = useState<Hand | null>(null);
  const [computerHand, setComputerHand] = useState<Hand | null>(null);
  const [result, setResult] = useState<string>('');
  const [receiverAddress, setReceiverAddress] = useState('');
  const [transactionResult, setTransactionResult] = useState('');

  const client = new Client('wss://s.altnet.rippletest.net:51233');

  // 送金に使用する固定値
  const senderAddress = 'rKSL87PSZ3bzGmGbdNqhWzKxJnVwjCfDz6';
  const senderSecret = 'sEdVQyU4UVsXYmCJRXMYgA2mWgGMR3z';
  const amount = '100'; // XRPの量

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
    const gameResult = determineWinner(userChoice, computerChoice);
    setResult(gameResult);
    if (gameResult === 'You Win!') {
      executeTransaction(); // 勝ったら送金を実行
    }
  };

  const executeTransaction = async () => {
    try {
      await client.connect();

      const prepared = await client.autofill({
        TransactionType: 'Payment',
        Account: senderAddress,
        Amount: xrpToDrops(amount),
        Destination: receiverAddress
      });
      const signed = Wallet.fromSecret(senderSecret).sign(prepared);
      const submitResult = await client.submitAndWait(signed.tx_blob);

      const receiverBalanceAfter = await client.getXrpBalance(receiverAddress);

      setTransactionResult(` 受信者アドレス: ${receiverAddress}, 受信者の残高: ${receiverBalanceAfter}`);

      await client.disconnect();
    } catch (error) {
      console.error('エラーが発生しました:', error);
      setTransactionResult('エラーが発生しました。');
    }
  };

  return (
    <div className="App text-center">
      {/* ジャンケンのUI */}
      <h1 className="text-3xl font-bold my-6">Rock Paper Scissors</h1>
      <div className="my-4">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-2" onClick={() => playGame('rock')}>Rock</button>
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mx-2" onClick={() => playGame('paper')}>Paper</button>
        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mx-2" onClick={() => playGame('scissors')}>Scissors</button>
      </div>
      <p className="text-lg">Your choice: {userHand}</p>
      <p className="text-lg">Computer's choice: {computerHand}</p>
      <p className="text-xl font-semibold">{result}</p>

      {/* 受信者のアドレス入力 */}
      <div>
        <input type="text" value={receiverAddress} onChange={(e) => setReceiverAddress(e.target.value)} placeholder="Receiver Address" />
        <p>{transactionResult}</p>
      </div>
    </div>
  );
}

export default App;