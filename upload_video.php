<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Caminho para salvar os arquivos
$uploadDir = 'uploads/';

// Verifica se o diretório de uploads existe, caso contrário, tenta criá-lo
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// Variáveis de resposta padrão
$response = ['success' => false, 'message' => 'Nenhum arquivo enviado.'];

try {
    // Verifica se o formulário foi enviado
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        
        // Verifica se o arquivo de vídeo está presente
        if (isset($_FILES['videoFile'])) {
            $videoFile = $_FILES['videoFile'];
            
            // Checa se o arquivo de vídeo foi enviado corretamente
            if ($videoFile['error'] === UPLOAD_ERR_OK) {
                $videoFileName = uniqid('video_') . '.webm';
                $videoFilePath = $uploadDir . $videoFileName;
                
                if (move_uploaded_file($videoFile['tmp_name'], $videoFilePath)) {
                    $response['success'] = true;
                    $response['message'] = 'Vídeo enviado com sucesso!';
                    $response['fileName'] = $videoFileName;
                } else {
                    $response['message'] = 'Erro ao mover o arquivo de vídeo.';
                }
            } else {
                $response['message'] = 'Erro ao enviar o vídeo. Código de erro: ' . $videoFile['error'];
            }
        }

        // Verifica se o arquivo PDF está presente
        if (isset($_FILES['pdfFile'])) {
            $pdfFile = $_FILES['pdfFile'];
            
            // Checa se o arquivo PDF foi enviado corretamente
            if ($pdfFile['error'] === UPLOAD_ERR_OK) {
                $pdfFileName = uniqid('informacoes_') . '.pdf';
                $pdfFilePath = $uploadDir . $pdfFileName;

                if (move_uploaded_file($pdfFile['tmp_name'], $pdfFilePath)) {
                    $response['message'] = 'PDF enviado com sucesso!';
                    $response['fileName'] = $pdfFileName;
                } else {
                    $response['message'] = 'Erro ao mover o arquivo PDF.';
                }
            } else {
                $response['message'] = 'Erro ao enviar o PDF. Código de erro: ' . $pdfFile['error'];
            }
        }

    } else {
        $response['message'] = 'Método HTTP inválido. Somente POST é permitido.';
    }
} catch (Exception $e) {
    $response['message'] = 'Erro inesperado: ' . $e->getMessage();
}

// Retorna a resposta como JSON
echo json_encode($response);
