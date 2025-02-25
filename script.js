document.addEventListener('DOMContentLoaded', function() {
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');

    const botResponses = [
        "I'm here to listen. Can you tell me more about how you're feeling?",
        "It sounds like you're going through a tough time. Remember, it's okay to not be okay.",
        "Have you tried any relaxation techniques? Deep breathing can be really helpful.",
        "Your feelings are valid. It's brave of you to open up about this.",
        "Sometimes, talking to a professional can provide valuable insights. Have you considered that?",
        "Remember to be kind to yourself. Self-care is important for mental health.",
        "I'm glad you reached out. Talking about our feelings is a positive step.",
        "It's natural to feel overwhelmed sometimes. Let's break things down into smaller, manageable steps."
    ];

    chatForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const userMessage = userInput.value.trim();
        if (userMessage) {
            addMessage('user', userMessage);
            userInput.value = '';
            setTimeout(() => {
                const botResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
                addMessage('bot', botResponse);
            }, 1000);
        }
    });

    function addMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Prevent form submission for the subscribe form
    const subscribeForm = document.getElementById('subscribe-form');
    subscribeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for subscribing! (This is a demo, no email was actually sent)');
        subscribeForm.reset();
    });
});