const messagesEl = document.getElementById('messages');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const micBtn = document.getElementById('micBtn');

let mediaRecorder = null;
let audioChunks = [];
let lastBlob = null;
let isRecording = false;

function appendMessage(role, html) {
  const div = document.createElement('div');
  div.className = 'msg ' + (role === 'user' ? 'user' : (role === 'assistant' ? 'assistant' : 'sys'));
  div.innerHTML = html;
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}


async function sendMessage(text, audioBlob=null) {
  if (!text && !audioBlob) return;

 
  if (text) appendMessage('user', text);
  saveChatToHistory({role:'user',text});
  appendMessage('assistant', '<em>Processing...</em>');

  
  await new Promise(r => setTimeout(r, 800));

  
  const placeholders = messagesEl.querySelectorAll('.msg.assistant');
  if (placeholders.length) {
    const last = placeholders[placeholders.length - 1];
    if (last.innerHTML.includes('Processing...')) last.remove();
  }

  
  const reply = audioBlob ? 'I received your audio (mock reply).' : `Echo: ${text}`;
  appendMessage('assistant', reply);
}


sendBtn.addEventListener('click', () => {
  const txt = chatInput.value.trim();
  if (!txt) return;
  sendMessage(txt);
  chatInput.value = '';
});


chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendBtn.click();
  }
});


micBtn.addEventListener('click', async () => {
  if (!isRecording) {
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];

      mediaRecorder.ondataavailable = e => {
        if (e.data && e.data.size > 0) audioChunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        lastBlob = new Blob(audioChunks, { type: 'audio/webm' });
        
        const audioURL = URL.createObjectURL(lastBlob);
        const markup = `
          <div>
            <audio controls src="${audioURL}"></audio>
            <div style="margin-top:6px;">
              <button class="btn small send" id="sendAudioBtn">Send audio</button>
            </div>
          </div>`;
        appendMessage('assistant', markup);

       
        setTimeout(() => {
          const btn = document.getElementById('sendAudioBtn');
          if (btn) {
            btn.addEventListener('click', () => {
              sendMessage('', lastBlob);
            });
          }
          messagesEl.scrollTop = messagesEl.scrollHeight;
        }, 150);
      };

      mediaRecorder.start();
      isRecording = true;
      micBtn.classList.add('recording');
      micBtn.setAttribute('aria-pressed', 'true');
      
      appendMessage('sys', 'Recording started — click mic to stop.');
    } catch (err) {
      console.error(err);
      appendMessage('sys', 'Microphone access denied or unavailable.');
    }
  } else {
    // stop
    if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();
    isRecording = false;
    micBtn.classList.remove('recording');
    micBtn.setAttribute('aria-pressed', 'false');
    appendMessage('sys', 'Recording stopped.');
  }
});


document.addEventListener("DOMContentLoaded", () => {

  
  const profileContainer = document.getElementById("profileContainer");
  const profileDropdown = document.getElementById("profileDropdown");
  const profileOption = document.getElementById("profileOption");
  const logoutOption = document.getElementById("logoutOption");
  const profileModal = document.getElementById("profileModal");

  const nameInput = document.getElementById("nameInput");
  const emailInput = document.getElementById("emailInput");
  const ageInput = document.getElementById("ageInput");
  const genderInput = document.getElementById("genderInput");
  const profileForm = document.getElementById("profileForm");

  
  let user = {
    name: localStorage.getItem("ee_account_user") || "",
    email: localStorage.getItem("ee_account_email") || "",
    age: localStorage.getItem("ee_account_age") || "",
    gender: localStorage.getItem("ee_account_gender") || ""
  };

  
  profileContainer.addEventListener("click", (e) => {
    e.stopPropagation();
    profileDropdown.style.display = profileDropdown.style.display === "block" ? "none" : "block";
  });

  
  window.addEventListener("click", () => {
    profileDropdown.style.display = "none";
  });

  
  profileOption.addEventListener("click", (e) => {
    e.preventDefault();
    profileDropdown.style.display = "none";

    
    nameInput.value = user.name;
    emailInput.value = user.email; 
    ageInput.value = user.age;
    genderInput.value = user.gender;

    profileModal.style.display = "flex";
  });

  
  profileModal.addEventListener("click", (e) => {
    if (e.target === profileModal) profileModal.style.display = "none";
  });

 
  profileForm.addEventListener("submit", (e) => {
    e.preventDefault();

    
    user.name = nameInput.value.trim() || user.name;
    user.age = ageInput.value || "";
    user.gender = genderInput.value || "";

   
    localStorage.setItem("ee_account_user", user.name);
    localStorage.setItem("ee_account_age", user.age);
    localStorage.setItem("ee_account_gender", user.gender);

    profileModal.style.display = "none";
    alert("Profile saved!");
  });

  
  logoutOption.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("ee_logged_in");
    window.location.href = "gateway.html"; 
  });

});

