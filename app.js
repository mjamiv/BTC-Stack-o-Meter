// Initialize variables
let bitcoinStack = 0;
let costBasisPerBitcoin = 0;

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
        return null;
    }
}

// Function to calculate gains and show results
async function calculateGains() {
    costBasisPerBitcoin = parseFloat(document.getElementById("costBasis").value);

    if (costBasisPerBitcoin && costBasisPerBitcoin > 0) {
        // Show loading spinner
        document.getElementById("loading").style.display = "block";

        // Fetch current Bitcoin price
        const currentPrice = await fetchBitcoinPrice();

        const datePulled = new Date().toLocaleString();

        // Hide loading spinner
        document.getElementById("loading").style.display = "none";

        if (currentPrice) {
            // Calculate gains
            const currentValue = currentPrice * bitcoinStack;
            const totalCostBasis = costBasisPerBitcoin * bitcoinStack;
            const gain = currentValue - totalCostBasis;

            // Format numbers
            const formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            });

            // Display results
            document.getElementById("result").innerHTML = `
                <h2>Results</h2>
                <p>Bitcoin Stack: ${bitcoinStack} BTC</p>
                <p>Cost Basis per Bitcoin: ${formatter.format(costBasisPerBitcoin)}</p>
                <p>Total Cost Basis: ${formatter.format(totalCostBasis)}</p>
                <p>Current Price of Bitcoin: ${formatter.format(currentPrice)} (Data pulled on: ${datePulled})</p>
                <p>Current Value: ${formatter.format(currentValue)}</p>
                <p>Gain/Loss: ${formatter.format(gain)}</p>
            `;

            // Show the chart
            document.getElementById('valueChart').style.display = 'block';
            generateChart(totalCostBasis, currentValue);
        }
    } else {
        alert("Please enter a valid cost basis per Bitcoin.");
    }
}

// Function to generate the chart
function generateChart(totalCostBasis, currentValue) {
    const ctx = document.getElementById('valueChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Total Cost Basis', 'Current Value'],
            datasets: [{
                label: 'USD Value',
                data: [totalCostBasis, currentValue],
                backgroundColor: ['#e67e22', '#f39c12'],
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// Dark Mode Toggle
const toggleSwitch = document.getElementById('darkModeToggle');
toggleSwitch.addEventListener('change', function() {
    document.body.classList.toggle('dark-mode');
});