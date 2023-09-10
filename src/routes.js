const { Router } = require("express");
const ProjectController = require("./app/controllers/ProjectController");
const ProgrammerController = require("./app/controllers/ProgrammerController");

const routes = Router();

routes.get("/projects", ProjectController.index);
routes.get("/projects-sorted", ProjectController.indexSorted);
routes.get("/projects/:id", ProjectController.show);
routes.post("/projects", ProjectController.store);
routes.put("/projects/:id", ProjectController.update);
routes.delete("/projects/:id", ProjectController.destroy);

routes.get("/programmer", ProgrammerController.getData);
routes.get("/programmer/:id", ProgrammerController.getDetail);
routes.post("/programmer", ProgrammerController.store);
routes.put("/programmer/:id", ProgrammerController.update);
routes.delete("/programmer/:id", ProgrammerController.destroy);

module.exports = routes;
