import React, { useState } from "react";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    checkpassword: "",
    checkbox: false,
  });
  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;

    let newValue;

    if (type === "checkbox") {
      newValue = checked;
    } else {
      newValue = value;
    }

    setFormData({
      ...formData,
      [name]: newValue,
    });
  };
  let submit = (e) => {
      e.preventDefault();
      if (formData.password !== formData.checkpassword) {
          return; // surface an error and return early
      } 
  };

  return (
    <>
      <form onSubmit={submit}>
        <h1>SignUp</h1>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          pattern="[A-Za-z]{3,9}"
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
        <input
          type="password"
          id="checkpassword"
          name="checkpassword"
          onChange={handleChange}
          value={formData.checkpassword}
          required
        />

      {formData.password !== "" &&
      formData.password !== formData.checkpassword && (
          <p>Passwords do not match</p>
        )}

        <label htmlFor="checkbox">CheckBox</label>
        <input
          type="checkbox"
          id="checkbox"
          name="checkbox"
          checked={formData.checkbox}
          onChange={handleChange}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
    </>
  );
};
export default SignUp;
