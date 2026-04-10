let timer;
let minutes = 25;
let seconds = 0;
let isPaused = false;
let enteredTime = null;
let totalTime = 25 * 60;
let currentMode = 'study';
let tasks = [];

const studyMinutes = 25;
const breakMinutes = 5;

const radius = 95;
const circumference = 2 * Math.PI * radius;

// starts the countdown
function startTimer() {
    clearInterval(timer);
    timer = setInterval(updateTimer, 1000);
}

// updates timer every second and also updates the ring
function updateTimer() {
    const timerElement = document.getElementById('timer');
    timerElement.textContent = formatTime(minutes, seconds);

    updateProgressRing();

    // when time runs out
    if (minutes == 0 && seconds == 0) {
        clearInterval(timer);
        playAlarmSound();

        // switch between study and break automatically
        if (currentMode === 'study') {
            showNotification('Study session done. Time for a break!');
            alert('Study session done. Time for a break!');
            setBreakMode();
        } else {
            showNotification('Break is over. Back to study!');
            alert('Break is over. Back to study!');
            setStudyMode();
        }
    } else if (!isPaused) {
        // normal countdown logic
        if (seconds > 0) {
            seconds--;
        } else {
            seconds = 59;
            minutes--;
        }
    }
}

// makes the timer always look like 05:09 instead of 5:9
function formatTime(minutes, seconds) {
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// just so I don’t keep rewriting the same selector
function getPauseButton() {
    return document.querySelector('.control-buttons button');
}

// resets the timer text + button text together
function resetTimerDisplay() {
    document.getElementById('timer').textContent = formatTime(minutes, seconds);
    getPauseButton().textContent = 'Pause';
}

// pause if running, resume if paused
function togglePauseResume() {
    const pauseResumeButton = getPauseButton();
    isPaused = !isPaused;

    if (isPaused) {
        clearInterval(timer);
        pauseResumeButton.textContent = 'Resume';
    } else {
        startTimer();
        pauseResumeButton.textContent = 'Pause';
    }
}

// restarts timer based on current mode or chosen time
function restartTimer() {
    clearInterval(timer);

    if (enteredTime !== null) {
        minutes = enteredTime;
        totalTime = enteredTime * 60;
    } else if (currentMode === 'study') {
        minutes = studyMinutes;
        totalTime = studyMinutes * 60;
    } else {
        minutes = breakMinutes;
        totalTime = breakMinutes * 60;
    }

    seconds = 0;
    isPaused = false;

    resetTimerDisplay();
    updateProgressRing();
    startTimer();
}

// lets user type in their own timer length
function chooseTime() {
    const newTime = prompt('Enter new time in minutes:');

    if (!isNaN(newTime) && newTime > 0) {
        enteredTime = parseInt(newTime);
        minutes = enteredTime;
        seconds = 0;
        totalTime = enteredTime * 60;
        isPaused = false;

        clearInterval(timer);
        resetTimerDisplay();
        updateProgressRing();
        startTimer();
    } else {
        alert('Invalid input. Please enter a valid number greater than 0.');
    }
}

// switches timer to study mode
function setStudyMode() {
    currentMode = 'study';
    enteredTime = null;
    minutes = studyMinutes;
    seconds = 0;
    totalTime = studyMinutes * 60;
    isPaused = false;

    document.getElementById('mode-label').textContent = 'Study Time';

    clearInterval(timer);
    resetTimerDisplay();
    updateProgressRing();
    startTimer();
}

// switches timer to break mode
function setBreakMode() {
    currentMode = 'break';
    enteredTime = null;
    minutes = breakMinutes;
    seconds = 0;
    totalTime = breakMinutes * 60;
    isPaused = false;

    document.getElementById('mode-label').textContent = 'Break Time';

    clearInterval(timer);
    resetTimerDisplay();
    updateProgressRing();
    startTimer();
}

// updates the pink progress circle around the timer
function updateProgressRing() {
    const circle = document.querySelector('.progress-ring-circle');
    const timeLeft = minutes * 60 + seconds;
    const progress = timeLeft / totalTime;

    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = circumference * (1 - progress);
}

// dark mode toggle
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');

    const themeIcon = document.getElementById('theme-icon');
    const isDark = document.body.classList.contains('dark-mode');

    if (isDark) {
        themeIcon.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    } else {
        themeIcon.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    }
}

// remembers theme even after refresh
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const themeIcon = document.getElementById('theme-icon');

    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeIcon.textContent = '☀️';
    } else {
        themeIcon.textContent = '🌙';
    }
}

// plays alarm when timer ends
function playAlarmSound() {
    const alarmSound = document.getElementById('alarm-sound');
    alarmSound.currentTime = 0;
    alarmSound.play();
}

// asks user for notification permission
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission !== 'granted') {
        Notification.requestPermission();
    }
}

// sends browser notification
function showNotification(message) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Pomodoro Timer', {
            body: message,
        });
    }
}

// background music settings
function playBackgroundMusic() {
    const music = document.getElementById('background-music');
    music.volume = 0.3;
    music.play();
}

// play/pause music button
function toggleMusic() {
    const music = document.getElementById('background-music');

    if (music.paused) {
        music.play();
    } else {
        music.pause();
    }
}

// just adding a small smooth transition
document.body.style.transition = 'background 0.5s';

// browser blocks autoplay sometimes so this starts music after first click
document.addEventListener('click', function () {
    playBackgroundMusic();
}, { once: true });

// add a task to the list
function addTask() {
    let input = document.getElementById('task');

    if (input.value === '') return;

    tasks.push(input.value);
    input.value = '';
    displayTasks();
}

// remove one task
function removeTask(i) {
    tasks.splice(i, 1);
    displayTasks();
}

// clears everything from the list
function clearAll() {
    tasks = [];
    displayTasks();
}

// redraws the to-do list each time something changes
function displayTasks() {
    let list = document.getElementById('list');
    list.innerHTML = '';

    for (let i = 0; i < tasks.length; i++) {
        list.innerHTML += `<li>${tasks[i]} <button onclick="removeTask(${i})">❌</button></li>`;
    }
}

// shows today's date on the date card
function showCurrentDate() {
    const today = new Date();

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const days = [
        'Sunday', 'Monday', 'Tuesday', 'Wednesday',
        'Thursday', 'Friday', 'Saturday'
    ];

    document.getElementById('month-name').textContent = months[today.getMonth()];
    document.getElementById('day-number').textContent = today.getDate();
    document.getElementById('day-name').textContent = days[today.getDay()];
}

// page setup stuff
loadTheme();
updateProgressRing();
requestNotificationPermission();
showCurrentDate();
startTimer();