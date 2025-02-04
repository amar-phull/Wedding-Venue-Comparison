<?php

// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

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

$attribute = $input['attribute'];
$grade = isset($input['grade']) ? $input['grade'] : null;
$date = isset($input['date']) ? $input['date'] : null;

$venues = [];

if ($attribute === 'catering' && $grade) {
    // Query to fetch venues with catering costs for the selected grade
    $sql = "SELECT v.name, c.cost 
            FROM venue v 
            JOIN catering c ON v.venue_id = c.venue_id 
            WHERE c.grade = ?";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $grade);
    $stmt->execute();
    $result = $stmt->get_result();

    while ($row = $result->fetch_assoc()) {
        $venues[] = [
            'name' => $row['name'],
            'cost' => $row['cost']
        ];
    }

} elseif ($attribute === 'capacity') {
    // Query to fetch venues with their capacity
    $sql = "SELECT name, capacity as value FROM venue";
    
    $result = $conn->query($sql);

    while ($row = $result->fetch_assoc()) {
        $venues[] = [
            'name' => $row['name'],
            'value' => $row['value']
        ];
    }

} elseif ($attribute === 'weekend_price') {
    // Query to fetch venues with their weekend prices
    $sql = "SELECT name, weekend_price as value FROM venue";
    
    $result = $conn->query($sql);

    while ($row = $result->fetch_assoc()) {
        $venues[] = [
            'name' => $row['name'],
            'value' => $row['value']
        ];
    }

} elseif ($attribute === 'weekday_price') {
    // Query to fetch venues with their weekday prices
    $sql = "SELECT name, weekday_price as value FROM venue";
    
    $result = $conn->query($sql);

    while ($row = $result->fetch_assoc()) {
        $venues[] = [
            'name' => $row['name'],
            'value' => $row['value']
        ];
    }

} elseif ($attribute === 'licensed') {
    // Query to fetch venues with their licensing status
    $sql = "SELECT name, licensed as value FROM venue";
    
    $result = $conn->query($sql);

    while ($row = $result->fetch_assoc()) {
        $venues[] = [
            'name' => $row['name'],
            'value' => $row['value'] === '1' ? 'Yes' : 'No'
        ];
    }

} elseif ($attribute === 'availability' && $date) {
    // Handle availability filtering
    $sql = "SELECT v.name, 
                   CASE WHEN b.venue_id IS NULL THEN 'Available' ELSE 'Booked' END AS value 
            FROM venue v 
            LEFT JOIN venue_booking b ON v.venue_id = b.venue_id AND b.booking_date = ?
            GROUP BY v.name, b.venue_id";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $date);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result === false) {
        echo json_encode(['error' => 'Query failed: ' . $conn->error]);
        exit();
    }

    while ($row = $result->fetch_assoc()) {
        $venues[] = [
            'name' => $row['name'],
            'value' => $row['value']
        ];
    }
} elseif ($attribute === 'review') {
    // Query to fetch venues with their average review score
    $sql = "SELECT v.name, AVG(vrs.score) as average_review 
            FROM venue v
            JOIN venue_review_score vrs ON v.venue_id = vrs.venue_id
            GROUP BY v.venue_id";
    
    $result = $conn->query($sql);

    while ($row = $result->fetch_assoc()) {
        $venues[] = [
            'name' => $row['name'],
            'value' => round($row['average_review'], 1) // Round to 1 decimal place
        ];
    }
} else {
    echo json_encode(['error' => 'Invalid attribute or grade']);
    exit();
}

// Return the result as a JSON object
echo json_encode(['venues' => $venues]);

$conn->close();
?>
