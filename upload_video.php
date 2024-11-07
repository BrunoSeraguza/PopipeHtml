<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Caminho para salvar o vídeo no servidor
$uploadDir = 'uploads/';

// Verifica se o diretório de uploads existe, caso contrário, tenta criá-lo
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// Verifica se o formulário foi enviado e se o arquivo de vídeo está presente
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['videoFile'])) {
    $file = $_FILES['videoFile'];

    // Checa se o arquivo foi enviado corretamente
    if ($file['error'] === UPLOAD_ERR_OK) {
        $fileName = basename($file['name']);
        $fileTmpName = $file['tmp_name'];
        $fileSize = $file['size'];
        $fileType = $file['type'];

        // Validar tipo de arquivo (webm)
        $allowedTypes = ['video/webm'];
        if (!in_array($fileType, $allowedTypes)) {
            echo json_encode(['success' => false, 'message' => 'Tipo de arquivo não permitido.']);
            exit;
        }

        // Gerar um nome único para o arquivo
        $newFileName = uniqid('video_') . '.webm';

        // Caminho completo para onde o arquivo será movido
        $filePath = $uploadDir . $newFileName;

        // Move o arquivo para o diretório de uploads
        if (move_uploaded_file($fileTmpName, $filePath)) {
            echo json_encode(['success' => true, 'message' => 'Arquivo enviado com sucesso!', 'fileName' => $newFileName]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Erro ao mover o arquivo.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Erro ao enviar o arquivo.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Nenhum arquivo enviado.']);
}
?>
