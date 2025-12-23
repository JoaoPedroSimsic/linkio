import express from "express";

class App {
	app;

	constructor() {
		this.app = express();
	}

	middlewares() {
		this.app.use(express.json());
	}

	routes() {
		// this.app.use('/', assad);
	}
}

export default new App().app;
