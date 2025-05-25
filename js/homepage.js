"use strict";

const mainTitle = document.querySelector("#mainTitle");
const salary = document.querySelector("#salary");
const list = document.querySelector(".expensesList");

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
  const setProfile = async () => {
    let response = await fetch(`${API_URL}/user/profile`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status == 401) {
      const newToken = refreshToken();
      if (newToken == "success") {
        response = await fetch(`${API_URL}/user/profile`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    }

    const data = await response.json();

    mainTitle.innerHTML = `Bienvenido/a ${data.user.firstname} ${data.user.lastname}`;

    const formattedSalary = data.user.salary.toLocaleString("es-ES", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    salary.innerHTML = `Salario ${data.user.currency} ${formattedSalary}`;
  };

  setProfile();

  const expensesList = async () => {
    let response = await fetch(`${API_URL}/expense/list`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status == 401) {
      const newToken = refreshToken();
      if (newToken == "success") {
        response = await fetch(`${API_URL}/expense/list`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    }

    const data = await response.json();

    const expenses = data.expensesList;

    // expenses.forEach((expense) => {
    //   const description = document.createElement("h2");
    //   const amount = document.createElement("h2");
    //   description.innerHTML = expense.description;
    //   amount.innerHTML = expense.amount.toLocaleString("es-ES", {
    //     minimumFractionDigits: 2,
    //     maximumFractionDigits: 2,
    //   });

    //   list.appendChild(description);
    //   list.appendChild(amount);
    // });
  };

  expensesList();
} else {
  document.location.href = "/index.html";
}
