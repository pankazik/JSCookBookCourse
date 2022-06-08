import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime'
const { request } = require("http");

if(module.hot){
  module.hot.accept();
}

const controlRecipies = async function(){
  try{
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    resultsView.update(model.getSearchResultsPage())
    

    // loading recipe
    await model.loadRecipe(id);

    //rendering recipe

    recipeView.render(model.state.recipe);

    bookmarksView.update(model.state.bookmarks)

  }catch(err){
    console.log(err);
    recipeView.renderError();
  }
}

const controlSearchResults = async function(){
  try{

    // get search query
    const query = searchView.getQuery();
    if(!query) return;
    resultsView.renderSpinner();

    // load search results
    await model.loadSearchResults(query);
    
    // render results
  resultsView.render(model.getSearchResultsPage());

  //render pagination buttons
  paginationView.render(model.state.search)

  }catch(err){
    console.error(err);
  }
}

const controlPagination = function(goToPage){
  resultsView.render(model.getSearchResultsPage(goToPage));
  paginationView.render(model.state.search)
}

const controlServings = function (newServings) {
  
  if(model.state.recipe.servings<=1 && newServings<1) return;
  model.updateServings(newServings);

  //update recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
}

const controlAddBookmark = function(){
  //Add or remove bookmark
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  // update view
  recipeView.update(model.state.recipe);
  //render bookmarks
  bookmarksView.render(model.state.bookmarks);
}

const controlBookamrks = function(){
  bookmarksView.render(model.state.bookmarks)
}

const controlAddRecipe = async function(newRecipe){
  try{

    //renderspinner
  addRecipeView.renderSpinner();

    //upload new recipe data
  await model.uploadRecipe(newRecipe)
  console.log(model.state.recipe);

  //render recipe
  recipeView.render(model.state.recipe)

  //render bookmarks
  bookmarksView.render(model.state.bookmarks)

  //change id in the url
    window.history.pushState(null,'',`#${model.state.recipe.id}`)
  
  //close form
  addRecipeView.renderMessage();
  addRecipeView.toggleWindow();
  }
  catch(err){
    console.error(err);
    addRecipeView.renderError(err.message)
  }
}

  
const init = function(){
  bookmarksView.addEventHandler(controlBookamrks);
  recipeView.addHandlerRedner(controlRecipies);
  searchView.addHandlerRedner(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  addRecipeView.addHandlerUpload(controlAddRecipe);
}
init();
