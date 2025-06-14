"use strict";

const recoveryForm = document.querySelector("#recoveryForm");
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

recoveryForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  formAlert.classList.add("alert-success");
  formAlert.style.display = "block";

  const username = usernameInput.value;
  const pwd = passwordInput.value;

  try {
    const response = await fetch(`${API_URL}/user/recovery-password`, {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ username, pwd }),
    });

    const data = await response.json();

    if (data.status == "error") {
      formAlert.classList.replace("alert-success", "alert-danger");
      return (formAlert.innerHTML = data.message);
    }

    formAlert.classList.replace("alert-danger", "alert-success");
    formAlert.innerHTML = data.message;

    usernameInput.value = "";
    passwordInput.value = "";
  } catch (error) {
    console.log(error);
  }
});
