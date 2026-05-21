<?php
session_start();
require 'db.php';

if (!isset($_SESSION['user_id'])){
    header('Location: login.php');
    exit;
}

$user_id = $_SESSION['user_id'];
$username = $_SESSION['username'];
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = trim($_POST['title'] ?? '');
    $body = trim($_POST['body'] ?? '');

    if ($title === '' || $body === '') {
        $error = 'Both fields are required';
    } else {
        $stmt = $pdo->prepare("INSERT INTO notes (user_id, title, body) VALUES (?, ?, ?)");
        $stmt->execute([$user_id, $title, $body]);
        header('Location: notes.php');
        exit;
    }
}

$stmt = $pdo->prepare("SELECT * FROM notes WHERE user_id = ? ORDER BY created_at DESC");
$stmt->execute([$user_id]);
$notes = $stmt->fetchAll();
?>

<!DOCTYPE html>
<html>
    <head>
        <title>My Notes</title>
        <link rel="stylesheet" href="style.css">
    </head>
    <body>
    <div class="container">
        <h2> Welcome, <?= htmlspecialchars($username) ?>!</h2>
        <a href="logout.php">Logout</a>

        <hr>

        <h3>Add a Note</h3>

        <?php if ($error): ?>
            <p style="color:red;"><?= $error ?></p>
        <?php endif; ?>

        <form method="POST">
            <input name="title" placeholder="Title" required><br><br>
            <textarea name="body" placeholder="Write your note..." rows="4" cols="40" required></textarea><br><br>
            <button type="submit">Add Note</button>
        </form>

        <hr>

        <h3>Your Notes</h3>

        <?php if (empty($notes)): ?>
            <p>No notes yet. Add one above!</p>
        <?php else: ?>
            <?php foreach ($notes as $note): ?>
                <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 10px;">
                    <h4><?=  htmlspecialchars($note['title']) ?></h4>
                    <p><?=  htmlspecialchars($note['body']) ?></p>
                    <small>Created: <?=  $note['created_at'] ?></small><br>
                    <a href="delete.php?id=<?= $note['id'] ?>">Delete</a>
                </div>
            <?php endforeach; ?>
        <?php endif; ?>
    </div>
    </body>
</html>