const menuBtn = document.getElementById('menuBtn');
const chatSidebar = document.getElementById('chatSidebar');
const chatList = document.getElementById('chatList');


let chatHistory = JSON.parse(localStorage.getItem('ee_chat_history') || '[]');

// Function to render chat items
function renderChatHistory() {
  chatList.innerHTML = '';
  chatHistory.forEach((chat, index) => {
    const div = document.createElement('div');
    div.className = 'chat-item';
    div.textContent = chat.title || `Chat ${index + 1}`;

    // Actions
    const actions = document.createElement('div');
    actions.className = 'chat-actions';
    actions.innerHTML = `
      <button onclick="renameChat(${index})">Rename</button>
      <button onclick="archiveChat(${index})">Archive</button>
      <button onclick="deleteChat(${index})">Delete</button>
    `;
    div.appendChild(actions);

    div.addEventListener('click', () => {
      loadChat(index);
    });

    chatList.appendChild(div);
  });
}

// Menu button click
menuBtn.addEventListener('click', () => {
  chatSidebar.classList.toggle('show');
});

// Functions for actions
window.renameChat = function(index) {
  const newTitle = prompt("Enter new chat title:", chatHistory[index].title);
  if (newTitle) {
    chatHistory[index].title = newTitle;
    localStorage.setItem('ee_chat_history', JSON.stringify(chatHistory));
    renderChatHistory();
  }
};

window.archiveChat = function(index) {
  alert(`Chat "${chatHistory[index].title}" archived (mock)`);
  // You can implement archive logic later
};

window.deleteChat = function(index) {
  if (confirm("Are you sure you want to delete this chat?")) {
    chatHistory.splice(index, 1);
    localStorage.setItem('ee_chat_history', JSON.stringify(chatHistory));
    renderChatHistory();
  }
};
// New Chat button
const newChatBtn = document.getElementById('newChatBtn');

newChatBtn.addEventListener('click', () => {
  // Clear current messages
  messagesEl.innerHTML = '';
  
  // Create a new chat entry in history
  const newChat = {
    title: `Chat ${chatHistory.length + 1}`,
    messages: []
  };
  chatHistory.unshift(newChat); // add to the top
  localStorage.setItem('ee_chat_history', JSON.stringify(chatHistory));
  
  // Re-render sidebar
  renderChatHistory();

  // Close sidebar
  chatSidebar.classList.remove('show');
});

// Load a chat
function loadChat(index) {
  const chat = chatHistory[index];
  messagesEl.innerHTML = ''; // clear current chat
  if (chat.messages) {
    chat.messages.forEach(msg => {
      appendMessage(msg.role, msg.text);
    });
  }
  chatSidebar.classList.remove('show');
}

// Initialize
renderChatHistory();

// Save new chats whenever a message is sent
function saveChatToHistory(newMessage) {
  if (!chatHistory[0]) chatHistory.push({ title: "Chat 1", messages: [] });
  chatHistory[0].messages.push(newMessage);
  localStorage.setItem('ee_chat_history', JSON.stringify(chatHistory));
}