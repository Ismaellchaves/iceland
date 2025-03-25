$(document).ready(function(){
    $(window).scroll(function(){
        // sticky navbar on scroll script
        if(this.scrollY > 20){
            $('.navbar').addClass("sticky");
        }else{
            $('.navbar').removeClass("sticky");
        }
        
        // scroll-up button show/hide script
        if(this.scrollY > 100){
            $('.scroll-up-btn').addClass("show");
        }else{
            $('.scroll-up-btn').removeClass("show");
        }
    });

    // slide-up script
    $('.scroll-up-btn').click(function(){
        $('html').animate({scrollTop: 0});
        // removing smooth scroll on slide-up button click
        $('html').css("scrollBehavior", "auto");
    });

    $('.navbar .menu li a').click(function(){
        // applying again smooth scroll on menu items click
        $('html').css("scrollBehavior", "smooth");
    });

    // toggle menu/navbar script
    $('.menu-btn').click(function(){
        $('.navbar .menu').toggleClass("active");
        $('.menu-btn .fas.fa-bars').toggleClass("active");
    });
});
//----------------------------------

function renderItem(item, idPosicao) {
    
    // Adicionando uma div com o item e a quantidade na div .items
    var carrinhoExibir = document.getElementById("carrinho-produtos");
    
    carrinhoExibir.innerHTML += `
    <div class="products">
        <div class="name">${item.name}</div>
        <div class="price">${parseFloat(item.preco).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</div>
        <div style="clear:both"></div>
        <div class="qty">
            Quantidade: 
                <div class="qtde">
                    <a onclick='removeQtde(${idPosicao},${item.qtd})' id="remove">-</a>
                    <div value="" class="itemQuantity" id="qtd">${item.qtd}</div>
                    <a onclick='addQtde(${idPosicao},${item.qtd})' id="add">+</a>
                </div>
        </div>
        <div class="subtotal">Subtotal: ${parseFloat(item.qtd * item.preco).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})} </div>
        <div class="remove"><a onclick='removeProd(${idPosicao})'>Remover</a></div>
    </div>`
}

function addQtde(idPosicao,quantidade){

    if(quantidade >= 15){

        console.log("tentou colocar um valor inválido");

    }else{

    let item = JSON.parse(sessionStorage.getItem('items'));
    
    // Soma +1 na quantidade e salva os dados no sessionStorage
    item[idPosicao].qtd = `${quantidade + 1}`;
    sessionStorage.setItem("items", JSON.stringify(item));
    
    // atualiza os dados na tela
    getItems();
    }
}

function removeQtde(idPosicao,quantidade){
    
    if(quantidade == 1){
        
        console.log("tentou colocar um valor inválido");

    }else{
    
        let item = JSON.parse(sessionStorage.getItem('items'));
    
    // Subtrai -1 na quantidade e salva os dados no sessionStorage
    item[idPosicao].qtd = `${quantidade - 1}`;
    sessionStorage.setItem("items", JSON.stringify(item));

    // atualiza os dados na tela
    getItems();
    }
    
    
}

// Se o carrinho estiver vazio mostra uma mensagem na tela para o usuário olhar o cardápio
function carrinhoVazio(){
    let items = JSON.parse(sessionStorage.getItem('items'));
    
    console.log("Chamou o CARREGA DADOS");

    if (items === null) {
        var carrinhoExibir = document.getElementById("cart-content");
        carrinhoExibir.innerHTML = "";
        var carrinhoExibir = document.getElementById("cart-null");
        carrinhoExibir.innerHTML = `
        <div class="noProduct">
            <div class="small-title">Seu carrinho do Paladare está vazio</div>
            <div class="small-subtitle">Dê uma olhada no nosso cardápio<div>
            <a href="../Cardapio/index.html">Ver Cardápio</a>
            
        </div>
        `
    }
}

function getItems() {

    // Pegando o array do sessionStorage e chamando a função carrinhoVazio por padrão
    let items = JSON.parse(sessionStorage.getItem('items'));
    carrinhoVazio();

    //verificando se o items existe no sessionStorage
    if(sessionStorage.getItem('items')){
        if(items.length == 0){
            sessionStorage.removeItem('items');

            // Limpa a tela e exibe a mensagem na tela que o carrinho está vazio
            carrinhoVazio();
            atualizaQtdeCart();

        }else{
            
            // Limpando o html
            var carrinhoExibir = document.getElementById("carrinho-produtos");
            carrinhoExibir.innerHTML="";

            // Para cada item do array, é renderizado no html
            items.forEach((item, indexid) => {renderItem(item,indexid)});

            // Atualizando a mensagem do whatsapp e o total
            mensagem();
            totalFunc()
            atualizaQtdeCart();
        }
     }
    
}

