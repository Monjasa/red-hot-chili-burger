const upperBunUrl = 'https://s3.eu-central-1.amazonaws.com/monjasa.org/org/monjasa/images/upper-bun.png';
const bottomBunUrl = 'https://s3.eu-central-1.amazonaws.com/monjasa.org/org/monjasa/images/bottom-bun.png';
const pattyUrl = 'https://s3.eu-central-1.amazonaws.com/monjasa.org/org/monjasa/images/patty.png';
const veggiePattyUrl = 'https://s3.eu-central-1.amazonaws.com/monjasa.org/org/monjasa/images/veggie-patty.png';
const cheeseUrl = 'https://s3.eu-central-1.amazonaws.com/monjasa.org/org/monjasa/images/cheese.png';
const lettuceUrl = 'https://s3.eu-central-1.amazonaws.com/monjasa.org/org/monjasa/images/lettuce.png';
const onionUrl = 'https://s3.eu-central-1.amazonaws.com/monjasa.org/org/monjasa/images/onion.png';
const tomatoUrl = 'https://s3.eu-central-1.amazonaws.com/monjasa.org/org/monjasa/images/tomato.png';

const layers = document.querySelector('.layers');
const priceTable = document.querySelector('.price-table-div');

const vegetarianToggle = document.getElementById('vegetarian');
const garnishContainer = document.querySelector('.garnish-div');

const upperBun = getLayerFromUrl(upperBunUrl, false);
const bottomBun = getLayerFromUrl(bottomBunUrl, false);

class Ingredient {

    constructor(ingredientUrl, ingredientClassName, price, layer, tableRow) {
        this.ingredientUrl = ingredientUrl;
        this.ingredientClassName = ingredientClassName;
        this.price = price;
        this.count = 0;
        this.layer = layer;
        this.tableRow = tableRow;
        this.addButton = tableRow.querySelector('.moreButton');
        this.removeButton = tableRow.querySelector('.lessButton');
    }

    sayHi() {
        alert(this.ingredientClassName);
    }

    removeIngredient() {
        this.count--;
        this.layer.removeChild(this.layer.firstChild);

        if (this.addButton.disabled) activateButton(this.addButton);
        if (this.count == 0) disactivateButton(this.removeButton);
    }

    buildIngredient(isDeletable) {

        this.count++;
        if (this.removeButton.disabled) activateButton(this.removeButton);

        if (this.count == 9) disactivateButton(this.addButton);

        let ingredientDiv = getLayerFromUrl(this.ingredientUrl, isDeletable);
        ingredientDiv.classList.add(this.ingredientClassName);
        return ingredientDiv;
    }

    setIngredientUrl(newUrl) {
        this.ingredientUrl = newUrl;
    }

    getIngredientUrl() {
        return this.ingredientUrl;
    }

    getIngredientClassName() {
        return this.ingredientClassName;
    }

    getPrice() {
        return this.price;
    }

    getCount() {
        return this.count;
    }

    getLayer() {
        return this.layer;
    }

    getTableRow() {
        return this.tableRow;
    }

    getAddButton() {
        return this.addButton;
    }
    
    getRemoveButton() {
        return this.removeButton;
    }

}

const patty = new Ingredient(pattyUrl, "patty-ingredient", 1.00, document.getElementById('patties-layer'),
    document.getElementById('patty-table-row'));

const cheese = new Ingredient(cheeseUrl, "cheese-ingredient", 0.50, document.getElementById('cheese-layer'), 
    document.getElementById('cheese-table-row'));

const lettuce = new Ingredient(lettuceUrl, "lettuce-ingredient", 0.30, document.getElementById('lettuce-layer'),
    document.getElementById('lettuce-table-row'));

const onion = new Ingredient(onionUrl, "onion-ingredient", 0.30, document.getElementById('onion-layer'),
    document.getElementById('onion-table-row'));

const tomato = new Ingredient(tomatoUrl, "tomato-ingredient", 0.30, document.getElementById('tomato-layer'),
    document.getElementById('tomato-table-row'));

const ingredientClassesMap = new Map();
ingredientClassesMap.set(patty.getIngredientClassName(), patty);
ingredientClassesMap.set(cheese.getIngredientClassName(), cheese);
ingredientClassesMap.set(lettuce.getIngredientClassName(), lettuce);
ingredientClassesMap.set(onion.getIngredientClassName(), onion);
ingredientClassesMap.set(tomato.getIngredientClassName(), tomato);

const ingredients = [patty, cheese, lettuce, onion, tomato];

function removeLayer(layerToRemove) {
    ingredientClassesMap.get(layerToRemove.className).removeIngredient();
    updateTable();
}

