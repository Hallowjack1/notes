<?php
$allowed = [
    'http://localhost:5173',
    'https://notes-psi-murex.vercel.app'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowed)) {
    header("Access-Control-Allow-Origin: $origin");
}

header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}