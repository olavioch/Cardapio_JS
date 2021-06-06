let modalqt = 1;
let modalkey = 0;
let cart = [];
const itens = (it) => document.querySelector(it);
const classItens = (it) => document.querySelectorAll(it); 

//listagem das pizzas
cardapioJson.map((item, index)=>{
    let pizzaItem = itens('.models .pizza-item').cloneNode(true);
    //preencher a informação em pizza item
    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.nome;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.descricao;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    itens('.pizza-area').append(pizzaItem);
    pizzaItem.querySelector('a').addEventListener('click', (e) =>{
        e.preventDefault();
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalqt =1;
        modalkey=key;
        itens('.pizzaInfo h1').innerHTML = cardapioJson[key].nome;
        itens('.pizzaBig img').src = cardapioJson[key].img;
        itens('.pizzaInfo--desc').innerHTML = cardapioJson[key].descricao;
        itens('.pizzaInfo--actualPrice').innerHTML = `R$ ${cardapioJson[key].price.toFixed(2)}`;
        itens('.pizzaInfo--size.selected').classList.remove('selected');
        classItens('.pizzaInfo--size').forEach((size, sizeindex) => {
            if(sizeindex == 2){
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = cardapioJson[key].sizes[sizeindex];
        });
        itens('.pizzaInfo--qt').innerHTML = modalqt;
        itens('.pizzaWindowArea').style.opacity = 0;
        itens('.pizzaWindowArea').style.display = "flex";
        setTimeout(()=>{
            itens('.pizzaWindowArea').style.opacity = 1;
        }, 500);
    });
});

//eventos modal
function closeModal(){
    itens('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=>{
        itens('.pizzaWindowArea').style.display = 'none';
    }, 500);
}
classItens('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});
itens('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if(modalqt > 1){
        modalqt--;
        itens('.pizzaInfo--qt').innerHTML = modalqt;
    }
});
itens('.pizzaInfo--qtmais').addEventListener('click', () =>{
    modalqt++;
    itens('.pizzaInfo--qt').innerHTML = modalqt;
});
classItens('.pizzaInfo--size').forEach((size, sizeindex) => {
    size.addEventListener('click', (e) =>{
        itens('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
        if(sizeindex == 1 || sizeindex == 0){
            itens('.pizzaInfo--size.selected').style.borderTopRightRadius = 0;
            itens('.pizzaInfo--size.selected').style.borderBottomRightRadius = 0;
        }
    });
});
itens('.pizzaInfo--addButton').addEventListener('click', () => {
    let size = parseInt(itens('.pizzaInfo--size.selected').getAttribute('data-key'));
    let identifier = cardapioJson[modalkey].id+'@'+ size;
    let key = cart.findIndex((item) => item.identifier == identifier);
    if(key > -1){
        cart[key].qt += modalqt;
    }else{
    cart.push({
        identifier,
        id: cardapioJson[modalkey].id,
        size,
        qt: modalqt
    }); } 
    updateCart();
    closeModal();
});
itens('.menu-closer').addEventListener('click', () =>{
    itens('aside').style.display = 'none';
});
itens('.menu-openner').addEventListener('click', () => {
    itens('aside').style.display = 'flex';
});
function updateCart(){
    itens('.menu-openner span').innerHTML = cart.length;
    if(cart.length > 0){
        itens('aside').classList.add('show');
        itens('aside').style.display = 'flex';
        itens('.cart').innerHTML = ' ';
        let subtotal = 0;
        let total = 0;
        let desconto = 0;
        for(let i in cart){
            let pizzaItem = cardapioJson.find((item)=>item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].qt;
            let cartItem = itens('.models .cart-item').cloneNode(true);
            let pizzaSizeName;
            switch(cart[i].size){
                case 0:
                pizzaSizeName = 'P';
                break;
                case 1:
                    pizzaSizeName = 'M';
                break;
                case 2: 
                    pizzaSizeName = 'G';
                break;    
            }
            let pizzaName = `${pizzaItem.nome} (${pizzaSizeName})`; 
            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart-item--name').innerHTML = pizzaName;
            cartItem.querySelector('.cart-item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.card-item--qtmenos').addEventListener('click',()=>{
                if(cart[i].qt > 1){
                    cart[i].qt--;
                }else{
                    cart.splice(i, 1);
                }
                updateCart();
            });
            cartItem.querySelector('.card-item--qtmais').addEventListener('click',()=>{
                cart[i].qt++;
                updateCart();
            });
            itens('.cart').append(cartItem);
        }
        desconto = subtotal * 0.1;
        total = subtotal - desconto;
        itens('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        itens('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        itens('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
    }
    else{
        itens('aside').classList.remove('show');
        itens('aside').style.display = 'none';
    }
}