import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { MdDelete, MdMode } from "react-icons/md";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import "../../styles/auth.css";
import { css } from "@emotion/react";
import ClockLoader
from "react-spinners/ClockLoader";

export default function Users() {
  const navigate = useNavigate();
  const [error, setError] = useState();
  const [users, setUsers] = useState([]);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [file, setFile] = useState(null);
  const [open, setOpen] = useState(false);
  const [updatedUser, setUpdatedUser] = useState();
  const override = css`
  display: block;
  margin: auto auto;
  border-color: #231E39;
`;
  const onOpenModal = (user) => {
    setUserName(user.userName)
    setEmail(user.email)
    setRole(user.role)
    setUpdatedUser(user);
    return setOpen(true);
  };
  const onCloseModal = () => {setOpen(false)};
  const onInputChange = (e) => {
    setFile(e.target.files[0]);
  };
  const getUsers = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      withCredentials: true,
    };
    try {
      const { data } = await axios.get(
        `http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/pfe/user/`,
        config
      );
      // console.log(data);
      setUsers(data.data.users);
    } catch (error) {
      setError(error.response.data.error.message);
      console.log(error.response.data.error.message);
    }
  };
  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      navigate("/auth");
    }

    getUsers();
  }, []);
  function refreshPage() {
    window.location.reload(false);
  }

  const deleteHandling = async (id) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      withCredentials: true,
    };
    try {
      const { data } = await axios.delete(
        `http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/pfe/user/${id}`,
        config
      );
      refreshPage();
    } catch (error) {
      console.log(error.response.data.message);
    }
  };
  // const nav = (user) => {
  //   navigate("/users/update", { state: { updatedUser: user } });
  // };
  const updateHandler = async (user) => {
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("email", email);
    formData.append("role", role);
    formData.append("photo", file);

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };
    try {
      const { data } = await axios.patch(
        `http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/pfe/user/${user._id}`,
        formData,
        config
      );
      refreshPage();
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  return (
    <>
        <Modal open={open} onClose={onCloseModal} center>
        <form className="sign-in-form">
          <h2 className="title">Update User</h2>
          <div className="input-field">
            <i className="fas fa-user"></i>
            <input
              type="text"
              placeholder="Name"
              // value={userName}
              defaultValue={updatedUser && updatedUser.userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div className="input-field">
            <i className="fas fa-user"></i>
            <input
              type="email"
              placeholder="Email"
              defaultValue={updatedUser && updatedUser.email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-field">
            <i className="fas fa-user"></i>
            <input
              type="role"
              placeholder="role"
              defaultValue={updatedUser && updatedUser.role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>
          
            <div
              className="input-field"
              style={{ display: "flex", alignItems: "center", gap: "2em" }}
            >
              <i className="fas fa-lock"></i>
              <input type="file" onChange={onInputChange} />
            </div>
         

          <input
            onClick={() => updatedUser && updateHandler(updatedUser)}
            readOnly
            value="Update"
            className="btns solid"
            style={{ textAlign: "center" }}
          />
        </form>
      </Modal>
      {users?(
        <div style={{width:"100%"}}>
        <div style={{ display: "flex", width: "100%" }}>
          <div
            style={{
              width: "  100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            {users &&
              users.map((el) => (
                <div
                  key={el._id}
                  style={{
                    display: "flex",
                    padding: "1em 0",
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  {el.photo && (
                    <>
                      <div style={{ width: "7%" }}>
                        <img
                          style={{
                            width: "100%",
                            height: "100%",
                            backgroundPosition: "center",
                            borderRadius: "50%",
                          }}
                          src={require(`../../img/users/${el.photo}`)}
                        />
                      </div>
                      <div style={{ width: "20%" }}>
                      <h2 style={{ width: "100%",fontSize:'100%' }}>
                        {el.userName} <br />
                        {el.email}
                      </h2>
                      </div>

                      <div style={{ gap: "0.3em", display: "flex" ,}}>
                        <MdDelete
                          style={{
                            height: "2em",
                            width: "2em",
                            cursor: "pointer",
                          }}
                          onClick={() =>window.confirm("Are you sure to delete This user ?")&&deleteHandling(el._id)}
                        />
                        <MdMode
                          onClick={() => onOpenModal(el)}
                          style={{
                            height: "2em",
                            width: "2em",
                            cursor: "pointer",
                          }}
                        />
                      </div>
                    </>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
      ):(
<ClockLoader color="#231E39" loading={true} css={override} size={150} />
      )}
       </>
    
  );
}
