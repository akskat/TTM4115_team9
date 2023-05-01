import React, { useState } from 'react';

const QuestionCard = ({ options }) => {
    const [selected, setSelected] = useState({});
    const [answers, setAnswers] = useState({});

    const handleClick = (option, isCorrect) => {
        setSelected((prevSelected) => ({
            ...prevSelected,
            [option.id]: isCorrect ? 'correct' : 'incorrect',
        }));
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [option.id]: option,
        }));
    };

    const calculateScore = () => {
        let score = 0;
        for (let key in answers) {
            if (answers[key].isCorrect) {
                score += 1;
            }
        }
        alert(`Your score is ${score}`);
    }

    return (
        <div>
            {options.map((option) => (
                <div key={option.id} style={{ display: 'flex', alignItems: 'center', margin: '10px' }}>
                    <div
                        onClick={() => handleClick(option, option.isCorrect)}
                        style={{
                            width: '100px',
                            height: '100px',
                            backgroundColor: selected[option.id]
                                ? selected[option.id] === 'correct'
                                    ? 'green'
                                    : 'red'
                                : 'gray',
                            marginRight: '10px',
                        }}
                    />
                    <div>{option.text}</div>
                </div>
            ))}
            <button onClick={calculateScore}>Submit Answers</button>
        </div>
    );
};

export default QuestionCard;
