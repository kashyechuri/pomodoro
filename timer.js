// State management
const state = {
    timeLeft: 0,
    isRunning: false,
    isWorkTime: true,
    sessions: 0,
    interval: null
};

// Settings
const settings = {
    workTime: 25,
    shortBreakTime: 5
};

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
    // Get elements
    const startButton = document.querySelector('button.primary');
    const resetButton = document.querySelectorAll('button')[1];
    const settingsButton = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeSettings = document.getElementById('close-settings');
    
    // Add event listeners
    startButton.addEventListener('click', toggleTimer);
    resetButton.addEventListener('click', resetTimer);
    settingsButton.addEventListener('click', () => settingsModal.style.display = 'flex');
    closeSettings.addEventListener('click', saveAndCloseSettings);
    
    // Initialize timer
    resetTimer();
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            toggleTimer();
        } else if (e.code === 'KeyR') {
            resetTimer();
        }
    });
});

function toggleTimer() {
    if (state.isRunning) {
        pauseTimer();
    } else {
        startTimer();
    }
}

function startTimer() {
    const startButton = document.querySelector('button.primary');
    startButton.textContent = 'Pause (Space)';
    
    state.isRunning = true;
    state.interval = setInterval(() => {
        state.timeLeft--;
        updateDisplay();
        
        if (state.timeLeft <= 0) {
            handleTimerComplete();
        }
    }, 1000);
}

function pauseTimer() {
    const startButton = document.querySelector('button.primary');
    startButton.textContent = 'Start (Space)';
    
    state.isRunning = false;
    clearInterval(state.interval);
    state.interval = null;
}

function resetTimer() {
    const startButton = document.querySelector('button.primary');
    startButton.textContent = 'Start (Space)';
    
    state.isRunning = false;
    clearInterval(state.interval);
    state.interval = null;
    state.timeLeft = settings.workTime * 60;
    state.isWorkTime = true;
    updateDisplay();
}

function handleTimerComplete() {
    playNotification();
    
    if (state.isWorkTime) {
        state.sessions++;
    }
    
    state.isWorkTime = !state.isWorkTime;
    state.timeLeft = state.isWorkTime ? settings.workTime * 60 : settings.shortBreakTime * 60;
    
    pauseTimer();
    updateDisplay();
}

function updateDisplay() {
    const minutes = Math.floor(state.timeLeft / 60);
    const seconds = state.timeLeft % 60;
    document.getElementById('timer').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    const modeElement = document.getElementById('mode');
    modeElement.textContent = state.isWorkTime ? 'WORK TIME' : 'BREAK TIME';
    modeElement.className = state.isWorkTime ? '' : 'break';
    
    document.getElementById('session-count').textContent = `Sessions: ${state.sessions}`;
    
    // Update progress circle
    const circle = document.querySelector('.progress');
    circle.className = `progress ${state.isWorkTime ? '' : 'break'}`;
    updateProgress();
}

function updateProgress() {
    const circle = document.querySelector('.progress');
    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    
    const totalTime = state.isWorkTime ? settings.workTime * 60 : settings.shortBreakTime * 60;
    const offset = circumference - (state.timeLeft / totalTime) * circumference;
    circle.style.strokeDashoffset = offset;
}

function saveAndCloseSettings() {
    settings.workTime = parseInt(document.getElementById('workTime').value) || 25;
    settings.shortBreakTime = parseInt(document.getElementById('shortBreakTime').value) || 5;
    
    document.getElementById('settings-modal').style.display = 'none';
    
    if (!state.isRunning) {
        resetTimer();
    }
}

function playNotification() {
    const audio = new Audio('data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7xA4Tvh9Rz/y8QADBwMWgQAZG/ILNAARQ4GLTcDeIIIhxGOBAuD7hOfBB3/94gcJ3w+o5/5eIAIAAAVwWgQAVQ2ORaIQwEMAJiDg95G4nQL7mQVWI6GwRcfsZAcsKkJvxgxEjzFUgfHoSQ9Qq7KNwqHwuB13MA4a1q/DmBrHgPcmjiGoh//EwC5nGPEmS4RcfkVKOhJf+WOgoxJclFz3kgn//dBA+ya1GhurNn8zb//9NNutNuhz31f////9vt///z+IdAEAAAK4LQIAKobHItEIYCGAExBwe8jcToF9zIKrEdDYIuP2MgOWFSE34wYiR5iqQPj0JIeoVdlG4VD4XA67mAcNa1fhzA1jwHuTRxDUQ//iYBczjHiTJcIuPyKlHQkv/LHQUYkuSi57yQT//uggfZNajQ3Vmz+Zt//+mm3Wm3Q576v////+32///5/EOgAAADVghQAAAAA==');
    audio.play();
} 