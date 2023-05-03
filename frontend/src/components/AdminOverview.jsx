import React, { useState, useEffect } from "react";
import Post from "./api/Post";

const AdminOverview = (props) => {
    const [loading, setLoading] = useState(true)
    const [leaderboardData, setLeaderboardData] = useState(null)

    const getLeaderboardCallback = (response) => {
        if (response.status === 200) {
            console.log(response)
            setLoading(false)
            setLeaderboardData(response.data)
        } else {
            return alert("Something went wrong")
        }
    }

    useEffect(() => {
        const data = {
            "group": props.group,
        }
        Post(data, "/group9/request/" + props.username + "/leaderboard", getLeaderboardCallback)
    }, [])

    return (
        <>
            {
                loading === true ?
                    <div>
                        <h1>Loading leaderboard...</h1>
                    </div>
                :
                    <div>
                        <h1>Leaderboard</h1>
                    </div>
            }
        </>
    )
}

export default AdminOverview