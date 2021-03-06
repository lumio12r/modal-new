/*jshint esversion: 8 */

// zbór response w jednym obiekcie cache, by nie zabijać serwera zbyt dużą ilością zapytań
const cache = {};

// obiekt w skali globalnej, który ma usegregować zmienne, które były zadeklarowane osobono
const data = {
  title: null,
  basePrice: null,
  stock: null,
  status: null,
  option: null,
  current_set: null,
  difference: null
};

// obiekt tym razem ze stanem lub odpowiedziami, by w razie wersji językowej lub zmiany treści - łatwo możnaby to zmienić w całym pliku
const txt = {
  productAvailable: 'Produkt dostępny',
  productNotAvailable: 'Produkt niedostępny',
  max: 'Maksymalny ilość produktu to:',
  min: 'Liczba nie może być równa lub mniejsza niż zero'
};

// przypisanie konkretnych lokacji do stałych
const btn = document.querySelector('.btn');
const modal = document.querySelector('.modal');
const close = document.querySelector('.close');
const close_mobile = document.querySelector('.close-mobile');
const product_box = document.querySelector('.product-box');
const titleOnPage = document.querySelector('.title');
const photo_box = document.querySelector('.photo-box');
const sizeContainer = document.querySelector('.size-container');
const price = document.querySelector('.price');
const options = document.querySelector('.options');
const available = document.querySelector('.available');
const icon = document.querySelector('.icon-available');
const counter_input = document.querySelector('.input-counter');
const button_submit = document.querySelector('.submit');
const delivery_box = document.querySelector('.delivery-box');
const previous_photo = document.querySelector('.fa-angle-left');
const next_photo = document.querySelector('.fa-angle-right');
const increase = document.querySelector('.plus');
const decrease = document.querySelector('.minus');
const form = document.querySelector('form');

