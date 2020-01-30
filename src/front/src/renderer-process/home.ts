import { remote } from 'electron';

async function initialize() {
    document.getElementById('btnInvoke').addEventListener('click', async () => {
        let div = document.getElementById('responses');
        let client = remote.getGlobal('WebSocketClient');

        if(client){
            let data = { name: 'echo', body: { content: 'Hello from electron!' } };
            let message = { name: 'invoke', payload: data };

            let response = await client.invoke(message);
            div.innerHTML += `<p>${JSON.stringify(response)} </p>` ;
        } else {
            div.innerHTML = '<h3>No WebSocket client found.</h3>';
        }
    });
}

initialize();