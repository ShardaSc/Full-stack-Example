import { data, Navigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import api from "../api"
import { REFRESH_TOKEN,ACCESS_TOKEN } from "../constants"
import { useState ,useEffect, Children} from "react"

function ProtectedRoute ({ childen }){
    const [isAuthorized , setIsAutorized] =useState(null)

    useEffect(() =>{
        auth().catch(() => setIsAutorized(false))
    }, [])
    
    const refreshtoken  = async () => {
        const refreshtoken = localStorage.getItem(REFRESH_TOKEN);

        try {
            const res = await api.post("/api/token/refresh",{
                refresh : refreshtoken,
            });
            if (res.status === 200){
                localStorage.setItem(ACCESS_TOKEN,res,data.access)
                setIsAutorized(true)
            }
            else{
                setIsAutorized(false)
            }
        } catch(error){
            console.log(error);
            setIsAutorized(false);

        }

    };

    const auth  = async() => {
        const token =localStorage.getItem(ACCESS_TOKEN);
        if(!token){
            setIsAutorized(false);
            return;
        }
        const decoded = jwtDecode(token);
        const tokenExpiration =decoded.exp;
        const now = Date.now ()/1000;

        if(tokenExpiration < now){
            await refreshtoken();
        }
        else{
            setIsAutorized(true);
        }
    };

    if (isAuthorized === null){
        return <div> Loading .....</div>;
    }

    return isAuthorized ? Children : <Navigate to="/login" />;
}

export default ProtectedRoute;