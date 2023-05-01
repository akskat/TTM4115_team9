import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getQuizResults } from '../../services/api'; // This function should be implemented in your API service

const QuizResults = () => {
    const { quizId } = useParams();

    const [results, setResults] = useState(null);

    useEffect(() => {
        getQuizResults(quizId).then(data => {
            setResults(data);
        }).catch(error => {
            console.error(error);
        });
    }, [quizId]);

    if (!results) return 'Loading...';

    return (
        <div>
            {console.log(results)}
            <h1>Quiz Results</h1>
            {results.questions && results.questions.map((question, index) => (
                <div key={index}>
                    <h2>Question {index + 1}</h2>
                    <p>{question.text}</p>
                    <p>Your answer: {question.yourAnswer}</p>
                </div>
            ))}
            <Link to="/student">Back</Link>
        </div>
    );
}    

export default QuizResults;