function removeProd(id){

    // pego os dados da sessionStrorage e excluo o posição que o usuário clicou    
    let item = JSON.parse(sessionStorage.getItem('items'));
    item.splice(id, 1);
    sessionStorage.setItem("items", JSON.stringify(item));

    // atualiza os dados na tela
    getItems();    
}

function totalFunc() {
    var totalFinal = [];
    var totalExibir = document.getElementById("total");
    let item = JSON.parse(sessionStorage.getItem('items'));

    // Adicionando os itens no total
    item.forEach((item) => {
        totalFinal.push(parseFloat(item.qtd * item.preco));  
    });

    // Soma tudo e joga no total
    totalFinal = totalFinal.reduce((totalFinal, currentElement) => totalFinal + currentElement);
    console.log("o totalFinal é de: " + totalFinal);

    // Definir a taxa de delivery automaticamente, se aplicável
    let taxaDelivery = 0;

    // Aqui você pode definir se é delivery ou não, por exemplo:
    let tipoPedido = "delivery"; // Aqui você pode alterar para "retirada" se não for delivery

    if (tipoPedido.toLowerCase() === 'delivery') {
        taxaDelivery = 3; // Taxa de delivery
    }

    // Aplica a taxa de delivery ao total, se necessário
    totalFinal += taxaDelivery;

    // Exibe o total com ou sem taxa de delivery
    totalExibir.innerHTML = `Total: ${totalFinal.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}`;
}






// Função do botão para mandar o pedido com os itens no WhatsApp
function mensagem(){
    // Primeiro, exibe a caixa de diálogo pedindo nome e tipo de pedido
    let nomeCliente = prompt("Nos informe seu nome:");
    let tipoPedido = prompt("Escolha o tipo de pedido: Digite 'delivery' para entrega ou 'retirada' para retirar no local.");

    // Se o tipo de pedido for delivery, adiciona a taxa de R$ 3,00
    let taxaDelivery = 0;
    if (tipoPedido.toLowerCase() === 'delivery') {
        taxaDelivery = 3; // Taxa de delivery
    }

    // Calcula o total
    var totalFinal = calcularTotal(taxaDelivery);
    
    // Exibe o total no console (ou em um alert, se preferir)
    alert(`Total do pedido: ${totalFinal.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}`);

    // Cria a mensagem do WhatsApp
    var mensagemWhats = `https://api.whatsapp.com/send?l=pt_BR&phone=5519900000000&text=Olá,%20meu%20nome%20é%20*${nomeCliente}*,%20gostaria%20de%20fazer%20o%20pedido%20com%20o%20valor%20total%20de%20${totalFinal.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}.`;

    // Adicionando os itens do carrinho à mensagem
    let item = JSON.parse(sessionStorage.getItem('items'));
    item.forEach((item) => {
        mensagemWhats += `%0A${item.qtd} - ${item.name};`;
    });

    // Atualiza o botão com a URL do WhatsApp para envio
    var buttonWhatsApp = document.getElementById("buttonWhatsapp");
    buttonWhatsApp.innerHTML = `<a href="${mensagemWhats}" target="_blank"><i class="fab fa-whatsapp"></i> Fazer pedido</a>`;
}

// Função para calcular o total (com ou sem taxa de delivery)
function calcularTotal(taxaDelivery) {
    var totalFinal = 0;
    let item = JSON.parse(sessionStorage.getItem('items'));
    item.forEach((item) => {
        totalFinal += parseFloat(item.qtd * item.preco);  
    });
    totalFinal += taxaDelivery; // Adiciona a taxa de delivery, se necessário
    return totalFinal;
}








// Mostra a quantidade de itens do carrinho da barra de navegacao
function atualizaQtdeCart(){
    let exibeQtdeCart = document.getElementById("cont-cart");
    let item = JSON.parse(sessionStorage.getItem('items'));
    let qtde = []
    if(item != null){
        item.forEach((item) => {
            qtde.push(parseInt(item.qtd));  
        });
        let total = qtde.reduce((total, qtde) => total + qtde, 0);
        exibeQtdeCart.innerHTML = `${total}`
    }else{
        exibeQtdeCart.innerHTML = `0`
    }
}

atualizaQtdeCart();
getItems();
totalFunc();
