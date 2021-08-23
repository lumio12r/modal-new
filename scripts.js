/*jshint esversion: 6 */

const cache = {};

const data = {
  title: null,
  basePrice: null,
  stock: null,
  status: null,
  option: null,
  current_set: null,
  difference: null
}

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


const fetchData = async url => {
  const res = await fetch(url);
  const data = await res.json();
  return data;
}


const getData = async () => {
  cache.title = await fetchData('https://my-json-server.typicode.com/lumio12r/modal-new/product');
  cache.sizes = await fetchData('https://my-json-server.typicode.com/lumio12r/modal-new/sizes');
  cache.multiversions = await fetchData('https://my-json-server.typicode.com/lumio12r/modal-new/multiversions');  
}

const createTitle = async () => {
  data.title = cache.title.name;
  titleOnPage.innerText = data.title;
}

const createButtons = async () => {
  const objects = Object.values(cache.sizes.items);
  for (const [i,item] of objects.entries()) {
    let button = document.createElement('button');
    button.innerText = item.name;
    if (i === 2) {
      button.classList.add('active');
    }
    button.classList.add('size-button');
    button.setAttribute('type', 'button');
    button.setAttribute('id', item.type);
    sizeContainer.appendChild(button);
  }
}

const getPrice = async () => {
  const active_option = document.querySelector('.active');
  data.basePrice = cache.sizes.items[active_option.id].price;
  price.innerText = data.basePrice + ".00" + " zł";
}

const newTitle = async () => {
  const active_option = document.querySelector('.active');
  option = active_option.innerText.slice(4).replace(/\s/g, '');
  let toReplace = data.title.slice(29, -10);
  data.title = data.title.replace(toReplace, option);
  titleOnPage.innerText = data.title;
}

const checkStock = async () => {
  const active_option = document.querySelector('.active');
  data.stock = cache.sizes.items[active_option.id].amount;
}

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
}

const createSetsImages = async () => {
  for (let object of cache.multiversions) {
    let items = Object.values(object.items);
    for (let [i,item] of items.entries()) {
      let products = Object.values(item.products);
      let set = document.createElement("div");
      set.classList.add('set');
      if (i === 0) {
        set.classList.add('current-set');
        current_set = set;
      }
      for (let [o, product] of products.entries()) {
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
}

const createOptions = async () => {
  for (let object of cache.multiversions) {
    let items = Object.values(object.items);
    for (let [i,item] of items.entries()) {
      let id = item.values_id
      let name = item.values[id].name;
      let option = document.createElement("option");
      option.innerText = name;
      option.setAttribute("value", id);
      options.appendChild(option);
    }
  }
}

const priceDifference = async (e) => {
  for (let object of cache.multiversions) {
    let items = Object.values(object.items);
    for (let [i,item] of items.entries()) {
      value_id = item.values_id;
      let products = Object.values(item.products);
      for (let [o, product] of products.entries()) {
        if (value_id == e.value ) {
        data.difference = parseFloat(product.price_difference);
        if (difference === 0) {
          price.innerText = data.basePrice + ".00 zł";
        } else {
          let newPrice = data.basePrice + difference;
          price.innerText = newPrice + ".00 zł";
      }
      }
}}}}

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
      set = 2
      break;
  }
  current.classList.remove("current-set");
  current_set = color_version[set];
  current_set.classList.add("current-set");
}

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
}

createModal();


btn.addEventListener('click', (e) => {
  if (modal.classList.contains('no-visible')) {
    modal.classList.remove('no-visible');
    modal.classList.add('visible');
  }
  counter_input.value = 1;
});

counter_input.addEventListener('input', () => {
  if (counter_input.value > data.stock) {
    alert(txt.max + " " + data.stock);
    counter_input.value = data.stock;
  }
});

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
    current_set.classList.remove('current-set');
    photo_box.children[0].classList.add('current-set');
  }
});



previous_photo.addEventListener('click', (e) => {
  let current_photo = current_set.querySelector('.current-photo');
  current_photo.classList.remove('current-photo');

  current_set;
  if (current_photo.previousSibling === null) {
    current_set.lastChild.classList.add('current-photo');
  }
  current_photo.previousSibling.classList.add('current-photo');
});

next_photo.addEventListener('click', (e) => {
  let current_photo = current_set.querySelector('.current-photo');
  current_photo.classList.remove('current-photo');
  try {
    current_photo.nextSibling.classList.add('current-photo');
  } catch (error) {
    current_set.firstChild.classList.add('current-photo');
  }
});

close.onclick = () => {
  modal.classList.add('no-visible');
};
close_mobile.onclick = () => {
  modal.classList.add('no-visible');
};

window.onclick = (e) => {
  if (modal.classList.contains('visible')) {
    if (e.target == modal) {
      modal.classList.remove('visible');
      modal.classList.add('no-visible');
    }
  }
};

form.addEventListener('submit', e => {
  e.preventDefault();
  let current = document.querySelector('.active');
  modal.classList.add('no-visible');
  alert(`Twoj produkt ${data.title} w cenie ${data.basePrice-data.difference}.00 zł za sztukę w ilości ${counter_input.value} została dodana do Twojego koszyka`)
  current.classList.remove('active');
  sizeContainer.firstChild.classList.add('active');
  options[0].selected = true;
  current_set.classList.remove('current-set');
  photo_box.children[0].classList.add('current-set');
  getPrice();

});

options.addEventListener('change', (e) => {
  priceDifference(e.target);
  changeGallery(e.target);
});

increase.addEventListener('click', () => {
  checkStock();
  console.log(data.stock);
  if (counter_input.value == data.stock) {
    alert(txt.max + " " + data.stock);
    counter_input.value = data.stock;
  } else {
    counter_input.value++;
  }
});

decrease.addEventListener('click', () => {
  if (counter_input.value <= 1) {
    alert(txt.min);
  } else {
    --counter_input.value;
  }
})
