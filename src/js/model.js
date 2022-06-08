import { async } from "regenerator-runtime";
import { API_URL, RES_PER_PAGE, JONAS_KEY } from "./config.js";
import { AJAX } from "./helpers.js";

export const state = {
    recipe:{},
    search:{
        query:'',
        results:[],
        resultsPerPage: RES_PER_PAGE,
        page: 1,
    },
    bookmarks:[],
};

const createRecipeObject = function(data){
    const {recipe} = data.data;
    return {
      id:recipe.id,
      title:recipe.title,
      publisher:recipe.publisher,
      sorceUrl:recipe.source_url,
      image:recipe.image_url,
      servings:recipe.servings,
      cookingTime:recipe.cooking_time,
      ingredients:recipe.ingredients,
      ...(recipe.key && {key:recipe.key}),
    }
}

export const loadRecipe = async function(id){
    try{
    const data = await AJAX(`${API_URL}/${id}?key=${JONAS_KEY}`)
    state.recipe = createRecipeObject(data);
    console.log(state.recipe);
    if(state.bookmarks.some(bookmark => bookmark.id === state.recipe.id))
    state.recipe.bookmarked=true;
    else
    state.recipe.bookmarked=false;
    
}catch(err){
    console.error(`${err}`)
    throw err;
}
}

export const loadSearchResults = async function(query){
    try{

        const {data} = await AJAX(`${API_URL}?search=${query}&key=${JONAS_KEY}`)
        state.search.results = 
            data.recipes.map(rec =>{
                return {
                    id:rec.id,
                    title:rec.title,
                    publisher:rec.publisher,
                    image:rec.image_url,
                    ...(rec.key && {key:rec.key}),
                }
            })
        state.search.query = query;
        state.search.page = 1;
        console.log(state.search);
    }catch(err){
        console.error(err);
        throw err;
    }
}

export const getSearchResultsPage = function(page = state.search.page){
    state.search.page = page;

    const start = (page-1)*state.search.resultsPerPage;
    const end = page*state.search.resultsPerPage;

    return state.search.results.slice(start,end);
}

export const updateServings = function(newServings){
    state.recipe.ingredients.forEach(ingredient =>{
        ingredient.quantity = (ingredient.quantity*newServings) / state.recipe.servings;
    })

    state.recipe.servings = newServings;
}

const persisBookmarks = function(){
    localStorage.setItem('bookmarks',JSON.stringify(state.bookmarks))
}

export const addBookmark = function(recipe){
    // add bookmark to bookmarks list
    state.bookmarks.push(recipe)

    if(recipe.id === state.recipe.id) state.recipe.bookmarked = true;

    persisBookmarks();
}

export const deleteBookmark = function(id){
    const index = state.bookmarks.findIndex(el => el.id ===id);
    state.bookmarks.splice(index,1);

    if(id === state.recipe.id) state.recipe.bookmarked = false;

    persisBookmarks();
}

const init = function(){
    const storage = localStorage.getItem('bookmarks');
    if (storage) state.bookmarks = JSON.parse(storage);
}

init();

const clearBookmarks = function(){
    localStorage.clear('bookmarks')
}

export const uploadRecipe = async function(newRecipe){
try{
const ingredients = Object.entries(newRecipe)
.filter(entry =>entry[0].startsWith('ingredient')&&entry[1]!='')
.map(ing => {
   const ingArr = ing[1].split(',').map(el => el.trim())
   if (ingArr.length != 3){
    throw new Error('Wrong ingredient format! Please use the correct format')
   }
   const[quantity,unit,description] = ingArr;
   return {quantity: quantity? +quantity: null, unit, description};
})

const recipe = {
    title: newRecipe.title,
    source_url: newRecipe.sourceUrl,
    image_url: newRecipe.image,
    publisher: newRecipe.publisher,
    cooking_time: +newRecipe.cookingTime,
    servings: +newRecipe.servings,
    ingredients,
};

const data = await AJAX(`${API_URL}?key=${JONAS_KEY}`, recipe);
state.recipe = createRecipeObject(data);
addBookmark(state.recipe);

}
catch(err){
    throw(err);
}
}
// clearBookmarks();