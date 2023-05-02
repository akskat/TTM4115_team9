import axios from "axios";

const PostMelding = (data, url, callBack) => {
    const headers = {
        'Content-Type': 'application/json'
    }
    axios.post("http://localhost:5000" + url, data, {headers})
        .then(response => callBack(response))
        .catch(error => callBack(error.toString()));
};

export default PostMelding;
