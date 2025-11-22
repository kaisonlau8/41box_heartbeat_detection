const axios = require('axios');
const fs = require('fs');
const path = require('path');

const TARGET_URL = 'https://41box.com';
const DATA_FILE = path.join(__dirname, '../data/history.json');
const MAX_HISTORY = 2000;

async function checkHeartbeat() {
    const startTime = Date.now();
    let status = 'down';
    let code = 0;
    let responseTime = 0;

    try {
        const response = await axios.get(TARGET_URL, {
            timeout: 10000,
            validateStatus: function (status) {
                return status >= 200 && status < 600; // Resolve for all status codes
            }
        });

        const endTime = Date.now();
        responseTime = endTime - startTime;
        code = response.status;

        if (response.status >= 200 && response.status < 400) {
            status = 'up';
        } else {
            status = 'down';
        }

    } catch (error) {
        const endTime = Date.now();
        responseTime = endTime - startTime;
        status = 'down';
        if (error.response) {
            code = error.response.status;
        } else if (error.request) {
            code = 0; // No response received
        } else {
            code = -1; // Request setup error
        }
        console.error('Check failed:', error.message);
    }

    const record = {
        timestamp: new Date().toISOString(),
        status,
        responseTime,
        code
    };

    updateHistory(record);
}

function updateHistory(newRecord) {
    let history = [];

    // Ensure data directory exists
    const dataDir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    // Read existing history
    if (fs.existsSync(DATA_FILE)) {
        try {
            const fileContent = fs.readFileSync(DATA_FILE, 'utf8');
            history = JSON.parse(fileContent);
        } catch (e) {
            console.error('Error reading history file:', e);
            history = [];
        }
    }

    // Append new record
    history.push(newRecord);

    // Trim history if too long
    if (history.length > MAX_HISTORY) {
        history = history.slice(history.length - MAX_HISTORY);
    }

    // Write back to file
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(history, null, 2));
        console.log(`Heartbeat checked: ${newRecord.status} (${newRecord.responseTime}ms). History updated.`);
    } catch (e) {
        console.error('Error writing history file:', e);
        process.exit(1);
    }
}

checkHeartbeat();
