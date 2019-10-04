export const actions = {

  toggle: (model, action, payload) => model.map((item, index) => { return (index===payload) ? { task: item.task, completed: !item.completed } : item }),
    
  toggleAll: (model, action, payload) => model.map((item, index) => { return { task: item.task, completed: payload }	}),

  destroy: (model, action, payload) => model.filter((item, index) => index!==payload),

  newTodo: (model, action, payload) => [{ task: payload, completed: false }, ...model],

  clearCompleted: (model, action, payload) => model.filter((item) => !item.completed),

  edit: (model, action, payload) =>  model.map((item, index) => (index===payload.index && payload.editing) ? { task: item.task, completed: item.completed, editing: true } : { task: item.task, completed: item.completed }),

  save: (model, action, payload) => (payload.value.length) ? 
										model.map((item, index) => (index===payload.index) ? { task: payload.value, completed: item.completed } : item)
                    : update(model, 'destroy', payload.index),
}

export const update = (model, action, payload) => (typeof actions[action] === 'function') ? actions[action](model, action, payload) : model;