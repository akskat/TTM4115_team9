import React, {useState} from "react";
import Login from "./Login"
import RatOverview from "./RatOverview"
import AdminOverview from "./AdminOverview";

const Router = () => {
    const [username, setUsername] = useState("")
    const [group, setGroup] = useState("")

    const logInResponse = (response) => {
        if (response.status === 200) {
            setUsername(response.data.username)
            setGroup(response.data.group)
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
                    group !== "admin" ?
                        <RatOverview
                            username={username}
                            group={group}
                        />
                    :
                        <AdminOverview/>
            }
        </>
    )
};

export default Router;
