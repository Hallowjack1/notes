<?php
header('Access-Control-Allow-Origin: https://notes-psi-murex.vercel.app/');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST');
header('Content-Type: application/json');

$allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
$maxSize = 5 * 1024 * 1024; // 5MB

if (!isset($_FILES['image'])) {
    echo json_encode(['success' => false, 'message' => 'No file uploaded.']);
    exit;
}

$file = $_FILES['image'];

if (!in_array($file['type'], $allowed)) {
    echo json_encode(['success' => false, 'message' => 'Only JPG, PNG, GIF and WEBP allowed.']);
    exit;
}

if ($file['size'] > $maxSize) {
    echo json_encode(['success' => false, 'message' => 'File must be under 5MB.']);
    exit;
}

$ext = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = bin2hex(random_bytes(16)) . '.' . $ext;
$dest = __DIR__ . '/../uploads/' . $filename;

if (move_uploaded_file($file['tmp_name'], $dest)) {
    echo json_encode(['success' => true, 'filename' => $filename]);
} else {
    echo json_encode(['success' => false, 'message' => 'Upload failed.']);
}