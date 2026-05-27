const Task = require('../models/Task');

exports.getTasks = async (req, res) => {

  const tasks = await Task.find({
    userId: req.user.id
  });

  res.json(tasks);
};

exports.createTask = async (req, res) => {

  const task = new Task({

    ...req.body,

    userId: req.user.id
  });

  await task.save();

  res.status(201).json(task);
};

exports.updateTask = async (req, res) => {

  const updatedTask = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updatedTask);
};

exports.deleteTask = async (req, res) => {

  await Task.findByIdAndDelete(req.params.id);

  res.json({
    message: 'Tarea eliminada'
  });
};