import Post from "./api/Post";

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
        Post(data, "/login", props.callback)
    }

    return (
        <>
            <h1>Online RAT</h1>
            <input type="text" id="username" placeholder="Username"/>
            <input type="text" id="password" placeholder="Password"/>
            <button type="button" onClick={() => loginRequest()}>Login</button>
        </>
    )
}

export default Login