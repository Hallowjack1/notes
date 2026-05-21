<?php
session_start();
require 'db.php';

if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit;
}

$id = $_GET['id'] ?? '';
$user_id = $_SESSION['user_id'];

if ($id === '') {
    header('Location: notes.php');
    exit;
}

$stmt = $pdo->prepare("DELETE FROM notes WHERE id = ? AND user_id = ?");
$stmt->execute([$id, $user_id]);

header('Location: notes.php');
exit;