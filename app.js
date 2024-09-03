async function fetchPriceData() {
    try {
        const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice/BTC.json');
        const data = await response.json();
        const btcPrice = data.bpi.USD.rate_float;

        // Placeholder gold price, should be fetched from a real API
        const goldPricePerOunce = 1800; // Example value

        return { btcPrice, goldPricePerOunce };
    } catch (error) {
        console.error('Error fetching price data:', error);
        alert("Failed to fetch price data. Please try again later.");
        throw error;
    }
}

async function calculateGains() {
    document.getElementById('loading').style.display = 'block';

    const bitcoinStack = document.getElementById('bitcoinStack').value;
    const costBasisPerBitcoin = document.getElementById('costBasis').value;

    if (!bitcoinStack || !costBasisPerBitcoin) {
        alert("Please enter both your Bitcoin stack and cost basis.");
        document.getElementById('loading').style.display = 'none';
        return;
    }

    try {
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
    } catch (error) {
        console.error("Error calculating gains:", error);
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
}

function displayChart(costBasis, usdValue) {
    const ctx = document.getElementById('profitChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Cost Basis', 'USD Value'],
            datasets: [{
                label: 'Amount in USD',
                data: [costBasis, usdValue],
                backgroundColor: ['#ffcc00', '#99f2c8']
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    document.querySelector('.container').classList.toggle('dark-mode');
    document.querySelectorAll('h1, label, span, p').forEach(el => el.classList.toggle('dark-mode'));
    document.querySelectorAll('input').forEach(el => el.classList.toggle('dark-mode'));
    document.querySelectorAll('button').forEach(el => el.classList.toggle('dark-mode'));
}
