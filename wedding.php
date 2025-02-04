<!DOCTYPE html>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<?php

// Database connection details
$servername = "sci-mysql.lboro.ac.uk";
$username = "coa123wuser";
$password = "grt64dkh!@2FD";
$dbname = "coa123wdb";

// Create a connection to the database
$conn = new mysqli($servername, $username, $password, $dbname);

// Check if the connection was successful
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>

<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VenueCompare</title>
    <!-- Link to CSS file for styling -->
    <link rel="stylesheet" href="styles.css">
    <!-- Link to Bootstrap for responsive design -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
</head>
<body>
    <!-- Header Section -->
    <header>
        <div class="site-header">
            <h1 class="site-title">VenueCompare</h1>
        </div>
        <nav class="mt-3">
            <ul class="nav">
                <li class="nav-item"><a href="#home" class="nav-link">Home</a></li>
                <li class="nav-item"><a href="#compare-venues" class="nav-link">Compare Venues</a></li>
                <li class="nav-item"><a href="#filter-venues" class="nav-link">Filter Venues</a></li>
                <li class="nav-item"><a href="#help" class="nav-link">Help</a></li>
            </ul>
        </nav>
    </header>
    

    <!-- Main Content Area -->
    <main class="container">
        
        <!-- Home Page Content -->
        <section id="home" class="content page">
            <div class="left-section">
                <h1 class="fade-in">Weddings Made Simple</h1>
                <p class="fade-in">Find your perfect wedding venue.</p>
                <p class="fade-in">Compare venues with the details that suit you.</p>
                <p class="fade-in">Visualize your options with our Visual Comparisons.</p>
                <p class="fade-in">Filter venues to suit you.</p>
                <p class="fade-in">Over 6,000 users in 2023.</p>
                <p class="fade-in">"I found the perfect venue for cheap" - Phil </p>
                <p class="fade-in">"VenueCompare made finding our dream wedding venue so easy! - Shirley</p>
            </div>

            <div class="right-section">
                <img src="venue1.png" alt="Hiltop Mansion" class="venue-image fade-in">
                <img src="venue2.png" alt="Haslegrave Hotel" class="venue-image fade-in">
                <img src="venue3.png" alt="Central Plaza" class="venue-image fade-in">

            </div>
        </section>



        <section id="help" class="page" style="display: block:;">
            <div class="fade-in">
            <h3 >Using Our Website</h3>
            <p>Plan your event with easy-to-use a insightful showings of venues.</p>
            <h3 >Compare Venues</h3>
            <p>Whether you're deciding based on budget, guest size, or specific amenities, the comparison tool highlights the strengths of each venue, making your decision-making process smoother and more informed.</p>
            <p>Quickly and effortlessly compare two different venues side by side. Green and red colours highlight which venue has the upper hand for each detail.</p>
            <p>We will also tell you which venue is better based on the comparison.</p>
            <p>Simply select two venues of your choice, select the date, choose your viewing format and click "Compare".</p>
            <h3>Filter Venues</h3>
            <p>Narrow down your options with our filter feature. Focus on what matters most to you, whether it's pricing, catering options, or venue availability on your preferred date. </p>
            <p>Simply select a crtieria and click "Filter". Sort the venues to your liking by clicking the arrow on top of the table.</p>
            </div>
        </section>




        <!-- Compare Venues Content -->
        <section id="compare-venues" class="page" style="display: none;">
            <h2>Select Venues to Compare</h2>
            <div class="row">
                <div class="col-md-6">
                    <label for="venue1">Venue 1:</label>
                    <select id="venue1" class="form-control">
                        <option value="">Select a venue</option>
                        <?php
                        // Fetch venue names from the database and populate the dropdown
                        $sql = "SELECT venue_id, name FROM venue";
                        $result = $conn->query($sql);
                        if ($result->num_rows > 0) {
                            while($row = $result->fetch_assoc()) {
                                echo "<option value='".$row['venue_id']."'>".$row['name']."</option>";
                            }
                        }
                        ?>
                    </select>
                    <label for="date1">Select Date:</label>
                    <input type="date" id="date1" class="form-control" min="2024-01-01" max="2024-12-31" value="2024-01-01">
                </div>
                <div class="col-md-6">
                    <label for="venue2">Venue 2:</label>
                    <select id="venue2" class="form-control">
                        <option value="">Select a venue</option>
                        <?php
                        // Repeat the same process for the second dropdown
                        $sql = "SELECT venue_id, name FROM venue";
                        $result = $conn->query($sql);
                        if ($result->num_rows > 0) {
                            while($row = $result->fetch_assoc()) {
                                echo "<option value='".$row['venue_id']."'>".$row['name']."</option>";
                            }
                        }
                        ?>
                    </select>
                    <label for="date2">Select Date:</label>
                    <input type="date" id="date2" class="form-control" min="2024-01-01" max="2024-12-31" value="2024-01-01">
                </div>
            </div>

            <div class="mt-3 d-flex align-items-center">
                <select id="display-options" class="form-control w-50 mr-3">
                    <option value="table">Table Comparison</option>
                    <option value="visual">Visual Comparisons</option>
                </select>
                <button id="compare-btn" class="btn btn-primary align-self-center">Compare</button>
                <button id="clear-btn" class="btn btn-secondary ml-2">Clear</button>
            </div>


            <!-- Placeholder for Comparison Table -->
            <section id="comparison-display" class="mt-4">
            </section>
        </section>

        <!-- Filter Venues Section -->
        <div id="filter-venues" class="page">
            <h2>Filter Venues</h2>
            <select id="attribute-select" class="form-control">
                <option value="">Select Criteria</option>
                <option value="capacity">Capacity</option>
                <option value="weekend_price">Weekend Price</option>
                <option value="weekday_price">Weekday Price</option>
                <option value="licensed">Licensed</option>
                <option value="catering">Catering Costs</option>
                <option value="availability">Availability</option>
                <option value="review">Reviews</option>

            </select>

            <!-- Dropdown for Catering Grade (only visible when 'Catering Costs' is selected) -->
            <div id="catering-grade-select-container" style="display:none; margin-top: 10px;">
                <label for="catering-grade-select">Select Catering Grade:</label>
                <select id="catering-grade-select" class="form-control">
                    <option value="1">Grade 1</option>
                    <option value="2">Grade 2</option>
                    <option value="3">Grade 3</option>
                    <option value="4">Grade 4</option>
                    <option value="5">Grade 5</option>
                </select>
            </div>

            <!-- Dropdown for Availability (only visible when 'Availability' is selected) -->
            <div id="availability-date-container" style="display:none;">
                <label for="availability-date">Select Date:</label>
                <input type="date" id="availability-date" class="form-control" min="2024-01-01" max="2024-12-31">
            </div>


            <button id="filter-btn" class="btn btn-primary align-self-center">Filter</button>
            <button id="filter-clear-btn" class="btn btn-secondary">Clear</button>


           <!-- Placeholder for Filtered table -->
           <section id="filter-display" class="mt-4">
            </section>
        </section>

    </main>

    <!-- Footer Section -->
    <footer>
        <p>&copy; 2024 VenueCompare  |  Amardeep Phull  |  Loughborough University</p>
    </footer>

    <!-- JavaScript for dynamic page loading -->
    <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    <script src="script.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels"></script>

</body>
</html>

<?php
// Close the database connection at the end
$conn->close();
?>
