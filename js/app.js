import model from './model.js';

const update = () => {};

const view = (signal, model, root) => {
	let html = '<ul class="todo-list">';
	html = model.reduce((acc, cur) => {
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

	root.innerHTML = html;
  }

const mount = (model, update, view, elementId) => {
	const root = document.getElementById(elementId); // root DOM element
	const signal = (action) => { 
		() => {
			model = update(model, action);
			view(signal, model, root);
		};
	};
	view(signal, model, root);         // render initial model (once)
};

mount(model, update, view, 'app');