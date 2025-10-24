// ======================== Global Variables ========================
let stompClient = null;
let currentUser = getCurrentUser();
let currentConversation = '68f9edf52d7d16c4f6985d6d';
let otherUser = 'instructor-1';

// ======================== Initialize App ========================
document.addEventListener('DOMContentLoaded', function () {
    console.log('Chat app initialized');
    initializeUserSelection();
    connectWebSocket();
    updateUserInfo();
});

// ======================== User Management ========================
function getCurrentUser() {
    // Try to get from URL parameter first
    const urlParams = new URLSearchParams(window.location.search);
    const userParam = urlParams.get('user');
    if (userParam) {
        localStorage.setItem('currentUser', userParam);
        return userParam;
    }

    // Try to get from localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        return storedUser;
    }

    // Default user
    return 'user1';
}

function changeUser(userId) {
    currentUser = userId;
    localStorage.setItem('currentUser', userId);
    document.getElementById('current-user-display').textContent = userId;

    // Reconnect WebSocket with new user
    if (stompClient && stompClient.connected) {
        stompClient.disconnect();
    }
    connectWebSocket();
    updateUserInfo();

    showToast(`Switched to user: ${userId}`, 'success');
}

function initializeUserSelection() {
    const userSelect = document.getElementById('user-select');
    const currentUserDisplay = document.getElementById('current-user-display');

    if (userSelect) {
        userSelect.value = currentUser;
    }
    if (currentUserDisplay) {
        currentUserDisplay.textContent = currentUser;
    }
}

// ======================== WebSocket Connection ========================
function connectWebSocket() {
    const socket = new SockJS('/ws/chat', null, {
        transports: ['websocket', 'xhr-streaming', 'xhr-polling']
    });
    stompClient = Stomp.over(socket);

    stompClient.connect(
        {},
        function (frame) {
            console.log('Connected: ' + frame);
            updateConnectionStatus(true);

            // Subscribe to conversation topic
            stompClient.subscribe(
                `/topic/conversations/${currentConversation}`,
                function (message) {
                    onMessageReceived(message);
                }
            );

            showToast('Connected to chat server ✓', 'success');
        },
        function (error) {
            console.error('Connection error:', error);
            updateConnectionStatus(false);
            showToast('Connection failed. Retrying...', 'error');

            // Retry connection after 3 seconds
            setTimeout(connectWebSocket, 3000);
        }
    );
}

// ======================== Send Message ========================
function sendMessage(event) {
    event.preventDefault();

    const messageInput = document.getElementById('message-input');
    const content = messageInput.value.trim();

    if (!content || !stompClient || !stompClient.connected) {
        showToast('Cannot send message. Check connection.', 'error');
        return;
    }

    const messagePayload = {
        senderId: currentUser,
        conversationId: currentConversation,
        content: content,
    };

    console.log('Sending message:', messagePayload);

    stompClient.send(
        `/app/chat/conversations/${currentConversation}/send`,
        {},
        JSON.stringify(messagePayload)
    );

    // Add message to UI immediately (optimistic update)
    addMessageToUI(content, currentUser, 'sent');
    messageInput.value = '';
    messageInput.focus();
}

// ======================== Receive Message ========================
function onMessageReceived(message) {
    const messageData = JSON.parse(message.body);
    console.log('Message received:', messageData);

    // Only add if not from current user (to avoid duplicates)
    if (messageData.senderId !== currentUser) {
        addMessageToUI(messageData.content, messageData.senderId, 'received');
        playNotificationSound();
        updateUnreadCount();
    }
}

// ======================== Add Message to UI ========================
function addMessageToUI(content, senderId, type) {
    const messagesArea = document.getElementById('messages-area');

    // Remove placeholder if exists
    const placeholder = messagesArea.querySelector('.message-placeholder');
    if (placeholder) {
        placeholder.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;

    const timestamp = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });

    const status = type === 'sent' ? '✓ Sent' : '✓ Delivered';

    messageDiv.innerHTML = `
        <div class="message-content">
            ${escapeHtml(content)}
        </div>
        <div class="message-meta">
            <span class="message-timestamp">${timestamp}</span>
            <span class="message-status">${status}</span>
        </div>
    `;

    messagesArea.appendChild(messageDiv);

    // Scroll to bottom
    setTimeout(() => {
        messagesArea.scrollTop = messagesArea.scrollHeight;
    }, 0);
}

