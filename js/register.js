"use strict";

const registerForm = document.querySelector("#registerForm");
const firstnameInput = document.querySelector("#firstnameInput");
const lastnameInput = document.querySelector("#lastnameInput");
const usernameInput = document.querySelector("#usernameInput");
const passwordInput = document.querySelector("#passwordInput");
const formAlert = document.querySelector(".formAlert");

// API URL en desarrollo
// const API_URL = "http://127.0.0.1:3000/api";

// API URL en producción
const API_URL = "https://mybalance-backend.onrender.com/api";

const loggedUser = async () => {
  const response = await fetch(`${API_URL}/user/logged`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (data.loggedIn) {
    window.location.href = "/homepage.html";
  }
};

loggedUser();

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

    formAlert.classList.remove("alert-danger");
    formAlert.classList.add("alert-success");
    formAlert.innerHTML = data.message;
  } catch (error) {
    console.log(error);
  }
});
