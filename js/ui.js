const attachEvents = (signal, root) => {
  
  root.querySelectorAll('input.toggle').forEach((element, index) => {
		element.addEventListener('change', signal('toggle', index))
	});
  
  root.querySelectorAll('input.toggle-all').forEach((element) => {
		element.addEventListener('change', signal('toggleAll', !element.checked))
	});
  
  root.querySelectorAll('button.destroy').forEach((element, index) => {
		element.addEventListener('click', signal('destroy', index))
	});
  
  root.querySelectorAll('input.new-todo').forEach((element, index) => {
		element.addEventListener('keyup', (event) => { 
			if (event.keyCode && event.keyCode === 13 && event.target.value.length) {
				signal('newTodo', event.target.value)();
			}
		})
	});
  
  root.querySelectorAll('button.clear-completed').forEach((element, index) => {
		element.addEventListener('click', signal('clearCompleted', null))
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
				signal('save', { index, value: event.target.value })();
			}
		})
	});

  // focus on input.edit if available
	const focusElement = root.querySelector('ul.todo-list > li.editing > input.edit');
	if (focusElement) focusElement.focus();
}

export const header = () => `
  <header class="header">
    <h1>todos</h1>
    <input class="new-todo" placeholder="What needs to be done?" autofocus>
  </header>
`;

// The output should be sanitized to prevent XSS attacks but it's not the purpose of the project.
export const main = ({ todos }) => `
  <section class="main">
    <input id="toggle-all" class="toggle-all" type="checkbox" ${todos.reduce((acc, cur) => acc && cur.completed, true) ? 'checked' : ''}>
    ${ todos.length ? '<label for="toggle-all">Mark all as complete</label>' : '' }
    <ul class="todo-list">
      <!-- List items should get the class 'editing' when editing and 'completed' when marked as completed -->
      ${ todos.map((item) => {
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
`;

export const footer = ({ todos }) => `
  <footer class="footer">
    <!-- This should be '0 items left' by default -->
    <span class="todo-count"><strong>${ todos.reduce((acc, cur) => acc + ((!cur.completed) ? 1 : 0), 0) }</strong> item left</span>
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
`;

export const view = (signal, model, root) => {
	let html;
	html = `
		<section class="todoapp">
      ${ header() }
      ${ model.todos.length ? main(model, signal) : '' }
      ${ model.todos.length ? footer(model) : '' }
		</section>`;
  root.innerHTML = html;
  attachEvents(signal, root);
}