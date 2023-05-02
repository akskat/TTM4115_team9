import React, { useState, useEffect } from "react";
import PostMelding from "./api/PostMelding";

const Login = (props) => {
    const loginRequest = () => {
        const username = document.getElementById("username").value
        const password = document.getElementById("password").value

        if (username === "") {
            return alert("Missing username")
        }
        if (password === "") {
            return alert("Missing password")
        }

        const data = {
            "username": username,
            "password": password,
        }
        PostMelding(data, "/login", props.callback)
    }

    return (
        <>
            <input type="text" id="username" placeholder="Username"/>
            <input type="text" id="password" placeholder="Password"/>
            <button className="submit" type={"button"} onClick={() => loginRequest()}>Login</button>
        </>
    )
}

export default Login