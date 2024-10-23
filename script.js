// let mediaRecorder;
// let recordedChunks = [];
// const startRecordButton = document.getElementById('record-video-btn');
// const stopRecordButton = document.getElementById('stop-video-btn');
// const videoPreview = document.getElementById('video-preview');
// const btnEnviar = document.getElementById('btn-enviar');
// const videoFile = document.getElementById('videoFile')


// startRecordButton.addEventListener('click', async () => {
//     try {
//         debugger
//         recordedChunks = []; // Reinicia os chunks gravados
//         videoPreview.src = '';
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//         videoPreview.srcObject = stream;
//         videoPreview.style.display = 'block'; // Torna o vídeo visível
//         await videoPreview.play(); // Inicia a reprodução do vídeo

//         mediaRecorder = new MediaRecorder(stream);
        
//         mediaRecorder.ondataavailable = (event) => {
//             if (event.data.size > 0) {
//                 recordedChunks.push(event.data);
//             }
//         };

//         mediaRecorder.onstop = () => {
//             debugger
//             const blob = new Blob(recordedChunks, { type: 'video/webm' });
//             const url = URL.createObjectURL(blob);
//             videoPreview.srcObject = null; 
//             videoPreview.src = url; 
//             videoPreview.controls = true; 
//             videoPreview.style.display = 'block'; 
         

//             // Criar um arquivo temporário para o upload
//             const file = new File([blob], "video.webm", { type: 'video/webm' });
//             const dataTransfer = new DataTransfer();
//             dataTransfer.items.add(file);
//             videoFile.files = dataTransfer.files; // Armazena o arquivo no elemento de entrada

//             btnEnviar.disabled = false; // Habilita o botão de upload
//         };

//         mediaRecorder.start();
//         startRecordButton.disabled = true;
//         stopRecordButton.classList.remove('d-none'); // Mostra o botão de parar gravação
//     } catch (error) {
//         console.error('Erro ao acessar a câmera e o microfone:', error);
//     }

// });


// btnEnviar.addEventListener('click', () => {
//     const videoBlob = new Blob(recordedChunks, { type: 'video/webm' });
//     saveVideoToServer(videoBlob);
// })

// // Função para enviar o vídeo para o servidor
// function  saveVideoToServer(videoBlob) {
//     const formData = new FormData();
// debugger
// const nome = document.getElementById('name').value;
// const email = document.getElementById('email').value;
// const telefone = document.getElementById('phone').value;
// const mensagem = document.getElementById('message').value;

// if(mensagem == "" ||nome == ""||email == "" || telefone == "")
//     return alert("Preencha o formulario antes de enviar!")
//     // Adiciona o arquivo de vídeo ao formData
//     formData.append('videoFile', videoBlob, 'video.webm');
//     formData.append('nome', nome);
//     formData.append('email', email);
//     formData.append('telefone', telefone);
//     formData.append('mensagem', mensagem);

// }

// stopRecordButton.addEventListener('click', () => {
//     mediaRecorder.stop();
//     stopRecordButton.classList.add('d-none'); // Oculta o botão de parar gravação
//     startRecordButton.disabled = false; // Habilita o botão de iniciar gravação
// });
// //
//         const CLIENT_ID = '959398658998-5lie1svvddtm9ktn3do5uvnlpcqqnutf.apps.googleusercontent.com';
//         const API_KEY = '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';
//         const SCOPES = 'https://www.googleapis.com/auth/drive.file';

//         function handleClientLoad() {
//             gapi.load('client:auth2', initClient);
//         }

//         function initClient() {
//             gapi.client.init({
//                 apiKey: API_KEY,
//                 clientId: CLIENT_ID,
//                 scope: SCOPES,
//                 discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"]
//             }).then(() => {
//                 // Listen for sign-in state changes
//                 gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
                
//                 // Handle the initial sign-in state
//                 updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
                
//                 document.getElementById('authorize_button').onclick = handleAuthClick;
//                 document.getElementById('upload_button').onclick = uploadFile;
//             });
//         }

//         function updateSigninStatus(isSignedIn) {
//             if (isSignedIn) {
//                 document.getElementById('authorize_button').style.display = 'none';
//                 document.getElementById('upload_button').style.display = 'block';
//             } else {
//                 document.getElementById('authorize_button').style.display = 'block';
//                 document.getElementById('upload_button').style.display = 'none';
//             }
//         }

//         function handleAuthClick(event) {
//             gapi.auth2.getAuthInstance().signIn();
//         }

//         function uploadFile() {
//             const fileInput = document.getElementById('video_file');
//             const file = fileInput.files[0];
        
