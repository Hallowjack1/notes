<?php
require 'cors.php';
header('Content-Type: application/json');

require '../db.php';

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'] ?? '';
$user_id = $data['user_id'] ?? '';

$stmt = $pdo->prepare("UPDATE notes SET deleted_at = NOW() WHERE id = ? AND user_id = ?");
$stmt->execute([$id, $user_id]);

echo json_encode(['success' => true]);