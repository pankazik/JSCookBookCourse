import View from "./View.js";
class SearchView extends View{
    _parentElement = document.querySelector('.search');

    getQuery(){
        const input = this._parentElement.querySelector(`.search__field`).value;
        this._clearInput();
        return input;
        
    }

    addHandlerRedner(handler){
        this._parentElement.addEventListener('submit',function(event){
            event.preventDefault();
            handler();
        })
    }

    _clearInput(){
        this._parentElement.querySelector(`.search__field`).value = null;
    }
}
export default new SearchView