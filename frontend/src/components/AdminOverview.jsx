import React, { useState, useEffect } from "react";
import Post from "./api/Post";
import {wait} from "@testing-library/user-event/dist/utils";
import {type} from "@testing-library/user-event/dist/type";

const AdminOverview = (props) => {
    const [leaderboardData, setLeaderboardData] = useState(null)

    const restTables = () => {
        const baseTable = "<thead>\n" +
            "                                <tr>\n" +
            "                                    <th></th>\n" +
            "                                    <th>RAT number</th>\n" +
            "                                    <th>Time taken (min)</th>" +
            "                                    <th>Score</th>" +
            "                                </tr>\n" +
            "                            </thead>"
        const groupTable = document.getElementById("groupTable")
        groupTable.innerHTML = baseTable
        const userTable = document.getElementById("userTable")
        userTable.innerHTML = baseTable
    }

    const getScore = (rat_number, question_number, option_number) => {
        const rat = leaderboardData.rats[rat_number]
        if (rat.questions[question_number][1][option_number][1]){
            return 1
        }
        else return 0
    }

    const getScoreFromRats = (rat, table_name) => {
        const number = rat.number + 1
        const time = Math.round(rat.time_taken * 100) / 100
        let score = 0
        for (let i = 0; i < rat.answers.length; i++) {
            if (table_name === "groupTable" && rat.answers[i][0] !== "") {
                score += getScore(rat.number, i, rat.answers[i][0])
            } else if (table_name === "userTable" && rat.answers[i][1] !== "") {
                score += getScore(rat.number, rat.answers[i][0], rat.answers[i][1])
            }
        }
        return {number, time, score}
    }

    const addRow = (table_name, name, rats) => {
        const table = document.getElementById(table_name)
        if (rats === null) {
            let row = table.insertRow()
            let name_row    = row.insertCell(0)
            let rat_row     = row.insertCell(1)
            let time_row    = row.insertCell(2)
            let score_row   = row.insertCell(3)
            name_row.innerHTML = name
            rat_row.innerHTML = "---"
            time_row.innerHTML = "---"
            score_row.innerHTML = "---"
        }  else {
            for (let i = 0; i < rats.length; i++) {
                const {number, time, score} = getScoreFromRats(rats[i], table_name)
                let row = table.insertRow()
                let name_row = row.insertCell(0)
                let rat_row = row.insertCell(1)
                let time_row = row.insertCell(2)
                let score_row = row.insertCell(3)
                name_row.innerHTML = name
                rat_row.innerHTML = number
                time_row.innerHTML = time + ""
                score_row.innerHTML = score + ""
            }
        }
    }

    useEffect(() => {
        if (leaderboardData != null) {
            restTables()
            const groupData = leaderboardData.groups
            const userData = leaderboardData.users

            for (let i = 0; i < groupData.length; i++) {
                if (groupData[i].rats !== "EMPTY ARRAY") {
                    addRow("groupTable", groupData[i].username, groupData[i].rats)
                } else {
                    addRow("groupTable", groupData[i].username, null)
                }
            }

            for (let i = 0; i < userData.length; i++) {
                if (userData[i].rats !== "EMPTY ARRAY") {
                    addRow("userTable", userData[i].username, userData[i].rats)
                } else {
                    addRow("userTable", userData[i].username, null)
                }
            }
        }
    }, [leaderboardData])

    const getLeaderboardCallback = (response) => {
        if (response.status === 200) {
            console.log(response.data)
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
                leaderboardData === null ?
                    <div>
                        <h1>Loading leaderboard...</h1>
                    </div>
                :
                    <div>
                        <h1>Leaderboard</h1>
                        <h2>Groups</h2>
                        <table id="groupTable"/>

                        <h2>Users</h2>
                        <table id="userTable"/>
                    </div>
            }
        </>
    )
}

export default AdminOverview