async function calculateGains() {
    document.getElementById('loading').style.display = 'block';

    const bitcoinStack = document.getElementById('bitcoinStack').value;
    const costBasisPerBitcoin = document.getElementById('costBasis').value;

    if (!bitcoinStack || !costBasisPerBitcoin) {
        alert("Please enter both your Bitcoin stack and cost basis.");
        document.getElementById('loading').style.display = 'none';
        return;
    }

    const { btcPrice, goldPricePerOunce } = await fetchPriceData();

    const usdValue = bitcoinStack * btcPrice;
    const costBasis = bitcoinStack * costBasisPerBitcoin;
    const goldValue = usdValue / goldPricePerOunce;
    const profit = usdValue - costBasis;

    document.getElementById('result').innerHTML = `
        <p>USD Value: $${usdValue.toFixed(2)}</p>
        <p>Gold Value: ${goldValue.toFixed(2)} ounces</p>
        <p>Profit/Loss: $${profit.toFixed(2)}</p>
    `;

    displayChart(costBasis, usdValue);
    document.getElementById('loading').style.display = 'none';
}