function activateButton(button) {
    button.disabled = false;
    button.style.backgroundColor = '#231f20';
    button.style.color = '#c5921a';
    button.style.cursor = 'pointer';
}

function disactivateButton(button) {
    button.disabled = true;
    button.style.backgroundColor = '#332e30';
    button.style.color = '#786740';
    button.style.cursor = 'default';
}

function setupPrices() {

    ingredients.forEach(ingredient => {
        ingredient.getTableRow().querySelector('.piece-price').innerHTML = '$' + Number.parseFloat(ingredient.getPrice()).toFixed(2);
    });
}

function calculatePrice() {

    let price = 1.00;
    ingredients.forEach(ingredient => price += ingredient.getCount() * ingredient.getPrice());

    document.querySelector('.total-price').innerHTML = '$' + Number.parseFloat(price).toFixed(2);
}

window.onresize = updatePosition;

window.onload = function() {

    setupSelection();
    updatePosition();
    setupPrices();

    document.addEventListener('click', closeAllSelect);
    document.getElementById('options').onchange = displayOptions;
    document.querySelector('.order').onclick = takeOrder;

    setupButtonInteractions();
    ingredients.forEach(ingredient => disactivateButton(ingredient.getRemoveButton()));
    
    paintOnCanvas();
    setupStartBurger();
}

function getLayerFromUrl(imageUrl, isDeletable) {

    let imgDiv = document.createElement('div');
    imgDiv.style.borderRadius = '50%';

    let img = document.createElement('img');
    
    img.src = imageUrl;
    img.height = '50';
    img.width = '50';
    img.ondragstart = function() { return false; }

    if (isDeletable) imgDiv.onclick = function(e) {
        removeLayer(this);
    };
    
    imgDiv.style.height = '60px';
    imgDiv.style.width = '60px';
    imgDiv.style.display = 'grid';
    imgDiv.style.justifyItems = 'center';
    imgDiv.style.alignItems = 'center';

    imgDiv.style.opacity = '0';
    imgDiv.style.transition = 'opacity 0.25s ease';

    imgDiv.appendChild(img);

    return imgDiv;
}

function updateTable() {

    ingredients.forEach(ingredient => {
        let tableRow = ingredient.getTableRow();
        let ingredientCount = ingredient.getCount();

        tableRow.querySelector('.ingredient-count').innerHTML = ingredientCount > 0 ? ingredientCount : '-';
        tableRow.querySelector('.layer-price').innerHTML = ingredientCount > 0 ? 
            '$' + Number.parseFloat(ingredientCount * ingredient.getPrice()).toFixed(2) : '-';
    })

    calculatePrice();
}

function addIngredient(layerToAdd) {

    ingredientClassesMap.get(layerToAdd.className).getLayer().appendChild(layerToAdd);
    window.getComputedStyle(layerToAdd).opacity;
    layerToAdd.style.opacity = '1';

    updateTable();
}

function setupButtonInteractions() {
    ingredients.forEach(ingredient => {
        ingredient.getAddButton().onclick = function() { addIngredient(ingredient.buildIngredient(true)); }
        ingredient.getRemoveButton().onclick = function() { removeLayer(ingredient.getLayer().firstChild); }
    })
}

function setupStartBurger() {

    layers.insertBefore(upperBun, lettuce.getLayer());
    window.getComputedStyle(upperBun).opacity;
    upperBun.style.opacity = '1';

    layers.appendChild(bottomBun);
    window.getComputedStyle(bottomBun).opacity;
    bottomBun.style.opacity = '1';

    addIngredient(patty.buildIngredient(true));
    addIngredient(cheese.buildIngredient(true));
    addIngredient(tomato.buildIngredient(true));
    addIngredient(cheese.buildIngredient(true));
    addIngredient(lettuce.buildIngredient(true));
}

const vegetarianIconsArray = Array.from(document.querySelector('.burger-header').getElementsByClassName('vegetarian-icon'));

vegetarianToggle.addEventListener('change', (event) => {
    if (event.target.checked) {
        patty.setIngredientUrl(veggiePattyUrl);
        replacePatties(veggiePattyUrl);
        vegetarianIconsArray.forEach(icon => icon.style.opacity = '1');
    } else {
        patty.setIngredientUrl(pattyUrl);
        replacePatties(pattyUrl);
        vegetarianIconsArray.forEach(icon => icon.style.opacity = '0');
    }
})

function replacePatties(pattyToInsertUrl) {
    let children = patty.getLayer().children;
    Array.from(children).forEach(element => element.querySelector('img').src = pattyToInsertUrl);
}

