
<div align="center"">
    <img style="margin: auto;" src="assets/react.svg" alt="nodejs" width="100">
</div>

<h1 align="center"">Interfaces com React.js</h1>

<p>Aplicação desenvolvida para ser bidirecional e aceitar todas operações cruds</p>

<h2>Tecnologias</h2>

- [React.js](https://react.dev/)
- [React Icons](https://react-icons.github.io/react-icons/)
- [Socket.io client](https://socket.io/docs/v4/client-api/)
- [Clique aqui para ver mais](https://github.com/FelipePinheiroRegina/front-pallet-rack/blob/main/package.json)

<h2>Video como funciona a aplicação</h2>

https://github.com/user-attachments/assets/05dcb366-9973-47f4-92e8-7a33396987b1

<h2>Como rodar a aplicação</h2>

Você primeiro terá que configurar o back-end na sua máquina.

Pegue o ip onde seu backend está escutando e coloque no arquivo `src/services/api.js`

Além disso você deve colocar o ip na page home onde o socket está escutando também

[Back-end da aplicação](https://github.com/FelipePinheiroRegina/api-pallet-rack)

```
// bash
cd ~

mkdir projects

git clone https://github.com/FelipePinheiroRegina/front-pallet-rack.git

cd front-pallet-rack

npm install 

npm run dev // development

npm run build // production
```
<h2 align='center'>Deploy</h2>
O projeto roda em um Ubuntu server na empresa, acessivel apenas para a rede local. utilizei bash para configurar o apache e o firewall.

<h2 align='center'>Desenvolvedor</h2>

<img src="assets/feGreen.jpeg" alt="Minha imagem" width="48">

<strong>Felipe Pinheiro Regina</strong>

[LinkedIn](https://www.linkedin.com/in/felipe-pinheiro-002427250/)


