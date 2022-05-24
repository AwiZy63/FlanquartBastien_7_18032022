import { recipes } from '../data/recipes.js';
import { modernFilteredRecipes, oldFilteredRecipes } from './algorithmes/algorithmes.js';
import { recipeCardFactory } from './patterns/recipeCard.pattern.js';
import { tagsFactory } from './patterns/tagCard.pattern.js';

let ingredients = [];
let appliances = [];
let ustensils = [];

const selectedTags = [];
let updatedRecipes = [];
let filteredRecipes = [...new Set(recipes)];

const fetchData = async () => {
    const types = ["ingredients", "appliance", "ustensils"];

    types.forEach((type) => {
        let list = [];
        filteredRecipes.forEach((recipe) => {
            if (recipe[type] && type === "ingredients") {
                recipe[type].forEach((ingredient) => {
                    list.push(ingredient.ingredient.toLowerCase());
                })
            }
            if (recipe[type] && type === "appliance") {
                list.push(recipe[type].toLowerCase());
            }
            if (recipe[type] && type === "ustensils") {
                recipe[type].forEach((ustensil) => {
                    list.push(ustensil.toLowerCase());
                });
            }
        });

        type === "ingredients" ? ingredients = [... new Set(list)] : type === "appliance" ? appliances = [... new Set(list)] : type === "ustensils" ? ustensils = [... new Set(list)] : console.error("Error fetching data.")
    });
}

const recipeCardsSection = document.getElementById('recipeCardsSection');

const displayRecipeCards = async (filter) => {
    recipeCardsSection.innerHTML = '';

    if (!filter || (filter && filter.length === 0)) {
        filteredRecipes = [...new Set(recipes)];
        return filteredRecipes.forEach((recipe) => {
            const recipeCardModel = recipeCardFactory(recipe);
            const recipeCardDOM = recipeCardModel.getRecipeCardDOM();
            recipeCardsSection.appendChild(recipeCardDOM);
        });
    }
    if (filter && filter.length > 0) {
        return filter.forEach((recipe) => {
            const recipeCardModel = recipeCardFactory(recipe);
            const recipeCardDOM = recipeCardModel.getRecipeCardDOM();
            recipeCardsSection.appendChild(recipeCardDOM);
        });
    }

}

const searchInput = document.getElementById('searchRecipe');
const searchRecipeCards = async () => {
    const notFound = document.createElement('p');
    notFound.classList.add('not-found');
    notFound.textContent = 'Aucune recette ne correspond à votre critère... vous pouvez chercher « tarte aux pommes », « poisson », etc.'

    searchInput.addEventListener('keyup', async () => {
        const value = searchInput.value;
        recipeCardsSection.classList.remove('empty');
        recipeCardsSection.innerHTML = '';
        await fetchData();

        if (value.length > 2) {
            console.log(ingredients)
        
            displayTags();
            
            filteredRecipes = await modernFilteredRecipes(recipes, value);
            // filteredRecipes = await oldFilteredRecipes(recipes, value);

            if (filteredRecipes.length > 0) {
                if (updatedRecipes && updatedRecipes.length > 0) {
                    displayRecipeCards(updatedRecipes);
                } else {
                    displayRecipeCards(filteredRecipes);
                }
            } else if (value && filteredRecipes.length <= 0) {
                recipeCardsSection.classList.add('empty');
                recipeCardsSection.appendChild(notFound);
            }
        } else {
            displayRecipeCards();
        }
    })
}

