/*jshint esversion: 6 */

// przypisanie konkretnych lokacji do stałych
const btn = document.querySelector(".btn");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const close_mobile = document.querySelector(".close-mobile");
const product_box = document.querySelector(".product-box");
const titleOnPage = document.querySelector(".title");
const photo_box = document.querySelector(".photo-box");
const sizeContainer = document.querySelector(".size-container");
const price = document.querySelector(".price");
const options = document.querySelector(".options");
const available = document.querySelector('.available');
const icon = document.querySelector('.icon-available');
const counter_input = document.querySelector('.input-counter');
const button_submit = document.querySelector('.submit');
const delivery_box = document.querySelector('.delivery-box');
const previous_photo = document.querySelector('.fa-angle-left');
const next_photo = document.querySelector('.fa-angle-right');
const increase = document.querySelector('.plus');
const decrease = document.querySelector('.minus');

// deklaracja zmiennych globalnych

let basePrice;
let stock;
let status;
let title;
let option;
let current_set;

/* 
funkcja getJson odpowiadająca za pobranie danych z fake API 
(postawione za pomocą komendy json-server --watch xbox.json --port 8000) 
*/

function getJson(url, callback, e) {
    let object;
    fetch(url)
    .then(response => response.json())
    .then(data => object = data)
    .then(() => callback(object, e));
}

// zbiór fukcji odpowiadających za pobranie danych i użycie ich do manipulowania DOM

function createTitle(jsonObject) {
    title = jsonObject.name;
    titleOnPage.innerText = title;
}

function createButtons(jsonObject) {
    let parent = [];
    for (let item in jsonObject.items) {
        parent.push(item);
    }
    for (let i = 0; i < parent.length; i++) {
        let button = document.createElement("button");
        button.innerText = jsonObject.items[parent[i]].name;
        if (i === 0) {
            button.classList.add('active');
        }
        button.classList.add('size-button');
        button.setAttribute("id", parent[i]);
        sizeContainer.appendChild(button);
    }

}

function getPrice(jsonObject) {
    let parent = [];
    for (let item in jsonObject.items) {
        parent.push(item);
    }
    for (let i = 0; i < parent.length; i++) {
        if (sizeContainer.children[i].classList.contains('active')) {
            option = sizeContainer.children[i].innerText;
            option = option.slice(4).replace(/\s/g, '');
            let toReplace = title.slice(29,-10);
            title = title.replace(toReplace, option);
            titleOnPage.innerText = title;
            basePrice = jsonObject.items[parent[i]].price;
            stock = jsonObject.items[parent[i]].amount;
            status = jsonObject.items[parent[i]].status;
            price.innerText = basePrice + ".00" + " zł";
            if (status == "Produkt niedostępny") {
                icon.classList.add('fa-times');
            } else {
                icon.classList.add('fa-check');
            }
            available.innerText = status;
            if (status == "Produkt niedostępny") {
                button_submit.disabled = true;
                counter_input.disabled = true;
                counter_input.value = 0;
                increase.disabled = true;
                decrease.disabled = true;
                increase.classList.add('disabled');
                decrease.classList.add('disabled');
                counter_input.classList.add('disabled');
            } else {
                button_submit.disabled = false;
                counter_input.disabled = false;
                counter_input.value = 1;
                increase.disabled = false;
                decrease.disabled = false;
                increase.classList.remove('disabled');
                decrease.classList.remove('disabled');
                counter_input.classList.remove('disabled');
                increase.onclick = () => {
                    if (counter_input.value == stock) {
                        alert(`Maksymalny ilość produktu to: ${stock}`);
                    } else {
                        counter_input.value++;
                    }
                };
                decrease.onclick = () => {
                    if (counter_input.value <= 1) {
                        alert('Liczba nie może być równa lub mniejsza niż zero');
                    } else {
                        --counter_input.value;
                    }
                };
            }
        }
    }
}

function changePrice (jsonObject, e) {
    let parent = [];
    for (let item in jsonObject.items) {
        parent.push(item);
    }
    for (let i = 0; i < parent.length; i++) {
        let current = document.querySelector(".active");
        if (sizeContainer.children[i] == e.target ) {
            if (sizeContainer.children[i].classList.contains('active') && e.target.classList.contains('active')) {
            }
            else {
                current.classList.remove('active');
                e.target.classList.add('active');
                option = sizeContainer.children[i].innerText;
                option = option.slice(4).replace(/\s/g, '');
                let toReplace = title.slice(29,-10);
                title = title.replace(toReplace, option);
                titleOnPage.innerText = title;
                basePrice = jsonObject.items[parent[i]].price;
                stock = jsonObject.items[parent[i]].amount;
                status = jsonObject.items[parent[i]].status;
                price.innerText = basePrice + ".00" + " zł";
                options[0].selected = true;
                current_set.classList.remove('current-set');
                photo_box.children[0].classList.add("current-set");
                if (icon.classList.contains('fa-times')) {
                    icon.classList.remove('fa-times');
                    if (status == "Produkt niedostępny") {
                        icon.classList.add('fa-times');
                    } else {
                        icon.classList.add('fa-check');
                    }
                }
                if (icon.classList.contains('fa-check')) {
                    icon.classList.remove('fa-check');
                    if (status == "Produkt niedostępny") {
                        icon.classList.add('fa-times');
                    } else {
                        icon.classList.add('fa-check');
                    }
                }
                if (status == "Produkt niedostępny") {
                    button_submit.disabled = true;
                    counter_input.disabled = true;
                    counter_input.value = 0;
                    increase.disabled = true;
                    decrease.disabled = true;
                    increase.classList.add('disabled');
                    decrease.classList.add('disabled');
                    counter_input.classList.add('disabled');
                    if (delivery_box.classList.contains('no-visible')) {
                        delivery_box.classList.remove('no-visible');
                    }
                    if (delivery_box.classList.contains('visible-flex')) {
                        delivery_box.classList.remove('visible-flex');
                    }
                    delivery_box.classList.add('no-visible');
                } else {
                    button_submit.disabled = false;
                    counter_input.disabled = false;
                    counter_input.value = 1;
                    increase.disabled = false;
                    decrease.disabled = false;
                    increase.classList.remove('disabled');
                    decrease.classList.remove('disabled');
                    counter_input.classList.remove('disabled');
                        increase.onclick = () => {
                            if (counter_input.value == stock) {
                                alert(`Maksymalny ilość produktu to: ${stock}`);
                            } else {
                                counter_input.value++;
                            }
                        };
                        decrease.onclick = () => {
                            if (counter_input.value <= 1) {
                                alert('Liczba nie może być równa lub mniejsza niż zero');
                            } else {
                                --counter_input.value;
                            }
                        };
                    if (delivery_box.classList.contains('no-visible')) {
                        delivery_box.classList.remove('no-visible');
                    }
                    if (delivery_box.classList.contains('visible-flex')) {
                        delivery_box.classList.remove('visible-flex');
                    }
                    delivery_box.classList.add('visible-flex');
                }
                available.innerText = status;
                break;
            }
        }
    }
}

