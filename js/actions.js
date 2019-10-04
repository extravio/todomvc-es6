export const actions = {

  alterTodo: (model, todos) => {
    return Object.assign({}, {...model }, { todos });
  },

  toggle: (model, payload) => actions.alterTodo(model, model.todos.map((item, index) => { return (index===payload) ? { task: item.task, completed: !item.completed } : item })),

  toggleAll: (model, payload) => actions.alterTodo(model, model.todos.map((item, index) => { return { task: item.task, completed: payload }	})),

  destroy: (model, payload) => actions.alterTodo(model, model.todos.filter((item, index) => index!==payload)),

  newTodo: (model, payload) => actions.alterTodo(model, [{ task: payload, completed: false }, ...model.todos]),
  
  clearCompleted: (model, payload) => actions.alterTodo(model, model.todos.filter((item) => !item.completed)),
  
  edit: (model, payload) => actions.alterTodo(model, model.todos.map((item, index) => (index===payload.index && payload.editing) ? { task: item.task, completed: item.completed, editing: true } : { task: item.task, completed: item.completed })),

  save: (model, payload) => (payload.value.length) 
                                    ? actions.alterTodo(model, model.todos.map((item, index) => (index===payload.index) ? { task: payload.value, completed: item.completed } : item))
                                    : update(model, 'destroy', payload.index),

  select: (model, payload) => {
    const hash = payload.slice(2);
    const view = (hash === 'active' || hash === 'completed') ? hash : 'all';
    return Object.assign({}, {...model }, { view });
  },
}

export const update = (model, action, payload) => (typeof actions[action] === 'function') ? actions[action](model, payload) : model;