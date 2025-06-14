"use strict";

const mainTitle = document.querySelector("#mainTitle");
const salaryTitle = document.querySelector("#salaryTitle");
const total = document.querySelector("#total");
const list = document.querySelector(".expensesList");
const logoutBtn = document.querySelector("#logoutBtn");
const historicalForm = document.querySelector("#historicalForm");
const monthInput = document.querySelector("#monthInput");
const yearInput = document.querySelector("#yearInput");
const formAlert = document.querySelector(".formAlert");
const toBePaid = document.querySelector("#toBePaid");
const paid = document.querySelector("#paid");

// API URL en desarrollo
// const API_URL = "http://127.0.0.1:3000/api";

// API URL en producción
const API_URL = "https://mybalance-backend.onrender.com/api";

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

    mainTitle.innerHTML = `Bienvenido/a ${data.userFound.firstname} ${data.userFound.lastname}`;

    const formattedSalary = data.userFound.salary.toLocaleString("es-ES", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    salaryTitle.innerHTML = `Salario ${data.userFound.currency} ${formattedSalary}`;
  };

  setProfile();

  const unpaidList = async () => {
    try {
      let response = await fetch(`${API_URL}/expense/unpaid-list`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
      });

      if (response.status == 401) {
        const newToken = await refreshToken();
        if (newToken == "success") {
          response = await fetch(`${API_URL}/expense/unpaid-list`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-type": "application/json",
            },
          });
        }
      }

      const data = await response.json();

      return data.toBePaid;
    } catch (error) {
      console.log(error);
    }
  };

  const paidList = async () => {
    try {
      let response = await fetch(`${API_URL}/expense/paid-list`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
      });

      if (response.status == 401) {
        const newToken = await refreshToken();
        if (newToken == "success") {
          response = await fetch(`${API_URL}/expense/paid-list`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-type": "application/json",
            },
          });
        }
      }

      const data = await response.json();

      return data.paid;
    } catch (error) {
      console.log(error);
    }
  };

  const payExpense = async (id, container, btn) => {
    try {
      let response = await fetch(`${API_URL}/expense/pay/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status == 401) {
        const newToken = await refreshToken();
        if (newToken == "success") {
          response = await fetch(`${API_URL}/expense/pay/${id}`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` },
          });
        }
      }

      const data = await response.json();

      if (data.status == "success") {
        document.location.href = "/homepage.html";
      }
    } catch (error) {
      console.log(error);
    }
  };

  const unmarkExpense = async (id, container, btn) => {
    let response = await fetch(`${API_URL}/expense/unmark/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status == 401) {
      const newToken = await refreshToken();
      if (newToken == "success") {
        response = await fetch(`${API_URL}/expense/unmark/${id}`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    }

    const data = await response.json();

    if (data.status == "success") {
      document.location.href = "/homepage.html";
    }
  };

  const deleteExpense = async (id) => {
    let response = await fetch(`${API_URL}/expense/remove/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status == 401) {
      const newToken = await refreshToken();
      if (newToken == "success") {
        response = await fetch(`${API_URL}/expense/remove/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    }

    const data = await response.json();

    if (data.status == "success") {
      document.location.href = "/homepage.html";
    }
  };

  const expensesList = async () => {
    let response = await fetch(`${API_URL}/expense/list`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status == 401) {
      const newToken = await refreshToken();
      if (newToken == "success") {
        response = await fetch(`${API_URL}/expense/list`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    }

    const data = await response.json();

    historicalForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      formAlert.style.display = "block";
      formAlert.classList.add("alert-danger");
      formAlert.innerHTML = data.message;
    });

    if (data.expensesList) {
      const expenses = data.expensesList;
      const currency = data.user.currency;
      const salary = data.user.salary;

      const formattedToPaid = data.toBePaid.toLocaleString("es-ES", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      const formattedPaid = data.paid.toLocaleString("es-ES", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      toBePaid.innerHTML = `Por pagar ${formattedToPaid}`;
      paid.innerHTML = `Pagado ${formattedPaid}`;

      historicalForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const month = monthInput.value.toUpperCase();
        const year = yearInput.value;

        try {
          let response = await fetch(`${API_URL}/expense/set-period`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-type": "application/json",
            },
            body: JSON.stringify({ month, year, expenses }),
          });

          if (response.status == 401) {
            const newToken = await refreshToken();
            if (newToken == "success") {
              response = await fetch(`${API_URL}/expense/set-period`, {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-type": "application/json",
                },
                body: JSON.stringify({ month, year }),
              });
            }
          }

          const data = await response.json();

          if (data.status == "success") {
            formAlert.style.display = "none";
            document.location.href = "/homepage.html";
          } else {
            formAlert.style.display = "block";
            formAlert.classList.add("alert-danger");
            formAlert.innerHTML = data.message;
          }
        } catch (error) {
          console.log(error);
        }
      });

      let totalExpenses = 0;

      expenses.forEach((expense) => {
        const expenseContainer = document.createElement("div");
        expenseContainer.classList.add("expense");
        if (expense.currentState == "paid") {
          expenseContainer.style.backgroundColor = "#2ee82e";
        }
        const description = document.createElement("div");
        description.classList.add("description", "fw-bold");
        description.innerHTML = expense.description;
        const amount = document.createElement("div");
        amount.classList.add("amount");
        const formattedAmount = expense.amount.toLocaleString("es-ES", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        amount.innerHTML = `${currency} ${formattedAmount}`;
        const btnContainer = document.createElement("div");
        btnContainer.classList.add("btn-container");

        const editBtn = document.createElement("button");
        editBtn.classList.add("btn", "btn-warning");
        editBtn.innerHTML = "Editar";
        editBtn.addEventListener("click", () => {
          localStorage.setItem("expense", JSON.stringify(expense));
          document.location.href = "/edit-expense.html";
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("btn", "btn-danger");
        deleteBtn.innerHTML = "Eliminar";
        deleteBtn.addEventListener("click", () => {
          deleteExpense(expense._id);
        });

        btnContainer.appendChild(editBtn);
        btnContainer.appendChild(deleteBtn);

        const paidBtn = document.createElement("button");

        if (expense.currentState != "paid") {
          paidBtn.classList.add("btn", "btn-success");
          paidBtn.innerHTML = "Pagar";
          paidBtn.addEventListener("click", () => {
            if (paidBtn.innerHTML == "Pagar") {
              payExpense(expense._id, expenseContainer, paidBtn);
            } else if (paidBtn.innerHTML == "Desmarcar") {
              unmarkExpense(expense._id, expenseContainer, paidBtn);
            }
          });
        } else {
          paidBtn.classList.add("btn", "btn-danger");
          paidBtn.innerHTML = "Desmarcar";
          paidBtn.addEventListener("click", () => {
            if (paidBtn.innerHTML == "Pagar") {
              payExpense(expense._id, expenseContainer, paidBtn);
            } else if (paidBtn.innerHTML == "Desmarcar") {
              unmarkExpense(expense._id, expenseContainer, paidBtn);
            }
          });
        }

        btnContainer.appendChild(paidBtn);
        expenseContainer.appendChild(description);
        expenseContainer.appendChild(amount);
        expenseContainer.appendChild(btnContainer);

        list.appendChild(expenseContainer);

        totalExpenses += expense.amount;
      });

      const result = salary - totalExpenses;

      const formattedTotal = result.toLocaleString("es-ES", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      total.innerHTML = `Restante ${currency} ${formattedTotal}`;
    } else {
      total.innerHTML = data.message;
    }
  };

  expensesList();
} else {
  document.location.href = "/index.html";
}

const logout = async () => {
  try {
    const response = await fetch(`${API_URL}/user/logout`);

    const data = await response.json();

    console.log(data);

    // if (data.status == "success") {
    //   localStorage.removeItem("access_token");
    //   localStorage.removeItem("expense");

    //   document.location.href = "/index.html";
    // }
  } catch (error) {
    console.log(error);
  }
};

logoutBtn.addEventListener("click", logout);
