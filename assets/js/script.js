document.addEventListener('DOMContentLoaded', () => {
    // Initialize speech recognition
    const recognition = new webkitSpeechRecognition() || new SpeechRecognition();

    // DOM elements
    const languageSelect = document.getElementById('language');
    const resultContainer = document.querySelector('.result p.resultText');
    const startListeningButton = document.querySelector('.btn.record');
    const recordButtonText = document.querySelector('.btn.record p');
    const clearButton = document.querySelector('.btn.clear');
    const downloadButton = document.querySelector('.btn.download');

    // Flag for recognizing state
    let recognizing = false;

    // Populate language options in the dropdown
    languages.forEach(language => {
        const option = document.createElement('option');
        option.value = language.code;
        option.text = language.name;
        languageSelect.add(option);
    });

    // Configure recognition settings
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = languageSelect.value;

    // Update recognition language on dropdown change
    languageSelect.addEventListener('change', () => {
        recognition.lang = languageSelect.value;
    });

    // Event listener for the start/stop recording button
    startListeningButton.addEventListener('click', toggleSpeechRecognition);

    // Event listener for the clear button
    clearButton.addEventListener('click', clearResults);

    // Disable download button initially
    downloadButton.disabled = true;

    // Event listener for recognition results
    recognition.onresult = (event) => {
        const result = event.results[event.results.length - 1][0].transcript;
        resultContainer.textContent = result;
        downloadButton.disabled = false;
    };

    // Event listener for recognition end
    recognition.onend = () => {
        recognizing = false;
        startListeningButton.classList.remove('recording');
        recordButtonText.textContent = 'Start Recording';
    };

    // Event listener for download button
    downloadButton.addEventListener('click', downloadResult);

    // Function to toggle speech recognition
    function toggleSpeechRecognition() {
        if (recognizing) {
            recognition.stop();
        } else {
            recognition.start();
        }

        recognizing = !recognizing;
        startListeningButton.classList.toggle('recording', recognizing);
        recordButtonText.textContent = 'Stop Recording';
    }

    // Function to clear recognition results
    function clearResults() {
        resultContainer.textContent = '';
        downloadButton.disabled = true;
    }

    // Function to download recognition result
    function downloadResult() {
        const resultText = resultContainer.textContent;

        const blob = new Blob([resultText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'Your-Text.txt';
        a.style.display = 'none';

        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
});