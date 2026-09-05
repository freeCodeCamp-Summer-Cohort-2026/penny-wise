import React, { useState } from "react";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    checkbox: false,
  });

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const submit = (e) =>{
    e.preventDefault();
  }


  return (
    <>
      <form onSubmit={submit}>
        <h1>Login</h1>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          pattern="*[A-Z]"
          minLength="3"
          maxLength="9"
          onChange={handleChange}
          value={formData.username}
          required
        />

        <label htmlFor="e-mail">E-mail</label>
        <input
          type="email"
          pattern=""
          id="e-mail"
          name="email"
          onChange={handleChange}
          value={formData.email}
          required
        />

        <label htmlFor="Password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          minLength="8"
          maxLength="20"
          pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}"
          onChange={handleChange}
          value={formData.password}
          required
        />

        <label htmlFor="checkbox">CheckBox</label>
        <input
          type="checkbox"
          id="checkbox"
          name="checkbox"
          checked={formData.checkbox}
          onChange={handleChange}
          required
        />
       <button type="submit">Log In</button>
      </form>
    </>
  );
};
export default LoginPage;
