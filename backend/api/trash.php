<?php
require 'cors.php';
header('Content-Type: application/json');


require '../db.php';

// GET - fetch trashed notes
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $user_id = $_GET['user_id'] ?? '';

    $stmt = $pdo->prepare("SELECT * FROM notes WHERE user_id = ? AND deleted_at IS NOT NULL ORDER BY deleted_at DESC");
    $stmt->execute([$user_id]);
    $notes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($notes);
    exit;
}

// POST - restore or permanently delete
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'] ?? '';
    $user_id = $data['user_id'] ?? '';
    $action = $data['action'] ?? '';

    if ($action === 'restore') {
        $stmt = $pdo->prepare("UPDATE notes SET deleted_at = NULL WHERE id = ? AND user_id = ?");
        $stmt->execute([$id, $user_id]);
        echo json_encode(['success' => true]);
    } elseif ($action === 'permanent') {
        $stmt = $pdo->prepare("DELETE FROM notes WHERE id = ? AND user_id = ?");
        $stmt->execute([$id, $user_id]);
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid action.']);
    }
}