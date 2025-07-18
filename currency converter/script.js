document.addEventListener('DOMContentLoaded', () => {
  const amountInput = document.getElementById('amount');
  const fromCurrency = document.getElementById('from-currency');
  const toCurrency = document.getElementById('to-currency');
  const convertBtn = document.getElementById('convert-btn');
  const swapBtn = document.getElementById('swap-currencies');
  const resultDiv = document.getElementById('result');
  const loadingDiv = document.getElementById('loading');
  const conversionResult = document.getElementById('conversion-result');
  const fromAmount = document.getElementById('from-amount');
  const fromCurrencyText = document.getElementById('from-currency-text');
  const convertedAmount = document.getElementById('converted-amount');
  const toCurrencyText = document.getElementById('to-currency-text');
  const lastUpdated = document.getElementById('last-updated');

  const currencies = [
    'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'HKD', 'NZD',
    'INR', 'SGD', 'ZAR', 'SEK', 'NOK', 'DKK', 'KRW', 'BRL', 'MXN', 'RUB'
  ];

  function populateDropdown(select) {
    currencies.forEach(code => {
      const option = document.createElement('option');
      option.value = code;
      option.textContent = code;
      select.appendChild(option);
    });
  }

  populateDropdown(fromCurrency);
  populateDropdown(toCurrency);
  fromCurrency.value = 'USD';
  toCurrency.value = 'EUR';

  swapBtn.addEventListener('click', () => {
    const temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;
  });

  convertBtn.addEventListener('click', async () => {
    const amount = parseFloat(amountInput.value);
    const from = fromCurrency.value;
    const to = toCurrency.value;

    if (!amount || isNaN(amount)) {
      alert('Please enter a valid amount');
      return;
    }

    loadingDiv.classList.remove('hidden');
    resultDiv.classList.add('hidden');

    try {
      // ✅ Free real-time API
      const response = await fetch(`https://open.er-api.com/v6/latest/${from}`);
      const data = await response.json();

      if (!data || !data.rates || !data.rates[to]) {
        throw new Error('Invalid API response');
      }

      const rate = data.rates[to];
      const convertedValue = (amount * rate).toFixed(2);

      fromAmount.textContent = amount.toFixed(2);
      fromCurrencyText.textContent = from;
      convertedAmount.textContent = convertedValue;
      toCurrencyText.textContent = to;
      conversionResult.textContent = `${amount.toFixed(2)} ${from} = ${convertedValue} ${to}`;
      lastUpdated.textContent = `Updated: ${new Date(data.time_last_update_utc).toLocaleString()}`;

      resultDiv.classList.remove('hidden');
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to convert currencies. Please try again.');
    } finally {
      loadingDiv.classList.add('hidden');
    }
  });
});
