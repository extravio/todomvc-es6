import model from './model.js';
import { view } from './ui.js';
import { update } from './actions.js';

const mount = (model, update, view, elementId) => {
	const root = document.getElementById(elementId);
	const signal = (action, payload) => { 
		return () => {
			model = update(model, action, payload);
			view(signal, model, root);
		};
	};
	view(signal, model, root);
};

mount(model, update, view, 'app');