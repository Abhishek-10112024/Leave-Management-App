import App from './App.svelte'; // This component serves as the entry point for the application.

const app = new App({ // new App({ ... }): This creates a new instance of the App component
  target: document.body, // This specifies where in the DOM the Svelte app will be mounted. Here, it's being attached to the entire document body.
  props: { // In this case, the url prop allows the App component to have access to the current URL, enabling dynamic behavior based on routing.
    url: window.location.pathname
  }
});

export default app;
