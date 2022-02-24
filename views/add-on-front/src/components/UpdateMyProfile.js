import axios from "axios"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router"

export default function UpdateMyProfile() {

    const navigate = useNavigate()
    const [currentUser, setCurrentUser] = useState()
    const [userName, setUserName] = useState()
    const [email, setEmail] = useState()
    const [photo, setPhoto] = useState()

    const getMe = async () => {
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            withCredentials: true,
        };
        try {
            const { data } = await axios.get(
                "http://localhost:5000/api/pfe/user/me",
                config
            );
            setCurrentUser(data.data.me);
            // setUserName(data.data.me.userName)
        } catch (error) {
            console.log(error.response.data.error.message);
        }
    };
    const onInputChange = (e) => {
        setPhoto(e.target.files[0]);
    };

    function refreshPage() {
        window.location.reload(false);
    }


    const updateHandler = async () => {

        const formData = new FormData();
        formData.append("userName", userName||currentUser.userName);
        formData.append("email", email||currentUser.email);
        formData.append("photo", photo);


        const config = {
            headers: {
                // "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            // withCredentials: true,
        };
        try {
            const { data } = await axios.patch(
                "http://localhost:5000/api/pfe/user/updateme",
                formData,
                config
            );

            refreshPage();
            // console.log(data)
        } catch (error) {
            console.log(error.response);
        }
    };

    useEffect(() => {
        if (!localStorage.getItem("authToken")) {
            navigate("/auth");
        }

        getMe();

    }, []);


    return (
        <>
            <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>


                <form className="sign-in-form">
                    <h2 className="title">Update Profile</h2>

                    <div className="input-field">
                        <i className="fas fa-user"></i>
                        <input type="text" placeholder="username" defaultValue={currentUser && currentUser.userName} onChange={(e) => setUserName(e.target.value)} />
                    </div>
                    <div className="input-field">
                        <i className="fas fa-user"></i>
                        <input type="email" placeholder="Email" defaultValue={currentUser && currentUser.email} onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    <div className="input-field" style={{display:"flex",alignItems:"center"}}>
                        <i className="fas fa-user"></i>
                        <input type="file" placeholder="new photo" onChange={onInputChange} />
                    </div>
                    <input
                        value="Update"
                        readOnly
                        className="btn solid"
                        style={{ textAlign: "center" }}
                        onClick={updateHandler}
                    />

                </form>





            </div>
        </>
    )
}