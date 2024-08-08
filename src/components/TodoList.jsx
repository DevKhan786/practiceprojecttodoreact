import React, { useEffect, useState } from "react";

export default function TodoList() {
  
  const [todos, setTodos] = useState([]);
  const [todoValue, setTodoValue] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const localTodos = localStorage.getItem("todos");
    if (localTodos) {
      try {
        const parsedTodos = JSON.parse(localTodos);
        if (Array.isArray(parsedTodos)) {
          setTodos(parsedTodos);
        } else {
          setTodos([]);
        }
      } catch (e) {
        setTodos([]);
      }
    }
  }, []);

  function persistData(newList) {
    localStorage.setItem("todos", JSON.stringify(newList));
  }

  function handleInput(event) {
    setTodoValue(event.target.value);
  }

  function addTask() {
    const newTask = [
      ...todos,
      {
        text: todoValue,
        isCompleted: false,
      },
    ];
    setTodos(newTask);
    persistData(newTask);
    setTodoValue("");
  }

  function deleteTask(index) {
    const newList = todos.filter((_, i) => i !== index);
    setTodos(newList);
    persistData(newList);
  }

  function editTask(index) {
    setTodoValue(todos[index].text);
    deleteTask(index);
  }

  function getFilteredTasks() {
    if (filter === "All") return todos;
    if (filter === "Completed") return todos.filter((task) => task.isCompleted);
    if (filter === "Incomplete")
      return todos.filter((task) => !task.isCompleted);
    return [];
  }

  function completedToggle(index) {
    const newList = todos.map((task, i) =>
      i === index ? { ...task, isCompleted: !task.isCompleted } : task
    );
    setTodos(newList);
    persistData(newList);
  }

  function moveTaskUp(index) {
    const newTaskList = [...todos];
    if (index > 0) {
      [newTaskList[index - 1], newTaskList[index]] = [
        newTaskList[index],
        newTaskList[index - 1],
      ];
      setTodos(newTaskList);
      persistData(newTaskList);
    }
  }

  function moveTaskDown(index) {
    const newTaskList = [...todos];
    if (index < newTaskList.length - 1) {
      [newTaskList[index + 1], newTaskList[index]] = [
        newTaskList[index],
        newTaskList[index + 1],
      ];
      setTodos(newTaskList);
      persistData(newTaskList);
    }
  }

  return (
    <div className="container">
      <h1>To-Do List</h1>
      <div className="inputs">
        <input
          value={todoValue}
          onChange={handleInput}
          type="text"
          placeholder="Enter Task"
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <div className="sort-inputs">
        <button onClick={() => setFilter("All")}>All</button>
        <button onClick={() => setFilter("Completed")}>Completed</button>
        <button onClick={() => setFilter("Incomplete")}>Incomplete</button>
      </div>
      <ul>
        {getFilteredTasks().map((task, index) => (
          <li key={index} className={task.isCompleted ? "completed" : ""}>
            <span>{task.text}</span>
            <div className="task-buttons">
              <button onClick={() => completedToggle(index)}>Toggle</button>
              <button className="moveUp" onClick={() => moveTaskUp(index)}>
                Move Up
              </button>
              <button className="moveDown" onClick={() => moveTaskDown(index)}>
                Move Down
              </button>
              <button className="delete" onClick={() => deleteTask(index)}>
                Delete
              </button>
              <button onClick={() => editTask(index)}>Edit</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
