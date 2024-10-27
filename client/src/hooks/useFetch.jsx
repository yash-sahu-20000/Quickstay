import axios from "axios"
import { useEffect, useState } from "react"

const useFetch = (url) => {
    
    const [response, setResponse] = useState(null)
    const [loading, setLoading] = useState(null)
    const [error, setError] = useState(null)

    useEffect(()=>{
        const fetchData = async (url) => {
            try {
                setLoading(true);
                const res = await axios.get('http://localhost:1001'+url, { withCredentials: true })
                setResponse(res);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false)
            }
        } 

        
        fetchData(url)
    },[])
    
    const reFetch =  async () => {
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:1001'+url,{ withCredentials: true })
            setResponse(res);
            setLoading(false);
        } catch (error) {
            setError(error);
            setLoading(false)
        }
    } 

    return {response, loading, error, reFetch};

}

export default useFetch;