"use strict";

const loginForm = document.querySelector("#loginForm");
const usernameInput = document.querySelector("#usernameInput");
const passwordInput = document.querySelector("#passwordInput");
const formAlert = document.querySelector(".formAlert");

const API_URL = "http://localhost:3000/api";

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  formAlert.classList.add("alert-success");
  formAlert.style.display = "block";

  const username = usernameInput.value;
  const password = passwordInput.value;

  try {
    const response = await fetch(`${API_URL}/user/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (data.status == "error") {
      formAlert.classList.replace("alert-success", "alert-danger");
      return (formAlert.innerHTML = data.message);
    }

    console.log(data);

    localStorage.setItem("access_token", data.token);

    document.location.href = "/homepage.html";
  } catch (error) {
    console.log(error);
  }
});
