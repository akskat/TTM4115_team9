import React, {useState} from "react";
import Login from "./Login"
import Overview from "./Overview"

const Router = () => {
    const [loggedIn, setLoggedIn] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)

    const logInResponse = (response) => {
        if (response.status === 200) {
            console.log("logged")
            setLoggedIn(true)
        }
        if (response.data.data === "admin") {
            console.log("logg234234ed")

            setIsAdmin(true)
        }
    }

    return (
        <>
            {
                loggedIn === false ?
                    <Login
                        callback={logInResponse}
                    />
                :
                    <Overview/>
            }
        </>
    )
};

export default Router;
