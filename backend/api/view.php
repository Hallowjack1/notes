<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

require '../db.php';

$token = $_GET['token'] ?? '';

if ($token === '') {
    echo json_encode(['success' => false, 'message' => 'Invalid link.']);
    exit;
}

$stmt = $pdo->prepare("SELECT title, body, tag, created_at FROM notes WHERE share_token = ? AND deleted_at IS NULL");
$stmt->execute([$token]);
$note = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$note) {
    echo json_encode(['success' => false, 'message' => 'Note not found or link has been revoked.']);
    exit;
}

echo json_encode(['success' => true, 'note' => $note]);