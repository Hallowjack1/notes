<?php
header('Access-Control-Allow-Origin: https://notes-psi-murex.vercel.app/');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, GET');
header('Content-Type: application/json');

require '../db.php';

// GET - fetch all folders
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $user_id = $_GET['user_id'] ?? '';

    $stmt = $pdo->prepare("SELECT * FROM folders WHERE user_id = ? ORDER BY created_at ASC");
    $stmt->execute([$user_id]);
    $folders = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($folders);
    exit;
}

// POST - create, rename, or delete folder
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $action = $data['action'] ?? '';
    $user_id = $data['user_id'] ?? '';

    if ($action === 'create') {
        $name = trim($data['name'] ?? '');
        if ($name === '') {
            echo json_encode(['success' => false, 'message' => 'Folder name is required.']);
            exit;
        }
        $stmt = $pdo->prepare("INSERT INTO folders (user_id, name) VALUES (?, ?)");
        $stmt->execute([$user_id, $name]);
        echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);

    } elseif ($action === 'rename') {
        $id = $data['id'] ?? '';
        $name = trim($data['name'] ?? '');
        if ($name === '') {
            echo json_encode(['success' => false, 'message' => 'Folder name is required.']);
            exit;
        }
        $stmt = $pdo->prepare("UPDATE folders SET name = ? WHERE id = ? AND user_id = ?");
        $stmt->execute([$name, $id, $user_id]);
        echo json_encode(['success' => true]);

    } elseif ($action === 'delete') {
        $id = $data['id'] ?? '';
        // Move notes in this folder back to no folder
        $stmt = $pdo->prepare("UPDATE notes SET folder_id = NULL WHERE folder_id = ? AND user_id = ?");
        $stmt->execute([$id, $user_id]);
        $stmt = $pdo->prepare("DELETE FROM folders WHERE id = ? AND user_id = ?");
        $stmt->execute([$id, $user_id]);
        echo json_encode(['success' => true]);
    }
}