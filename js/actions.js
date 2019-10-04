export const actions = {

  alterTodo: (model, todos) => {
    return Object.assign({}, {...model }, { todos });
  },

  toggle: (model, action, payload) => actions.alterTodo(model, model.todos.map((item, index) => { return (index===payload) ? { task: item.task, completed: !item.completed } : item })),

  toggleAll: (model, action, payload) => actions.alterTodo(model, model.todos.map((item, index) => { return { task: item.task, completed: payload }	})),

  destroy: (model, action, payload) => actions.alterTodo(model, model.todos.filter((item, index) => index!==payload)),

  newTodo: (model, action, payload) => actions.alterTodo(model, [{ task: payload, completed: false }, ...model.todos]),
  
  clearCompleted: (model, action, payload) => actions.alterTodo(model, model.todos.filter((item) => !item.completed)),
  
  edit: (model, action, payload) => actions.alterTodo(model, model.todos.map((item, index) => (index===payload.index && payload.editing) ? { task: item.task, completed: item.completed, editing: true } : { task: item.task, completed: item.completed })),

  save: (model, action, payload) => (payload.value.length) 
                                    ? actions.alterTodo(model, model.todos.map((item, index) => (index===payload.index) ? { task: payload.value, completed: item.completed } : item))
                                    : update(model, 'destroy', payload.index),
}

export const update = (model, action, payload) => (typeof actions[action] === 'function') ? actions[action](model, action, payload) : model;