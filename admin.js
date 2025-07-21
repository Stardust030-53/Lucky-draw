document.addEventListener('DOMContentLoaded', function() {
    const namesTextarea = document.getElementById('names');
    const totalNamesDisplay = document.getElementById('total-names');
    const clearBtn = document.getElementById('clear-btn');
    const addExampleBtn = document.getElementById('add-example-btn');
    const saveBtn = document.getElementById('save-btn');
    const historyList = document.getElementById('history-list');

    // Load names and history
    function init() {
        loadNames();
        loadHistory();
    }

    // Load names from localStorage
    function loadNames() {
        const savedNames = localStorage.getItem('luckyDrawNames');
        if (savedNames) {
            namesTextarea.value = savedNames;
        }
        updateStats();
    }

    // Load history from localStorage
    function loadHistory() {
        const savedHistory = localStorage.getItem('luckyDrawHistory');
        if (savedHistory) {
            const history = JSON.parse(savedHistory);
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
    }

    // Update statistics
    function updateStats() {
        const namesText = namesTextarea.value.trim();
        const namesArray = namesText ? namesText.split('\n')
            .map(name => name.trim())
            .filter(name => name.length > 0) : [];
        
        totalNamesDisplay.textContent = namesArray.length;
    }

    // Save names to localStorage
    function saveNames() {
        localStorage.setItem('luckyDrawNames', namesTextarea.value);
        alert("Names saved successfully!");
        updateStats();
    }

    // Add example names
    function addExamples() {
        const examples = [
            "Alex Johnson", "Taylor Smith", "Jordan Williams",
            "Morgan Davis", "Casey Brown", "Riley Miller",
            "Quinn Wilson", "Avery Taylor", "Skyler Moore",
            "Peyton Anderson"
        ];
        namesTextarea.value = examples.join('\n');
        updateStats();
    }

    // Event listeners
    namesTextarea.addEventListener('input', updateStats);
    clearBtn.addEventListener('click', () => {
        if (confirm("Are you sure you want to clear all names?")) {
            namesTextarea.value = '';
            updateStats();
        }
    });
    addExampleBtn.addEventListener('click', addExamples);
    saveBtn.addEventListener('click', saveNames);

    // Initialize
    init();
});
