// Function to move from step 1 to step 2
function goToStep2() {
    const bitcoinStackValue = document.getElementById("bitcoinStack").value;
    const bitcoinStack = parseFloat(bitcoinStackValue);

    if (bitcoinStack && bitcoinStack > 0) {
        document.getElementById("step1").style.display = "none";
        document.getElementById("step2").style.display = "block";
    } else {
        alert("Please enter a valid Bitcoin stack.");
    }
}

// Function to go back to step 1
function goBackToStep1() {
    document.getElementById("step2").style.display = "none";
    document.getElementById("step1").style.display = "block";
}

// Function to fetch current Bitcoin price
async function fetchBitcoinPrice() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        const data = await response.json();
        return data.bitcoin.usd;
    } catch (error) {
        alert('Error fetching Bitcoin price. Please try again later.');
        console.error(error);
        // Hide loading spinner if an error occurs
        document.getElementById("loading").style.display = "none";
    }
}

// Function to fetch current Gold price per ounce in USD
async function fetchGoldPrice() {
    try {
        const response = await fetch('https://api.metals.live/v1/spot');
        const data = await response.json();
        const goldData = data.find(item => item.metal === 'gold' && item.currency === 'USD');
        return goldData.price;
    } catch (error) {
        alert('Error fetching Gold price. Please try again later.');
        console.error(error);
        // Hide loading spinner if an error occurs
        document.getElementById("loading").style.display = "none";
    }
}

// Function to calculate gains and show results
async function calculateGains() {
    const costBasisValue = document.getElementById("costBasis").value;
    const bitcoinStackValue = document.getElementById("bitcoinStack").value;

    const costBasis = parseFloat(costBasisValue);
    const bitcoinStack = parseFloat(bitcoinStackValue);

    if (costBasis && costBasis > 0) {
        // Show loading spinner
        document.getElementById("loading").style.display = "block";

        // Fetch​⬤