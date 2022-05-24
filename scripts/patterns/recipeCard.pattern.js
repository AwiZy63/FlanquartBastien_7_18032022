export const recipeCardFactory = (data) => {
    const { name, description, time, ingredients, appliance, ustensils } = data;

    const getRecipeCardDOM = () => {
        const cardContainer = document.createElement('article');
        cardContainer.classList.add('card');

        const cardHeader = document.createElement('div');
        cardHeader.classList.add('card-header');

        const cardContent = document.createElement('div');
        cardContent.classList.add('card-content');

        const cardContentTitle = document.createElement('h3');
        cardContentTitle.classList.add('card-content-title');
        cardContentTitle.textContent = name;

        const cardContentTime = document.createElement('p');
        cardContentTime.classList.add('card-content-time');
        cardContentTime.textContent = `${time} min`;

        const cardContentIngredients = document.createElement('div');
        cardContentIngredients.classList.add('card-content-ingredients');


        const cardContentRecipe = document.createElement('p');
        cardContentRecipe.classList.add('card-content-recipe');
        cardContentRecipe.textContent = description;

        cardContainer.appendChild(cardHeader);
        cardContainer.appendChild(cardContent);
        cardContent.appendChild(cardContentTitle);
        cardContent.appendChild(cardContentTime);
        cardContent.appendChild(cardContentIngredients);


        ingredients.forEach((ingredientData) => {
            const { ingredient, quantity, unit } = ingredientData;

            const cardContentIngredient = document.createElement('p');
            cardContentIngredient.classList.add('card-content-ingredient')
            cardContentIngredient.innerHTML = `<b>${ingredient}: </b>${quantity ? quantity : 1} ${unit ? unit === "grammes" ? "g" : unit.includes("cuillère") ? "cuillères" : "" : ""}`;
            cardContentIngredients.appendChild(cardContentIngredient);
        });


        cardContent.appendChild(cardContentRecipe);

        return cardContainer;
    }

    return { name, description, time, ingredients, appliance, ustensils, getRecipeCardDOM };
}