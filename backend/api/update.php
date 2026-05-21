<?php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST');
header('Content-Type: application/json');

require '../db.php';

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'] ?? '';
$user_id = $data['user_id'] ?? '';
$title = trim($data['title'] ?? '');
$body = trim($data['body'] ?? '');
$tag = trim($data['tag'] ?? '');

if ($title === '' || $body === '') {
    echo json_encode(['success' => false, 'message' => 'All fields are required.']);
    exit;
}

$stmt = $pdo->prepare("UPDATE notes SET title = ?, body = ?, tag = ? WHERE id = ? AND user_id = ?");
$stmt->execute([$title, $body, $tag ?: null, $id, $user_id]);

echo json_encode(['success' => true]);