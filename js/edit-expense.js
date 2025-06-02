"use strict";

const editForm = document.querySelector("#editForm");
const formAlert = document.querySelector(".formAlert");
const expensiveInput = document.querySelector("#expensiveInput");
const descriptionTitle = document.querySelector(".descriptionTitle");
const amountInput = document.querySelector("#amountInput");
const amountTitle = document.querySelector(".amountTitle");
const logoutBtn = document.querySelector("#logoutBtn");

const API_URL = "http://127.0.0.1:3000/api";

var token = localStorage.getItem("access_token");

var currentExpense = JSON.parse(localStorage.getItem("expense"));

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
  descriptionTitle.innerHTML = currentExpense.description;
  const formattedAmount = currentExpense.amount.toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  amountTitle.innerHTML = formattedAmount;

  editForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    formAlert.classList.add("alert-success");
    formAlert.style.display = "block";

    const description = expensiveInput.value.toUpperCase();
    const amount = amountInput.value;

    try {
      let response = await fetch(
        `${API_URL}/expense/edit/${currentExpense._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json",
          },
          body: JSON.stringify({ description, amount }),
        }
      );

      if (response.status == 401) {
        const newToken = refreshToken();
        if (newToken == "success") {
          response = await fetch(
            `${API_URL}/expense/edit/${currentExpense._id}`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-type": "application/json",
              },
              body: JSON.stringify({ description, amount }),
            }
          );
        }
      }

      const data = await response.json();

      if (data.status == "success") {
        document.location.href = "/homepage.html";
      } else {
        formAlert.classList.replace("alert-success", "alert-danger");
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
