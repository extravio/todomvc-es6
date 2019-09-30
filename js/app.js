import model from './model.js';

class App {

	constructor(elementId) {
		this.element = document.getElementById(elementId);
	}

	setModel(model) {
		this.model = model;
	}

	render() {
		//<!-- These are here just to show the structure of the list items -->
		//<!-- List items should get the class 'editing' when editing and 'completed' when marked as completed -->

		let html = '<ul class="todo-list">';
		html = this.model.reduce((acc, cur) => {
			return acc + `<li class="${cur.completed ? 'completed' : ''}">
							<div class="view">
								<input class="toggle" type="checkbox" ${cur.completed ? 'checked' : ''}>
								<label>${cur.task}</label>
								<button class="destroy"></button>
							</div>
							<input class="edit" value="${cur.task}">
						</li>`
		}, html);
		html += '</ul>';

		this.element.innerHTML = html;
	}
}

export default App;


let app = new App('app');
app.setModel(model);
app.render();