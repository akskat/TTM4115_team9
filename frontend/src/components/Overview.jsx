import React, { useState, useEffect, useCallback } from "react";
import Post from "./api/Post";

const Overview = (props) => {
    const [ratData, setRatData] = useState(null)

    const setRat = (response) => {
        if (response.status === 200) {
            setRatData(response.data)
        }
        else {
            return alert(response)
        }
    }

    const getRatFromCode = () => {
        const code = document.getElementById("code").value

        if (code === "") {
            return alert("Missing RAT-code")
        }

        const data = {
            "code": code
        }
        Post(data, "/group9/request/" + props.username + "/rat", setRat)
    }

    return (
        <div>
            {
                ratData === null ?
                    <div>
                        <h2>Enter RAT-Code</h2>
                        <input type="text" id="code"/>
                        <button type="button" onClick={() => getRatFromCode()}>Start RAT</button>
                    </div>
                :
                    <h2>RAT</h2>
            }
        </div>
    )
}

export default Overview