function updatePosition() {
    let burgerDiv = document.querySelector('.burger');

    if (matchMedia("(max-width: 768px)").matches) {
        document.querySelector('.burger-form').insertBefore(burgerDiv, document.querySelector('.order'));
    } else {
        document.querySelector('.main').appendChild(burgerDiv);
    }
}

let isSelectOpened = false;

function setupSelection() {

    let garnishSelection = garnishContainer.getElementsByTagName('select')[0];

    let selectedOption = document.createElement('div');
    selectedOption.setAttribute('class', "select-selected");
    selectedOption.innerHTML = garnishSelection.options[garnishSelection.selectedIndex].innerHTML;

    garnishContainer.appendChild(selectedOption);

    let optionList = document.createElement('div');
    optionList.setAttribute('class', "select-items select-hide");

    optionList.style.borderBottomLeftRadius = '1em';
    optionList.style.borderBottomRightRadius = '1em';

    for (i = 1; i < garnishSelection.length; i++) {

        let option = document.createElement('div');
        option.innerHTML = garnishSelection.options[i].innerHTML;

        option.addEventListener('click', function(e) {
            
            let garnishSelection = this.parentNode.parentNode.getElementsByTagName('select')[0];
            let previousOption = this.parentNode.previousSibling;

            for (j = 0; j < garnishSelection.length; j++) {

                if (garnishSelection.options[j].innerHTML == this.innerHTML) {

                    garnishSelection.selectedIndex = j;
                    previousOption.innerHTML = this.innerHTML;
                    let options = this.parentNode.getElementsByClassName('same-as-selected');

                    for (k = 0; k < options.length; k++) {
                        options[k].removeAttribute('class');
                    }

                    this.setAttribute('class', "same-as-selected");
                    break;
                }
            }
            previousOption.click();
        });

        optionList.appendChild(option);
    }

    garnishContainer.appendChild(optionList);

    selectedOption.addEventListener("click", function(e) {
        e.stopPropagation();
        this.nextSibling.classList.toggle("select-hide");
        this.classList.toggle("select-arrow-active");

        if (isSelectOpened) {
            this.style.borderBottomLeftRadius = '1em';
            this.style.borderBottomRightRadius = '1em';
            isSelectOpened = false;
        } else {
            this.style.borderBottomLeftRadius = '0';
            this.style.borderBottomRightRadius = '0';
            isSelectOpened = true;
        }
    });
}

function closeAllSelect(element) {
  
  let array = [];
  let selectedItems = document.getElementsByClassName("select-items");
  let selectedOptions = document.getElementsByClassName("select-selected");

  for (i = 0; i < selectedOptions.length; i++) {
    if (element == selectedOptions[i]) {
        array.push(i)
    } else {
        selectedOptions[i].classList.remove("select-arrow-active");
    }

    selectedOptions[i].style.borderBottomLeftRadius = '1em';
    selectedOptions[i].style.borderBottomRightRadius = '1em';
    isSelectOpened = false;
  }

  for (i = 0; i < selectedItems.length; i++) {
    if (array.indexOf(i)) {
        selectedItems[i].classList.add("select-hide");
    }
  }
}

function displayOptions() {
    if (document.getElementById('options').checked) {
        document.querySelector('.options-textarea textarea').style.display = 'block';
    } else {
        document.querySelector('.options-textarea textarea').style.display = 'none';
    }
}

function takeOrder(event) {

    let sauceValue = document.forms["order"]["sauce"].value;
    if (sauceValue = null || sauceValue == "") {
        alert('You should choose sauce at first!');
        event.preventDefault();
        return false;
    }

    let garnishValue = document.forms["order"]["garnish"].value;
    if (garnishValue = null || garnishValue == "") {
        alert('Please, choose your garnish.');
        event.preventDefault();
        return false;
    }
}

function paintOnCanvas() {
    
    let canvas = document.querySelector(".canvas");
    let context = canvas.getContext("2d");

    let gradient = context.createRadialGradient(75, 50, 5, 90, 60, 100);
    gradient.addColorStop(0, "#231f20");
    gradient.addColorStop(1, "#c5921a");

    context.fillStyle = gradient;
    context.fillRect(0, 0, 200, 100);

    context.font = "30px Cambria";
    context.strokeText("Red Hot Chili", 10, 50);

    context.beginPath();
    context.arc(95, 50, 40, 0, Math.PI);
    context.stroke();
}

document.querySelector('.copy-span').onclick = () => {

    if (document.querySelector('.diagram').style.display == 'block') 
        document.querySelector('.diagram').style.display = 'none';
    else 
        document.querySelector('.diagram').style.display = 'block';

    if (document.querySelector('.canvas').style.display == 'block') 
        document.querySelector('.canvas').style.display = 'none';
    else 
        document.querySelector('.canvas').style.display = 'block';
}