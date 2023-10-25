import React, { useState, useEffect } from 'react';
import './App.css';
import Corazon from './corazon.png';

const palabrasIniciales = ['arena', 'fuego', 'cielo', 'papel', 'tigre'];
const indiceInicial = 0;

function App() {
  const [originalWords, setOriginalWords] = useState(palabrasIniciales);
  const [currentWord, setCurrentWord] = useState(originalWords[indiceInicial]);
  const [scrambledWord, setScrambledWord] = useState('');
  const [inputValues, setInputValues] = useState(Array(currentWord.length).fill(''));
  const [currentInputIndex, setCurrentInputIndex] = useState(0);
  const [lives, setLives] = useState(3);
  const [message, setMessage] = useState('');
  const [currentIndex, setCurrentIndex] = useState(indiceInicial);

  useEffect(() => {
    let newScrambledWord = '';
    do {
      newScrambledWord = currentWord.split('').sort(() => Math.random() - 0.5).join('');
    } while (newScrambledWord === currentWord);

    setScrambledWord(newScrambledWord);
  }, [currentWord]);

  const handleInputChange = (event) => {
    const currentInputValue = event.target.value;
    if (/^[a-zA-Z]*$/.test(currentInputValue)) {
      const updatedInputValues = [...inputValues];
      updatedInputValues[currentInputIndex] = currentInputValue;
      setInputValues(updatedInputValues);

      if (currentInputValue === currentWord[currentInputIndex]) {
        if (currentInputIndex === currentWord.length - 1) {
          setMessage(`¡Correcto! La palabra es ${currentWord}`);
          const newWords = originalWords.filter((word) => word !== currentWord);
          setOriginalWords(newWords);
          if (newWords.length > 0) {
            const newIndex = Math.floor(Math.random() * newWords.length);
            setCurrentIndex(newIndex);
            setCurrentWord(newWords[newIndex]);
            setCurrentInputIndex(0);
            setInputValues(Array(newWords[newIndex].length).fill(''));
            setMessage('');
          } else {
            setMessage('Muy bien, has ganado .:3!');
          }
        } else {
          setCurrentInputIndex(currentInputIndex + 1);
          setMessage('¡Muy bien! Vamos por la siguiente.');
        }
      } else {
        setLives(lives - 1);
        setMessage('Intenta de nuevo.');
        if (lives === 1) {
          setMessage('Perdiste. Mejor suerte para la próxima.');
        }
      }
    }
  };

  const handleDelete = () => {
    const updatedInputValues = [...inputValues];
    updatedInputValues[currentInputIndex] = '';
    setInputValues(updatedInputValues);
  };

  const handleRestart = () => {
    const newWords = palabrasIniciales.slice();
    const newIndex = Math.floor(Math.random() * newWords.length);
    const newCurrentWord = newWords[newIndex];

    setOriginalWords(newWords);
    setCurrentWord(newCurrentWord);
    setScrambledWord('');
    setInputValues(Array(newCurrentWord.length).fill(''));
    setLives(3);
    setMessage('');
    setCurrentIndex(newIndex);
    setCurrentInputIndex(0); // Restablece el índice de entrada al inicio
  };

  const inputBoxes = inputValues.map((value, index) => (
    <div key={index} className="input-row">
      <div className="input-container">
        <input
          maxLength={1}
          type="text"
          value={value}
          onChange={handleInputChange}
          disabled={index !== currentInputIndex || lives === 0}
          className="input"
        />
      </div>
      <div className="button-container">
        {index === currentInputIndex && (
          <button onClick={handleDelete} className="button">
            Eliminar
          </button>
        )}
      </div>
    </div>
  ));

  return (
    <div className='container'>
      <h1 className='title'>Ordena la palabra</h1>
      <div className='info-container'>
        <p className='info-box'>Adivina la palabra: {scrambledWord}</p>
        <div className='info-box1'>
          vidas:{Array(lives).fill().map((_, index) => (
            <img key={index} src={Corazon} alt="Corazon" className="corazon" />
          ))}
        </div>
      </div>
      <div className="input-container">
        {inputBoxes}
      </div>
      <button onClick={handleRestart} className='button1'>Reiniciar</button>
      <p className='message'>{message}</p>
    </div>
  );
}

export default App;
