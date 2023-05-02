import {useState, useEffect} from "react";
import axios from 'axios';

const GetMelding = (path) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect( () => {
        const getData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get("http://localhost:5000" + path);
                response && setData(response.data);
            } catch (err) {
                setError(err.toString());
            } finally {
                setLoading(false);
            }
        };

        getData();
    }, [path]);

    return {
        data, loading, error
    }
};

export default GetMelding;
