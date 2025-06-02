"use strict";

const editUserForm = document.querySelector("#editUserForm");
const formAlert = document.querySelector(".formAlert");
const passwordInput = document.querySelector("#passwordInput");
const salaryInput = document.querySelector("#salaryInput");
const currencySelect = document.querySelector("#currencySelect");
const logoutBtn = document.querySelector("#logoutBtn");

const API_URL = "http://127.0.0.1:3000/api";

var token = localStorage.getItem("access_token");

const refreshToken = async () => {
  const response = await fetch(`${API_URL}/user/refresh`, {
    method: "POST",
    credentials: "include",
  });

  const data = await response.json();
  if (data.status === "success") {
    // ESTABLECER EL NUEVO ACCESS TOKEN EN EL LOCAL STORAGE
    localStorage.setItem("access_token", data.token);
    // MODIFICAR LA VARIABLE TOKEN CON EL NUEVO ACCESS TOKEN
    token = localStorage.getItem("access_token");

    return data.status;
  }
  return data.status;
};

if (token) {
  editUserForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    formAlert.classList.add("alert-success");
    formAlert.style.display = "block";

    const password = passwordInput.value;
    const salary = salaryInput.value;
    const currency = currencySelect.value;

    try {
      let response = await fetch(`${API_URL}/user/edit`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify({ password, salary, currency }),
      });

      if (response.status == 401) {
        const newToken = await refreshToken();
        if (newToken == "success") {
          response = await fetch(`${API_URL}/user/edit`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-type": "application/json",
            },
            body: JSON.stringify({ password, salary, currency }),
          });
        }
      }

      const data = await response.json();

      if (data.status == "success") {
        document.location.href = "/homepage.html";
      } else {
        formAlert.classList.remove("alert-success");
        formAlert.classList.add("alert-danger");
        formAlert.innerHTML = data.message;
      }
    } catch (error) {
      console.log(error);
    }
  });
} else {
  document.location.href = "/index.html";
}

const logout = async () => {
  try {
    await fetch(`${API_URL}/user/logout`);
    localStorage.removeItem("access_token");
    localStorage.removeItem("expense");

    document.location.href = "/index.html";
  } catch (error) {
    console.log(error);
  }
};

logoutBtn.addEventListener("click", logout);
