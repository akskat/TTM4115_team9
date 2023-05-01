import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuiz_student, startQuiz, submitAnswer, finishQuiz, verifyQuizCode } from '../../services/api';

const Quiz = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();

    const [quiz, setQuiz] = useState({});
    const [codeVerified, setCodeVerified] = useState(false);
    const [quizCode, setQuizCode] = useState('');
    const [attempt, setAttempt] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [seconds, setSeconds] = useState(null);

    useEffect(() => {
        getQuiz_student(quizId).then(data => {
            setQuiz(data);
        }).catch(error => {
            console.error(error);
        });
    }, [quizId]);

    useEffect(() => {
        if (attempt && attempt.id && seconds > 0) { 
            const timerId = setInterval(() => {
                setSeconds(seconds - 1);
            }, 1000);

            return () => clearInterval(timerId); 
        } else if (attempt && attempt.id) {
            finishQuiz(attempt.id).then(() => {
                navigate('/results/' + quizId);
            }).catch(error => {
                console.error(error);
            });
        }
    }, [attempt, navigate, quizId, seconds]);

    const startTheQuiz = () => {
      startQuiz(quizId).then(data => {
          console.log('Start quiz response:', data); 
          if (data && data.attempt && data.attempt.id) {
              setAttempt(data.attempt);
              setSeconds(data.remaining_time);
          } else {
              console.error('No attempt id received');
          }
      }).catch(error => {
          console.error(error);
      });
    }

    const verifyCode = () => {
        verifyQuizCode(quizId, quizCode)
            .then((isValid) => {
                if (isValid) {
                    setCodeVerified(true);
                    startTheQuiz();
                } else {
                    alert('Invalid quiz code.');
                }
            }).catch(error => {
                console.error(error);
            });
    };

    const selectOption = (option) => {
        setSelectedOption(option);
    };

    const submitAndNext = () => {
        if (selectedOption === null) {
            alert('Please select an option!');
            return;
        }

        if (!attempt || !attempt.id) {
            console.error('Attempt or attempt id is undefined');
            return;
        }

        if (!quiz.questions || !quiz.questions[currentQuestion]) {
          console.error('Current question is undefined');
          return;
      }

      submitAnswer(attempt.id, quiz.questions[currentQuestion].id, selectedOption, quizId)
          .then(() => {
              setSelectedOption(null);
              if (currentQuestion + 1 < quiz.questions.length) {
                  setCurrentQuestion(currentQuestion + 1);
              } else {
                  finishQuiz(attempt.id, quizId).then(() => {
                      navigate('/results/' + quizId);
                  }).catch(error => {
                      console.error(error);
                  });
              }
          }).catch(error => {
              console.error(error);
          });
    };

    if (!quiz.questions) return 'Loading...';

    return (
        <>
            {codeVerified ? (
                <>
                    <h1>{quiz.title}</h1>
                    <div>Time remaining: {seconds}</div>
                    <h2>Question {currentQuestion + 1}</h2>
                    <p>{quiz.questions[currentQuestion].text}</p>
                    {quiz.questions[currentQuestion].options.map((option) => (
                        <div key={option}>
                            <input type="radio" id={`option-${option}`} name="option" value={option} 
                                checked={selectedOption === option} onChange={() => selectOption(option)} />
                            <label htmlFor={`option-${option}`}>{option}</label>
                        </div>
                    ))}
                    {attempt && <button onClick={submitAndNext}>Submit and next</button>}
                </>
            ) : (
                <div>
                    <h2>Please enter the quiz code to start:</h2>
                    <input type="text" value={quizCode} onChange={e => setQuizCode(e.target.value)} />
                    <button onClick={verifyCode}>Verify Code</button>
                </div>
            )}
        </>
    );
  }
  
  export default Quiz;
  
