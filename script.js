//defining variables
let timer;
let minutes = 25;
let seconds = 0;
let isPaused = false;
let enteredTime = null; 
let totalTime = 25 * 60;
let currentMode = 'study';

const studyMinutes = 25;
const breakMinutes = 5;

const radius = 95;
const circumference = 2 * Math.PI * radius;

//Function to start the timer
function startTimer() {
    clearInterval(timer);
    timer = setInterval(updateTimer, 1000);
}

//Function to update the timerand the progress ring
function updateTimer() {
    const timerElement = document.getElementById('timer');
    timerElement.textContent = formatTime(minutes, seconds);

    updateProgressRing();

    if (minutes == 0 && seconds == 0) {
        clearInterval(timer);
        playAlarmSound();

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
        if (seconds > 0) {
            seconds--;
        } else {
            seconds = 59;
            minutes--;
        }
    }
}

//Function to format time
function formatTime(minutes, seconds) {
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

//Function to Pause/Resume
function togglePauseResume() {
    const pauseResumeButton = 
        document.querySelector('.control-buttons button');
    isPaused = !isPaused;

    if (isPaused) {
        clearInterval(timer);
        pauseResumeButton.textContent = 'Resume';
    } else {
        startTimer();
        pauseResumeButton.textContent = 'Pause';
    }
}

//Function to restart the timer
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

    const timerElement = 
        document.getElementById('timer');
    timerElement.textContent = 
        formatTime(minutes, seconds);

    const pauseResumeButton = 
        document.querySelector('.control-buttons button');
    pauseResumeButton.textContent = 'Pause';

    updateProgressRing();
    startTimer();
}

//Function to choose the time
function chooseTime() {
    const newTime = prompt('Enter new time in minutes:');
    if (!isNaN(newTime) && newTime > 0) {
        enteredTime = parseInt(newTime);
        minutes = enteredTime;
        seconds = 0;
        totalTime = enteredTime * 60;
        isPaused = false;

        const timerElement =
            document.getElementById('timer');
        timerElement.textContent =
            formatTime(minutes, seconds);

        clearInterval(timer);

        const pauseResumeButton =
            document.querySelector('.control-buttons button');
        pauseResumeButton.textContent = 'Pause';

        updateProgressRing();
        startTimer();
    } else {
        alert('Invalid input. Please enter' +
              ' a valid number greater than 0.');
    }
}

//Function to set study mode
function setStudyMode() {
    currentMode = 'study';
    enteredTime = null;
    minutes = studyMinutes;
    seconds = 0;
    totalTime = studyMinutes * 60;
    isPaused = false;

    document.getElementById('mode-label').textContent = 'Study Time';
    document.getElementById('timer').textContent = formatTime(minutes, seconds);

    const pauseResumeButton =
        document.querySelector('.control-buttons button');
    pauseResumeButton.textContent = 'Pause';

    clearInterval(timer);
    updateProgressRing();
    startTimer();
}

//Function to set break mode
function setBreakMode() {
    currentMode = 'break';
    enteredTime = null;
    minutes = breakMinutes;
    seconds = 0;
    totalTime = breakMinutes * 60;
    isPaused = false;

    document.getElementById('mode-label').textContent = 'Break Time';
    document.getElementById('timer').textContent = formatTime(minutes, seconds);

    const pauseResumeButton =
        document.querySelector('.control-buttons button');
    pauseResumeButton.textContent = 'Pause';

    clearInterval(timer);
    updateProgressRing();
    startTimer();
}

//Function to update the circular progress ring
function updateProgressRing() {
    const circle = document.querySelector('.progress-ring-circle');
    const timeLeft = minutes * 60 + seconds;
    const progress = timeLeft / totalTime;

    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = circumference * (1 - progress);
}

//Function to toggle dark mode
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

//Function to load saved theme
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

//Function to play the alarm sound
function playAlarmSound() {
    const alarmSound = document.getElementById('alarm-sound');
    alarmSound.currentTime = 0;
    alarmSound.play();
}

//Function to request notification permission
function requestNotificationPermission() {
    if ("Notification" in window && Notification.permission !== "granted") {
        Notification.requestPermission();
    }
}

//Function to show browser notification
function showNotification(message) {
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Pomodoro Timer", {
            body: message,
        });
    }
}

//Function to play background music
function playBackgroundMusic() {
    const music = document.getElementById('background-music');
    music.volume = 0.3;
    music.play();
}

//Function to toggle background music
function toggleMusic() {
    const music = document.getElementById('background-music');

    if (music.paused) {
        music.play();
    } else {
        music.pause();
    }
}

//adding a slight transition
document.body.style.transition = "background 0.5s";

//remove the bock autoplay
document.addEventListener('click', function () {
    playBackgroundMusic();
}, { once: true });

loadTheme();
updateProgressRing();
requestNotificationPermission();
startTimer();