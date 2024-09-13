// Function to move from step 1 to step 2
function goToStep2() {
    const bitcoinStack = document.getElementById("bitcoinStack").value;
    if (bitcoinStack && bitcoinStack > 0) {
        document.getElementById("step1").style.display = "none";
        document.getElementById("step2").style.display = "block";
    } else {
        alert("Please enter a valid Bitcoin stack.");
    }
}

// Function to fetch current Bitcoin price
async function fetchBitcoinPrice() {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
    const data = await response.json();
    return data.bitcoin.usd;
}

// Function to calculate gains and show results
async function calculateGains() {
    const costBasis = document.getElementById("costBasis").value;
    const bitcoinStack = document.getElementById("bitcoinStack").value;

    if (costBasis && costBasis > 0) {
        // Show loading spinner
        document.getElementById("loading").style.display = "block";

        // Fetch current Bitcoin price
        const currentPrice = await fetchBitcoinPrice();
        const datePulled = new Date().toLocaleString();

        // Hide loading spinner
        document.getElementById("loading").style.display = "none";

        // Calculate gains
        const currentValue = currentPrice * bitcoinStack;
        const gain = currentValue - costBasis;

        // Display results
        document.getElementById("result").innerHTML = `
            <h2>Results</h2>
            <p>Bitcoin Stack: ${bitcoinStack} BTC</p>
            <p>Cost Basis: $${costBasis}</p>
            <p>Current Price of Bitcoin: $${currentPrice} (Data pulled on: ${datePulled})</p>
            <p>Current Value: $${currentValue.toFixed(2)}</p>
            <p>Gain/Loss: $${gain.toFixed(2)}</p>
        `;
    } else {
        alert("Please enter a valid cost basis.");
    }
}