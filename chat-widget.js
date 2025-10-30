// Chat Widget Script
(function() {
    // Create and inject styles
    const styles = `
        .n8n-chat-widget {
            --chat--color-primary: var(--n8n-chat-primary-color, #854fff);
            --chat--color-secondary: var(--n8n-chat-secondary-color, #6b3fd4);
            --chat--color-background: var(--n8n-chat-background-color, #ffffff);
            --chat--color-font: var(--n8n-chat-font-color, #333333);
            font-family: 'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
        .n8n-chat-widget .chat-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            display: none;
            width: 380px;
            height: 600px;
            background: var(--chat--color-background);
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(133, 79, 255, 0.15);
            border: 1px solid rgba(133, 79, 255, 0.2);
            overflow: hidden;
            font-family: inherit;
        }
        .n8n-chat-widget .chat-container.position-left {
            right: auto;
            left: 20px;
        }
        .n8n-chat-widget .chat-container.open {
            display: flex;
            flex-direction: column;
        }
        .n8n-chat-widget .brand-header {
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            border-bottom: 1px solid rgba(133, 79, 255, 0.1);
            position: relative;
        }
        .n8n-chat-widget .close-button {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: var(--chat--color-font);
            cursor: pointer;
            font-size: 20px;
            width: 28px;
            height: 28px;
            border-radius: 6px;
            transition: background-color 0.2s;
        }
        .n8n-chat-widget .close-button:hover {
            background: rgba(133, 79, 255, 0.1);
        }
        .n8n-chat-widget .brand-logo {
            width: 36px;
            height: 36px;
            border-radius: 8px;
            object-fit: cover;
        }
        .n8n-chat-widget .brand-name {
            font-size: 16px;
            font-weight: 600;
            color: var(--chat--color-font);
        }
        .n8n-chat-widget .messages-container {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            background: var(--chat--color-background);
        }
        .n8n-chat-widget .chat-message {
            margin-bottom: 16px;
            padding: 12px 16px;
            border-radius: 12px;
            max-width: 80%;
            word-wrap: break-word;
        }
        .n8n-chat-widget .chat-message.user {
            background: var(--chat--color-primary);
            color: white;
            margin-left: auto;
            border-bottom-right-radius: 4px;
        }
        .n8n-chat-widget .chat-message.bot {
            background: #f5f5f5;
            color: var(--chat--color-font);
            margin-right: auto;
            border-bottom-left-radius: 4px;
        }
        .n8n-chat-widget .chat-input {
            padding: 16px;
            background: var(--chat--color-background);
            border-top: 1px solid rgba(133, 79, 255, 0.1);
            display: flex;
            gap: 12px;
            align-items: flex-start;
        }
        .n8n-chat-widget .chat-input textarea {
            flex: 1;
            padding: 12px;
            border: 1px solid rgba(133, 79, 255, 0.2);
            border-radius: 8px;
            font-size: 14px;
            resize: none;
            font-family: inherit;
            color: var(--chat--color-font);
            min-height: 44px;
            max-height: 120px;
        }
        .n8n-chat-widget .chat-input textarea:focus {
            outline: none;
            border-color: var(--chat--color-primary);
        }
        .n8n-chat-widget .chat-input button {
            padding: 12px 20px;
            background: var(--chat--color-primary);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
            transition: background-color 0.2s;
            font-family: inherit;
            white-space: nowrap;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 44px;
        }
        .n8n-chat-widget .chat-input button:hover {
            background: var(--chat--color-secondary);
        }
        .n8n-chat-widget .toggle-button {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 999;
            width: 56px;
            height: 56px;
            background: var(--chat--color-primary);
            border-radius: 50%;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(133, 79, 255, 0.3);
            transition: all 0.2s;
        }
        .n8n-chat-widget .toggle-button.position-left {
            right: auto;
            left: 20px;
        }
        .n8n-chat-widget .toggle-button:hover {
            background: var(--chat--color-secondary);
            transform: scale(1.05);
        }
        .n8n-chat-widget .new-chat-button {
            background: none;
            border: 1px solid rgba(133, 79, 255, 0.3);
            color: var(--chat--color-primary);
            padding: 8px 16px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            transition: all 0.2s;
            font-family: inherit;
            margin-left: auto;
        }
        .n8n-chat-widget .new-chat-button:hover {
            background: rgba(133, 79, 255, 0.1);
            border-color: var(--chat--color-primary);
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Read configuration from data attributes
    const config = {
        webhook: {
            url: document.currentScript.getAttribute('data-webhook-url') || 'YOUR_WEBHOOK_URL_HERE'
        },
        branding: {
            name: document.currentScript.getAttribute('data-brand-name') || 'Chat Assistant',
            logoUrl: document.currentScript.getAttribute('data-brand-logo') || '',
            primaryColor: document.currentScript.getAttribute('data-primary-color') || '#854fff',
            secondaryColor: document.currentScript.getAttribute('data-secondary-color') || '#6b3fd4',
            backgroundColor: document.currentScript.getAttribute('data-background-color') || '#ffffff',
            fontColor: document.currentScript.getAttribute('data-font-color') || '#333333',
        },
        position: document.currentScript.getAttribute('data-position') || 'right',
        initialMessage: document.currentScript.getAttribute('data-initial-message') || 'Hello! How can I help you today?'
    };

    // Apply theme colors to CSS variables
    const root = document.documentElement;
    root.style.setProperty('--n8n-chat-primary-color', config.branding.primaryColor);
    root.style.setProperty('--n8n-chat-secondary-color', config.branding.secondaryColor);
    root.style.setProperty('--n8n-chat-background-color', config.branding.backgroundColor);
    root.style.setProperty('--n8n-chat-font-color', config.branding.fontColor);

    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'n8n-chat-widget';

    const positionClass = config.position === 'left' ? 'position-left' : '';

    widgetContainer.innerHTML = `
        <button class="toggle-button ${positionClass}" aria-label="Toggle chat">
            💬
        </button>
        <div class="chat-container ${positionClass}">
            <div class="brand-header">
                ${config.branding.logoUrl ? `<img src="${config.branding.logoUrl}" alt="${config.branding.name}" class="brand-logo">` : ''}
                <span class="brand-name">${config.branding.name}</span>
                <button class="new-chat-button" aria-label="Start new chat">New Chat</button>
                <button class="close-button" aria-label="Close chat">×</button>
            </div>
            <div class="messages-container">
                <div class="chat-message bot">${config.initialMessage}</div>
            </div>
            <div class="chat-input">
                <textarea placeholder="Type your message..." rows="1"></textarea>
                <button type="submit">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(widgetContainer);

    const chatContainer = widgetContainer.querySelector('.chat-container');
    const toggleButton = widgetContainer.querySelector('.toggle-button');
    const messagesContainer = widgetContainer.querySelector('.messages-container');
    const textarea = widgetContainer.querySelector('textarea');
    const sendButton = widgetContainer.querySelector('button[type="submit"]');
    const newChatBtn = widgetContainer.querySelector('.new-chat-button');

    let conversationHistory = [];

    function startNewConversation() {
        conversationHistory = [];
        messagesContainer.innerHTML = `<div class="chat-message bot">${config.initialMessage}</div>`;
    }

    textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });

    async function sendMessage(message) {
        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'chat-message user';
        userMessageDiv.textContent = message;
        messagesContainer.appendChild(userMessageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        conversationHistory.push({ role: 'user', content: message });
        
        const messageData = {
            action: 'sendMessage',
            sessionId: 'web-chat-' + Date.now(),
            chatInput: message,
            conversationHistory: conversationHistory
        };
        
        try {
            const response = await fetch(config.webhook.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageData)
            });
            
            const data = await response.json();
            
            const botMessageDiv = document.createElement('div');
            botMessageDiv.className = 'chat-message bot';
            botMessageDiv.textContent = Array.isArray(data) ? data[0].output : data.output;
            messagesContainer.appendChild(botMessageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (error) {
            console.error('Error:', error);
        }
    }
    newChatBtn.addEventListener('click', startNewConversation);
    
    sendButton.addEventListener('click', () => {
        const message = textarea.value.trim();
        if (message) {
            sendMessage(message);
            textarea.value = '';
        }
    });
    
    textarea.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const message = textarea.value.trim();
            if (message) {
                sendMessage(message);
                textarea.value = '';
            }
        }
    });
    
    toggleButton.addEventListener('click', () => {
        chatContainer.classList.toggle('open');
    });
    // Add close button handlers
    const closeButtons = chatContainer.querySelectorAll('.close-button');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            chatContainer.classList.remove('open');
        });
    });
})();
