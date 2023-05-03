import React, {useState} from "react";
import Login from "./Login"
import RatOverview from "./RatOverview"
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
                        <RatOverview
                            username={username}
                        />
                    :
                        <AdminOverview/>
            }
        </>
    )
};

export default Router;
