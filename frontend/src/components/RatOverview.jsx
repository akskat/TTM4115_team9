import React, {useEffect, useState} from "react";
import Post from "./api/Post";

const RatOverview = (props) => {
    const [ratData, setRatData] = useState(null)
    const [ratCode, setRatCode] = useState("")
    const [canDoTeamRat, setCanDoTeamRat] = useState(false)
    let currentRatQuestion = [null, null]

    const setRat = (response) => {
        if (response.status === 200) {
            setRatData(response.data)
        }
        else {
            setRatCode("")
            return alert(response)
        }
    }

    const ratCallback = (response) => {
        if (response.status === 200) {
            setCanDoTeamRat(true)
        }
        else {
            return alert(response)
        }
    }

    const getRatFromCode = (callback) => {
        if (!canDoTeamRat) {
            const code = document.getElementById("code").value
            if (code === "") {
                return alert("Missing code")
            }
            setRatCode(code)
            const data = {
                "code": code
            }
            Post(data, "/group9/request/" + props.username + "/rat", callback)
        } else {
            const data = {
                "code": ratCode
            }
            Post(data, "/group9/request/" + props.group + "/rat", callback)
        }
    }

    const submitAnswers = (ratDiv) => {
        let answers = []
        let questionNumber = 0
        for (let i = 0; i < ratDiv.children.length; i++) {
            if (ratDiv.children[i].nodeName === "DIV") {
                const question = document.getElementById("question" + questionNumber)
                let optionNumber = 0
                let checked = false
                for (let j = 0; j < question.children.length; j++) {
                    if (question.children[j].nodeName === "INPUT") {
                        if (question.children[j].checked) {
                            answers.push([questionNumber, optionNumber])
                            checked = true
                        }
                        optionNumber++
                    }
                }
                if (!checked) {
                    return alert("Missing answer in question " + (questionNumber + i))
                }
                questionNumber++
            }
        }
        Post(answers, "/group9/request/" + props.username + "/question", ratCallback)
    }

    const checkAnswerCallback = (response) => {
        let question = currentRatQuestion[0]
        let option = question.children[currentRatQuestion[1]]
        if (response.status === 200) {
            if (response.data.message === "Incorrect answer") {
                option.disabled = true
                option.checked = false
            } else {
                option.disabled = true
                for (let i = 0; i < question.children.length; i++) {
                    if (question.children[i].nodeName === "BUTTON") {
                        question.children[i].style.display = "none"
                    }
                }
                if (response.data.message === "Completed RAT") {
                    if(!alert('You have completed the team RAT')){window.location.reload();}
                }
            }
            currentRatQuestion = [null, null]
        } else {
            currentRatQuestion = [null, null]
            return alert("Something went wrong")
        }
    }

    const checkAnswer = (question, number) => {
        let answer = {
            "question": "",
            "option": ""
        }
        let optionNumber = 0
        for (let i = 0; i < question.children.length; i++) {
            if (question.children[i].nodeName === "INPUT") {
                if (question.children[i].checked) {
                    answer["question"] = number
                    answer["option"] = optionNumber
                    currentRatQuestion = [question, i]
                }
                optionNumber++
            }
        }
        if (currentRatQuestion[0] === null) {
            return alert("No input is checked")
        }
        Post(answer, "/group9/request/" + props.group + "/question", checkAnswerCallback)
    }

    const startTeam = (response) => {
        if (response.status === 200) {
            unWrapRat()
        }
        else {
            return alert("Some members are still doing the RAT or the team RAT has been completed")
        }
    }

    const teamRatLogic = () => {
        let rat = document.getElementById("ratDiv")
        rat.innerHTML = ""
        rat.innerHTML += "<h1>" + "Team RAT " + ratData.name + "</h1>"
        let button = document.createElement("button")
        button.type = "button"
        button.onclick = () => getRatFromCode(startTeam)
        button.innerText = "Start team RAT"
        rat.appendChild(button)
    }

    const unWrapRat = () => {
        let rat = document.getElementById("ratDiv")
        rat.innerHTML = ""
        if (canDoTeamRat) {
            rat.innerHTML += "<h1>" + "Team RAT " + ratData.name + "</h1>"
        } else {
            rat.innerHTML += "<h1>" + "RAT " + ratData.name + "</h1>"
        }
        for (let i = 0; i < ratData.questions.length; i++) {
            const question = ratData.questions[i]
            let optionWrapper = document.createElement("div")
            optionWrapper.setAttribute("id", "question" + i)
            optionWrapper.innerHTML = "<h4>" + (i + 1) + ": " + question[0] + "</h4>"

            for (let j = 0; j < question[1].length; j++) {
                let option = document.createElement("input")
                option.setAttribute("id", "option" + j + ":" + i)
                option.type = "radio"
                option.name = "question" + i
                optionWrapper.innerHTML += question[1][j]
                optionWrapper.appendChild(option)
                optionWrapper.innerHTML += "<br>"
            }

            if (canDoTeamRat) {
                let button = document.createElement("button")
                button.type = "button"
                button.onclick = () => checkAnswer(document.getElementById("question" + i), i)
                button.innerText = "Check answer"
                optionWrapper.appendChild(button)
            }

            rat.appendChild(optionWrapper)
        }
        if (!canDoTeamRat) {
            rat.innerHTML += "<br>"
            let button = document.createElement("button")
            button.type = "button"
            button.onclick = () => submitAnswers(document.getElementById("ratDiv"))
            button.innerText = "Submit answers"
            rat.appendChild(button)
        }
    }

    return (
        <div id="ratDiv">
            {
                ratData === null ?
                    <div>
                        <h2>Enter RAT-Code</h2>
                        <input type="text" id="code"/>
                        <button type="button" placeholder="RAT-code" onClick={() => getRatFromCode(setRat)}>Start RAT</button>
                    </div>
                :
                    canDoTeamRat ?
                        <div>
                            {teamRatLogic()}
                        </div>
                    :
                        <div>
                            {unWrapRat()}
                        </div>
            }
        </div>
    )
}

export default RatOverview