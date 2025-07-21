document.addEventListener('DOMContentLoaded', function() {
    const namesTextarea = document.getElementById('names');
    const currentNameDisplay = document.getElementById('current-name');
    const selectBtn = document.getElementById('select-btn');
    const historySection = document.getElementById('history-section');
    const historyList = document.getElementById('history-list');
    const totalNamesDisplay = document.getElementById('total-names');
    const drawsCountDisplay = document.getElementById('draws-count');
    const clearBtn = document.getElementById('clear-btn');
    const addExampleBtn = document.getElementById('add-example-btn');
    const winnerCardContainer = document.getElementById('winner-card-container');
    const winnerName = document.getElementById('winner-name');
    const resetBtn = document.getElementById('reset-btn');
    const closeCardBtn = document.getElementById('close-card-btn');
    
    let namesArray = [];
    let selectionInterval;
    let isSelecting = false;
    let totalDraws = 0;
    let history = [];
    
    // Initialize the app
    function initApp() {
        updateStats();
    }
    
	function resetUI() {
        winnerCardContainer.classList.remove('visible');
        namesTextarea.disabled = false; // Always re-enable the textarea
        currentNameDisplay.innerHTML = `
            <i class="fas fa-star" style="font-size: 2rem; opacity: 0.7;"></i>
            <span style="margin: 0 15px;">Ready to Draw</span>
            <i class="fas fa-star" style="font-size: 2rem; opacity: 0.7;"></i>
        `;
        currentNameDisplay.style.color = "#f6b93b";
        currentNameDisplay.style.animation = "none";
        clearInterval(selectionInterval);
    }
    // Update statistics display
    function updateStats() {
        const namesText = namesTextarea.value.trim();
        namesArray = namesText ? namesText.split('\n')
            .map(name => name.trim())
            .filter(name => name.length > 0) : [];
        
        totalNamesDisplay.textContent = namesArray.length;
        drawsCountDisplay.textContent = totalDraws;
        
        // Show history section if there are previous winners
        historySection.classList.toggle('visible', history.length > 0);
    }
    
    // Add names to history
    function addToHistory(winner) {
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        
        history.unshift({
            name: winner,
            time: timeString
        });
        
        // Keep only last 5 winners
        if (history.length > 5) history.pop();
        
        updateHistoryDisplay();
    }
    
    // Update history display
    function updateHistoryDisplay() {
        historyList.innerHTML = '';
        
        history.forEach(entry => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <span class="history-name">${entry.name}</span>
                <span class="history-time">${entry.time}</span>
            `;
            historyList.appendChild(historyItem);
        });
    }
    
    // Start random name selection
    selectBtn.addEventListener('click', function() {
        // Get names from textarea
        const namesText = namesTextarea.value.trim();
        
        if (!namesText) {
            showError("Please enter at least one name!");
            namesTextarea.focus();
            return;
        }
        
        // Split names by new line and filter out empty lines
        namesArray = namesText.split('\n')
            .map(name => name.trim())
            .filter(name => name.length > 0);
        
        if (namesArray.length < 2) {
            showError("Please enter at least two names!");
            return;
        }
        
        // Disable button and textarea during selection
        selectBtn.disabled = true;
        namesTextarea.disabled = true;
        isSelecting = true;
        
        // Change button text
        selectBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Selecting Winner...';
        
        // Start name shuffling effect
        let counter = 0;
        const duration = 3000; // 3 seconds
        const startTime = Date.now();
        
        selectionInterval = setInterval(() => {
            // Random name for the shuffling effect
            const randomIndex = Math.floor(Math.random() * namesArray.length);
            currentNameDisplay.textContent = namesArray[randomIndex];
            currentNameDisplay.style.animation = "nameFlash 0.1s";
            
            // Slow down as we approach the end
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
        // Display a random name
        const randomIndex = Math.floor(Math.random() * namesArray.length);
        currentNameDisplay.textContent = namesArray[randomIndex];
        currentNameDisplay.style.animation = "nameFlash 0.1s";

        if (delay < 500) {
            // Schedule next slowdown step with increased delay
            setTimeout(() => {
                startSlowdown(delay * 1.3);
            }, delay);
        } else {
            // After the delay becomes too long, we stop and select the winner
            selectWinner();
        }
    }
    
    function selectWinner() {
        // Final random selection
        const winnerIndex = Math.floor(Math.random() * namesArray.length);
        const winner = namesArray[winnerIndex];
        
        // Display winner in the center display
        currentNameDisplay.textContent = winner;
        currentNameDisplay.style.animation = "pulse 1s";
        currentNameDisplay.style.color = "#f6b93b";
        
        // Show winner card
        winnerName.textContent = winner;
        winnerCardContainer.classList.add('visible');
        
        // Create confetti
        createConfetti();
        
        // Add to history
        addToHistory(winner);
        
        // Update stats
        totalDraws++;
        updateStats();
        
        // Reset button state
        selectBtn.disabled = false;
        selectBtn.innerHTML = '<i class="fas fa-random"></i> Select Random Name';
		namesTextarea.disabled = false; //Re-enable textarea after selection
    }
    
    // Reset button functionality
    resetBtn.addEventListener('click', function() {
        // Reset UI
        winnerCardContainer.classList.remove('visible');
        namesTextarea.disabled = false;
        currentNameDisplay.innerHTML = `
            <i class="fas fa-star" style="font-size: 2rem; opacity: 0.7;"></i>
            <span style="margin: 0 15px;">Ready to Draw</span>
            <i class="fas fa-star" style="font-size: 2rem; opacity: 0.7;"></i>
        `;
        currentNameDisplay.style.color = "#f6b93b";
        currentNameDisplay.style.animation = "none";
        
        // Clear any intervals just in case
        clearInterval(selectionInterval);
    });
    
    // Close winner card
    closeCardBtn.addEventListener('click', function() {
        winnerCardContainer.classList.remove('visible');
    });
    
    // Create confetti effect
    function createConfetti() {
        const colors = ['#f6b93b', '#e55039', '#4a69bd', '#1e3c72', '#ffffff', '#6a89cc'];
        const container = document.querySelector('.container');
        
        // Use DocumentFragment for better performance
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
            
            // Animate confetti
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
    
    // Clear names
    clearBtn.addEventListener('click', function() {
        if (confirm("Are you sure you want to clear all names?")) {
            namesTextarea.value = '';
            updateStats();
        }
    });
    
    // Add example names
    addExampleBtn.addEventListener('click', function() {
        const examples = [
            "Alex Johnson",
            "Taylor Smith",
            "Jordan Williams",
            "Morgan Davis",
            "Casey Brown",
            "Riley Miller",
            "Quinn Wilson",
            "Avery Taylor",
            "Skyler Moore",
            "Peyton Anderson"
        ];
        
        namesTextarea.value = examples.join('\n');
        updateStats();
    });
    
    // Show error message
    function showError(message) {
        alert(message);
    }
    
    // Initialize the app
    initApp();
    
    // Update stats when textarea changes
    namesTextarea.addEventListener('input', updateStats);
});
