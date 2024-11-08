
let mediaRecorder;
let recordedChunks = [];
const startRecordButton = document.getElementById('record-video-btn');
const stopRecordButton = document.getElementById('stop-video-btn');
const videoPreview = document.getElementById('video-preview');
const btnEnviar = document.getElementById('btn-enviar');
const videoFile = document.getElementById('videoFile');
const form = document.getElementById('video-form'); // O formulário que contém o botão de enviar

// Inicia a gravação do vídeo
startRecordButton.addEventListener('click', async () => {
    try {
        recordedChunks = []; // Reinicia os chunks gravados
        videoPreview.src = '';
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        videoPreview.srcObject = stream;
        videoPreview.style.display = 'block'; // Torna o vídeo visível
        await videoPreview.play(); // Inicia a reprodução do vídeo

        mediaRecorder = new MediaRecorder(stream);
        
        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };

        // Quando a gravação é parada, processa o vídeo
        mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            videoPreview.srcObject = null; 
            videoPreview.src = url; 
            videoPreview.controls = true; 
            videoPreview.style.display = 'block'; 

            // Criar o arquivo temporário para o upload
            const file = new File([blob], "video.webm", { type: 'video/webm' });
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            videoFile.files = dataTransfer.files; // Armazena o arquivo no elemento de input

            // Habilita o botão de enviar quando a gravação terminar
            btnEnviar.disabled = false; 
        };

        mediaRecorder.start();
        startRecordButton.disabled = true; // Desabilita o botão de gravar enquanto grava
        stopRecordButton.classList.remove('d-none'); // Mostra o botão de parar gravação
        btnEnviar.disabled = true; // Desabilita o botão de enviar enquanto grava
    } catch (error) {
        console.error('Erro ao acessar a câmera e o microfone:', error);
    }
});

// Lida com o envio do vídeo
btnEnviar.addEventListener('click', async (e) => {
    // Previne o comportamento padrão do formulário
    e.preventDefault();

    // Verifica se o vídeo foi gravado e o arquivo foi configurado corretamente
    if (btnEnviar.disabled) return;

    const videoBlob = new Blob(recordedChunks, { type: 'video/webm' });

    if (videoBlob.size === 0) {
        alert('Não há vídeo gravado para enviar.');
        return;
    }
debugger
    // Evita que o formulário seja enviado automaticamente (desabilita o botão enviar)
    if (form.checkValidity()) {
        // Aqui você pode desabilitar o botão "Enviar" para evitar múltiplos cliques
        btnEnviar.disabled = true;
        

        // Envia o vídeo para o servidor
        try {
            const response = await saveVideoToServer(videoBlob);
            if (response.success) {
                alert('Vídeo enviado com sucesso!');
                window.location.reload();
            } else {
                alert(`Erro: ${response.message}`);
            }
        } catch (error) {
            console.error('Erro ao enviar o vídeo:', error);
            alert('Erro ao enviar o vídeo. Por favor, tente novamente.');
        } finally {
            btnEnviar.disabled = false; // Reabilita o botão após a tentativa de envio
        }
    } else {
        alert('Por favor, preencha todos os campos obrigatórios!');
    }
});

// Função para salvar o vídeo no servidor
function saveVideoToServer(videoBlob) {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        const nome = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const message = document.getElementById('message').value;

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.text('Informações Capturadas', 10, 10);
        doc.text(`Nome: ${nome}`, 10, 20);
        doc.text(`Email: ${email}`, 10, 30);
        doc.text(`Telefone: ${phone}`, 10, 40);
        doc.text(`Mensagem: ${message}`, 10, 50);

    // Converte o PDF para um arquivo Blob
    const pdfBlob = doc.output('blob');

    // Cria um FormData para enviar o vídeo e o PDF juntos
    formData.append('videoFile', videoBlob, 'video.webm');
    formData.append('pdfFile', pdfBlob, 'informacoes.pdf');

        uploadFile(formData).then(response => {
            resolve(response); // Resolve a promessa com a resposta
        }).catch(error => {
            reject(error); // Se ocorrer um erro no upload, rejeita a promessa
        });
    });
}

// Função para realizar o upload via AJAX
function uploadFile(formData) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/upload_video.php',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            timeout: 60000,
            success: function(response) {
                try {
                    const data = JSON.parse(response); // Parse da resposta JSON
                    if (data.success) {
                        resolve(data); // Resolve a promessa com a resposta
                    } else {
                        reject(new Error(data.message || 'Erro no upload do vídeo.')); // Se o upload falhar, rejeita a promessa
                    }
                } catch (e) {
                    reject(new Error('Falha ao processar resposta do servidor. Resposta: ' + response));
                }
            },
            error: function(xhr, status, error) {
                reject(new Error(`Erro no upload: ${xhr.status} - ${xhr.statusText}`)); // Rejeita a promessa em caso de erro
            }
        });
    });
}


// Função para parar a gravação do vídeo
stopRecordButton.addEventListener('click', () => {
    mediaRecorder.stop();
    stopRecordButton.classList.add('d-none'); // Oculta o botão de parar gravação
    startRecordButton.disabled = false; // Habilita o botão de iniciar gravação
});
