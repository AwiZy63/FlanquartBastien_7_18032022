export const tagsFactory = (data) => {
    const { type, tag } = data;
    const getTagCardDOM = () => {
        const tagCard = document.createElement('div');
        tagCard.classList.add('selected-filter');
        tagCard.classList.add(`${type}-color`);
        tagCard.textContent = tag.charAt(0).toUpperCase() + tag.slice(1);

        const removeTag = document.createElement('span');
        removeTag.classList.add('filter-remove');

        const removeTagButton = document.createElement('img');
        removeTagButton.setAttribute('src', './assets/icons/close.svg');
        removeTagButton.setAttribute('alt', 'remove tag');
        
        tagCard.appendChild(removeTag);
        removeTag.appendChild(removeTagButton);
        return tagCard;
    }
    const getTagItemDOM = () => {
        const tagItem = document.createElement('li');
        tagItem.classList.add('filter-list-content-element');
        tagItem.textContent = data

        return tagItem;
    }

    return { type, tag, getTagCardDOM, getTagItemDOM };
}