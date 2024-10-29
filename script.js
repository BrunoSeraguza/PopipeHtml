let accessToken = null;
let mediaRecorder;
let recordedChunks = [];
const startRecordButton = document.getElementById('record-video-btn');
const stopRecordButton = document.getElementById('stop-video-btn');
const videoPreview = document.getElementById('video-preview');
const btnEnviar = document.getElementById('btn-enviar');
const videoFile = document.getElementById('videoFile');

// function handleClientLoad() {
//     gapi.load('client:auth2', initClient);
// }

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
    debugger
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

async function uploadFile(formData) {
debugger
   // const accessToken = gapi.auth.getToken()?.access_token;
//    if (!accessToken) {
//         await handleAuthClick();
//     }
    debugger
   
        console.log(accessToken)
    // ID da pasta no Google Drive
    const folderId = '1qy2mQ8Hv-faTwQq5SxjMki9AAOstRRjl'; // Substitua pelo ID da sua pasta

    // Metadados do arquivo
    const metadata = {
        'name': 'video.webm', // Nome do arquivo que será salvo
        'mimeType': 'video/webm', // Tipo MIME do arquivo
        'parents': [folderId] // ID da pasta onde o arquivo será armazenado
    };
 
    const formDataWithMetadata = new FormData();
    formDataWithMetadata.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    formDataWithMetadata.append('videoFile', videoBlob, 'video.webm'); // Adiciona o arquivo de vídeo
  

    fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
        },
        body: formDataWithMetadata,
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
//const CLIENT_ID = '959398658998-5lie1svvddtm9ktn3do5uvnlpcqqnutf.apps.googleusercontent.com'; --minha
const CLIENT_ID = '1090299703695-i7hbld4agldb5729p4kpqbu9bjme5p6s.apps.googleusercontent.com'
//const API_KEY = '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';
const API_KEY ='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'
const SCOPES = 'https://www.googleapis.com/auth/drive';

// function initClient() {
//     debugger
//     gapi.client.init({
//         apiKey: API_KEY,
//         clientId: CLIENT_ID,
//         scope: SCOPES,
//         discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"]
//     }).then(() => {
//         debugger
//         // Listen for sign-in state changes
//         gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        
//         // Handle the initial sign-in state
//         updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        
//         document.getElementById('btn-enviar').onclick = handleAuthClick;
//     }).catch((error) => {
//         console.error("Erro ao inicializar o cliente Google API:", error);
//     });
// }
// Função de inicialização do cliente GIS
// function initClient() {
//     debugger
//     const client = google.accounts.oauth2.initTokenClient({
//         client_id: CLIENT_ID, // Substitua com o seu CLIENT_ID
//         scope: SCOPES, // As permissões que você precisa
//         prompt: 'consent',
//         callback: (tokenResponse) => {
//             debugger
//             if (tokenResponse && tokenResponse.access_token) {
//                 accessToken = tokenResponse.access_token;
//                 console.log("Token de Acesso:", accessToken);
//                 btnEnviar.style.display = 'block'; // Habilita o botão de upload
//             } else {
//                 debugger
//                 console.error("Falha ao obter o token de acesso.");
//             }
//         }
//     });
//     document.getElementById('btn-enviar').onclick = () => {
//         debugger
//         client.requestAccessToken();
//     };
// }

function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        document.getElementById('btn-enviar').style.display = 'none';
        btnEnviar.style.display = 'block'; // Habilita o botão de upload
    } else {
        document.getElementById('btn-enviar').style.display = 'block';
        btnEnviar.style.display = 'none'; // Oculta o botão de upload
    }
}

function handleAuthClick() {
    return new Promise((resolve, reject) => {
        const client = window.google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: SCOPES,
            callback: (tokenResponse) => {
                if (tokenResponse && tokenResponse.access_token) {
                    debugger
                    accessToken = tokenResponse.access_token;
                    console.log("Token de Acesso:", accessToken);
                    resolve(accessToken);
                } else {
                    debugger
                    reject(new Error("Falha ao obter o token de acesso."));
                }
            }
        });
        client.requestAccessToken();
    });
}

function handleCredentialResponse(response) {
    debugger
    const token = response.credential; // O token JWT retornado
    console.log("Token de ID:", token);
    fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'client_id': '1090299703695-i7hbld4agldb5729p4kpqbu9bjme5p6s.apps.googleusercontent.com',
            'client_secret': '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',
            'code': token, // ou o código de autorização
            'grant_type': 'authorization_code',
            'redirect_uri': 'http://127.0.0.1:5500/Index.html',
        }),
    })
    .then(response => response.json())   
    .then(data => {
        debugger
        const accessToken = data.access_token; // O Access Token
        console.log("Access Token:", accessToken);
    
        // Agora você pode usar o Access Token para enviar o vídeo
        // Exemplo:
        // uploadVideo(accessToken);
    })
    .catch(error => {
        console.error("Erro ao obter Access Token:", error);
    });
    }
    
// Passo 1: Redirecionar para o Google para obter autorização
function redirectToGoogleAuth() {
    const clientId = '1090299703695-i7hbld4agldb5729p4kpqbu9bjme5p6s.apps.googleusercontent.com';
    const redirectUri = 'http://127.0.0.1:5500/Index.html';
    const scope = 'https://www.googleapis.com/auth/drive'; // Escopo desejado

    const authUrl = `https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    window.location.href = authUrl; // Redireciona o usuário para o Google
}

// Passo 2: Capturar o código após redirecionamento
function handleAuthorizationCode() {
    debugger
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code'); // Captura o código

    if (code) {
        exchangeCodeForToken(code); // Chama a função para trocar o código por um token
    }
}

// Passo 3: Trocar o código por um access token
function exchangeCodeForToken(code) {
    debugger
    fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'client_id': '1090299703695-i7hbld4agldb5729p4kpqbu9bjme5p6s.apps.googleusercontent.com',
            'client_secret': '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',
            'code': code, // Aqui você usa o código de autorização
            'grant_type': 'authorization_code',
            'redirect_uri': 'http://127.0.0.1:5500/Index.html',
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            throw new Error(`Erro: ${data.error_description}`);
        }
       
        console.log("Access Token deu certo:",  data.access_token);
        accessToken =  data.access_token;        
        // Aqui você pode usar o Access Token para enviar o vídeo
        // uploadVideo(accessToken);
    })
    .catch(error => {
        console.error("Erro ao obter Access Token:", error);
    });
}

// Chame redirectToGoogleAuth para iniciar o fluxo
// redirectToGoogleAuth();
