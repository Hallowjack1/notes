<?php
header('Access-Control-Allow-Origin: https://notes-psi-murex.vercel.app/');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

require '../db.php';

// GET - fetch notes
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $user_id = $_GET['user_id'] ?? '';

    $stmt = $pdo->prepare("SELECT * FROM notes WHERE user_id = ? AND deleted_at IS NULL ORDER BY pinned DESC, created_at DESC");
    $stmt->execute([$user_id]);
    $notes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($notes);
    exit;
}

// POST - add note and tag notes
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
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

    $stmt = $pdo->prepare("INSERT INTO notes (user_id, title, body, tag, folder_id, reminder_at, image) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$user_id, $title, $body, $tag ?: null, $folder_id ?: null, $reminder_at ?: null, $image ?: null]);
    echo json_encode(['success' => true]);
}