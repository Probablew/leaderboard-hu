document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const popup = document.getElementById('popup');
    const popupContent = document.getElementById('popup-content');
    const popupMessage = document.getElementById('popup-message');

    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
        popupMessage.textContent = 'Login successful';
        popupContent.classList.remove('popup-error');
        popupContent.classList.add('popup-success');
    } else {
        const errorText = await response.text();
        popupMessage.textContent = `Login failed: ${errorText}`;
        popupContent.classList.remove('popup-success');
        popupContent.classList.add('popup-error');
    }

    popup.style.display = 'flex';

    setTimeout(() => {
        popup.style.display = 'none';
    }, 3000); // Hide the popup after 3 seconds
});

function closePopup() {
    document.getElementById('popup').style.display = 'none';
}
