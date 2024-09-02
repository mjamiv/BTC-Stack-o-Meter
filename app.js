async function fetchPriceData() {
    const btcPriceUrl = 'https://api.coindesk.com/v1/bpi/currentprice/USD.json';
    const goldPriceUrl = 'https://data-asg.goldprice.org/dbXRates/USD';

    const [btcResponse, goldResponse] = await Promise.all([fetch(btcPriceUrl), fetch(goldPriceUrl)]);

    const btcData = await btcResponse.json();
    const goldData = await goldResponse.json();

    const btcPrice = btcData.bpi.USD.rate_float;
    const goldPricePerOunce = goldData.items[0].xauPrice;

    return { btcPrice, goldPricePerOunce };
}

async function calculateGains() {
    const bitcoinStack = document.getElementById('bitcoinStack').value;
    if (!bitcoinStack) {
        alert("Please enter your Bitcoin stack.");
        return;
    }

    const { btcPrice, goldPricePerOunce } = await fetchPriceData();

    const usdValue = bitcoinStack * btcPrice;
    const goldValue = usdValue / goldPricePerOunce;

    document.getElementById('result').innerHTML = `
        <p>USD Value: $${usdValue.toFixed(2)}</p>
        <p>Gold Value: ${goldValue.toFixed(2)} ounces</p>
    `;
}
