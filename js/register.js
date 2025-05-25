"use strict";

const registerForm = document.querySelector("#registerForm");
const firstnameInput = document.querySelector("#firstnameInput");
const lastnameInput = document.querySelector("#lastnameInput");
const usernameInput = document.querySelector("#usernameInput");
const passwordInput = document.querySelector("#passwordInput");
const formAlert = document.querySelector(".formAlert");

const API_URL = "http://localhost:3000/api";

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  formAlert.classList.add("alert-success");
  formAlert.style.display = "block";

  const firstname = firstnameInput.value;
  const lastname = lastnameInput.value;
  const username = usernameInput.value;
  const password = passwordInput.value;

  try {
    const response = await fetch(`${API_URL}/user/register`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ firstname, lastname, username, password }),
    });

    const data = await response.json();

    if (data.status == "error") {
      formAlert.classList.replace("alert-success", "alert-danger");
      return (formAlert.innerHTML = data.message);
    }

    firstnameInput.value = "";
    lastnameInput.value = "";
    usernameInput.value = "";
    passwordInput.value = "";

    formAlert.innerHTML = data.message;
  } catch (error) {
    console.log(error);
  }
});
