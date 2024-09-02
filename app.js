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
    document.getElementById('loading').style.display = 'block';

    const bitcoinStack = document.getElementById('bitcoinStack').value;
    const costBasis = document.getElementById('costBasis').value;

    if (!bitcoinStack || !costBasis) {
        alert("Please enter both your Bitcoin stack and cost basis.");
        document.getElementById('loading').style.display = 'none';
        return;
    }

    const { btcPrice, goldPricePerOunce } = await fetchPriceData();

    const usdValue = bitcoinStack * btcPrice;
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

function displayChart(costBasis, usdValue) {
    const ctx = document.getElementById('profitChart').getContext('2d');
    if (Chart.getChart(ctx)) {
        Chart.getChart(ctx).destroy();  // Destroy the previous chart instance if it exists.
    }
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Cost Basis', 'USD Value'],
            datasets: [{
                label: 'USD',
                data: [costBasis, usdValue],
                backgroundColor: ['#ffcc00', '#ff6600'],
                borderColor: ['#ffaa00', '#ff3300'],
                borderWidth: 1
            }]
        },
        options: {
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
    document.querySelectorAll('p, h1, label, span').forEach(function (element) {
        element.classList.toggle('dark-mode');
    });
}