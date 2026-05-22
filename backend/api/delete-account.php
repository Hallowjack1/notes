<?php
header('Access-Control-Allow-Origin: https://notes-psi-murex.vercel.app/');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST');
header('Content-Type: application/json');

require '../db.php';

$data = json_decode(file_get_contents('php://input'), true);
$user_id = $data['user_id'] ?? '';
$password = $data['password'] ?? '';

if ($user_id === '' || $password === '') {
    echo json_encode(['success' => false, 'message' => 'All fields are required.']);
    exit;
}

// Verify password first
$stmt = $pdo->prepare("SELECT password FROM users WHERE id = ?");
$stmt->execute([$user_id]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password'])) {
    echo json_encode(['success' => false, 'message' => 'Incorrect password.']);
    exit;
}

// Delete all notes first, then the user
$stmt = $pdo->prepare("DELETE FROM notes WHERE user_id = ?");
$stmt->execute([$user_id]);

$stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
$stmt->execute([$user_id]);

echo json_encode(['success' => true]);