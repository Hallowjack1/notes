<?php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST');
header('Content-Type: application/json');

require '../db.php';

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'] ?? '';
$user_id = $data['user_id'] ?? '';
$action = $data['action'] ?? '';

if ($action === 'generate') {
    $token = bin2hex(random_bytes(32));
    $stmt = $pdo->prepare("UPDATE notes SET share_token = ? WHERE id = ? AND user_id = ?");
    $stmt->execute([$token, $id, $user_id]);
    echo json_encode(['success' => true, 'token' => $token]);

} elseif ($action === 'revoke') {
    $stmt = $pdo->prepare("UPDATE notes SET share_token = NULL WHERE id = ? AND user_id = ?");
    $stmt->execute([$id, $user_id]);
    echo json_encode(['success' => true]);
}