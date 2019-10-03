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
	root.querySelectorAll('input.new-todo').forEach((element, index) => {
		element.addEventListener('keyup', (event) => { 
			if (event.keyCode && event.keyCode === 13 && event.target.value.length) {
				signal('new-todo', event.target.value)();
			}
		})
	});
	root.querySelectorAll('button.clear-completed').forEach((element, index) => {
		element.addEventListener('click', signal('clear-completed', null))
	});
	root.querySelectorAll('ul.todo-list div.view').forEach((element, index) => {
		element.addEventListener('dblclick', signal('edit', { index, editing: true }))
	});
	root.querySelectorAll('ul.todo-list input.edit').forEach((element, index) => {
		element.addEventListener('blur', signal('edit', { index, editing: false }))
	});
	root.querySelectorAll('ul.todo-list input.edit').forEach((element, index) => {
		element.addEventListener('keyup', (event) => { 
			if (event.keyCode && event.keyCode === 27) {
				signal('edit', { index, editing: false })();
			}
		})
	});
	root.querySelectorAll('ul.todo-list input.edit').forEach((element, index) => {
		element.addEventListener('keyup', (event) => { 
			if (event.keyCode && event.keyCode === 13) {
				signal('update', { index, value: event.target.value })();
			}
		})
	});

	const focusElement = root.querySelector('ul.todo-list > li.editing > input.edit');
	if (focusElement) focusElement.focus();
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
		case 'new-todo': return [{ task: payload, completed: false }, ...model];
		case 'clear-completed': return model.filter((item) => !item.completed);
		case 'edit':  return model.map((item, index) => (index===payload.index && payload.editing) ? { task: item.task, completed: item.completed, editing: true } : { task: item.task, completed: item.completed });
		case 'update': return (payload.value.length) ? 
										model.map((item, index) => (index===payload.index) ? { task: payload.value, completed: item.completed } : item)
										: update(model, 'destroy', payload.index);
		default: return model;           // if no action, return curent state.
	  }
};

const view = (signal, model, root) => {
	let html;
	html = `
		<section class="todoapp">
			<header class="header">
				<h1>todos</h1>
				<input class="new-todo" placeholder="What needs to be done?" autofocus>
			</header>
			<!-- This section should be hidden by default and shown when there are todos -->
			<section class="main">
				<input id="toggle-all" class="toggle-all" type="checkbox" ${model.reduce((acc, cur) => acc && cur.completed, true) ? 'checked' : ''}>
				${ model.length ? '<label for="toggle-all">Mark all as complete</label>' : '' }
				<ul class="todo-list">
					<!-- List items should get the class 'editing' when editing and 'completed' when marked as completed -->
					${ model.map((item) => {
						return `<li class="${item.completed ? 'completed' : ''} ${item.editing ? 'editing' : ''}">
											<div class="view" tabindex="0">
												<input class="toggle" type="checkbox" ${item.completed ? 'checked' : ''}>
												<label>${item.task}</label>
												<button class="destroy"></button>
											</div>
											<input class="edit" value="${item.task}">
										</li>`
						}).join('') }
				</ul>
			</section>
			<!-- This footer should hidden by default and shown when there are todos -->
			<footer class="footer">
				<!-- This should be '0 items left' by default -->
				<span class="todo-count"><strong>${ model.reduce((acc, cur) => acc + ((!cur.completed) ? 1 : 0), 0) }</strong> item left</span>
				<!-- Remove this if you don't implement routing -->
				<ul class="filters">
					<li>
						<a class="selected" href="#/">All</a>
					</li>
					<li>
						<a href="#/active">Active</a>
					</li>
					<li>
						<a href="#/completed">Completed</a>
					</li>
				</ul>
				<!-- Hidden if no completed items are left ↓ -->
				<button class="clear-completed">Clear completed</button>
			</footer>
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