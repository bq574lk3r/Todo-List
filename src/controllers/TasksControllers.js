const { TasksServices } = require('../services/TasksServices');
const { validationResult } = require("express-validator");
const Sentry = require("@sentry/node");

require('dotenv').config();

class TasksControllers {

    async getTasks(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            res.status(200).send(await TasksServices.getTasks(req.userId));
        } catch (error) {
            Sentry.captureException(error);
        }

    }

    async createTask(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { title, isCompleted } = req.body;
            const newTask = await TasksServices.createTask(title, isCompleted, req.userId);
            res.status(201).send(newTask);
        } catch (error) {
            Sentry.captureException(error);
        }
    }

    async updateTitle(req, res){
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { title } = req.body;
            const updatedTask = await TasksServices.updateTitle(title, req.userId, req.params.id);
            res.status(200).send(updatedTask);
        } catch (error) {
            Sentry.captureException(error);
        } 
    }

    async updateStatus(req, res){
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const updatedTask = await TasksServices.updateStatus(req.userId, req.params.id);
            res.status(200).send(updatedTask);
        } catch (error) {
            Sentry.captureException(error);
        } 
    }

    async deleteTask(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            res.send(await TasksServices.deleteTask(req.userId, req.params.id));
        } catch (error) {
            Sentry.captureException(error);
        }

    }

}

module.exports = new TasksControllers();