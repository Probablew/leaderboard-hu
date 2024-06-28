// Fetch server data from the API
async function fetchServerData() {
    try {
        const response = await fetch('http://localhost:3000/getservers');
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

// Call the function to fetch server data and handle it
async function handleServerData() {
    const serverData = await fetchServerData();

    // Ensure serverData is not null before parsing
    if (serverData) {
        // Function to create server item HTML
        function createServerItem(server) {
            const serverLink = document.createElement('a');
            serverLink.href = `http://localhost:3000/servers/${server.name}`;
            serverLink.className = 'block bg-gray-800 shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl hover:shadow-black/70 duration-300';

            const img = document.createElement('img');
            img.className = 'w-full h-48 object-cover';
            img.src = server.image;
            img.alt = server.name;

            const contentDiv = document.createElement('div');
            contentDiv.className = 'p-4';

            const title = document.createElement('h2');
            title.className = 'text-2xl font-semibold mb-2';
            title.innerText = server.name;

            const description = document.createElement('p');
            description.className = 'text-gray-400';
            description.innerText = server.description;

            contentDiv.appendChild(title);
            contentDiv.appendChild(description);

            serverLink.appendChild(img);
            serverLink.appendChild(contentDiv);

            return serverLink;
        }

        // Append server items to the server list container
        const serverList = document.getElementById('server-list');
        serverData.forEach(server => {
            const serverItem = createServerItem(server);
            serverList.appendChild(serverItem);
        });
    }
}

// Execute the function to handle server data
handleServerData();
