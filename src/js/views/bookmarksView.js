import icons from '../../img/icons.svg';
import previewView from './previewView.js';
import View from "./View.js";

class BookmarksView extends View{
    _parentElement = document.querySelector('.bookmarks__list');
    _errorMessage = 'No bookmarks found'
    _successMessage ='';

    _generateMarkup(){
      // console.log(this._data);
      return this._data.map(bookmark => previewView.render(bookmark,false))
      .join('');
}

addEventHandler = function(handler){
  window.addEventListener('load',handler);
}

}

export default new BookmarksView();