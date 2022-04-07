import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import axios from "axios";
import "react-responsive-modal/styles.css";
import { useNavigate } from "react-router"
export default function AllMacro() {
    const navigate = useNavigate();
    const location = useLocation();
    const [macros, setMacros] = useState();

    const getMacros = async () => {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          withCredentials: true,
        };
        try {
          const { data } = await axios.get(
            `http://${
              process.env.REACT_APP_IP_ADDRESS
            }:5000/api/pfe/user/projects/macros/allMacros/${
              location.pathname.split("/")[2]
            }`,
            config
          );
          setMacros(data.data.macros.macros);
        } catch (error) {
          console.log(error.response.data.error.message);
        }
      };
      useEffect(() => {
        if (!localStorage.getItem("authToken")) {
          navigate("/auth");
        }
    
        getMacros();
 
      }, []);
  return (
    <>
     {macros && macros.length ? (
                      macros.map((el) => (
                        <div
                          onClick={() =>
                            navigate(
                              `/project/${
                                location.pathname.split("/")[2]
                              }/macro/${el._id}`
                            )
                          }
                          className="box box-down "
                          style={{
                            width: "100%",
                            border: `2px solid #${Math.floor(
                              Math.random() * 16777215
                            ).toString(16)}`,
                          }}
                          key={el._id}
                        >
                          <div
                            style={{
                              display: "flex",
                              gap: "20%",
                              alignItems: "center",
                            }}
                          >
                            <img
                              style={{ width: "5em", height: "5em" }}
                              src={require(`../../img/macros/${el.icon}`)}
                              alt=""
                            />
                            <h2>{el.name}</h2>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              width: "100%",
                            }}
                          >
                            <p>{el.description}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <h3>
                        This Project didn't have any Macro , Please create one{" "}
                      </h3>
                    )}
    </>
  )
}
