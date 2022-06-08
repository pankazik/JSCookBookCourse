import View from './View.js';
import icons from '../../img/icons.svg';
import {Fraction} from 'fractional';

class RecipeView extends View{
    _parentElement = document.querySelector('.recipe');
    _errorMessage = 'We could not find recipe with provided ID'
    _successMessage ='';
   

    addHandlerRedner(handler){
        // controlRecipies();
        const listeners = ['hashchange','load'];
        listeners.forEach(element => {
        window.addEventListener(element,handler)
        });
    }

    addHandlerUpdateServings(handler){
        this._parentElement.addEventListener('click',function(e){
            const btn = e.target.closest('.btn--tiny');
            if(!btn) return;
            const value = +btn.dataset.update;
            handler(value);
        })
    }

    addHandlerBookmark(handler){
        this._parentElement.addEventListener('click',function(e){
            const btn = e.target.closest('.btn--bookmark');
            if(!btn) return;
            handler();
        })
    }

    _generateMarkup(){

        return `
            <figure class="recipe__fig">
            <img src="https://www.google.pl/images/branding/googlelogo/2x/googlelogo_color_160x56dp.png" alt="${this._data.title}" class="recipe__img" />
            <h1 class="recipe__title">
            <span>${this._data.title}</span>
            </h1>
        </figure>
        
        <div class="recipe__details">
            <div class="recipe__info">
            <svg class="recipe__info-icon">
                <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${this._data.cookingTime}</span>
            <span class="recipe__info-text">minutes</span>
            </div>
            <div class="recipe__info">
            <svg class="recipe__info-icon">
                <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${this._data.servings}</span>
            <span class="recipe__info-text">servings</span>
        
            <div class="recipe__info-buttons">
                <button data-update="${this._data.servings-1}" class="btn--tiny btn--increase-servings">
                <svg>
                    <use href="${icons}#icon-minus-circle"></use>
                </svg>
                </button>
                <button data-update="${this._data.servings+1}" class="btn--tiny btn--increase-servings">
                <svg>
                    <use href="${icons}#icon-plus-circle"></use>
                </svg>
                </button>
            </div>
            </div>
        
            <div class="recipe__user-generated ${this._data.key ? '': 'hidden'}">
                <svg>
                    <use href="${icons}#icon-user"></use>
                </svg>
            </div>
            <button class="btn--round btn--bookmark">
            <svg class="">
                <use href="${icons}#icon-bookmark${this._data.bookmarked?'-fill':''}"></use>
            </svg>
            </button>
        </div>
        
        <div class="recipe__ingredients">
            <h2 class="heading--2">Recipe ingredients</h2>
            <ul class="recipe__ingredient-list">
        ${this._data.ingredients.map(this._generateMarkupIngredient).join('')}
        
            
            </ul>
        </div>
        
        <div class="recipe__directions">
            <h2 class="heading--2">How to cook it</h2>
            <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${this._data.publisher}</span>. Please check out
            directions at their website.
            </p>
            <a
            class="btn--small recipe__btn"
            href="${this._data.source_url}"
            target="_blank"
            >
            <span>Directions</span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
            </svg>
            </a>
        </div>`;
    }
    

    _generateMarkupIngredient(ingredient){
            return `
                <li class="recipe__ingredient">
                    <svg class="recipe__icon">
                    <use href="${icons}#icon-check"></use>
                    </svg>
                    <div class="recipe__quantity">${ingredient.quantity?new Fraction(ingredient.quantity).toString():''}</div>
                    <div class="recipe__description">
                    <span class="recipe__unit">${ingredient.unit?ingredient.unit:''}</span>
                    ${ingredient.description}
                    </div>
                </li>`
    }
}

export default new RecipeView();