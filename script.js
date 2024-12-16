document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('search-bar');
    const searchButton = document.getElementById('search-button');
    const clearButton = document.getElementById('clear-button');
    const suggestions = document.getElementById('suggestions');
    const results = document.getElementById('results');

    let csvData = {
        headers: [],
        rows: []
    };
    let jsonData = [];

    // Load both CSV and JSON data
    Promise.all([
        // Load CSV data
        fetch('nbfcPilot.csv')
            .then(response => response.text())
            .then(data => {
                const lines = data.split('\n').map(line => line.trim()).filter(line => line);
                csvData.headers = lines[0].split(',').map(header => header.trim());
                csvData.rows = lines.slice(1).map(line => line.split(',').map(cell => cell.trim()));
            }),
        
        // Load JSON data
        fetch('nbfcxx.json')
            .then(response => response.json())
            .then(data => {
                jsonData = data;
            })
    ]).catch(error => {
        console.error('Error loading data:', error);
        results.innerHTML = '<div class="error">Error loading data. Please try again later.</div>';
    });

    // Search bar input event
    // Search bar input event
searchBar.addEventListener('input', () => {
    const query = searchBar.value.toLowerCase().trim();
    suggestions.innerHTML = '';
    
    if (!query) return;

    // Search in CSV data
    const csvMatches = csvData.rows
        .filter(row => row[1] && row[1].toLowerCase().includes(query));

    // Search in JSON data
    const jsonMatches = jsonData
        .filter(item => item.__EMPTY_1 && item.__EMPTY_1.toLowerCase().includes(query));

    // Combine matches and limit to 10
    const allMatches = [
        ...csvMatches.map(row => ({ type: 'csv', name: row[1] })),
        ...jsonMatches.map(item => ({ type: 'json', name: item.__EMPTY_1 }))
    ].slice(0, 10);

    if (allMatches.length > 0) {
        suggestions.innerHTML = allMatches
            .map(match => `<div class="suggestion" onclick="(function(){
                document.getElementById('search-bar').value='${match.name}';
                document.getElementById('search-button').click();
            })()">${match.name}</div>`)
            .join('');
    }
});
    // Search function
    function performSearch() {
        const query = searchBar.value.toLowerCase().trim();
        suggestions.innerHTML = '';
        
        if (!query) {
            results.innerHTML = '<div class="error">Please enter a search term</div>';
            return;
        }
    
        // Search in both CSV and JSON data
        const csvMatches = csvData.rows
            .filter(row => row[1] && row[1].toLowerCase().includes(query));
        
        const jsonMatches = jsonData
            .filter(item => item.__EMPTY_1 && item.__EMPTY_1.toLowerCase().includes(query));
    
        // Show or hide the banner based on JSON matches
        const banner = document.getElementById('banner');
        if (jsonMatches.length > 0) {
            banner.style.display = 'block'; // Show the banner
        } else {
            banner.style.display = 'none'; // Hide the banner
        }
    
        if (csvMatches.length > 0 || jsonMatches.length > 0) {
            results.innerHTML = `
                <div style="padding: 12px;">
                    <h3>Results:</h3>
                    ${csvMatches.map(row => `
                        <div class="result-item">
                            ${csvData.headers.slice(1).map((header, index) => `
                                <div><strong>${header}:</strong> ${row[index + 1] || 'N/A'}</div>
                            `).join('')}
                        </div>
                    `).join('')}
                    ${jsonMatches.map(item => `
                        <div class="result-item">
                            <div><strong>Company Name:</strong> ${item.__EMPTY_1 || 'N/A'}</div>
                            <div><strong>Regional Office:</strong> ${item.__EMPTY_2 || 'N/A'}</div>
                            <div><strong>Address:</strong> ${item.__EMPTY_3 || 'N/A'}</div>
                        </div>
                    `).join('')}
                </div>`;
        } else {
            results.innerHTML = `
                <div class="not-registered-banner">
                    <span class="x-sign">✕</span>
                    <div class="banner-text">NBFC NOT REGISTERED WITH RBI</div>
                </div>`;
        }
    }
     

    // Search button click event
    searchButton.addEventListener('click', performSearch);
    searchBar.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    // Clear button click event
    clearButton.addEventListener('click', () => {
        searchBar.value = '';
        suggestions.innerHTML = '';
        results.innerHTML = '';
    });
});