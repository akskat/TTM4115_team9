import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getQuizzes_student, getQuizStatus, getGroupQuizzes, getGroupQuizStatus, getQuizzes_group } from '../../services/api';

function QuizList() {
    const [quizzes, setQuizzes] = useState([]);
    const [groupQuizzes, setGroupQuizzes] = useState([]);

    useEffect(() => {
        getQuizzes_student()
            .then(data => {
                Promise.all(data.map(quiz => getQuizStatus(quiz.id)))
                    .then(statuses => {
                        const updatedQuizzes = data.map((quiz, index) => ({
                            ...quiz,
                            status: statuses[index],
                        }));
                        setQuizzes(updatedQuizzes);
                    });
            });

            getGroupQuizzes()
            .then(data => {
                Promise.all(data.map(quiz => getGroupQuizStatus(quiz.id)))
                    .then(statuses => {
                        const updatedQuizzes = data.map((quiz, index) => ({
                            ...quiz,
                            status: statuses[index],
                        }));
                        setGroupQuizzes(updatedQuizzes);
                    });
            });
    }, []);

    return (
        <div>
                        <h1>Quizzes</h1>
            <h2>Individual Quizzes</h2>
            {quizzes.map(quiz => (
                <div key={quiz.id}>
                    <Link to={quiz.status === 'completed' ? `/results/${quiz.id}` : `/student/quizzes/${quiz.id}`}>{quiz.name}</Link>
                </div>
            ))}
            <h2>Group Quizzes</h2>
            {groupQuizzes.map(quiz => (
                <div key={quiz.id}>
                    <Link to={quiz.status === 'completed' ? `/results/${quiz.id}` : `/student/group-quizzes/${quiz.id}`}>{quiz.name}</Link>
                </div>
            ))}
        </div>
    );
}

export default QuizList;


