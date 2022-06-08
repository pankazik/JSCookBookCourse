import icons from '../../img/icons.svg';
import previewView from './previewView.js';
import View from "./View.js";

class ResultsView extends View{
    _parentElement = document.querySelector('.results');
    _errorMessage = 'No recipies found for this query. Please try again'
    _successMessage ='';

    _generateMarkup(){
      // console.log(this._data);
      return this._data.map(search => previewView.render(search,false)).join('');;
}
}

export default new ResultsView();