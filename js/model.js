const hash = window.location.hash.slice(2);

const model = {
    todos: [
        { task: 'Learn Angular', completed: false },
        { task: 'Learn React', completed: true },
        { task: 'Learn Vue', completed: false },
    ],
    view: (hash === 'active' || hash === 'completed') ? hash : 'all', // all|active|completed
};

export default model;