// główna, która odpowiada za pobieranie danych z API
const fetchData = async url => {
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

// pobranie wszystkich danych do jednego obiektu cache
const getData = async () => {
  cache.title = await fetchData('https://my-json-server.typicode.com/lumio12r/modal-new/product');
  cache.sizes = await fetchData('https://my-json-server.typicode.com/lumio12r/modal-new/sizes');
  cache.multiversions = await fetchData('https://my-json-server.typicode.com/lumio12r/modal-new/multiversions');  
};

// funkcja, która tworzy tytuł i wstawia go na stronę
const createTitle = async () => {
  data.title = cache.title.name;
  titleOnPage.innerText = data.title;
};

// funkcja, która tworzy przyciski do zmiany rozmiaru - w tym przypadku ilości pamięci
const createButtons = async () => {
  const objects = Object.values(cache.sizes.items);
  for (const [i,item] of objects.entries()) {
    let button = document.createElement('button');
    button.innerText = item.name;
    if (i === 0) {
      button.classList.add('active');
    }
    button.classList.add('size-button');
    button.setAttribute('type', 'button');
    button.setAttribute('id', item.type);
    sizeContainer.appendChild(button);
  }
};

// funkcja, która pobiera aktualną cenę, w zależności od aktywnego przycisku
const getPrice = async () => {
  const active_option = document.querySelector('.active');
  data.basePrice = cache.sizes.items[active_option.id].price;
  price.innerText = data.basePrice + ".00" + " zł";
};

// funkcja zamieniąjąca w tytule rozmiar, czy pojemność urządzenia
const newTitle = async () => {
  const active_option = document.querySelector('.active');
  data.option = active_option.innerText.slice(4).replace(/\s/g, '');
  let toReplace = data.title.slice(29, -10);
  data.title = data.title.replace(toReplace, data.option);
  titleOnPage.innerText = data.title;
};

// funkcja sprawdzająca stan magazynowy danego produktu
const checkStock = async () => {
  const active_option = document.querySelector('.active');
  data.stock = cache.sizes.items[active_option.id].amount;
};

// funkcja ustawiająca status na podstawie stanu magazynowego, a także wszystkie rzeczy będące powiązane ze statusem 
// - czyli nieklikalność przycisków, gdy nie ma nic na stanie lub ukrycie boxa "możemy wysłać Ci już dzisiaj"
const setStatus = async () => {
  if (data.stock === 0) {
    data.status = txt.productNotAvailable;
    icon.removeAttribute("src");
    icon.setAttribute("src", "./resources/icons/close.svg");
    available.innerText = data.status;
    button_submit.disabled = true;
    counter_input.disabled = true;
    counter_input.value = 0;
    increase.disabled = true;
    decrease.disabled = true;
    available.style.width = "125px";
    increase.classList.add('disabled');
    decrease.classList.add('disabled');
    counter_input.classList.add('disabled');
    delivery_box.classList.remove('no-visible','visible-flex');
    delivery_box.classList.add('no-visible');
  } else {
    icon.setAttribute("src", "./resources/icons/ok.svg");
    data.status = txt.productAvailable;
    available.innerText = data.status;
    button_submit.disabled = false;
    counter_input.disabled = false;
    counter_input.value = 1;
    increase.disabled = false;
    decrease.disabled = false;
    increase.classList.remove('disabled');
    decrease.classList.remove('disabled');
    counter_input.classList.remove('disabled');
    delivery_box.classList.remove('no-visible','visible-flex');
    delivery_box.classList.add('visible-flex');
  }
};

// tworzenie całych galerii przypisanych do jednej opcji kolorystycznej
const createSetsImages = async () => {
  for (let object of cache.multiversions) {
    let items = Object.values(object.items);
    for (let [i,item] of items.entries()) {
      let products = Object.values(item.products);
      let set = document.createElement("div");
      set.classList.add('set');
      if (i === 0) {
        set.classList.add('current-set');
        data.current_set = set;
      }
      for (let product of products) {
        let images = Object.values(product.images);
        for (let [z, image] of images.entries()) {
          let img = document.createElement("img");
          img.setAttribute("src", image.url);
          img.setAttribute("alt", image.alt);
          img.classList.add('photo');
          if (z === 0) {
            img.classList.add('current-photo');
          }
          set.appendChild(img);
        }
        photo_box.appendChild(set);
      }
    }
  }
};

// tworzenie opcji, które mają znaleźć się w select
const createOptions = async () => {
  for (let object of cache.multiversions) {
    let items = Object.values(object.items);
    for (let item of items) {
      let id = item.values_id;
      let name = item.values[id].name;
      let option = document.createElement("option");
      option.innerText = name;
      option.setAttribute("value", id);
      options.appendChild(option);
    }
  }
};

// funkcja, która zajmuje się wybraniem odpowiedniej różnicy cenowej w wersjach kolorystycznych, a później zaaktualizowanie nowej ceny
const priceDifference = async (e) => {
  for (let object of cache.multiversions) {
    let items = Object.values(object.items);
    for (let item of items) {
      let value_id = item.values_id;
      let products = Object.values(item.products);
      for (let product of products) {
        if (value_id == e.value ) {
        data.difference = parseFloat(product.price_difference);
        if (data.difference === 0) {
          price.innerText = data.basePrice + ".00 zł";
        } else {
          let newPrice = data.basePrice + data.difference;
          price.innerText = newPrice + ".00 zł";
      }
      }
}}}};

// funkcja zmieniająca galerie, gdy są zmieniane wersje kolorystyczne
const changeGallery = async (e) => {
  let current = document.querySelector(".current-set");
  let color_version = document.querySelectorAll(".set");
  console.log(e);
  let set;
  switch (e.value) {
    case "61":
      set = 0;
      break;
    case "60":
      set = 1;
      break;
    case "59":
      set = 2;
      break;
  }
  current.classList.remove("current-set");
  data.current_set = color_version[set];
  data.current_set.classList.add("current-set");
};

// funkcja, która zbiera w całość poprzednie funkcje i tworzy cały kompletny popup
const createModal = async () => {
  await getData();
  await createTitle();
  createButtons();
  getPrice();
  await newTitle();
  await checkStock();
  await setStatus();
  await createSetsImages();
  await createOptions();
  console.log(cache);
};

createModal();
                                                                      /* ZBÓR EVENTLISTENERÓW  */
// eventlistener, który zajmuje się pojawieniem się popupu
btn.addEventListener('click', () => {
  if (modal.classList.contains('no-visible')) {
    modal.classList.remove('no-visible');
    modal.classList.add('visible');
  }
  counter_input.value = 1;
});

// eventlistener, który zajmuje się sprawdzaniem, czy nie są wprowadzane dane, które będą większe lub mniejsze niż stan magazynowy
counter_input.addEventListener('input', () => {
  checkStock();
  if (counter_input.value > data.stock) {
    alert(txt.max + " " + data.stock);
    counter_input.value = data.stock;
  }
  if (counter_input.value < 1) {
    alert(txt.min);
}});

// eventlisteneter, który zamuje się sprawdzaniem, czy nie jest klikany, któryś z buttonów z rozmiarem i ewentualne zaaktualizowanie danych
sizeContainer.addEventListener('click', (e) => {
  let current = document.querySelector('.active');
  if (current === e.target) {

  } else {
    current.classList.remove('active');
    e.target.classList.add('active');
    getPrice();
    newTitle();
    checkStock();
    setStatus();
    options[0].selected = true;
    data.current_set.classList.remove('current-set');
    photo_box.children[0].classList.add('current-set');
  }
});

// eventlistener, który zajmuje się przewijaniem zdjęc w tył w galerii w jednej opcji kolorystycznej
previous_photo.addEventListener('click', () => {
  let current_photo = data.current_set.querySelector('.current-photo');
  current_photo.classList.remove('current-photo');
  if (current_photo.previousSibling === null) {
    data.current_set.lastChild.classList.add('current-photo');
  }
  current_photo.previousSibling.classList.add('current-photo');
});


// eventlistener, który zajmuje się przewijaniem zdjęc w przód w galerii w jednej opcji kolorystycznej
next_photo.addEventListener('click', () => {
  let current_photo = data.current_set.querySelector('.current-photo');
  current_photo.classList.remove('current-photo');
  try {
    current_photo.nextSibling.classList.add('current-photo');
  } catch (error) {
    data.current_set.firstChild.classList.add('current-photo');
  }
});

// event onclick, który zamyka popup za pomocą przycisku na tabletach i komputerach
close.onclick = () => {
  modal.classList.add('no-visible');
};
  
// event onclick, który zamyka popup za pomocą przycisku na telefonach
close_mobile.onclick = () => {
  modal.classList.add('no-visible');
};

// event onclick, który zamyka modal, gdy kliknie się na wyszarzoną część
window.onclick = (e) => {
  if (modal.classList.contains('visible')) {
    if (e.target == modal) {
      modal.classList.remove('visible');
      modal.classList.add('no-visible');
    }
  }
};

// eventlistener, który odpowiada za wysłanie formularza
form.addEventListener('submit', e => {
  e.preventDefault();
  let current = document.querySelector('.active');
  modal.classList.add('no-visible');
  alert(`Twoj produkt ${data.title} w cenie ${data.basePrice-data.difference}.00 zł za sztukę w ilości ${counter_input.value} została dodana do Twojego koszyka`);
  current.classList.remove('active');
  sizeContainer.firstChild.classList.add('active');
  options[0].selected = true;
  data.current_set.classList.remove('current-set');
  photo_box.children[0].classList.add('current-set');
  getPrice();

});

// eventlistener, który odpowiada za zmianę ceny i zmianę galerii po wybraniu odpowiedniej wersji kolorystycznej
options.addEventListener('change', (e) => {
  priceDifference(e.target);
  changeGallery(e.target);
});

// eventlistner, który odpowiada za zwiększanie i obsługę przycisku zwiększającego ilości produktów
increase.addEventListener('click', () => {
  checkStock();
  if (counter_input.value == data.stock) {
    alert(txt.max + " " + data.stock);
    counter_input.value = data.stock;
  } else {
    counter_input.value++;
  }
});

// eventlistner, który odpowiada za zwiększanie i obsługę przycisku zmniejszająć ilość produktów
decrease.addEventListener('click', () => {
  if (counter_input.value <= 1) {
    alert(txt.min);
  } else {
    --counter_input.value;
  }
});
