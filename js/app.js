import model from './model.js';

const tmp_event = (signal, model, root) => {
	root.querySelectorAll('input.toggle').forEach((element, index) => {
		element.addEventListener('change', signal('toggle', index))
	});
	root.querySelectorAll('input.toggle-all').forEach((element) => {
		element.addEventListener('change', signal('toggle-all', !element.checked))
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
		case 'toggle-all': return model.map((item, index) => { 
			return { task: item.task, completed: payload };
		});
		case 'destroy': return model.filter((item, index) => index!==payload);
		default: return model;           // if no action, return curent state.
	  }
};

const view = (signal, model, root) => {
	let html;
	html = `
		<!-- This section should be hidden by default and shown when there are todos -->
		<section class="main">
			<input id="toggle-all" class="toggle-all" type="checkbox" ${model.reduce((acc, cur) => acc && cur.completed, true) ? 'checked' : ''}>
			${ model.length ? '<label for="toggle-all">Mark all as complete</label>' : '' }
			<ul class="todo-list">
				<!-- These are here just to show the structure of the list items -->
				<!-- List items should get the class 'editing' when editing and 'completed' when marked as completed -->
				${ model.map((item) => {
					return `<li class="${item.completed ? 'completed' : ''}">
										<div class="view">
											<input class="toggle" type="checkbox" ${item.completed ? 'checked' : ''}>
											<label>${item.task}</label>
											<button class="destroy"></button>
										</div>
										<input class="edit" value="${item.task}">
									</li>`
					}).join('') }
			</ul>
		</section>`;
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