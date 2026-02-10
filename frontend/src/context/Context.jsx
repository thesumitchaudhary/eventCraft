import React, { useState, createContext } from "react";

export const Context = createContext(null);

export const ContextProvider = (props) => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [designation, setDesignation] = useState("");
  return (
    <Context.Provider
      value={{
        firstname,
        setFirstname,
        lastname,
        setLastname,
        email,
        setEmail,
        password,
        setPassword,
        phone,
        setPhone,
        designation,
        setDesignation
      }}
    >
      {props.children}
    </Context.Provider>
  );
};
