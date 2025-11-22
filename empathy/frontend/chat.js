
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


document.getElementById('menuBtn').addEventListener('click', () => {
  appendMessage('sys', 'Menu clicked (placeholder)');
});


document.getElementById('profileBtn').addEventListener('click', () => {
  appendMessage('sys', 'Profile clicked (placeholder)');
});