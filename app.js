// Initialize variables
let bitcoinStack = 0;
let costBasisPerBitcoin = 0;
let chartInstance = null;

// Function to move from step 1 to step 2
function goToStep2() {
    const bitcoinInput = document.getElementById("bitcoinStack").value.trim();
    bitcoinStack = parseFloat(bitcoinInput);
    if (!isNaN(bitcoinStack) && bitcoinStack > 0) {
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
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data.bitcoin && data.bitcoin.usd) {
            return data.bitcoin.usd;
        } else {
            throw new Error('Invalid data format received from API.');
        }
    } catch (error) {
        alert('Error fetching Bitcoin price. Please try again later.');
        console.error('Fetch Error:', error);
        return null;
    }
}

// Function to calculate gains and show results
async function calculateGains() {
    const costBasisInput = document.getElementById("costBasis").value.trim();
    costBasisPerBitcoin = parseFloat(costBasisInput);

    if (!isNaN(costBasisPerBitcoin) && costBasisPerBitcoin > 0) {
        // Show loading spinner
        document.getElementById("loading").style.display = "block";

        // Fetch current Bitcoin price
        const currentPrice = await fetchBitcoinPrice();

        // Hide loading spinner
        document.getElementById("loading").style.display = "none";

        if (currentPrice !== null) {
            // Calculate gains
            const currentValue = currentPrice * bitcoinStack;
            const totalCostBasis = costBasisPerBitcoin * bitcoinStack;
            const gain = currentValue - totalCostBasis;

            // Format numbers
            const formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            });

            // Get current date and time
            const datePulled = new Date().toLocaleString();

            // Update the result section spans
            document.getElementById("bitcoinStackDisplay").textContent = `${bitcoinStack} BTC`;
            document.getElementById("costBasisDisplay").textContent = formatter.format(costBasisPerBitcoin);
            document.getElementById("totalCostBasis").textContent = formatter.format(totalCostBasis);
            document.getElementById("currentPriceDisplay").textContent = `${formatter.format(currentPrice)} (Data pulled on: ${datePulled})`;
            document.getElementById("currentValueDisplay").textContent = formatter.format(currentValue);
            document.getElementById("gainLossDisplay").textContent = formatter.format(gain);

            // Show the result section
            document.getElementById("result").style.display = "block";

            // Show the chart
            document.getElementById('valueChart').style.display = 'block';
            generateChart(totalCostBasis, currentValue);

            // Scroll to the result section for better user experience
            document.getElementById("result").scrollIntoView({ behavior: 'smooth' });
        }
    } else {
        alert("Please enter a valid cost basis per Bitcoin.");
    }
}

// Function to generate the chart
function generateChart(totalCostBasis, currentValue) {
    const ctx = document.getElementById('valueChart').getContext('2d');

    // If a chart instance already exists, destroy it to prevent duplication
    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
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
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed.y;
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        },
                        color: '#ffffff' // Y-axis labels in white
                    },
                    grid: {
                        color: '#555555' // Grid lines color
                    }
                },
                x: {
                    ticks: {
                        color: '#ffffff' // X-axis labels in white
                    },
                    grid: {
                        color: '#555555' // Grid lines color
                    }
                }
            }
        }
    });
}

// Function to reset the stack and interface
function resetStack() {
    // Reset variables
    bitcoinStack = 0;
    costBasisPerBitcoin = 0;

    // Clear input fields
    document.getElementById("bitcoinStack").value = '';
    document.getElementById("costBasis").value = '';

    // Hide step 2
    document.getElementById("step2").style.display = "none";

    // Show step 1
    document.getElementById("step1").style.display = "block";

    // Hide result section
    document.getElementById("result").style.display = "none";

    // Hide the chart
    document.getElementById('valueChart').style.display = 'none';

    // Destroy the existing chart instance if it exists
    if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
    }

    // Optionally, scroll back to the top for better user experience
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
