<?php
header('Content-Type: application/json');

// Database connection details
$servername = "sci-mysql.lboro.ac.uk";
$username = "coa123wuser";
$password = "grt64dkh!@2FD";
$dbname = "coa123wdb";

// Create a connection to the database
$conn = new mysqli($servername, $username, $password, $dbname);

// Check if the connection was successful
if ($conn->connect_error) {
    echo json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]);
    exit();
}

// Get POST data
$input = json_decode(file_get_contents('php://input'), true);

$venue1_id = $input['venue1'];
$venue2_id = $input['venue2'];
$date1 = $input['date1'];
$date2 = $input['date2'];

// Function to get venue details
function getVenueDetails($conn, $venue_id) {
    $sql = "SELECT * FROM venue WHERE venue_id = $venue_id";
    $result = $conn->query($sql);
    return $result->fetch_assoc();
}

// Function to get booking status
function getBookingStatus($conn, $venue_id, $date) {
    $sql = "SELECT COUNT(*) as booked FROM venue_booking WHERE venue_id = $venue_id AND booking_date = '$date'";
    $result = $conn->query($sql);
    $row = $result->fetch_assoc();
    return $row['booked'] > 0 ? 'Booked' : 'Available';
}

// Function to get catering details
function getCateringDetails($conn, $venue_id) {
    $sql = "SELECT * FROM catering WHERE venue_id = $venue_id";
    $result = $conn->query($sql);
    $catering = [];
    while ($row = $result->fetch_assoc()) {
        $catering[] = $row;
    }
    return $catering;
}

// Function to get review scores and calculate the average
function getReviewScores($conn, $venue_id) {
    $sql = "SELECT score FROM venue_review_score WHERE venue_id = $venue_id";
    $result = $conn->query($sql);
    $scores = [];
    $totalScore = 0;
    $count = 0;

    while ($row = $result->fetch_assoc()) {
        $scores[] = $row['score'];
        $totalScore += $row['score'];
        $count++;
    }

    $averageScore = $count > 0 ? round($totalScore / $count, 1) : 0;
    return ['average' => $averageScore, 'scores' => $scores];
}

// Function to get review scores grouped by stars
function getReviewScoresByStars($conn, $venue_id) {
    $sql = "SELECT score, COUNT(*) as count FROM venue_review_score WHERE venue_id = $venue_id GROUP BY score";
    $result = $conn->query($sql);
    $starCounts = [
        '0' => 0,
        '1' => 0,
        '2' => 0,
        '3' => 0,
        '4' => 0,
        '5' => 0,
    ];

    while ($row = $result->fetch_assoc()) {
        $score = $row['score'];
        $count = $row['count'];

        if ($score == 0) {
            $starCounts['0'] += $count;
        } else if ($score == 1 || $score == 2) {
            $starCounts['1'] += $count;
        } else if ($score == 3 || $score == 4) {
            $starCounts['2'] += $count;
        } else if ($score == 5 || $score == 6) {
            $starCounts['3'] += $count;
        } else if ($score == 7 || $score == 8) {
            $starCounts['4'] += $count;
        } else if ($score == 9 || $score == 10) {
            $starCounts['5'] += $count;
        }
    }

    return $starCounts;
}

// Fetch venue details, booking status, catering, and review scores for both venues
$venue1_details = getVenueDetails($conn, $venue1_id);
$venue2_details = getVenueDetails($conn, $venue2_id);

// Replace 'licensed' value with 'Yes' or 'No'
$venue1_details['licensed'] = $venue1_details['licensed'] ? 'Yes' : 'No';
$venue2_details['licensed'] = $venue2_details['licensed'] ? 'Yes' : 'No';

$venue1_booking_status = getBookingStatus($conn, $venue1_id, $date1);
$venue2_booking_status = getBookingStatus($conn, $venue2_id, $date2);

$venue1_catering = getCateringDetails($conn, $venue1_id);
$venue2_catering = getCateringDetails($conn, $venue2_id);

$venue1_reviews = getReviewScores($conn, $venue1_id);
$venue2_reviews = getReviewScores($conn, $venue2_id);

$venue1_starCounts = getReviewScoresByStars($conn, $venue1_id);
$venue2_starCounts = getReviewScoresByStars($conn, $venue2_id);

// Return the data as JSON
echo json_encode([
    'venue1' => [
        'details' => $venue1_details,
        'booking_status' => $venue1_booking_status,
        'catering' => $venue1_catering,
        'reviews' => $venue1_reviews,
        'starCounts' => $venue1_starCounts
    ],
    'venue2' => [
        'details' => $venue2_details,
        'booking_status' => $venue2_booking_status,
        'catering' => $venue2_catering,
        'reviews' => $venue2_reviews,
        'starCounts' => $venue2_starCounts
    ]
]);


$conn->close();
?>
