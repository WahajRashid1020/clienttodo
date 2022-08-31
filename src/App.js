import { useEffect, useState } from "react";
import { readTodo, createTodo, updateTodo } from "./funtions";
import Preloader from "./components/Preloader";
import { deleteTodo } from "./api";

function App() {
  const [todo, setTodo] = useState({ title: "", content: "" });
  const [todos, setTodos] = useState(null);
  const [currentId, setCurrentId] = useState(0);
  useEffect(() => {
    let currentTodo =
      currentId != 0
        ? todos.find((todo) => todo._id === currentId)
        : { title: "", content: "" };
    setTodo(currentTodo);
  }, [currentId]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await readTodo();
      setTodos(result);
    };
    fetchData();
  }, [currentId]);
  const clear = () => {
    setCurrentId(0);
    setTodo({ title: "", content: "" });
  };
  useEffect(() => {
    const clearField = (e) => {
      if (e.keyCode === 27) {
        clear();
      }
    };
    window.addEventListener("keydown", clearField);
    return () => window.removeEventListener("keydown", clearField);
  }, []);
  const removeTodo = async (id) => {
    await deleteTodo(id);
    const todosCopy = [...todos];
    todosCopy.filter((todo) => todo._id !== id);
    setTodos(todosCopy);
  };
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (currentId === 0) {
      const result = await createTodo(todo);
      setTodos([...todos, result]);
      clear();
    } else {
      await updateTodo(currentId, todo);
      clear();
    }
  };
  return (
    <div className="container">
      <div className="row">
        <form className="col s12" onSubmit={onSubmitHandler}>
          <div className="row">
            <pre>{JSON.stringify(todo)}</pre>
            <div className="input-field col s6">
              <i className="material-icons prefix">account_circle</i>
              <input
                id="title"
                type="text"
                className="validate"
                value={todo.title}
                onChange={(e) => setTodo({ ...todo, title: e.target.value })}
              />
              <label htmlFor="title">Title</label>
            </div>
            <div className="input-field col s6">
              <i className="material-icons prefix">description</i>
              <input
                id="content"
                type="tel"
                className="validate"
                value={todo.content}
                onChange={(e) => setTodo({ ...todo, content: e.target.value })}
              />
              <label htmlFor="icon_telephone">Description</label>
            </div>
          </div>
          <div className="row">
            <button className="wave-effect waves-light btn">Submit</button>
          </div>
        </form>
        {!todos ? (
          <Preloader />
        ) : todos.length > 0 ? (
          <ul className="collection container">
            {todos.map((todo) => (
              <div>
                <li
                  key={todo._id}
                  onClick={() => setCurrentId(todo._id)}
                  className="collection-item"
                >
                  <div>
                    <h5>{todo.title}</h5>
                    <p>
                      {todo.content}
                      <a
                        href="#!"
                        onClick={() => removeTodo(todo._id)}
                        className="secondary-content"
                      >
                        <i className="material-icons">delete</i>
                      </a>
                    </p>
                  </div>
                </li>
              </div>
            ))}
          </ul>
        ) : (
          <div>Nothing</div>
        )}
      </div>
    </div>
  );
}

export default App;
