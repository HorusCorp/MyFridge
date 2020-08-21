const foodDiv = document.querySelector(".food");
const url = "http://localhost:1337";
let allFood = [];

const addfoodForm = document.forms.addfood;
const foodTitle = addfoodForm.foodtitle;
const expirationDate = addfoodForm.expirationdate;

addfoodForm.addEventListener("submit", addFood);

init();

function init() {
    getFood();
}

function getFood() {
    fetch(`${url}/fooditems?_sort=Expirationdate:ASC`)
    .then(data => data.json())
    .then(result => {
        allFood = result;
        console.log("allFood", allFood);
        renderFood(allFood);
    })
    .catch((err) => {
        console.error(err);
    })
}


function convertInFrenchDateString(dateString) {
     const dateFragments = dateString.split("-");
     return `${dateFragments[2]}/${dateFragments[1]}/${dateFragments[0]}`   
}

function renderFood(food) {
    let list = [];
    food.forEach(f => {
        const dateFr = convertInFrenchDateString(f.expirationdate)
        const item = `<li id="${f.id}">
            <div class="first-col">${f.title}</div>
            <div class="second-col">${dateFr}</div>
            <button class="btn-delete">x</button>
        </li>`;
        list = [...list, item ]
    });
    console.log(list)
    foodDiv.innerHTML = `<ul>${list.join("")}</ul>`;
}

function addFood(e) {
    e.preventDefault();
// Ici le trim() va permettre de gerer les espaces dans les inputs
    const title = foodTitle.value.trim();
    const date = expirationDate.value;
    console.log(title, date)
// On créer le payload qui sera envoyé à Strapi   
    const payload = {
        title: title,
        expirationdate: date,
        catgory: 'default'
    }
// Requete pour envoyer les infos du formulaire d'ajout en database
    fetch(`${url}/fooditems`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
    }).then(response => {
        console.log(response);
        foodTitle.value = "";
        expirationDate.value = "";
//Met a jour la liste en dynamique
        getFood();
    })
}

// Suprimer un element de la liste
foodDiv.addEventListener("click", deleteFoodItem)

function deleteFoodItem (e) {
    if(e.target.nodeName.toLowerCase() !== "button") {
        return;
    }
    const foodItemId = e.target.parentNode.id;
    console.log(foodItemId);
    fetch(`${url}/fooditems/${foodItemId}`, {
        method: "DELETE"
    }).then(res => {
        console.log(res.json())
        getFood();
    })
}