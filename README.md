# 41Box Heartbeat Detection

A serverless status monitoring dashboard for [41box.com](https://41box.com), powered by GitHub Actions and GitHub Pages.

![Dashboard Preview](https://github.com/kaisonlau8/41box_heartbeat_detection/blob/main/local_dashboard_view_1763802651982.png?raw=true)
*(Note: Screenshot placeholder - once deployed, the live site will show real-time data)*

## Features

- **Automated Monitoring**: Checks the website status every 15 minutes using GitHub Actions.
- **Real-time Dashboard**: Displays current status, response time, and uptime percentage.
- **Historical Data**: Visualizes response time history with a chart.
- **Log History**: Keeps a record of recent checks and status codes.
- **Serverless**: Runs entirely on GitHub infrastructure (Actions + Pages).

## How It Works

1.  **GitHub Action**: A scheduled workflow (`.github/workflows/heartbeat.yml`) runs every 15 minutes.
2.  **Check Script**: The workflow executes a Node.js script (`scripts/check_heartbeat.js`) that pings the target website.
3.  **Data Update**: The script appends the result (timestamp, status, response time) to `data/history.json`.
4.  **Commit**: The workflow commits the updated data file back to the repository.
5.  **Dashboard**: The frontend (`index.html`) fetches the raw JSON data and renders the status dashboard on GitHub Pages.

## Local Development

To run the project locally:

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/kaisonlau8/41box_heartbeat_detection.git
    cd 41box_heartbeat_detection
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run a manual check**:
    ```bash
    npm run check
    ```
    This will generate/update `data/history.json`.

4.  **View the dashboard**:
    You need a local server to handle the JSON fetch.
    ```bash
    # Python 3
    python3 -m http.server 8080
    
    # OR using npx
    npx serve .
    ```
    Open `http://localhost:8080` in your browser.

## Deployment

This project is designed to be deployed on GitHub Pages.

1.  Push the code to a GitHub repository.
2.  Go to **Settings** > **Pages**.
3.  Select **Source**: `Deploy from a branch`.
4.  Select **Branch**: `main`, **Folder**: `/ (root)`.
5.  Click **Save**.

## License

MIT
