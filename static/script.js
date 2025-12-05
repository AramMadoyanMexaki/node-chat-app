function createList(data) {
    const li = document.createElement("li");
    li.classList.add("message");

    li.innerHTML = `
        <span class="name">${data.username}</span>
        <p>${data.message}</p>
    `;

    const messagesList = document.getElementById("messages");
    messagesList.appendChild(li);
    messagesList.scrollTop = messagesList.scrollHeight;
}

window.addEventListener("DOMContentLoaded", () => {
    const username = localStorage.getItem("username");
    document.getElementById("currentUser").innerText = username || "Unknown";

    const form = document.getElementById("sendForm");
    const input = document.getElementById("sendInput");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const message = input.value;
        if(message === "") return;

        socket.emit("chatMessage", {
            message: message,
            username: username
        });

        input.value = "";
    });

    socket.on("chatMessage", (message) => {
        createList(message);
    });

    socket.on("loadMessages", (messages) => {
        messages.forEach(message => {
            createList(message);
        });
    });
});
