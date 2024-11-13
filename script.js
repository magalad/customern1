// Example script to add interactivity

// Add event listeners for buttons
document.addEventListener("DOMContentLoaded", function() {
    const getStartedButton = document.querySelector("button");
    
    if (getStartedButton) {
        getStartedButton.addEventListener("click", () => {
            alert("Let's get started with editing your IPTV playlist!");
        });
    }
});

// Placeholder for drag-and-drop functionality
function enableDragAndDrop() {
    console.log("Drag-and-drop functionality can be added here");
}

// You could call enableDragAndDrop() when the page loads if needed

// Function to handle playlist upload
function uploadPlaylist() {
    const fileInput = document.getElementById('fileUpload');
    const urlInput = document.getElementById('urlUpload');

    if (fileInput.files.length > 0) {
        alert("File uploaded successfully: " + fileInput.files[0].name);
    } else if (urlInput.value) {
        alert("URL submitted successfully: " + urlInput.value);
    } else {
        alert("Please upload a file or enter a URL.");
    }
}

// Function to handle contact form submission
function submitContactForm() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    if (name && email && message) {
        alert(`Thank you, ${name}! Your message has been sent successfully.`);
        document.getElementById('contactForm').reset();
    } else {
        alert("Please fill out all fields before submitting.");
    }
}

// Toggle menu function
function toggleMenu() {
    const menu = document.getElementById('dropdownMenu');
    const overlay = document.getElementById('overlay');
    menu.classList.toggle('active');
    overlay.classList.toggle('active');
}

// Close menu function
function closeMenu() {
    const menu = document.getElementById('dropdownMenu');
    const overlay = document.getElementById('overlay');
    menu.classList.remove('active');
    overlay.classList.remove('active');
}

// Add event listener to close menu when clicking on the overlay
document.getElementById('overlay').addEventListener('click', closeMenu);

function loadPlaylist() {
    const fileInput = document.getElementById('fileUpload');
    const urlInput = document.getElementById('urlUpload');

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const fileContent = e.target.result;
            parseM3U(fileContent);
        };
        
        reader.readAsText(file); // Read the file as text
    } else if (urlInput.value) {
        const url = urlInput.value;
        
        fetch(url)
            .then(response => response.text())
            .then(data => parseM3U(data))
            .catch(error => alert("Failed to load playlist from URL"));
    } else {
        alert("Please upload a file or enter a URL.");
    }
}

function parseM3U(content) {
    const lines = content.split("\n");
    const playlist = [];
    let channel = {};

    lines.forEach(line => {
        line = line.trim();
        if (line.startsWith("#EXTINF")) {
            // Extract the channel name after the comma
            const name = line.split(",")[1];
            channel = { name: name || "Unknown", url: "" };
        } else if (line && !line.startsWith("#")) {
            // This line is a URL
            channel.url = line;
            playlist.push(channel);
            channel = {}; // Reset for the next channel
        }
    });

    displayPlaylist(playlist);
}

function displayPlaylist(playlist) {
    const container = document.getElementById("playlistContainer");
    container.innerHTML = ""; // Clear previous content

    playlist.forEach((channel, index) => {
        const div = document.createElement("div");
        div.classList.add("channel-item");

        // Channel name and URL
        div.innerHTML = `
            <strong contenteditable="true" onblur="updateChannelName(${index}, this.innerText)">${channel.name}</strong><br>
            <a href="${channel.url}" target="_blank">${channel.url}</a>
            <button onclick="removeChannel(${index})">Remove</button>
        `;

        container.appendChild(div);
    });

    // Save the playlist globally for reference
    window.currentPlaylist = playlist;
}

// Function to update channel name
function updateChannelName(index, newName) {
    if (window.currentPlaylist && window.currentPlaylist[index]) {
        window.currentPlaylist[index].name = newName;
    }
}

// Function to remove a channel
function removeChannel(index) {
    if (window.currentPlaylist) {
        window.currentPlaylist.splice(index, 1); // Remove the channel from the playlist
        displayPlaylist(window.currentPlaylist); // Re-render the updated playlist
    }
}

function exportPlaylist() {
    if (!window.currentPlaylist || window.currentPlaylist.length === 0) {
        alert("No playlist to export.");
        return;
    }

    // Start building the M3U file content
    let m3uContent = "#EXTM3U\n";
    window.currentPlaylist.forEach(channel => {
        m3uContent += `#EXTINF:-1,${channel.name}\n${channel.url}\n`;
    });

    // Create a Blob from the M3U content
    const blob = new Blob([m3uContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    // Create a temporary link to download the file
    const a = document.createElement("a");
    a.href = url;
    a.download = "modified_playlist.m3u";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();

    // Clean up by revoking the object URL and removing the temporary link
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

{
    
}