
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

            // Load CSV data
            fetch('nbfcPilot.csv')
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.text();
                })
                .then(data => {
                    const lines = data.split('\n').map(line => line.trim()).filter(line => line);
                    csvData.headers = lines[0].split(',').map(header => header.trim());
                    csvData.rows = lines.slice(1).map(line => line.split(',').map(cell => cell.trim()));
                    
                    console.log('Data loaded successfully');
                    console.log('Headers:', csvData.headers);
                    console.log('First row:', csvData.rows[0]);
                })
                .catch(error => {
                    console.error('Error loading CSV:', error);
                    results.innerHTML = '<div class="error">Error loading data. Please try again later.</div>';
                });

            // Search bar input event
            searchBar.addEventListener('input', () => {
                const query = searchBar.value.toLowerCase().trim();
                suggestions.innerHTML = '';
                
                if (!query) return;
                if (csvData.rows.length === 0) {
                    suggestions.innerHTML = '<div class="error">Loading data...</div>';
                    return;
                }

                // Filter matches based on NBFC Name (column B, index 1)
                const matches = csvData.rows
                    .filter(row => row[1] && row[1].toLowerCase().includes(query))
                    .slice(0, 10);

                    if (matches.length > 0) {
                    suggestions.innerHTML = matches
                        .map(row => `<div class="suggestion" onclick="(function(){
                            document.getElementById('search-bar').value='${row[1]}';
                            document.getElementById('search-button').click();
                        })()">${row[1]}</div>`)
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

                if (csvData.rows.length === 0) {
                    results.innerHTML = '<div class="error">Data is still loading...</div>';
                    return;
                }

                const matches = csvData.rows.filter(row => 
                    row[1] && row[1].toLowerCase().includes(query)
                );

                if (matches.length > 0) {
                    results.innerHTML = `
                        <div style="padding: 12px;">
                            <h3>Results:</h3>
                            ${matches.map(row => `
                                <div class="result-item">
                                                                        ${csvData.headers.slice(1).map((header, index) => `
                                        <div><strong>${header}:</strong> ${row[index + 1] || 'N/A'}</div>
                                    `).join('')}
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
    