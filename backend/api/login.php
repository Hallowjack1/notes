<?php
header('Access-Control-Allow-Origin: https://notes-psi-murex.vercel.app/');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

require '../db.php';

$data = json_decode(file_get_contents('php://input'), true);
$username = trim($data['username'] ?? '');
$password = $data['password'] ?? '';

if ($username === '' || $password === '') {
    echo json_encode(['success' => false, 'message' => 'All fields are required.']);
    exit;
}

$stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
$stmt->execute([$username]);
$user = $stmt->fetch();

if ($user && password_verify($password, $user['password'])) {
    echo json_encode([
        'success' => true,
        'user_id' => $user['id'],
        'username' => $user['username']
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid username or password.']);
}