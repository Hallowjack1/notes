<?php
require 'cors.php';
header('Content-Type: application/json');


require '../db.php';

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'] ?? '';
$user_id = $data['user_id'] ?? '';
$pinned = $data['pinned'] ?? 0;

$stmt = $pdo->prepare("UPDATE notes SET pinned = ? WHERE id = ? AND user_id = ?");
$stmt->execute([$pinned, $id, $user_id]);

echo json_encode(['success' => true]);