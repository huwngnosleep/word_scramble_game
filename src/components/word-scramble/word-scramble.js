import React, { useState, useEffect } from "react";
import "./word-scramble.sass";
import { Button } from 'react-bootstrap';
const WORDS = [
	{text: "A", image: null},
	{text: "B", image: null},
	{text: "C", image: null},
	{text: "D", image: null},
	{text: "E", image: null},
	{text: "F", image: null},
	{text: "G", image: null},
	{text: "H", image: null},
];

const charcodeStart = 65
const charcodeEnd = 91
const chars = []
for(let i = charcodeStart; i < charcodeEnd; i++){
	chars.push(String.fromCharCode(i));
}

const WIN_MESSAGE = "YOU WON!!!"
const WIN_COUNT = 5

const WordScramble = () => {
	const [streak, setStreak] = useState(0)
	const [isPlayOn, setIsPlayOn] = useState(false);
	const [inputValue, setInputValue] = useState("");
	const [correctWord, setCorrectWord] = useState("");
	const [scrambledWord, setScrambledWord] = useState("");
	const [selectedWord, setSelectedWord] = useState()
	const [message, setMessage] = useState("");

	const resetStreak = function() {
		setStreak(0)
	}

	const clearInput = function() {
		setInputValue('')
	}

	function nextQuestion() {
		getWord()
	}

	const selectWord = () => {
		const randomIndex = Math.floor(Math.random() * WORDS.length);
		const tempWord = WORDS[randomIndex];
		return tempWord
	};

	const handleButtonClick = () => {
		if (inputValue !== "") {
			if (correctWord === inputValue) {
				if(streak + 1 == 5) {
					setMessage(WIN_MESSAGE)
				} else {
					setMessage("Correct Answer");
					setStreak(streak => streak + 1)
					clearInput()
					nextQuestion()
				}
			} else {
				setMessage("Wrong Answer");
				resetStreak()
			}
		}
	};

	const handleClearButton = function() {
		setInputValue((cur) => cur.slice(0, cur.length - 1))
	}

	function getWord() {
		const word = selectWord();
		setCorrectWord(word.text.toUpperCase());
		setScrambledWord(constructScrambledWord(word.text));
		setSelectedWord(word)
	}

	const handleStartGame = () => {
		setIsPlayOn(true);
		setInputValue("");
		setMessage("");

		getWord()

		resetStreak()
	};

	const handleCharButtonClick = function(char) {
		setInputValue((cur) => cur += char)
	}

	const constructScrambledWord = (word) => {
		const shuffledArray = word.split("");
		for (let i = shuffledArray.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffledArray[i], shuffledArray[j]] = [
				shuffledArray[j],
				shuffledArray[i],
			];
		}
		return shuffledArray.join("");
	};

	useEffect(() => {
		let clearMessage;
		if (message != WIN_MESSAGE) {
			clearMessage = setTimeout(() => setMessage(""), 1000);
		}

		return () => {
			if (clearMessage) {
				clearTimeout(clearMessage);
			}
		};
	}, [message]);

	return (
		<div className='word_scramble'>
			{!!message && (
				<div className='message'>
					<p> {message}</p>
				</div>
			)}

			<h1>Word Scramble</h1>
			<div className='content'>
				{isPlayOn ? (
					<>
						<h3 style={{color: 'black'}}>Score: {streak}</h3>
						<img src={selectedWord.image} style={{height: 250, width: 250, marginBottom: 20}}></img>

						<div className='board'>
							{correctWord.split("").map((el, i) => (
								<span key={`${el}_${i}`} className='square_bg'>
									{inputValue[i]}
								</span>
							))}
						</div>
						<p className='scrambled_word'>{scrambledWord}</p>
						<div className='field'>
							<div style={{display: "flex", flexDirection: "horizontal"}}>
								{chars.map((item, i) => <button key={i} style={{height: 30, width: 30}} onClick={() => handleCharButtonClick(item)}>{item}</button>)}
							</div>


							<div style={{display: "flex", flexDirection: "horizontal", width: "100%", justifyContent: "center", marginTop: 20}}>
								<Button type='button' style={{color: 'red'}} onClick={handleClearButton}>
									Clear
								</Button>
								<Button type='button' style={{color: 'green'}} onClick={handleButtonClick}>
									Enter
								</Button>
								
							</div>
						</div>
					</>
				) : (
					<button
						className='start_game'
						type='button'
						onClick={handleStartGame}
					>
						Start Game
					</button>
				)}

				{isPlayOn && (
					<button
						className='start_game new'
						type='button'
						onClick={handleStartGame}
					>
						New Game
					</button>
				)}
			</div>
		</div>
	);
};

export default WordScramble;
