let portfolio = [];

async function fetchPriceData(currency = 'USD') {
    const btcPriceUrl = `https://api.coindesk.com/v1/bpi/currentprice/${currency}.json`;
    const goldPriceUrl = 'https://data-asg.goldprice.org/dbXRates/USD';

    const [btcResponse, goldResponse] = await Promise.all([fetch(btcPriceUrl), fetch(goldPriceUrl)]);

    const btcData = await btcResponse.json();
    const goldData = await goldResponse.json();

    const btcPrice = btcData.bpi[currency].rate_float;
    const goldPricePerOunce = goldData.items[0].xauPrice;

    return { btcPrice, goldPricePerOunce };
}

async function calculateGains() {
    document.getElementById('loading').style.display = 'block';

    const bitcoinStack = document.getElementById('bitcoinStack').value;
    const currency = document.getElementById('currency').value;
    const compareDate = document.getElementById('dateCompare').value;

    if (!bitcoinStack) {
        alert("Please enter your Bitcoin stack.");
        document.getElementById('loading').style.display = 'none';
        return;
    }

    const { btcPrice, goldPricePerOunce } = await fetchPriceData(currency);

    const usdValue = bitcoinStack * btcPrice;
    const goldValue = usdValue / goldPricePerOunce;

    let comparisonText = '';
    if (compareDate) {
        const historicalBtcPrice = await fetchHistoricalPrice(compareDate, currency);
        const historicalValue = bitcoinStack * historicalBtcPrice;
        comparisonText = `<p>Compared to ${compareDate}: ${currency} ${historicalValue.toFixed(2)}</p>`;
    }

    document.getElementById('result').innerHTML = `
        <p>${currency} Value: ${usdValue.toFixed(2)}</p>
        <p>Gold Value: ${goldValue.toFixed(2)} ounces</p>
        ${comparisonText}
    `;
    document.getElementById('loading').style.display = 'none';

    updateChart(currency, usdValue);
}

async function fetchHistoricalPrice(date, currency) {
    const response = await fetch(`https://api.coindesk.com/v1/bpi/historical/close.json?currency=${currency}&start=${date}&end=${date}`);
    const data = await response.json();
    return data.bpi[date];
}

function savePortfolio() {
    const bitcoinStack = document.getElementById('bitcoinStack').value;
    const currency = document.getElementById('currency').value;

    portfolio.push({ bitcoinStack, currency });
    displayPortfolio​⬤