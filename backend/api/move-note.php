<?php
require 'cors.php';
header('Content-Type: application/json');


require '../db.php';

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'] ?? '';
$user_id = $data['user_id'] ?? '';
$folder_id = $data['folder_id'] ?? null;

$stmt = $pdo->prepare("UPDATE notes SET folder_id = ? WHERE id = ? AND user_id = ?");
$stmt->execute([$folder_id ?: null, $id, $user_id]);

echo json_encode(['success' => true]);