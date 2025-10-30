// Chat Widget Script
(function() {
    // Read configuration from window.ChatWidgetConfig
    const config = window.ChatWidgetConfig || {};
    
    // Default configuration
    const defaultConfig = {
        colorPrimary: '#ff6bcb',
        colorSecondary: '#7367f0',
        colorGlass: 'rgba(255,255,255,0.7)',
        colorFont: '#232946',
        font: 'Sora',
        brandName: 'ChatBot',
        mascot: '🤖',
        position: { bottom: '32px', right: '32px' },
        webhookUrl: '',
        width: '420px',
        height: '620px',
        borderRadius: '32px'
    };
    
    // Merge config with defaults
    const settings = { ...defaultConfig, ...config };
    
    // Inject font if specified
    if (settings.font) {
        const fontLink = document.createElement('link');
        fontLink.rel = 'stylesheet';
        fontLink.href = `https://fonts.googleapis.com/css2?family=${settings.font.replace(' ', '+')}:wght@400;600;700&display=swap`;
        document.head.appendChild(fontLink);
    }
    
    // Creative, glassmorphic, circular styles with configurable values
    const styles = `
        .n8n-chat-widget {
            --chat--color-primary: ${settings.colorPrimary};
            --chat--color-secondary: ${settings.colorSecondary};
            --chat--color-glass: ${settings.colorGlass};
            --chat--color-glass-blur: blur(16px);
            --chat--color-font: ${settings.colorFont};
            font-family: '${settings.font}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
        .n8n-chat-widget .chat-toggle {
            position: fixed;
            bottom: ${settings.position.bottom};
            right: ${settings.position.right};
            width: 72px;
            height: 72px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: 0 8px 32px rgba(115, 103, 240, 0.25);
            z-index: 999;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.3s cubic-bezier(.68,-0.55,.27,1.55);
            outline: none;
        }
        .n8n-chat-widget .chat-toggle:active {
            transform: scale(0.95);
        }
        .n8n-chat-widget .chat-toggle svg {
            width: 36px;
            height: 36px;
            fill: currentColor;
        }
        .n8n-chat-widget .chat-container {
            position: fixed;
            bottom: 120px;
            right: ${settings.position.right};
            width: ${settings.width};
            height: ${settings.height};
            border-radius: ${settings.borderRadius};
            background: var(--chat--color-glass);
            backdrop-filter: var(--chat--color-glass-blur);
            box-shadow: 0 12px 48px rgba(115, 103, 240, 0.18);
            border: 2px solid rgba(255,255,255,0.3);
            z-index: 998;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            opacity: 0;
            transform: scale(0.9) translateY(20px);
            transition: opacity 0.3s ease, transform 0.3s cubic-bezier(.68,-0.55,.27,1.55);
            pointer-events: none;
        }
        .n8n-chat-widget .chat-container.open {
            opacity: 1;
            transform: scale(1) translateY(0);
            pointer-events: auto;
        }
        .n8n-chat-widget .brand-header {
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            padding: 24px;
            font-size: 20px;
            font-weight: 700;
            border-radius: ${settings.borderRadius} ${settings.borderRadius} 0 0;
            display: flex;
            align-items: center;
            gap: 12px;
            position: relative;
        }
        .n8n-chat-widget .mascot {
            font-size: 28px;
            animation: float 3s ease-in-out infinite;
        }
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-6px); }
        }
        .n8n-chat-widget .close-button {
            position: absolute;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255,255,255,0.2);
            color: white;
            border: none;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s;
        }
        .n8n-chat-widget .close-button:hover {
            background: rgba(255,255,255,0.3);
        }
        .n8n-chat-widget .chat-messages {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .n8n-chat-widget .chat-message {
            max-width: 75%;
            padding: 14px 18px;
            border-radius: 24px;
            font-size: 15px;
            line-height: 1.5;
            animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .n8n-chat-widget .chat-message.user {
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            align-self: flex-end;
            border-bottom-right-radius: 8px;
        }
        .n8n-chat-widget .chat-message.bot {
            background: rgba(115, 103, 240, 0.08);
            color: var(--chat--color-font);
            align-self: flex-start;
            border-bottom-left-radius: 8px;
        }
        .n8n-chat-widget .chat-input {
            display: flex;
            gap: 12px;
            padding: 20px;
            background: rgba(255,255,255,0.6);
            border-radius: 0 0 ${settings.borderRadius} ${settings.borderRadius};
            backdrop-filter: blur(8px);
        }
        .n8n-chat-widget .chat-input textarea {
            flex: 1;
            border: 2px solid rgba(115, 103, 240, 0.2);
            border-radius: 20px;
            padding: 12px 18px;
            font-family: inherit;
            font-size: 15px;
            resize: none;
            outline: none;
            transition: border-color 0.2s;
            background: white;
            color: var(--chat--color-font);
        }
        .n8n-chat-widget .chat-input textarea:focus {
            border-color: var(--chat--color-secondary);
        }
        .n8n-chat-widget .chat-input button {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            cursor: pointer;
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s;
        }
        .n8n-chat-widget .chat-input button:active {
            transform: scale(0.95);
        }
        .n8n-chat-widget .chat-input button svg {
            width: 20px;
            height: 20px;
        }
    `;
    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);
    
    // Widget container
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'n8n-chat-widget';
    document.body.appendChild(widgetContainer);
    
    // Toggle button
    const toggleButton = document.createElement('button');
    toggleButton.className = 'chat-toggle';
    toggleButton.setAttribute('aria-label', 'Toggle chat');
    toggleButton.innerHTML = `
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3 .97 4.29L2 22l5.71-.97C9 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.33 0-2.58-.28-3.72-.78l-.27-.15-2.85.48.48-2.85-.15-.27C4.28 14.58 4 13.33 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z"></path>
        </svg>
    `;
    widgetContainer.appendChild(toggleButton);
    
    // Chat container
    const chatContainer = document.createElement('div');
    chatContainer.className = 'chat-container';
    widgetContainer.appendChild(chatContainer);
    
    // Brand header with mascot
    const brandHeader = document.createElement('div');
    brandHeader.className = 'brand-header';
    brandHeader.innerHTML = `
        <div class="mascot" title="Mascot">${settings.mascot}</div>
        ${settings.brandName}
        <button class="close-button" aria-label="Close chat">×</button>
    `;
    chatContainer.appendChild(brandHeader);
    
    // Chat messages area
    const messagesContainer = document.createElement('div');
    messagesContainer.className = 'chat-messages';
    chatContainer.appendChild(messagesContainer);
    
    // Chat input area with SVG send icon
    const chatInput = document.createElement('div');
    chatInput.className = 'chat-input';
    chatInput.innerHTML = `
        <textarea placeholder="Type your message..." rows="1"></textarea>
        <button type="submit" aria-label="Send">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
            </svg>
        </button>
    `;
    chatContainer.appendChild(chatInput);
    
    // Show/hide chat
    toggleButton.addEventListener('click', () => {
        chatContainer.classList.toggle('open');
    });
    
    brandHeader.querySelector('.close-button').addEventListener('click', () => {
        chatContainer.classList.remove('open');
    });
    
    // Send message logic
    const textarea = chatInput.querySelector('textarea');
    const sendButton = chatInput.querySelector('button');
    
    sendButton.addEventListener('click', async () => {
        const message = textarea.value.trim();
        if (message) {
            const userMessageDiv = document.createElement('div');
            userMessageDiv.className = 'chat-message user';
            userMessageDiv.textContent = message;
            messagesContainer.appendChild(userMessageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            textarea.value = '';
            
            // Send to webhook if configured
            if (settings.webhookUrl) {
                try {
                    const response = await fetch(settings.webhookUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ message: message })
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        if (data.response) {
                            const botMessageDiv = document.createElement('div');
                            botMessageDiv.className = 'chat-message bot';
                            botMessageDiv.textContent = data.response;
                            messagesContainer.appendChild(botMessageDiv);
                            messagesContainer.scrollTop = messagesContainer.scrollHeight;
                        }
                    }
                } catch (error) {
                    console.error('Error sending message to webhook:', error);
                }
            }
        }
    });
    
    textarea.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendButton.click();
        }
    });
})();
