const http = require('http');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const hostname = 'localhost';

const port = process.env.PORT || 3000;

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'rpwesley20@gmail.com',
        pass: 'cujaghqumdjsnhmh'
    }
})

const server = http.createServer((req, res) => {
    if (req.url === '/' || req.url === '/index') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        // Rota para a página inicial
        const filePath = path.join(__dirname, 'index.html');

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'text/plain');
                res.end('Internal Server Error');
                return;
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end(data);
        });
    } else if (req.url === '/about') {
        // Rota para a página "about"
        res.setHeader('Access-Control-Allow-Origin', '*');
        const aboutPath = path.join(__dirname, 'about.html');

        fs.readFile(aboutPath, 'utf8', (err, data) => {
            if (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'text/plain');
                res.end('Internal Server Error');
                return;
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end(data);
        });
    } else if (req.url === '/cadastro/email' && req.method === 'OPTIONS') {
        // Responde às solicitações OPTIONS (pré-requisições CORS) para a rota /cadastro
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.statusCode = 204; // Resposta de sucesso sem conteúdo
        res.end();
    } else if (req.url === '/cadastro/email' && req.method === 'POST') {
        res.setHeader('Access-Control-Allow-Origin', '*');

        let requestBody = '';

        req.on('data', (e) => {
            requestBody += e.toString();
            console.log(requestBody)
        })

        req.on('end', () => {
            const requestData = JSON.parse(requestBody);
            // Realiza alguma lógica com os dados recebidos (requestData)
            // Aqui você pode processar os dados e, por exemplo, salvar no banco de dados

            const mailOptions = {
                from: 'rpwesley20@gmail.com',
                to: requestData.email,
                subject: 'Novo contato',
                text: requestData.assunto
            };

            transporter.sendMail(mailOptions, (error, info) => {
                var responseData = {};

                if (error) {
                    if (requestData.assunto === '') {
                        responseData = {
                            mensagem: 'E-mail nao cadastrado!',
                            mensagemDetalhe: requestData.email,
                            status: 'error'
                        };
                    } else {
                        responseData = {
                            mensagem: 'E-mail nao cadastrado!',
                            mensagemDetalhe: requestData.email,
                            mensagemAssunto: requestData.assunto,
                            status: 'error'
                        };
                    };

                    res.statusCode = 200;

                    res.setHeader('Content-Type', 'application/json');

                    const jsonResponse = JSON.stringify(responseData);

                    res.end(jsonResponse);

                } else {

                    if (requestData.assunto === '') {
                        responseData = {
                            mensagem: 'E-mail cadastrado com sucesso!',
                            mensagemDetalhe: requestData.email,
                            status: 'success'
                        };
                    } else {
                        responseData = {
                            mensagem: 'E-mail cadastrado com sucesso!',
                            mensagemDetalhe: requestData.email,
                            mensagemAssunto: requestData.assunto,
                            status: 'success'
                        };
                    };

                    res.statusCode = 200;

                    res.setHeader('Content-Type', 'application/json');

                    const jsonResponse = JSON.stringify(responseData);

                    res.end(jsonResponse);
                }
            })


        })

    } else if (req.url === '/background.mp4') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        // Rota para o arquivo de vídeo
        const filePath = path.join(__dirname, 'midia', 'video', 'background.mp4');

        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.log(err)
                res.statusCode = 500;
                res.setHeader('Content-Type', 'text/plain');
                res.end('Internal Server Error');
                return;
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'video/mp4');
            res.end(data, 'binary');
        });
    } else {
        // Rota padrão para páginas não encontradas
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Not Found');
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
