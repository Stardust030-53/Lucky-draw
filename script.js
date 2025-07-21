document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const currentNameDisplay = document.getElementById('current-name');
    const selectBtn = document.getElementById('select-btn');
    const historySection = document.getElementById('history-section');
    const historyList = document.getElementById('history-list');
    const totalNamesDisplay = document.getElementById('total-names');
    const drawsCountDisplay = document.getElementById('draws-count');
    const winnerCardContainer = document.getElementById('winner-card-container');
    const winnerName = document.getElementById('winner-name');
    const resetBtn = document.getElementById('reset-btn');
    const removeBtn = document.getElementById('remove-btn');

    // State variables
    let namesArray = [];
    let selectionInterval;
    let totalDraws = 0;
    let history = [];
    let currentWinnerIndex = -1;

    // Initialize the app
    function init() {
        loadNames();
        loadHistory();
        updateStats();
    }

    // Load names from localStorage
    function loadNames() {
        const savedNames = localStorage.getItem('luckyDrawNames');
        if (savedNames) {
            namesArray = savedNames.split('\n')
                .map(name => name.trim())
                .filter(name => name.length > 0);
        }
    }

    // Load history from localStorage
    function loadHistory() {
        const savedHistory = localStorage.getItem('luckyDrawHistory');
        if (savedHistory) {
            history = JSON.parse(savedHistory);
        }
    }

    // Save history to localStorage
    function saveHistory() {
        localStorage.setItem('luckyDrawHistory', JSON.stringify(history));
    }

    // Update statistics display
    function updateStats() {
        totalNamesDisplay.textContent = namesArray.length;
        drawsCountDisplay.textContent = totalDraws;
        historySection.classList.toggle('visible', history.length > 0);
    }

    // Add winner to history
    function addToHistory(winner) {
        const now = new Date();
        
        history.unshift({
            name: winner,
            time: now.toLocaleTimeString(),
            date: now.toLocaleDateString(),
            timestamp: now.getTime()
        });

        // Keep last 100 winners
        if (history.length > 100) {
            history.pop();
        }

        saveHistory();
        updateHistoryDisplay();
    }

    // Update history display
    function updateHistoryDisplay() {
        historyList.innerHTML = history.map(entry => `
            <div class="history-item">
                <span class="history-name">${entry.name}</span>
                <div class="history-time">
                    <span class="history-date">${entry.date}</span>
                    <span>${entry.time}</span>
                </div>
            </div>
        `).join('');
    }

    // Start random name selection
    selectBtn.addEventListener('click', function() {
        if (namesArray.length < 2) {
            alert("Please add at least 2 names in the admin panel!");
            return;
        }

        selectBtn.disabled = true;
        selectBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Selecting...';

        let counter = 0;
        const duration = 3000;
        const startTime = Date.now();

        selectionInterval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * namesArray.length);
            currentNameDisplay.textContent = namesArray[randomIndex];
            currentNameDisplay.style.animation = "nameFlash 0.1s";

            const elapsed = Date.now() - startTime;
            if (elapsed > duration * 0.7) {
                clearInterval(selectionInterval);
                startSlowdown(100);
            }

            counter++;
        }, 50);
    });

    // Recursive slowdown function
    function startSlowdown(delay) {
        const randomIndex = Math.floor(Math.random() * namesArray.length);
        currentNameDisplay.textContent = namesArray[randomIndex];
        currentNameDisplay.style.animation = "nameFlash 0.1s";

        if (delay < 500) {
            setTimeout(() => startSlowdown(delay * 1.3), delay);
        } else {
            selectWinner();
        }
    }

    // Select and display winner
    function selectWinner() {
        currentWinnerIndex = Math.floor(Math.random() * namesArray.length);
        const winner = namesArray[currentWinnerIndex];

        // Update display
        currentNameDisplay.textContent = winner;
        currentNameDisplay.style.animation = "pulse 1s";
        currentNameDisplay.style.color = "#f6b93b";
        winnerName.textContent = winner;
        winnerCardContainer.classList.add('visible');

        // Update stats
        totalDraws++;
        addToHistory(winner);
        updateStats();

        // Reset button
        selectBtn.disabled = false;
        selectBtn.innerHTML = '<i class="fas fa-random"></i> Draw Winner';
        
        createConfetti();
    }

    // Remove winner from list
    removeBtn.addEventListener('click', function() {
        if (currentWinnerIndex >= 0 && currentWinnerIndex < namesArray.length) {
            namesArray.splice(currentWinnerIndex, 1);
            localStorage.setItem('luckyDrawNames', namesArray.join('\n'));
            totalNamesDisplay.textContent = namesArray.length;
        }
        resetUI();
    });

    // Reset UI
    resetBtn.addEventListener('click', resetUI);

    function resetUI() {
        winnerCardContainer.classList.remove('visible');
        currentNameDisplay.innerHTML = `
            <i class="fas fa-star" style="font-size: 2rem; opacity: 0.7;"></i>
            <span style="margin: 0 15px;">Ready to Draw</span>
            <i class="fas fa-star" style="font-size: 2rem; opacity: 0.7;"></i>
        `;
        currentNameDisplay.style.color = "#f6b93b";
        currentNameDisplay.style.animation = "none";
        clearInterval(selectionInterval);
        currentWinnerIndex = -1;
    }

    // Create confetti effect
    function createConfetti() {
        const colors = ['#f6b93b', '#e55039', '#4a69bd', '#1e3c72', '#ffffff', '#6a89cc'];
        const container = document.querySelector('.container');
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < 200; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.opacity = Math.random();
            confetti.style.width = Math.random() * 12 + 8 + 'px';
            confetti.style.height = Math.random() * 12 + 8 + 'px';
            fragment.appendChild(confetti);

            const animation = confetti.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                { transform: `translateY(${window.innerHeight}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
            ], {
                duration: Math.random() * 3000 + 2000,
                easing: 'cubic-bezier(0,0,0.2,1)'
            });

            animation.onfinish = () => confetti.remove();
        }

        container.appendChild(fragment);
    }

    // Initialize the app
    init();
});
