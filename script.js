document.addEventListener('DOMContentLoaded', () => {
    fetchData();
});

async function fetchData() {
    try {
        const response = await fetch('data/history.json');
        if (!response.ok) {
            throw new Error('Failed to load data');
        }
        const data = await response.json();
        
        if (data.length === 0) {
            renderEmptyState();
            return;
        }

        // Sort data by timestamp descending (newest first)
        data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        renderCurrentStatus(data[0]);
        renderOverview(data);
        renderChart(data);
        renderLogs(data);

    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('current-status').textContent = 'Error loading data';
    }
}

function renderCurrentStatus(latest) {
    const statusEl = document.getElementById('current-status');
    const lastCheckedEl = document.getElementById('last-checked');
    const responseTimeEl = document.getElementById('response-time');

    const isUp = latest.status === 'up';
    statusEl.textContent = isUp ? 'Operational' : 'Downtime';
    statusEl.className = `status-badge ${latest.status}`;

    const date = new Date(latest.timestamp);
    lastCheckedEl.textContent = date.toLocaleString();
    
    responseTimeEl.textContent = `${latest.responseTime} ms`;
}

function renderOverview(data) {
    const uptimeEl = document.getElementById('uptime-percentage');
    
    // Calculate uptime for the last 24 hours (or all data if less)
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const recentData = data.filter(item => new Date(item.timestamp) > oneDayAgo);
    
    if (recentData.length === 0) {
        uptimeEl.textContent = '--%';
        return;
    }

    const upCount = recentData.filter(item => item.status === 'up').length;
    const uptime = (upCount / recentData.length) * 100;
    
    uptimeEl.textContent = `${uptime.toFixed(2)}%`;
}

function renderChart(data) {
    const ctx = document.getElementById('responseChart').getContext('2d');
    
    // Take last 50 records for the chart and reverse to show oldest to newest
    const chartData = data.slice(0, 50).reverse();

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartData.map(item => {
                const date = new Date(item.timestamp);
                return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }),
            datasets: [{
                label: 'Response Time (ms)',
                data: chartData.map(item => item.responseTime),
                borderColor: '#38bdf8',
                backgroundColor: 'rgba(56, 189, 248, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: {
                        color: '#334155'
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                },
                y: {
                    grid: {
                        color: '#334155'
                    },
                    ticks: {
                        color: '#94a3b8'
                    },
                    beginAtZero: true
                }
            }
        }
    });
}

function renderLogs(data) {
    const tbody = document.getElementById('log-body');
    tbody.innerHTML = '';

    // Show last 20 logs
    const logsToShow = data.slice(0, 20);

    logsToShow.forEach(item => {
        const tr = document.createElement('tr');
        const date = new Date(item.timestamp);
        
        tr.innerHTML = `
            <td>${date.toLocaleString()}</td>
            <td>
                <span class="status-dot ${item.status}"></span>
                ${item.status.toUpperCase()}
            </td>
            <td>${item.code}</td>
            <td>${item.responseTime} ms</td>
        `;
        tbody.appendChild(tr);
    });
}

function renderEmptyState() {
    document.getElementById('current-status').textContent = 'No Data';
}