// ======================== Conversation Selection ========================
function selectConversation(convId) {
    currentConversation = convId;

    // Update other user based on current user
    otherUser = currentUser.startsWith('user') ? 'instructor1' : 'user1';

    document.querySelectorAll('.conversation-item').forEach((item) => {
        item.classList.remove('active');
    });
    event.target.closest('.conversation-item').classList.add('active');

    // Clear messages
    const messagesArea = document.getElementById('messages-area');
    messagesArea.innerHTML =
        '<div class="message-placeholder"><p>📱 No messages yet. Send your first message!</p></div>';

    document.getElementById('chat-title').textContent = `Chat Room - ${currentUser}`;

    updateUserInfo();

    // Resubscribe to new conversation
    if (stompClient && stompClient.connected) {
        stompClient.subscribe(
            `/topic/conversation/${currentConversation}`,
            function (message) {
                onMessageReceived(message);
            }
        );
    }

    showToast(`Switched to conversation: ${convId}`, 'info');
}

// ======================== Unread Count Management ========================
function updateUnreadCount() {
    fetch(`/api/v1/chat/unread/${currentUser}`)
        .then((response) => response.json())
        .then((data) => {
            const count = data.data || 0;
            document.getElementById('unread-count').textContent = count;
            document.getElementById(`unread-conv-${currentConversation}`).textContent = count;

            // Update badge visibility
            if (count > 0) {
                document.getElementById(`unread-conv-${currentConversation}`).style.display =
                    'flex';
            }
        })
        .catch((error) => console.error('Error fetching unread count:', error));
}

function resetUnreadCount() {
    fetch(`/api/v1/chat/unread/${currentUser}/reset`, {
        method: 'POST',
    })
        .then((response) => response.json())
        .then((data) => {
            document.getElementById('unread-count').textContent = '0';
            document.getElementById(`unread-conv-${currentConversation}`).textContent = '0';
            showToast('Unread count reset ✓', 'success');
        })
        .catch((error) => {
            console.error('Error resetting unread count:', error);
            showToast('Failed to reset unread count', 'error');
        });
}

// ======================== User Info Panel ========================
function toggleUserInfo() {
    const panel = document.getElementById('user-info-panel');
    panel.classList.toggle('show');
}

function updateUserInfo() {
    document.getElementById('current-user').textContent = currentUser;
    document.getElementById('conv-id').textContent = currentConversation;
    updateUnreadCount();
}

// ======================== Connection Status ========================
function updateConnectionStatus(connected) {
    const indicator = document.getElementById('status-indicator');
    const statusText = document.getElementById('status-text');
    const wsStatus = document.getElementById('ws-status');

    if (connected) {
        indicator.classList.add('connected');
        statusText.textContent = 'Connected';
        wsStatus.textContent = '✓ Connected';
        wsStatus.style.color = 'var(--success-color)';
    } else {
        indicator.classList.remove('connected');
        statusText.textContent = 'Disconnected';
        wsStatus.textContent = '✗ Disconnected';
        wsStatus.style.color = 'var(--danger-color)';
    }
}

// ======================== Clear Chat ========================
function clearChat() {
    if (
        confirm(
            'Are you sure you want to clear all messages? This action cannot be undone.'
        )
    ) {
        const messagesArea = document.getElementById('messages-area');
        messagesArea.innerHTML =
            '<div class="message-placeholder"><p>📱 Chat cleared. Send your first message!</p></div>';
        showToast('Chat cleared ✓', 'info');
    }
}

// ======================== Toast Notifications ========================
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ======================== Utility Functions ========================
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function playNotificationSound() {
    // Simple notification sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

// ======================== Keyboard Shortcuts ========================
document.addEventListener('keydown', function (event) {
    // Alt + I to toggle user info
    if (event.altKey && event.key === 'i') {
        toggleUserInfo();
    }

    // Alt + C to clear chat
    if (event.altKey && event.key === 'c') {
        clearChat();
    }

    // Focus on message input with Ctrl+M
    if (event.ctrlKey && event.key === 'm') {
        document.getElementById('message-input').focus();
    }
});

console.log('App.js loaded successfully');
