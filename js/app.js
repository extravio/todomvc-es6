import model from './model.js';

const tmp_event = (signal, model, root) => {
	root.querySelectorAll('input.toggle').forEach((element, index) => {
		element.addEventListener('change', signal('toggle', index))
	});
	root.querySelectorAll('button.destroy').forEach((element, index) => {
		element.addEventListener('click', signal('destroy', index))
	});
}

const update = (model, action, payload) => {
	switch(action) {                   // and an action (String) runs a switch
		case 'toggle': return model.map((item, index) => { 
			return (index===payload) ? { task: item.task, completed: !item.completed } : item
		});
		case 'destroy': return model.filter((item, index) => index!==payload);
		default: return model;           // if no action, return curent state.
	  }
};

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
	tmp_event(signal, model, root);
  }

const mount = (model, update, view, elementId) => {
	const root = document.getElementById(elementId); // root DOM element
	const signal = (action, payload) => { 
		return () => {
			model = update(model, action, payload);
			view(signal, model, root);
		};
	};
	view(signal, model, root);         // render initial model (once)
};

mount(model, update, view, 'app');