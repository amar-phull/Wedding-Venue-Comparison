document.addEventListener('DOMContentLoaded', function() {
    function showPage(page) {
        // Hide all pages and remove the fade-in class
        document.querySelectorAll('.page').forEach(function(section) {
            section.style.display = 'none';
            section.classList.remove('fade-in', 'visible');
        });

        // Show the selected page
        const targetSection = document.getElementById(page);
        if (targetSection) {
            targetSection.style.display = 'block';
            
            // Apply the fade-in effect
            setTimeout(() => {
                targetSection.classList.add('fade-in', 'visible');
                window.scrollTo(0, 0); // Scroll to the top of the page
            }, 10); // Delay to ensure the page is fully loaded
        }
    }

    // Event listener for navigation links
    document.querySelectorAll('.nav-link').forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const target = this.getAttribute('href').substring(1);
            window.location.hash = target;
            showPage(target);
        });
    });

    // Trigger the initial page display based on the hash in the URL
    const initialHash = window.location.hash.substring(1) || 'home';
    showPage(initialHash);
    

    function fetchComparisonData() {
        const venue1 = document.getElementById('venue1');
        const venue2 = document.getElementById('venue2');
        const date1 = document.getElementById('date1');
        const date2 = document.getElementById('date2');

        if (!venue1 || !venue2 || !date1 || !date2) {
            console.error('One or more elements could not be found.');
            return;
        }

        const venue1Value = venue1.value;
        const venue2Value = venue2.value;
        const date1Value = date1.value;
        const date2Value = date2.value;

        if (!venue1Value || !venue2Value) {
            alert('Please select both venues to compare.');
            return;
        }

        if (venue1Value === venue2Value) {
            alert('Both venues must be different.');
            return;
        }

        fetch('fetch_comparison_data.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                venue1: venue1Value,
                venue2: venue2Value,
                date1: date1Value,
                date2: date2Value
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Server Error:', data.error);
                alert('An error occurred: ' + data.error);
                return;
            }

            const displayOption = document.getElementById('display-options').value;
            const comparisonDisplay = document.getElementById('comparison-display');
            let venue1Greens = 0;
            let venue2Greens = 0;

            if (displayOption === 'table') {
                comparisonDisplay.innerHTML = `
                    <h3>Comparison between ${data.venue1.details.name} and ${data.venue2.details.name}</h3>
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Feature</th>
                                <th>${data.venue1.details.name}</th>
                                <th>${data.venue2.details.name}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Capacity</td>
                                <td id="venue1-capacity">${data.venue1.details.capacity}</td>
                                <td id="venue2-capacity">${data.venue2.details.capacity}</td>
                            </tr>
                            <tr>
                                <td>Weekend Price</td>
                                <td id="venue1-weekend-price">£${data.venue1.details.weekend_price} per day</td>
                                <td id="venue2-weekend-price">£${data.venue2.details.weekend_price} per day</td>
                            </tr>
                            <tr>
                                <td>Weekday Price</td>
                                <td id="venue1-weekday-price">£${data.venue1.details.weekday_price} per day</td>
                                <td id="venue2-weekday-price">£${data.venue2.details.weekday_price} per day</td>
                            </tr>
                            <tr>
                                <td>Licensed</td>
                                <td id="venue1-licensed">${data.venue1.details.licensed}</td>
                                <td id="venue2-licensed">${data.venue2.details.licensed}</td>
                            </tr>
                            
                            <tr>
                                <td>Booking Status</td>
                                <td id="venue1-booking-status">${data.venue1.booking_status}</td>
                                <td id="venue2-booking-status">${data.venue2.booking_status}</td>
                            </tr>

                            <tr>
                                <td>Catering Costs</td>
                                <td>${data.venue1.catering.map(c => `<span id="venue1-catering-${c.grade}">Grade ${c.grade}: £${c.cost} per person</span>`).join('<br>')}</td>
                                <td>${data.venue2.catering.map(c => `<span id="venue2-catering-${c.grade}">Grade ${c.grade}: £${c.cost} per person</span>`).join('<br>')}</td>
                            </tr>
                            <tr>
                                <td>Review Scores</td>
                                <td id="venue1-reviews">${data.venue1.reviews.average}/10</td>
                                <td id="venue2-reviews">${data.venue2.reviews.average}/10</td>
                            </tr>
                        </tbody>
                    </table>
                    <div id="comparison-summary"></div>
                `;

                function applyColorComparison(element1, element2, value1, value2, higherIsBetter = true) {
                    if (value1 > value2) {
                        element1.style.color = higherIsBetter ? 'green' : 'red';
                        element2.style.color = higherIsBetter ? 'red' : 'green';
                        venue1Greens += higherIsBetter ? 1 : 0;
                        venue2Greens += higherIsBetter ? 0 : 1;
                    } else if (value1 < value2) {
                        element1.style.color = higherIsBetter ? 'red' : 'green';
                        element2.style.color = higherIsBetter ? 'green' : 'red';
                        venue1Greens += higherIsBetter ? 0 : 1;
                        venue2Greens += higherIsBetter ? 1 : 0;
                    }
                }

                // Applying color comparison
                applyColorComparison(
                    document.getElementById('venue1-capacity'),
                    document.getElementById('venue2-capacity'),
                    data.venue1.details.capacity,
                    data.venue2.details.capacity,
                    true
                );

                applyColorComparison(
                    document.getElementById('venue1-weekend-price'),
                    document.getElementById('venue2-weekend-price'),
                    data.venue1.details.weekend_price,
                    data.venue2.details.weekend_price,
                    false
                );

                applyColorComparison(
                    document.getElementById('venue1-weekday-price'),
                    document.getElementById('venue2-weekday-price'),
                    data.venue1.details.weekday_price,
                    data.venue2.details.weekday_price,
                    false
                );

                applyColorComparison(
                    document.getElementById('venue1-licensed'),
                    document.getElementById('venue2-licensed'),
                    data.venue1.details.licensed === 'Yes' ? 1 : 0,
                    data.venue2.details.licensed === 'Yes' ? 1 : 0,
                    true
                );

                // Apply color comparison for booking status
                applyColorComparison(
                    document.getElementById('venue1-booking-status'),
                    document.getElementById('venue2-booking-status'),
                    data.venue1.booking_status === 'Available' ? 1 : 0,
                    data.venue2.booking_status === 'Available' ? 1 : 0,
                    true // true because 'Available' is better than 'Booked'
                );
                
                applyColorComparison(
                    document.getElementById('venue1-reviews'),
                    document.getElementById('venue2-reviews'),
                    data.venue1.reviews.average,
                    data.venue2.reviews.average,
                    true
                );
                function applyCateringColorComparison(venue1Catering, venue2Catering) {
                    venue1Catering.forEach(c1 => {
                        const venue1Element = document.getElementById(`venue1-catering-${c1.grade}`);
                        const matchingC2 = venue2Catering.find(c2 => c2.grade === c1.grade);
                
                        if (matchingC2) {
                            const venue2Element = document.getElementById(`venue2-catering-${matchingC2.grade}`);
                            applyColorComparison(venue1Element, venue2Element, c1.cost, matchingC2.cost, false);
                        } else {
                            venue1Element.style.color = 'green';
                            venue1Greens++;
                        }
                    });
                
                    venue2Catering.forEach(c2 => {
                        const venue2Element = document.getElementById(`venue2-catering-${c2.grade}`);
                        const matchingC1 = venue1Catering.find(c1 => c1.grade === c2.grade);
                
                        if (!matchingC1) {
                            venue2Element.style.color = 'green';
                            venue2Greens++;
                        }
                    });
                }
                applyCateringColorComparison(data.venue1.catering, data.venue2.catering);

                // Summary section
                const summaryDiv = document.getElementById('comparison-summary');
                if (venue1Greens > venue2Greens) {
                    summaryDiv.innerHTML = `<p><strong>${data.venue1.details.name}</strong> is the better venue overall with ${venue1Greens} better attributes.</p>`;
                } else if (venue2Greens > venue1Greens) {
                    summaryDiv.innerHTML = `<p><strong>${data.venue2.details.name}</strong> is the better venue overall with ${venue2Greens} better attributes.</p>`;
                } else {
                    summaryDiv.innerHTML = `<p>Both venues have the same number of better attributes. It is recommended to view the <a href="#" id="visual-comparison-link">visual comparison</a>.</p>`;
                    document.getElementById('visual-comparison-link').addEventListener('click', function(event) {
                        event.preventDefault();
                        document.getElementById('display-options').value = 'visual';
                        fetchComparisonData(); // Trigger the visual comparison immediately
                    });
                }
            } else if (displayOption === 'visual') {
                comparisonDisplay.innerHTML = `
                    <h3>Comparison between ${data.venue1.details.name} and ${data.venue2.details.name}</h3>
                    <div>
                        <canvas id="reviewChart"></canvas>
                        <canvas id="capacityChart"></canvas>
                        <canvas id="priceChart"></canvas>
                    </div>
                `;
            
                // Define consistent colors for Venue 1 and Venue 2
                const venue1Color = '#4A90E2'; // Soft Blue for Venue 1
                const venue2Color = '#F5A623'; // Soft Orange for Venue 2
            
                // Capacity Bar Chart
                new Chart(document.getElementById('capacityChart'), {
                    type: 'bar',
                    data: {
                        labels: ['Capacity'],
                        datasets: [
                            {
                                label: data.venue1.details.name,
                                data: [data.venue1.details.capacity],
                                backgroundColor: venue1Color
                            },
                            {
                                label: data.venue2.details.name,
                                data: [data.venue2.details.capacity],
                                backgroundColor: venue2Color
                            }
                        ]
                    },
                    options: {
                        scales: {
                            y: { beginAtZero: true }
                        },
                        plugins: {
                            title: { display: true, text: 'Capacity Comparison' }
                        }
                    }
                });
            
                // Price Grouped Bar Chart
                new Chart(document.getElementById('priceChart'), {
                    type: 'bar',
                    data: {
                        labels: ['Weekend Price', 'Weekday Price'],
                        datasets: [
                            {
                                label: data.venue1.details.name,
                                data: [data.venue1.details.weekend_price, data.venue1.details.weekday_price],
                                backgroundColor: venue1Color
                            },
                            {
                                label: data.venue2.details.name,
                                data: [data.venue2.details.weekend_price, data.venue2.details.weekday_price],
                                backgroundColor: venue2Color
                            }
                        ]
                    },
                    options: {
                        scales: {
                            y: { beginAtZero: true }
                        },
                        plugins: {
                            title: { display: true, text: 'Price Comparison' }
                        }
                    }
                });
            
                // Review Scores Distribution Horizontal Bar Chart
                new Chart(document.getElementById('reviewChart'), {
                    type: 'bar',
                    data: {
                        labels: ['5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star', '0 Stars'],
                        datasets: [
                            {
                                label: data.venue1.details.name,
                                data: [
                                    data.venue1.starCounts['5'],
                                    data.venue1.starCounts['4'],
                                    data.venue1.starCounts['3'],
                                    data.venue1.starCounts['2'],
                                    data.venue1.starCounts['1'],
                                    data.venue1.starCounts['0']
                                ],
                                backgroundColor: venue1Color
                            },
                            {
                                label: data.venue2.details.name,
                                data: [
                                    data.venue2.starCounts['5'],
                                    data.venue2.starCounts['4'],
                                    data.venue2.starCounts['3'],
                                    data.venue2.starCounts['2'],
                                    data.venue2.starCounts['1'],
                                    data.venue2.starCounts['0']
                                ],
                                backgroundColor: venue2Color
                            }
                        ]
                    },
                    options: {
                        indexAxis: 'y', // Horizontal bars
                        scales: {
                            x: {
                                beginAtZero: true,
                                min: 0, // Start x-axis at 0
                                suggestedMax: Math.max(...[
                                    ...data.venue1.starCounts, 
                                    ...data.venue2.starCounts
                                ]) + 2, // Adjust max for scaling
                                display: false // Hide x-axis
                            },
                            y: {
                                grid: {
                                    display: false // Hide grid lines
                                }
                            }
                        },
                        plugins: {
                            title: {
                                display: true,
                                text: 'Review Score Distribution'
                            },
                            datalabels: {
                                anchor: 'end',
                                align: 'end', // Place labels after the bars
                                offset: 10, // Offset the label from the end of the bar
                                color: '#000', // Set the color of the label
                                formatter: function(value) {
                                    return value === 0 ? '' : value; // Show the number, but hide it if the value is 0
                                }
                            }
                        }
                    },
                    plugins: [ChartDataLabels] // Load the datalabels plugin
                });
            }
            
        })
        .catch(error => {
            console.error('Error fetching comparison data:', error);
            alert('An error occurred while fetching comparison data.');
        });
    }

    // Attach the event listener to the Compare button
    document.getElementById('compare-btn').addEventListener('click', fetchComparisonData);
    document.getElementById('clear-btn').addEventListener('click', function() {
        // Reset dropdowns and date fields to default
        document.getElementById('venue1').selectedIndex = 0;
        document.getElementById('venue2').selectedIndex = 0;
        document.getElementById('date1').value = "2024-01-01";
        document.getElementById('date2').value = "2024-01-01";

        // Clear the comparison display
        document.getElementById('comparison-display').innerHTML = '';
        
        // Clear the summary section
        document.getElementById('comparison-summary').innerHTML = '';
    });

    // Handle attribute selection and toggle visibility of catering grade dropdown
    document.getElementById('attribute-select').addEventListener('change', function() {
        const selectedAttribute = this.value;
        const cateringGradeContainer = document.getElementById('catering-grade-select-container');
        if (selectedAttribute === 'catering') {
            cateringGradeContainer.style.display = 'block';
        } else {
            cateringGradeContainer.style.display = 'none';
        }
    });

    console.log("DOM fully loaded.");

    let sortOrder = 'asc'; // Default sort order
    let currentSortBy = 'venue'; // Default sort by option
    

    // Event listener for the filter button click with a delay
    document.getElementById('filter-btn').addEventListener('click', function() {
        // Disable the filter button and sort buttons to prevent multiple clicks
        this.disabled = true;
        const sortOrderButton = document.getElementById('sort-order-btn');
        if (sortOrderButton) {
            sortOrderButton.disabled = true;
        }

        // Add a delay before processing the filter
        setTimeout(() => {
            const selectedAttribute = document.getElementById('attribute-select').value;
            const selectedGrade = document.getElementById('catering-grade-select').value;
            const selectedDate = document.getElementById('availability-date').value;
            const filterDisplay = document.getElementById('filter-display');

            // Validation for required fields
            if (!selectedAttribute || 
                (selectedAttribute === 'catering' && !selectedGrade) || 
                (selectedAttribute === 'availability' && !selectedDate)) {
                alert('Please select the required options to filter.');
                this.disabled = false;  // Re-enable the filter button
                if (sortOrderButton) {
                    sortOrderButton.disabled = false;  // Re-enable the sort button
                }
                return;
            }

            let requestData = {
                attribute: selectedAttribute,
                grade: selectedGrade,
                date: selectedDate
            };

            // Fetch data based on selected criteria
            fetch('fetch_filter_data.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData)
            })
            .then(response => response.text())  // Get the raw response text
            .then(text => {
                console.log('Raw response:', text);  // Log it to the console
                return JSON.parse(text);  // Then parse it as JSON
            })
            .then(data => {
                if (data.error) {
                    console.error('Server Error:', data.error);
                    alert('An error occurred: ' + data.error);
                    this.disabled = false;  // Re-enable the filter button
                    if (sortOrderButton) {
                        sortOrderButton.disabled = false;  // Re-enable the sort button
                    }
                    return;
                }

                // Determine the appropriate column heading based on the selected attribute
                let columnHeading;
                if (selectedAttribute === 'catering') {
                    columnHeading = `Catering Cost`;
                } else if (selectedAttribute === 'capacity') {
                    columnHeading = 'Capacity';
                } else if (selectedAttribute === 'weekend_price') {
                    columnHeading = 'Weekend Price (£ per day)';
                } else if (selectedAttribute === 'weekday_price') {
                    columnHeading = 'Weekday Price (£ per day)';
                } else if (selectedAttribute === 'licensed') {
                    columnHeading = 'Licensed';
                } else if (selectedAttribute === 'availability') {
                    columnHeading = 'Availability on ' + selectedDate;
                } else if (selectedAttribute === 'review') {
                    columnHeading = 'Average Review Score';
                }

                // Generate the sort by dropdown and arrow for sorting order
                filterDisplay.innerHTML = `
                    <h3>Filtered Results for ${selectedAttribute.replace('_', ' ').toUpperCase()}</h3>
                    <div style="margin-bottom: 10px;">
                        <label for="sort-by-select">Sort by: </label>
                        <select id="sort-by-select" class="form-control" style="display: inline-block; width: auto;">
                            <option value="venue">Venue Name</option>
                            <option value="attribute">${columnHeading}</option>
                        </select>
                        <button id="sort-order-btn" style="border: none; background: none; cursor: pointer;">▲</button>
                    </div>
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Venue Name</th>
                                <th>${columnHeading}</th>
                            </tr>
                        </thead>
                        <tbody id="venues-tbody">
                            ${generateTableRows(data.venues, selectedAttribute)}
                        </tbody>
                    </table>
                `;

                // Sorting functionality for the table
                document.getElementById('sort-order-btn').addEventListener('click', function() {
                    // Disable the button to prevent multiple clicks during sorting
                    this.disabled = true;

                    setTimeout(() => {
                        sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
                        this.innerHTML = sortOrder === 'asc' ? '▲' : '▼';
                        const sortedVenues = sortVenues(data.venues, currentSortBy, selectedAttribute, sortOrder);
                        document.getElementById('venues-tbody').innerHTML = generateTableRows(sortedVenues, selectedAttribute);

                        // Re-enable the button after sorting is complete
                        this.disabled = false;
                    }, 500); // 100 milliseconds delay
                });

                // Event listener for the Sort by dropdown change with a delay
                document.getElementById('sort-by-select').addEventListener('change', function() {
                    const sortBySelect = this.value;
                    setTimeout(() => {
                        currentSortBy = sortBySelect;
                        const sortedVenues = sortVenues(data.venues, currentSortBy, selectedAttribute, sortOrder);
                        document.getElementById('venues-tbody').innerHTML = generateTableRows(sortedVenues, selectedAttribute);
                    }, 500); // 300 milliseconds delay
                });

                // Re-enable the filter button and sort buttons after processing is complete
                this.disabled = false;
                if (sortOrderButton) {
                    sortOrderButton.disabled = false;
                }
            })
            .catch(error => {
                console.error('Error fetching filtered data:', error);
                alert('An error occurred while fetching filtered data.');
                this.disabled = false;  // Re-enable the filter button
                if (sortOrderButton) {
                    sortOrderButton.disabled = false;  // Re-enable the sort button
                }
            });
        }, 500); // 500 milliseconds delay
    });


    // Event listener for attribute selection change
    document.getElementById('attribute-select').addEventListener('change', function() {
        const selectedAttribute = this.value;
        const cateringGradeContainer = document.getElementById('catering-grade-select-container');
        const availabilityDateContainer = document.getElementById('availability-date-container');

        if (selectedAttribute === 'catering') {
            cateringGradeContainer.style.display = 'block';
            availabilityDateContainer.style.display = 'none';
        } else if (selectedAttribute === 'availability') {
            availabilityDateContainer.style.display = 'block';
            cateringGradeContainer.style.display = 'none';
        } else {
            cateringGradeContainer.style.display = 'none';
            availabilityDateContainer.style.display = 'none';
        }
    });

    // Function to generate table rows
    function generateTableRows(venues, attribute) {
        return venues.map(venue => {
            let value;
            if (attribute === 'catering') {
                value = venue.cost ? `£${venue.cost} per person` : 'No data available';
            } else if (attribute === 'licensed' || attribute === 'availability') {
                value = venue.value;
            } else if (attribute == 'capacity'){
                value = `${venue.value}`;
            } else if (attribute === 'review') {
                value = `${parseFloat(venue.value).toFixed(1)}/10`;
            } else {
                value = `£${venue.value}`;
            }
            return `
                <tr>
                    <td>${venue.name}</td>
                    <td>${value}</td>
                </tr>
            `;
        }).join('');
    }

    // Function to sort venues
    function sortVenues(venues, sortBy, attribute, order) {
        return venues.sort((a, b) => {
            let valA, valB;

            if (sortBy === 'venue') {
                valA = a.name.toLowerCase();
                valB = b.name.toLowerCase();
            } else {
                if (attribute === 'catering') {
                    valA = parseFloat(a.cost) || 0;
                    valB = parseFloat(b.cost) || 0;
                } else if (attribute === 'licensed' || attribute === 'availability') {
                    valA = a.value === 'Yes' || a.value === 'Available' ? 1 : 0;
                    valB = b.value === 'Yes' || b.value === 'Available' ? 1 : 0;
                } else if (attribute === 'review') {
                    valA = parseFloat(a.value) || 0;  // Corrected to use 'value'
                    valB = parseFloat(b.value) || 0;  // Corrected to use 'value'
                } else {
                    valA = parseFloat(a.value) || 0;
                    valB = parseFloat(b.value) || 0;
                }
            }

            if (order === 'asc') {
                return valA > valB ? 1 : -1;
            } else {
                return valA < valB ? 1 : -1;
            }
        });
    }

       // Clear button functionality for the filter venues page
       document.getElementById('filter-clear-btn').addEventListener('click', function() {
        // Reset all filter inputs
        document.getElementById('attribute-select').selectedIndex = 0;
        document.getElementById('catering-grade-select').selectedIndex = 0;
        document.getElementById('availability-date').value = '';

        // Hide the additional fields
        document.getElementById('catering-grade-select-container').style.display = 'none';
        document.getElementById('availability-date-container').style.display = 'none';

        // Clear the displayed results
        document.getElementById('filter-display').innerHTML = '';

        // Optionally re-enable any buttons if needed
        document.getElementById('filter-btn').disabled = false;
        const sortOrderButton = document.getElementById('sort-order-btn');
        if (sortOrderButton) {
            sortOrderButton.disabled = false;
        }
    });
    function fadeInOnScroll() {
        const elements = document.querySelectorAll('.fade-in');

        elements.forEach(function(element) {
            const elementPosition = element.getBoundingClientRect().top;
            const viewportHeight = window.innerHeight;

            if (elementPosition < viewportHeight - 50) {
                element.classList.add('visible');
            } else {
                element.classList.remove('visible');  // Fade out when scrolled past
            }
        });
    }

    window.addEventListener('scroll', fadeInOnScroll);
    fadeInOnScroll();  // Run on initial load
});
