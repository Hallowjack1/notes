<?php
header('Access-Control-Allow-Origin: https://notes-psi-murex.vercel.app/');
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
$folder_id = $data['folder_id'] ?? null;
$reminder_at = $data['reminder_at'] ?? null;
$image = $data['image'] ?? null;

if ($title === '' || $body === '') {
    echo json_encode(['success' => false, 'message' => 'All fields are required.']);
    exit;
}

$stmt = $pdo->prepare("UPDATE notes SET title = ?, body = ?, tag = ?, folder_id = ?, reminder_at = ?, image = ? WHERE id = ? AND user_id = ?");
$stmt->execute([$title, $body, $tag ?: null, $folder_id ?: null, $reminder_at ?: null, $image ?: null, $id, $user_id]);

echo json_encode(['success' => true]);