import React, { useState, useEffect} from "react";
import Post from "./api/Post";

const RatOverview = (props) => {
    const [ratData, setRatData] = useState(null)
    const [ratCode, setRatCode] = useState("")
    const [canDoTeamRat, setCanDoTeamRat] = useState(false)
    const [currentRatQuestion, setCurrentRatQuestion] = useState(null)

    const setRat = (response) => {
        if (response.status === 200) {
            setRatData(response.data)
        }
        else {
            return alert(response)
        }
    }

    const ratCallback = (response) => {
        if (response.status === 200) {
            console.log("OK")
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
                return alert("Missing RAT-code")
            }
            setRatCode(code)
        }

        const data = {
            "code": ratCode
        }
        Post(data, "/group9/request/" + props.username + "/rat", callback)
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

    const unWrapRat = () => {
        let rat = document.getElementById("ratDiv")
        rat.innerHTML = ""
        rat.innerHTML += "<h1>" + "RAT " + ratData.name + "</h1>"
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
            rat.appendChild(optionWrapper)
        }
        rat.innerHTML += "<br>"
        let button = document.createElement("button")
        button.type = "button"
        button.onclick = () => submitAnswers(document.getElementById("ratDiv"))
        button.innerText = "Submit answers"
        rat.appendChild(button)
    }

    const checkAnswerCallback = (response) => {
        let question = currentRatQuestion[0]
        let option = question[currentRatQuestion[1]]
        if (response === 200) {
            option.style.color = "green"
            option.disabled = true
            for (let i = 0; i < question.children.length; i++) {
                if (question.children[i].nodeName === "BUTTON") {
                    question.children[i].style.disabled = true
                }
            }
            if (response.data.message === "Completed RAT") {
                return alert("You have colpeted the RAT")
            }
        } else {
            option.style.color = "red"
            option.disabled = true
            option.checked = false
        }
    }

    const checkAnswer = (question, number) => {
        let answer = []
        let optionNumber = 0
        for (let i = 0; i < question.children.length; i++) {
            if (question.children[i].nodeName === "INPUT") {
                if (question.children[i].checked) {
                    answer.push(number, optionNumber)
                    setCurrentRatQuestion([question, i])
                }
                optionNumber++
                if (currentRatQuestion != null) {
                    return alert("No input is checked")
                }
            }
        }
        Post(answer, "/group9/request/" + props.group + "/question", checkAnswerCallback)
    }

    const unWrapTeamRat = () => {
        let rat = document.getElementById("ratDiv")
        rat.innerHTML = ""
        rat.innerHTML += "<h1>" + "RAT " + ratData.name + "</h1>"
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

            let button = document.createElement("button")
            button.type = "button"
            button.onclick = () => checkAnswer(document.getElementById("question" + i), i)
            button.innerText = "Chekc answer"
            rat.appendChild(optionWrapper)
            rat.innerHTML += "<br>"
        }
    }


    const startTeam = (response) => {
        if (response.status === 200) {
            unWrapTeamRat()
        }
        else {
            return alert("Some members are still doing the RAT")
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