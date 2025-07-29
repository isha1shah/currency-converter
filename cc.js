document.addEventListener("DOMContentLoaded", () => {
  const fromCurr = document.querySelector("#from-currency");
  const toCurr = document.querySelector("#to-currency");
  const dropdowns = document.querySelectorAll("select");
  const amountInput = document.querySelector("#amount");
  const convertBtn = document.querySelector("#convert-btn");
  const msg = document.querySelector("#exchange-msg");

  convertBtn.addEventListener("click", () => {
  convertBtn.style.backgroundColor = "#9a5da6ff"; 
  convertBtn.style.color = "#fff"; 

  setTimeout(() => {
    convertBtn.style.backgroundColor = "rgb(57, 43, 71)"; 
    convertBtn.style.color = "white";  
  },250);    
});


  //  Populate dropdowns
  dropdowns.forEach((select) => {
    for (let currencyCode in countryList) {
      const option = document.createElement("option");
      option.value = currencyCode;
      option.innerText = currencyCode;

      // Set defaults
      if (select.name === "from" && currencyCode === "USD") {
        option.selected = true;
      } else if (select.name === "to" && currencyCode === "INR") {
        option.selected = true;
      }

      select.appendChild(option);
    }

    // Flag change handler
    select.addEventListener("change", (e) => {
      updateFlag(e.target);
    });
  });

  // Flag updater
  function updateFlag(element) {
    const currCode = element.value;
    const countryCode = countryList[currCode];
    const img = element.parentElement.querySelector("img");
    img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
  }

  //Currency converter
  async function updateExchangeRate() {
  let amount = amountInput.value;

  if (amount === "" || isNaN(amount) || amount <= 0) {
    amount = 1;
    amountInput.value = "1";
  }

  const from = fromCurr.value;
  const to = toCurr.value;

  const url = `https://open.er-api.com/v6/latest/${from}`;
  console.log("Requesting:", url);

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data || !data.rates || !data.rates[to]) {
      throw new Error("Invalid exchange rate data");
    }

    const rate = data.rates[to];
    const finalAmount = (amount * rate).toFixed(2);

    msg.innerText = `${amount} ${from} = ${finalAmount} ${to}`;
  } catch (error) {
    console.error("Error during fetch:", error);
    msg.innerText = "Error fetching exchange rate!";
  }
}

  // Button click triggers fetch
  convertBtn.addEventListener("click", (e) => {
    e.preventDefault();
    updateExchangeRate();
  });

  //  Fetch initial rate
  updateExchangeRate();

}); 
