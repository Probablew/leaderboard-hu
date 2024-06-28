// Extract server name from the URL
function getServerNameFromURL() {
    const url = window.location.href;
    const urlObject = new URL(url);
    const path = urlObject.pathname;
    const pathSegments = path.split('/');
    return pathSegments[pathSegments.length - 1];
}

// Populate server details in the DOM
function populateServerDetails(server) {
    document.getElementById('server-name').innerText = server.name;
    document.getElementById('server-description').innerText = server.description;
    const serverImage = document.getElementById('server-image');
    serverImage.src = server.image;
    serverImage.alt = server.name;
}

// Create the player count chart
function createPlayerCountChart(playerCount) {
    const ctx = document.getElementById('player-count-chart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
            datasets: [{
                label: 'Játékosok',
                data: JSON.parse(playerCount),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: true
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Idő'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Játékosok'
                    },
                    beginAtZero: true
                }
            }
        }
    });
}

// Fetch server data from the API
async function fetchServerData(serverName) {
    try {
        const response = await fetch('http://localhost:3000/getserver/' + serverName);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching server data:', error);
        return null;
    }
}

// Main function to execute the script
async function main() {
    const serverName = getServerNameFromURL();
    console.log("Server Name:", serverName); // Output: Server Name

    const server = await fetchServerData(serverName);
    if (server) {
        console.log("Fetched Server Data:", server);
        populateServerDetails(server);

        const playerCount = server["playerCount"];
        console.log('Player Count Data:', playerCount);
        createPlayerCountChart(playerCount);
    }
}

// Execute the main function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', main);
