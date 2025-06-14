"use strict";

const mainTitle = document.querySelector("#mainTitle");
const logoutBtn = document.querySelector("#logoutBtn");
const mainCointainer = document.querySelector("#mainCointainer");

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
  const showHistorical = async () => {
    let response = await fetch(`${API_URL}/expense/historical`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    });

    if (response.status == 401) {
      const newToken = refreshToken();
      if (newToken == "success") {
        response = await fetch(`${API_URL}/expense/historical`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json",
          },
        });
      }
    }

    const data = await response.json();

    if (data.periods) {
      const periods = data.periods;

      let counter = 1;

      for (const period in periods) {
        const accordionContainer = document.createElement("div");
        accordionContainer.classList.add("accordion");
        accordionContainer.setAttribute("id", "accordionExample");
        const accordionItem = document.createElement("div");
        accordionItem.classList.add("accordion-item");
        const items = periods[period];
        const accordionHeader = document.createElement("h2");
        accordionHeader.classList.add("accordion-header");

        const accordionBtn = document.createElement("button");
        accordionBtn.classList.add("accordion-button");
        accordionBtn.setAttribute("type", "button");
        accordionBtn.setAttribute("data-bs-toggle", "collapse");
        accordionBtn.setAttribute("data-bs-target", `#collapse${counter}`);
        accordionBtn.setAttribute("aria-expanded", "true");
        accordionBtn.setAttribute("aria-controls", `collapse${counter}`);
        accordionBtn.innerHTML = period;

        const collapseOne = document.createElement("div");
        collapseOne.classList.add("accordion-collapse", "collapse");
        collapseOne.setAttribute("data-bs-parent", "#accordionExample");
        collapseOne.setAttribute("id", `collapse${counter}`);

        const accordionBody = document.createElement("div");
        accordionBody.classList.add("accordion-body");

        const ul = document.createElement("ul");
        for (const item in items) {
          const formattedAmount = items[item].amount.toLocaleString("es-ES", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
          const li = document.createElement("li");
          li.innerHTML = `${items[item].description} - ${items[item].period} - ${formattedAmount}`;
          ul.appendChild(li);
        }

        accordionBody.appendChild(ul);

        collapseOne.appendChild(accordionBody);
        accordionHeader.appendChild(accordionBtn);

        accordionItem.appendChild(accordionHeader);
        accordionItem.appendChild(collapseOne);
        accordionContainer.appendChild(accordionItem);

        mainCointainer.appendChild(accordionContainer);
        counter++;
      }
    } else {
      const subtitle = document.createElement("h2");
      subtitle.classList.add("fs-2", "fw-bold", "text-center");
      subtitle.innerHTML = data.message;
      mainCointainer.appendChild(subtitle);
    }
  };

  showHistorical();
} else {
  document.location.href = "/index.html";
}

const logout = async () => {
  try {
    await fetch(`${API_URL}/user/logout`, {
      method: "POST",
      credentials: "include",
    });

    localStorage.removeItem("access_token");
    localStorage.removeItem("expense");

    document.location.href = "/index.html";
  } catch (error) {
    console.log(error);
  }
};

logoutBtn.addEventListener("click", logout);
