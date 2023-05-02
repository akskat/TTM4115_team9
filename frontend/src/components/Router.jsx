import React, {useState} from "react";
import Login from "./Login"
import Overview from "./Overview"
import AdminOverview from "./AdminOverview";

const Router = () => {
    const [isAdmin, setIsAdmin] = useState(false)
    const [username, setUsername] = useState("user1")

    const logInResponse = (response) => {
        if (response.data.message === "admin") {
            setIsAdmin(true)
        }
        if (response.status === 200) {
            setUsername(response.data.username)
        }
        else {
            return alert(response)
        }

    }

    return (
        <>
            {
                username === "" ?
                    <Login
                        callback={logInResponse}
                    />
                :
                    isAdmin === false ?
                        <Overview
                            username={username}
                        />
                    :
                        <AdminOverview/>
            }
        </>
    )
};

export default Router;
