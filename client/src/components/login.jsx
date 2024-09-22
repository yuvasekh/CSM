import { useState, useEffect } from "react";
import { Formik, Field, Form } from "formik";
import { EyeTwoTone, EyeInvisibleOutlined } from "@ant-design/icons";
import { message } from "antd";
import { loginService } from "./api.js";
import MSS from "/public/miracle-logo.svg";
import * as CryptoJS from "crypto-js";
import { useNavigate, redirect } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import {jwtDecode} from "jwt-decode";
import axios from "axios";
import {Input} from "antd"
const Login = () => {
  const navigate = useNavigate();

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  


  const VITE_API_KEY = import.meta.env.VITE_API_KEY;





  const CustomInput = (props) => (
    <Input
      {...props}
   
      placeholder="Username"
      type="text"
    />
  );
  const CustomHideInput = (props) => (
  
      <Input.Password
        
      
        placeholder="Password"
        {...props}
      />
     

   
  );

  function set(keys, value) {
    var key = CryptoJS.enc.Utf8.parse(keys);
    var iv = CryptoJS.enc.Utf8.parse(keys);
    var encrypted = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(value.toString()),
      key,
      {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    return encrypted.toString();
  }

  const login = (data) => {
    const { name, password } = data;

    if (name !== "" && password !== "") {
      setLoading(true);
      var usernameCipher = name;
      var passwordCipher = password;

      let key = VITE_API_KEY.replace("#", "$");
  
      console.log(key,name,password,"artelli")
      usernameCipher = set(key, name);
      passwordCipher = set(key, password);

      let payload = { loginId: usernameCipher, password: passwordCipher };

      loginService(payload)
        .then((res) => {
          console.log(payload,"payload")
          if (res.data.success) {
            setLoading(false);
            localStorage.setItem("token", res.data.token);
            navigate("/home");
          } else {
            setLoading(false);
            message.error("Invalid credentials.");
            redirect("/home");
          }
        })
        .catch((e) => {
          console.log(e,"error")
          setLoading(false);
        });
    } else {
      message.error("Usename or Password cannot be empty.");
      redirect("/home");
      setLoading(false);
    }
  };
  const antIcon = (
    <LoadingOutlined style={{ fontSize: 16, color: "white" }} spin />
  );
  return (
    <div className="flex">
      <div className="flex-[2]">
        <div className="bg-cover  bg-[#232332d4] bg-blend-overlay  bg-[url('/bg.jpg')] h-screen ">
          <div className="h-screen text-4xl   flex items-start p-20 flex-col justify-end text-miracle-blue">
            miraAI Recruitment
            <p className="text-sm text-[#FFFF]">
              {" "}
              © {new Date().getFullYear()} Miracle Software Systems, Inc.{" "}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-1  justify-center">
        <div className="flex items-center justify-center p-1 text-sm gap-3 flex-col">
          <img src={MSS} className="self-start h-12" />
          <div className="">
            <Formik
              initialValues={{
                name: "",
                password: "",
              }}
              onSubmit={async (values) => {
                login(values);
              }}
            >
              <Form>
                <div className="flex flex-col gap-4  w-[320px] mb-12">
                  <div className="relative border-2">
                    <label className="block p-2 text-sm font-semibold text-miracle-black  ">
                      Username:
                    </label>
                    <Field name="name" as={CustomInput} />
                  </div>
                  <div className="relative border-2">
                    <label className="block p-2 text-sm font-semibold text-miracle-black">
                      Password:
                    </label>
                    <Field name="password" as={CustomHideInput} />
                  </div>

                  <button
                    className="bg-[#00aae7] hover:bg-[#33bbec] text-white font-bold py-2 px-4 rounded ml-auto col-span-2 flex items-center justify-end gap-1"
                    type="submit"
                  >
                    {loading && <Spin indicator={antIcon} />}
                    Login
                  </button>
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Login;
