import { collection, addDoc, getAuth, db } from "./firebase.config.js"


const dinnerApi = async () => {
    try {
        let dinner = await fetch('https://web.langmingle.com/api/get-recipes')
        let toJson = await dinner.json()
        let recipe = toJson.recipes
        console.log(recipe);
        let dinnerRecipe = recipe.filter(item => item.course === 'dinner')
        console.log(dinnerRecipe);
        recipes = dinnerRecipe
        return recipes
    }
    catch (error) {
        console.error(error);
    }
}
// dinnerApi()
const dinner = (cards) => {
    let dinnerCard = document.getElementById('dinner-cards')
    dinnerCard.innerHTML = ''

    if (cards.length === 0) {
        dinnerCard.innerHTML = `<p>No Recipe Found</p>`
    }
    let gridContainer = document.createElement('div');
    gridContainer.classList.add('grid-container');

    cards.forEach((product) => {
        let newCard = document.createElement('div')
        newCard.classList.add('newSaladCard')
        newCard.innerHTML = `
        <div class="card position-relative">
            <img class="card-img img-fluid" src="${product.image}" alt="${product.name}">
            <span class="heart-icon position-absolute top-0 end-0 m-2" 
                data-recipe-id="${product.id}" data-user-id="CURRENT_USER_ID">
                <i class="bi bi-heart"></i>
            </span>
            <div class="card-body">
                <h3 class="card-title">${product.name}</h3>
                <p class="card-desc">${product.description || "Salads!"}</p>
                <button id="viewDetails" type="button" class="btn">
                    <a style="text-decoration: none; color: white;" href="showRecipePage.html?id=${product.id}">View Recipe</a>
                </button>
            </div>
        </div>
        `;
        newCard.querySelector('.heart-icon').addEventListener('click', function () {
            this.classList.toggle('active');
        
            const auth = getAuth();
            const user = auth.currentUser;
            if (user) {
                const userId = user.uid;
                
                // Get the complete recipe object
                const recipeToSave = {
                    id: product.id,
                    name: product.name,
                    image: product.image,
                    description: product.description
                };
                
                addToWishlist(userId, recipeToSave);
            } else {
                console.log("User not logged in");
            }
        });
        
        

        gridContainer.appendChild(newCard)
    })
    dinnerCard.appendChild(gridContainer)
}
dinnerApi().then((data) => {
    if (data) {
        dinner(data)
    }
})
// Function to Add Recipe to Wishlist
const addToWishlist = (userId, recipeId) => {
    const wishlistRef = collection(db, 'wishList');
    addDoc(wishlistRef, {
        recipId: recipeId,
        userId: userId
    }).then(() => {
        console.log("Recipe added to wishlist!");
    }).catch(error => {
        console.error('Error adding to wishlist:', error);
    });
}

// Search filter
let recipes = [];
const search = () => {
    let searchField = document.getElementById('searchField')
    let filterData = searchField.value.toLowerCase()
    let setFilterData = recipes.filter((item) => {
        console.log(recipes);
        return item.name.toLowerCase().includes(filterData)
    })
    let container = document.getElementById('noRecipe')
    if (setFilterData.length === 0) {
        container.innerHTML = `<p>No results found</p>`;
    }
    dinner(setFilterData)
}
document.getElementById('searchField')?.addEventListener('keyup', search)


