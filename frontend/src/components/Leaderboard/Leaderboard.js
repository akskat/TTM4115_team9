import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getQuizResults } from '../../services/api';

export default function Leaderboard() {
    const { id } = useParams();
    const [results, setResults] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const response = await getQuizResults(id);
            setResults(response.data);
        }

        fetchData();
    }, [id]);

    return (
        <div>
            <h2>Leaderboard</h2>
            <table>
                <thead>
                    <tr>
                        <th>Student ID</th>
                        <th>Score</th>
                        <th>Time Taken</th>
                    </tr>
                </thead>
                <tbody>
                    {results.map((result, index) => (
                        <tr key={index}>
                            <td>{result.studentId}</td>
                            <td>{result.score}</td>
                            <td>{result.timeTaken}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
