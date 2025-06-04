const apiUrl = "https://www.cbr-xml-daily.ru/daily_json.js";
const currencyList = document.getElementById("currency-list");
const resultSpan = document.getElementById("result");
const currencyName = document.getElementById("currency-name");
const amountInput = document.getElementById("amount");

let currentRate = 1;

fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
        const currencies = data.Valute;

        Object.values(currencies).forEach((currency) => {
            const diff = currency.Value - currency.Previous;
            const diffClass = diff > 0 ? "positive" : "negative";
            const sign = diff > 0 ? "+" : "";

            const col = document.createElement("div");
            col.className = "col-12 col-sm-6 col-md-4 col-lg-3";

            col.innerHTML = `
        <div class="card h-100 p-3" data-bs-toggle="modal" data-bs-target="#convertModal" data-rate="${currency.Value}" data-name="${currency.Name}">
          <div class="card-body">
            <h5 class="card-title">${currency.Name} <span class="badge bg-secondary">${currency.CharCode}</span></h5>
            <p class="card-text">Курс: <strong>${currency.Value.toFixed(2)}</strong> ₽</p>
            <p class="card-text ${diffClass}">Динамика: ${sign}${diff.toFixed(2)} ₽</p>
          </div>
        </div>
      `;

            currencyList.appendChild(col);
        });

        const modal = document.getElementById("convertModal");
        modal.addEventListener("show.bs.modal", function (event) {
            const card = event.relatedTarget;
            const rate = parseFloat(card.getAttribute("data-rate"));
            const name = card.getAttribute("data-name");

            currentRate = rate;
            currencyName.textContent = `Конвертация: ${name}`;
            amountInput.value = "";
            resultSpan.textContent = "-";
        });

        amountInput.addEventListener("input", () => {
            const amount = parseFloat(amountInput.value);
            if (!isNaN(amount)) {
                resultSpan.textContent = (amount * currentRate).toFixed(2);
            } else {
                resultSpan.textContent = "-";
            }
        });
    })
    .catch((err) => {
        currencyList.innerHTML = `<p class="text-danger">Ошибка загрузки данных: ${err.message}</p>`;
    });
