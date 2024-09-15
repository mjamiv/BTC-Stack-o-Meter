// Initialize variables
let bitcoinStack = 0;
let costBasis = 0;

// Function to move from step 1 to step 2
function goToStep2() {
    bitcoinStack = parseFloat(document.getElementById("bitcoinStack").value);
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
        const response = await fetch(
            'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
        );
        const data = await response.json();
        return data.bitcoin.usd;
    } catch (error) {
        alert('Error fetching Bitcoin price. Please try again later.');
        console.error(error);
        document.getElementById("loading").style.display = "none";
    }
}

// Function to fetch current Gold price per ounce
async function fetchGoldPricePerOunce() {
    try {
        const response = await fetch(
            'https://api.coingecko.com/api/v3/simple/price?ids=troy-ounce-gold&vs_currencies=usd'
        );
        const data = await response.json();
        return data['troy-ounce-gold'].usd;
    } catch (error) {
        alert('Error fetching Gold price. Please try again later.');
        console.error(error);
        document.getElementById("loading").style.display = "none";
    }
}

// Function to calculate gains and show results
async function calculateGains() {
    costBasis = parseFloat(document.getElementById("costBasis").value);

    if (costBasis && costBasis > 0) {
        // Show loading spinner
        document.getElementById("loading").style.display = "block";

        // Fetch current Bitcoin price and Gold price per ounce
        const [currentPrice, goldPricePerOunce] = await Promise.all([
            fetchBitcoinPrice(),
            fetchGoldPricePerOunce()
        ]);

        const datePulled = new Date().toLocaleString();

        // Hide loading spinner
        document.getElementById("loading").style.display = "none";

        if (currentPrice && goldPricePerOunce) {
            // Calculate gains
            const currentValue = currentPrice * bitcoinStack;
            const gain = currentValue - costBasis;
            const goldEquivalent = currentValue / goldPricePerOunce;

            // Format numbers
            const formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            });

            // Display results
            document.getElementById("result").innerHTML = `
                <h2>Results</h2>
                <p​⬤