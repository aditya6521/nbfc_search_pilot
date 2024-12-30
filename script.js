document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('search-bar');
    const searchButton = document.getElementById('search-button');
    const clearButton = document.getElementById('clear-button');
    const suggestions = document.getElementById('suggestions');
    const results = document.getElementById('results');
    const banner = document.getElementById('banner'); // Get the banner element

    let jsonData = [];
    let newJsonData = [];

    // Load both JSON data
    Promise.all([
        // Load existing JSON data
        fetch('nbfcxx.json')
            .then(response => response.json())
            .then(data => {
                jsonData = data;
            }),
        
        // Load new JSON data
        fetch('nbfcx1list.json')
            .then(response => response.json())
            .then(data => {
                newJsonData = data;
            })
    ]).catch(error => {
        console.error('Error loading data:', error);
        results.innerHTML = '<div class="error">Error loading data. Please try again later.</div>';
    });

    // Search bar input event
    searchBar.addEventListener('input', () => {
        const query = searchBar.value.toLowerCase().trim();
        suggestions.innerHTML = '';
        
        if (!query) return;

        // Search in existing JSON data
        const jsonMatches = jsonData
            .filter(item => item.__EMPTY_1 && item.__EMPTY_1.toLowerCase().includes(query));

        // Search in new JSON data
        const newJsonMatches = newJsonData
            .filter(item => item.__EMPTY_1 && item.__EMPTY_1.toLowerCase().includes(query));

        // Combine matches and limit to 10
        const allMatches = [
            ...jsonMatches.map(item => ({ type: 'json', name: item.__EMPTY_1 })),
            ...newJsonMatches.map(item => ({ type: 'newJson', name: item.__EMPTY_1 }))
        ].slice(0, 10);

        // Sort matches alphabetically
        allMatches.sort((a, b) => a.name.localeCompare(b.name));

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

        // Search in existing JSON data
        const jsonMatches = jsonData
            .filter(item => item.__EMPTY_1 && item.__EMPTY_1.toLowerCase() === query);
        
        // Search in new JSON data
        const newJsonMatches = newJsonData
            .filter(item => item.__EMPTY_1 && item.__EMPTY_1.toLowerCase() === query);

        // Show or hide the banner based on JSON matches for jsonData
        if (jsonMatches.length > 0) {
            banner.style.display = 'block'; // Show the banner
        } else {
            banner.style.display = 'none'; // Hide the banner
        }

        // Display results
        if (jsonMatches.length > 0) {
            results.innerHTML = `
                <div style="padding: 12px;">
                    <h3>Search Results from nbfcxx.json:</h3>
                    ${jsonMatches.map(item => `
                        <div class="result-item">
                            <div><strong>Company Name:</strong> ${item.__EMPTY_1 || 'N/A'}</div>
                            <div><strong>Details:</strong> ${item.__EMPTY_2 || 'N/A'}</div>
                            <div><strong>Additional Info:</strong> ${item.__EMPTY_3 || 'N/A'}</div>
                        </div>
                    `).join('')}
                </div>`;
        }

        if (newJsonMatches.length > 0) {
            results.innerHTML += `
                <div style="padding: 12px;">
                    ${newJsonMatches.map(item => `
                        <div class="result-item">
                            <div><strong>NBFC Name:</strong> ${item.__EMPTY_1 || 'N/A'}</div>
                            <div><strong>Regional Office:</strong> ${item.__EMPTY_2 || 'N/A'}</div>
                            <div><strong>CoR for Public Deposits:</strong> ${item.__EMPTY_3 || 'N/A'}</div>
                            <div><strong>Classification:</strong> ${item.__EMPTY_4 || 'N/A'}</div>
                            <div><strong>CIN:</strong> ${item.__EMPTY_5 || 'N/A'}</div>
                            <div><strong>Layer:</strong> ${item.__EMPTY_6 || 'N/A'}</div>
                            <div><strong>Address:</strong> ${item.__EMPTY_7 || 'N/A'}</div>
                            <div><strong>Email ID:</strong> ${item.__EMPTY_8 || 'N/A'}</div>
                        </div>
                    `).join('')}
                </div>`;
        }

        // If no matches found in both datasets
        if (jsonMatches.length === 0 && newJsonMatches.length === 0) {
            results.innerHTML = `
                <div class="not-registered-banner">
                    <span class="x-sign">✕</span>
                    <div class="banner-text">No results found for the searched term.</div>
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
        banner.style.display = 'none'; // Clear the banner
    });
});