//             if (!file) {
//                 alert("Por favor, selecione um arquivo de vídeo para enviar.");
//                 return;
//             }
        
//             const metadata = {
//                 name: file.name,
//                 mimeType: file.type,
//                 parents: ['1NkcdjiSyd32JiAvTkRiaC6jR0daNkxI8'] // Substitua pelo ID da sua pasta
//             };
        
//             const accessToken = gapi.auth.getToken().access_token;
//             const form = new FormData();
//             form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
//             form.append('file', file);
        
//             fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
//                 method: 'POST',
//                 headers: {
//                     'Authorization': 'Bearer ' + accessToken,
//                 },
//                 body: form,
//             })
//             .then(response => response.json())
//             .then(data => {
//                 console.log('Success:', data);
//                 alert('Vídeo enviado com sucesso!');
//             })
//             .catch(error => {
//                 console.error('Error:', error);
//                 alert('Erro ao enviar o vídeo.');
//             });
//         }
        

//         handleClientLoad();
//
let mediaRecorder;
let recordedChunks = [];
const startRecordButton = document.getElementById('record-video-btn');
const stopRecordButton = document.getElementById('stop-video-btn');
const videoPreview = document.getElementById('video-preview');
const btnEnviar = document.getElementById('btn-enviar');
const videoFile = document.getElementById('videoFile');

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

        mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            videoPreview.srcObject = null; 
            videoPreview.src = url; 
            videoPreview.controls = true; 
            videoPreview.style.display = 'block'; 

            // Criar um arquivo temporário para o upload
            const file = new File([blob], "video.webm", { type: 'video/webm' });
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            videoFile.files = dataTransfer.files; // Armazena o arquivo no elemento de entrada

            btnEnviar.disabled = false; // Habilita o botão de upload
        };

        mediaRecorder.start();
        startRecordButton.disabled = true;
        stopRecordButton.classList.remove('d-none'); // Mostra o botão de parar gravação
    } catch (error) {
        console.error('Erro ao acessar a câmera e o microfone:', error);
    }
});

btnEnviar.addEventListener('click', () => {
    const videoBlob = new Blob(recordedChunks, { type: 'video/webm' });
    saveVideoToServer(videoBlob);
});

// Função para enviar o vídeo para o servidor
function saveVideoToServer(videoBlob) {
    const formData = new FormData();
    const nome = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('phone').value;
    const mensagem = document.getElementById('message').value;

    if (mensagem === "" || nome === "" || email === "" || telefone === "") {
        return alert("Preencha o formulário antes de enviar!");
    }

    // Adiciona o arquivo de vídeo ao formData
    formData.append('videoFile', videoBlob, 'video.webm');
    formData.append('nome', nome);
    formData.append('email', email);
    formData.append('telefone', telefone);
    formData.append('mensagem', mensagem);

    // Chama a função para fazer o upload do vídeo
    uploadFile(formData);
}

// Função para enviar o vídeo ao Google Drive
function uploadFile(formData) {
    const accessToken = gapi.auth.getToken().access_token;

    fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
        },
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        alert('Vídeo enviado com sucesso!');
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Erro ao enviar o vídeo.');
    });
}

stopRecordButton.addEventListener('click', () => {
    mediaRecorder.stop();
    stopRecordButton.classList.add('d-none'); // Oculta o botão de parar gravação
    startRecordButton.disabled = false; // Habilita o botão de iniciar gravação
});

// Configuração da API do Google Drive
const CLIENT_ID = '959398658998-5lie1svvddtm9ktn3do5uvnlpcqqnutf.apps.googleusercontent.com';
const API_KEY = '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';
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

function handleClientLoad() {
    //gapi.load('client:auth2', initClient);
    window.onload = function () {
        // Adicione um listener para o botão de autorizar
        document.getElementById('btn-enviar').onclick = handleAuthClick;
    };
}

function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        scope: SCOPES,
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"]
    }).then(() => {
        // Listen for sign-in state changes
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        
        // Handle the initial sign-in state
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        
        document.getElementById('authorize_button').onclick = handleAuthClick;
    });
}

function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        document.getElementById('authorize_button').style.display = 'none';
        btnEnviar.style.display = 'block'; // Habilita o botão de upload
    } else {
        document.getElementById('authorize_button').style.display = 'block';
        btnEnviar.style.display = 'none'; // Oculta o botão de upload
    }
}

function handleAuthClick(event) {
    //gapi.auth2.getAuthInstance().signIn();
    window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (tokenResponse) => {
            // Token recebido, pode fazer as chamadas da API
            btnEnviar.style.display = 'block'; // Habilita o botão de upload
            console.log('Token:', tokenResponse.access_token);
        },
    }).requestAccessToken();
}

handleClientLoad();