function createOptions (Array) {
    let parent = [];
    let id = [];
    for (let object of Array) {
        for (let item in object.items) {
            parent.push(item);
        }
        for (let i = 0; i < parent.length; i++) {
            id.push(object.items[parent[i]].values_id);
            let name = object.items[parent[i]].values[id[i]].name;
            let option = document.createElement("option");
            let set = document.createElement("div");
            set.classList.add('set');
            if (i === 0) {
                set.classList.add('current-set');
                current_set = set;
            }
            for (let product of object.items[parent[i]].products) {
                    for (let o = 0; o < product.images.length; o++) {
                        let img = document.createElement("img");
                        img.setAttribute("src", product.images[o].url);
                        img.setAttribute("alt", product.images[o].alt);
                        img.classList.add('photo');
                        if (o === 0) {
                            img.classList.add('current-photo');
                        }
                        set.appendChild(img);
                    }
                    photo_box.appendChild(set);
            }
            option.innerText = name;
            option.setAttribute("value", id[i]);
            options.appendChild(option);
        }
    }

}

function changeColor (Array, e) {
    let parent = [];
    let current = document.querySelector(".current-set");
    let color_version = document.querySelectorAll(".set");

    for (let object of Array) {
        for (let item in object.items) {
            parent.push(item);
        }
        for (let i = 0; i < parent.length; i++) {
            for (let product of object.items[parent[i]].products) {
                if (e.target.children[i].selected == true) {
                    let difference = parseFloat(product.price_difference);
                    current.classList.remove("current-set");
                    current_set = color_version[i];
                    current_set.classList.add("current-set");
                    if (difference === 0) {
                        price.innerText = basePrice + ".00 zł";
                    } else {
                        let newPrice = basePrice + difference;
                        price.innerText = newPrice + ".00 zł";
                }
            }
        }
    }
    }};


counter_input.addEventListener('input', function (e) {
    if(counter_input.value > stock) {
        alert(`Maksymalna ilość produktu to: ${stock}`);
        counter_input.value = stock;
    }
});

// funkcje odpowiadające za pojawianie i znikanie boxa z produktem

btn.addEventListener('click', e => {
        getJson('https://my-json-server.typicode.com/lumio12r/modal-new/product', createTitle);
        getJson('https://my-json-server.typicode.com/lumio12r/modal-new/sizes', createButtons);
        getJson('https://my-json-server.typicode.com/lumio12r/modal-new/sizes', getPrice);
        getJson('https://my-json-server.typicode.com/lumio12r/modal-new/multiversions', createOptions);
}, {once: true});
btn.addEventListener('click', e => {
    if (modal.classList.contains('no-visible')){
        modal.classList.remove('no-visible');
        modal.classList.add("visible");
    }
    counter_input.value = 1;
});
/* alternatywna wersja do tej ^
        document.addEventListener('mouseover', e => {
            getJson('http://my-json-server.typicode.com/lumio12r/modal/sizes', changePrice, e)
        });*/
sizeContainer.addEventListener('click', e => {
    getJson('https://my-json-server.typicode.com/lumio12r/modal-new/sizes', changePrice, e);
});
options.addEventListener('click', e => {
    getJson('https://my-json-server.typicode.com/lumio12r/modal-new/multiversions', changeColor, e);
});
previous_photo.addEventListener('click', e => {
    let current_photo = current_set.querySelector('.current-photo');
    current_photo.classList.remove('current-photo');
    
    (current_set);
    if (current_photo.previousSibling === null) {
        current_set.lastChild.classList.add('current-photo');
    }
    current_photo.previousSibling.classList.add('current-photo');
});
next_photo.addEventListener('click', e => {
    let current_photo = current_set.querySelector('.current-photo');
    current_photo.classList.remove('current-photo');
    try {
        current_photo.nextSibling.classList.add('current-photo');
    } catch (error){
        current_set.firstChild.classList.add('current-photo');
    }
});

close.onclick = () => {
    modal.classList.add("no-visible");
};
close_mobile.onclick = () => {
    modal.classList.add("no-visible");
};

window.onclick = e => {
    if (modal.classList.contains("visible")){
        if (e.target == modal) {
            modal.classList.remove("visible");
            modal.classList.add("no-visible");
        }
    }
};
