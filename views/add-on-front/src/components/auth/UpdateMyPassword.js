import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";


export default function UpdateMyPassword() {
    const navigate = useNavigate()
    const [passwordCurrent, setCurrentPassword] = useState();
    const [password, setUpdatedPassword] = useState();
    const [confirmPassword, setConfirmUpdatedPassword] = useState();
    const [error,setError]=useState()



    const updateHandler = async () => {
        const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            withCredentials: true,
          };
        try {
            const { data } = await axios.patch(
                `http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/pfe/user/updatemypassword`,
                {passwordCurrent,password,confirmPassword},
                config
            );
            // console.log(data)
            localStorage.removeItem('authToken')
            navigate('/')
        } catch (error) {
            setError(error.response.data.message)
            console.log(error.response.data.message);
        }
    };

    return (
        <div style={{width:"100%",display:"flex",justifyContent:"center",alignItems:"center"}}>
            <form className="sign-in-form"  >
                <h2 className="title">Update Password</h2>
                {error && <h5 style={{ color: "#ff3333" }}>{error}</h5>}
                <div className="input-field">
                    <i className="fas fa-user"></i>
                    <input type="password" placeholder="current password" onChange={(e)=>setCurrentPassword(e.target.value)} />
                </div>
                <div className="input-field">
                    <i className="fas fa-user"></i>
                    <input type="password" placeholder="new password" onChange={(e)=>setUpdatedPassword(e.target.value)} />
                </div>
                <div className="input-field">
                    <i className="fas fa-user"></i>
                    <input type="password" placeholder="confirm new password" onChange={(e)=>setConfirmUpdatedPassword(e.target.value)} />
                </div>
                <input
                    defaultValue="Update"
                    readOnly
                    className="btns solid"
                    style={{ textAlign: "center" }}
                    // type="submit"
                    onClick={updateHandler}
                />

            </form>





        </div>
    )
}