/* Tags */
const displayTags = async () => {

    const ingredientsTags = document.getElementById('ingredientsTags');
    const ingredientsTagsList = document.getElementById('ingredientsTagsList');
    const ingredientInput = document.getElementById('ingredientInput');
    const selectedTagsSection = document.querySelector('.search-section-filters-selected-filters');

    const ingredientArrow = document.getElementById('ingredientsArrow').childNodes[0];
    const applianceArrow = document.getElementById('appliancesArrow').childNodes[0];
    const ustensilArrow = document.getElementById('ustensilsArrow').childNodes[0];

    const appliancesTags = document.getElementById('appliancesTags');
    const appliancesTagsList = document.getElementById('appliancesTagsList');
    const applianceInput = document.getElementById('applianceInput');

    const ustensilsTags = document.getElementById('ustensilsTags');
    const ustensilsTagsList = document.getElementById('ustensilsTagsList');
    const ustensilInput = document.getElementById('ustensilInput');

    const tempIngredients = ingredients;
    const tempAppliances = appliances;
    const tempUstensils = ustensils;

    const updateTagsList = ({ filter, type }) => {
        if (type === 'ingredients') {
            ingredientsTagsList.innerHTML = '';
            if (!filter) {
                return tempIngredients.forEach((ingredient) => {
                    const ingredientsTagsItem = tagsFactory(ingredient);
                    const ingredientsTagsDOM = ingredientsTagsItem.getTagItemDOM();
                    ingredientsTagsList.appendChild(ingredientsTagsDOM);
                });
            }

            return filter.forEach((ingredient) => {
                const ingredientsTagsItem = tagsFactory(ingredient);
                const ingredientsTagsDOM = ingredientsTagsItem.getTagItemDOM();
                ingredientsTagsList.appendChild(ingredientsTagsDOM);
            });
        } else if (type === 'appliances') {
            appliancesTagsList.innerHTML = '';
            if (!filter) {
                return tempAppliances.forEach((appliance) => {
                    const appliancesTagsItem = tagsFactory(appliance);
                    const appliancesTagsDOM = appliancesTagsItem.getTagItemDOM();
                    appliancesTagsList.appendChild(appliancesTagsDOM);
                });
            }
            return filter.forEach((appliance) => {
                const appliancesTagsItem = tagsFactory(appliance);
                const appliancesTagsDOM = appliancesTagsItem.getTagItemDOM();
                appliancesTagsList.appendChild(appliancesTagsDOM);
            });
        } else if (type === 'ustensils') {
            ustensilsTagsList.innerHTML = '';
            if (!filter) {
                return tempUstensils.forEach((ustensil) => {
                    const ustensilsTagsItem = tagsFactory(ustensil);
                    const ustensilsTagsDOM = ustensilsTagsItem.getTagItemDOM();
                    ustensilsTagsList.appendChild(ustensilsTagsDOM);
                });
            }
            return filter.forEach((ustensil) => {
                const ustensilsTagsItem = tagsFactory(ustensil);
                const ustensilsTagsDOM = ustensilsTagsItem.getTagItemDOM();
                ustensilsTagsList.appendChild(ustensilsTagsDOM);
            });
        }
    }

    const updateSelectedTags = (tags) => {
        selectedTagsSection.innerHTML = '';
        fetchData()
        ///////////////////////
        updatedRecipes = filteredRecipes.filter(
            (recipe) =>
                selectedTags.some(
                    (filter) =>
                        recipe.name.toLowerCase().includes(filter.tag.toLowerCase()) ||
                        recipe.description.toLowerCase().includes(filter.tag.toLowerCase())
                ) ||
                recipe.ingredients.some((ingredient) =>
                    selectedTags.some((filter) =>
                        ingredient.ingredient.toLowerCase().includes(filter.tag.toLowerCase())
                    )
                )
        );

        if (updatedRecipes.length !== 0) {
             displayRecipeCards(updatedRecipes);
        } else if (!tags || tags.length <= 0) {
            displayRecipeCards(filteredRecipes);
        }

        ///////////////////////
        tags.forEach((tag) => {
            const data = {
                tag: tag.tag,
                type: tag.type
            }

            const tagsCard = tagsFactory(data);
            const tagsCardDOM = tagsCard.getTagCardDOM();
            selectedTagsSection.appendChild(tagsCardDOM);
        });
    }

    selectedTagsSection.addEventListener('click', (event) => {
        const element = event.target;
        if (element.tagName === 'IMG') {
            const tagName = element.parentNode.parentNode.textContent;
            if (tagName) {
                const index = selectedTags.findIndex((element) => element.tag.toLowerCase() === tagName.toLowerCase());

                if (selectedTags[index].type && selectedTags[index].type === 'ingredients') {
                    tempIngredients.push(tagName);
                } else if (selectedTags[index].type && selectedTags[index].type === 'appliances') {
                    tempAppliances.push(tagName);
                } else if (selectedTags[index].type && selectedTags[index].type === 'ustensils') {
                    tempUstensils.push(tagName);
                }
                updateTagsList({ type: selectedTags[index].type ? selectedTags[index].type : 'ingredients' });
                selectedTags.splice(index, 1);
                updateSelectedTags(selectedTags);
            }
        }
    });

    ingredientInput.addEventListener('input', (event) => {
        const value = event.target.value;

        value.length > 0 ? (
            appliancesTagsList.style.display = 'none',
            ustensilsTagsList.style.display = 'none',
            ingredientsTagsList.style.display = 'grid',

            applianceArrow.style.transform = 'rotate(0deg)',
            ustensilArrow.style.transform = 'rotate(0deg)',
            ingredientArrow.style.transform = 'rotate(180deg)',

            applianceInput.style.width = '170px',
            ustensilInput.style.width = '170px',
            ingredientInput.style.width = '635px',

            applianceInput.style.borderRadius = '5px',
            ustensilInput.style.borderRadius = '5px',
            ingredientInput.style.borderRadius = '5px 5px 0 0') : (ingredientsTagsList.style.display = 'none', ingredientArrow.style.transform = 'rotate(0)', ingredientInput.style.width = '170px', ingredientInput.style.borderRadius = '5px');

        const filteredIngredients = tempIngredients.filter((ingredient) => ingredient.toLowerCase().includes(value.toLowerCase()))
        updateTagsList({ filter: filteredIngredients, type: 'ingredients' });
    });

    ingredientsTags.addEventListener('click', (event) => {
        ingredientInput.value = '';
        if (event.target.parentNode && event.target.parentNode.id === 'ingredientsArrow') {
            ingredientsTagsList.style.display === 'none' || !ingredientsTagsList.style.display ? (
                appliancesTagsList.style.display = 'none',
                ustensilsTagsList.style.display = 'none',
                ingredientsTagsList.style.display = 'grid',

                applianceArrow.style.transform = 'rotate(0deg)',
                ustensilArrow.style.transform = 'rotate(0deg)',
                ingredientArrow.style.transform = 'rotate(180deg)',

                applianceInput.style.width = '170px',
                ustensilInput.style.width = '170px',
                ingredientInput.style.width = '635px',

                applianceInput.style.borderRadius = '5px',
                ustensilInput.style.borderRadius = '5px',
                ingredientInput.style.borderRadius = '5px 5px 0 0') : (ingredientsTagsList.style.display = 'none', ingredientArrow.style.transform = 'rotate(0)', ingredientInput.style.width = '170px', ingredientInput.style.borderRadius = '5px');

        }
        updateTagsList({ type: 'ingredients' });
    });

    ingredientsTagsList.addEventListener('click', (event) => {
        const element = event.target;
        if (element.tagName === 'LI') {
            const index = tempIngredients.indexOf(element.textContent, 0);
            selectedTags.push({ tag: element.textContent, type: 'ingredients' });

            /* Filtrer */

            console.log(searchInput.value)
            console.log(filteredRecipes)
            console.log(element.textContent);

            /***********/

            tempIngredients.splice(index, 1);
            updateTagsList({ type: 'ingredients' });
            updateSelectedTags(selectedTags);
        }
    });

    /* Appliances */
    applianceInput.addEventListener('input', (event) => {
        const value = event.target.value;

        value.length > 0 ? (appliancesTagsList.style.display = 'grid',
            ustensilsTagsList.style.display = 'none',
            ingredientsTagsList.style.display = 'none',

            applianceArrow.style.transform = 'rotate(180deg)',
            ustensilArrow.style.transform = 'rotate(0deg)',
            ingredientArrow.style.transform = 'rotate(0deg)',

            applianceInput.style.width = '635px',
            ustensilInput.style.width = '170px',
            ingredientInput.style.width = '170px',

            applianceInput.style.borderRadius = '5px 5px 0 0',
            ustensilInput.style.borderRadius = '5px',
            ingredientInput.style.borderRadius = '5px') : (appliancesTagsList.style.display = 'none', applianceArrow.style.transform = 'rotate(0)', applianceInput.style.width = '170px', applianceInput.style.borderRadius = '5px');

        const filteredAppliances = tempAppliances.filter((appliance) => appliance.toLowerCase().includes(value.toLowerCase()))
        updateTagsList({ filter: filteredAppliances, type: 'appliances' });
    });

    appliancesTags.addEventListener('click', (event) => {
        applianceInput.value = '';
        if (event.target.parentNode && event.target.parentNode.id === 'appliancesArrow') {
            appliancesTagsList.style.display === 'none' || !appliancesTagsList.style.display ? (appliancesTagsList.style.display = 'grid',
                ustensilsTagsList.style.display = 'none',
                ingredientsTagsList.style.display = 'none',

                applianceArrow.style.transform = 'rotate(180deg)',
                ustensilArrow.style.transform = 'rotate(0deg)',
                ingredientArrow.style.transform = 'rotate(0deg)',

                applianceInput.style.width = '635px',
                ustensilInput.style.width = '170px',
                ingredientInput.style.width = '170px',

                applianceInput.style.borderRadius = '5px 5px 0 0',
                ustensilInput.style.borderRadius = '5px',
                ingredientInput.style.borderRadius = '5px') : (appliancesTagsList.style.display = 'none', applianceArrow.style.transform = 'rotate(0)', applianceInput.style.width = '170px', applianceInput.style.borderRadius = '5px');
        }
        updateTagsList({ type: 'appliances' });
    });

    appliancesTagsList.addEventListener('click', (event) => {
        const element = event.target;
        if (element.tagName === 'LI') {
            const index = tempAppliances.indexOf(element.textContent, 0);
            selectedTags.push({ tag: element.textContent, type: 'appliances' });
            tempAppliances.splice(index, 1);
            updateTagsList({ type: 'appliances' });
            updateSelectedTags(selectedTags);
        }
    });

    /* Ustensils */
    ustensilInput.addEventListener('input', (event) => {
        const value = event.target.value;

        value.length > 0 ? (
            appliancesTagsList.style.display = 'none',
            ustensilsTagsList.style.display = 'grid',
            ingredientsTagsList.style.display = 'none',

            applianceArrow.style.transform = 'rotate(0deg)',
            ustensilArrow.style.transform = 'rotate(180deg)',
            ingredientArrow.style.transform = 'rotate(0deg)',

            applianceInput.style.width = '170px',
            ustensilInput.style.width = '635px',
            ingredientInput.style.width = '170px',

            applianceInput.style.borderRadius = '5px',
            ustensilInput.style.borderRadius = '5px 5px 0 0',
            ingredientInput.style.borderRadius = '5px') : (ustensilsTagsList.style.display = 'none', ustensilArrow.style.transform = 'rotate(0)', ustensilInput.style.width = '170px', ustensilInput.style.borderRadius = '5px');

        const filteredUstensils = tempUstensils.filter((ustensil) => ustensil.toLowerCase().includes(value.toLowerCase()))
        updateTagsList({ filter: filteredUstensils, type: 'ustensils' });
    });

    ustensilsTags.addEventListener('click', (event) => {
        ustensilInput.value = '';
        if (event.target.parentNode && event.target.parentNode.id === 'ustensilsArrow') {
            ustensilsTagsList.style.display === 'none' || !ustensilsTagsList.style.display ? (
                appliancesTagsList.style.display = 'none',
                ustensilsTagsList.style.display = 'grid',
                ingredientsTagsList.style.display = 'none',

                applianceArrow.style.transform = 'rotate(0deg)',
                ustensilArrow.style.transform = 'rotate(180deg)',
                ingredientArrow.style.transform = 'rotate(0deg)',

                applianceInput.style.width = '170px',
                ustensilInput.style.width = '635px',
                ingredientInput.style.width = '170px',

                applianceInput.style.borderRadius = '5px',
                ustensilInput.style.borderRadius = '5px 5px 0 0',
                ingredientInput.style.borderRadius = '5px') : (ustensilsTagsList.style.display = 'none', ustensilArrow.style.transform = 'rotate(0)', ustensilInput.style.width = '170px', ustensilInput.style.borderRadius = '5px');
        }
        updateTagsList({ type: 'ustensils' });
    });

    ustensilsTagsList.addEventListener('click', (event) => {
        const element = event.target;
        if (element.tagName === 'LI') {
            const index = tempUstensils.indexOf(element.textContent, 0);
            selectedTags.push({ tag: element.textContent, type: 'ustensils' });
            tempUstensils.splice(index, 1);
            updateTagsList({ type: 'ustensils' });
            updateSelectedTags(selectedTags);
        }
    });
}

const init = async () => {

    await fetchData();

    await displayTags();

    // console.log([ingredients, appliances, ustensils]);
    await displayRecipeCards();
    searchRecipeCards();
}

/* Creating a function called init() and then calling it. */
init();