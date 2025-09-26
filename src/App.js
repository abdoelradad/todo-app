import { Moon, Pencil, Plus, Sun, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [todos, setTodos] = useState([]);
  const [theme, setTheme] = useState("light");
  const [updateId, setUpdateId] = useState(null);
  const [search, setSearch] = useState("");

  const [sortBy, setSortBy] = useState("all");

  return (
    <div className={`app ${theme}`}>
      <div className="container">
        <Heading />
        <Header
          search={search}
          setSearch={setSearch}
          theme={theme}
          changeMode={setTheme}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
        <List
          setIsOpen={setIsOpen}
          search={search}
          todos={todos}
          setTodos={setTodos}
          setUpdateId={setUpdateId}
          sortBy={sortBy}
        />
        <AddButton setIsOpen={setIsOpen} />

        {isOpen && (
          <Modal
            setIsOpen={setIsOpen}
            todos={todos}
            setTodos={setTodos}
            updateId={updateId}
            setUpdateId={setUpdateId}
          />
        )}
      </div>
      <ToastContainer />
    </div>
  );
}

function Heading() {
  return <h1 className="heading">Todo list</h1>;
}

function Header({ search, setSearch, theme, changeMode, sortBy, setSortBy }) {
  function handleChangeMode() {
    if (theme === "light") {
      changeMode("dark");
    } else {
      changeMode("light");
    }
  }

  return (
    <div className="header">
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={`${theme}`}
        placeholder="Search note..."
      />
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value={"all"}>All</option>
        <option value="completed">Completed</option>
        <option value="in-completed">In-completed</option>
      </select>
      <button onClick={() => handleChangeMode()}>
        {theme === "light" ? <Moon /> : <Sun />}
      </button>
    </div>
  );
}

function List({ search, todos, setTodos, setIsOpen, setUpdateId, sortBy }) {
  let sortedList = todos;

  if (sortBy === "completed") {
    sortedList = todos.filter((todo) => todo.isCompleted === true);
  } else if (sortBy === "in-completed") {
    sortedList = todos.filter((todo) => todo.isCompleted === false);
  }

  if (search) {
    sortedList = sortedList.filter((todo) =>
      todo.text.toLowerCase().includes(search.toLowerCase())
    );
  }

  return (
    <ul className="list">
      {sortedList.map((item) => (
        <ListItem
          key={item.id}
          todos={todos}
          setTodos={setTodos}
          setUpdateId={setUpdateId}
          setIsOpen={setIsOpen}
          item={item}
        />
      ))}
    </ul>
  );
}

function ListItem({ item, todos, setTodos, setIsOpen, setUpdateId }) {
  function handleDeleteTodo(id) {
    const updatedList = todos.filter((todo) => todo.id !== id);
    setTodos(updatedList);
    toast("Todo has been deleted!");
  }

  function handleSetUpdateId(id) {
    setIsOpen(true);
    setUpdateId(id);
  }

  function handleCompleteTodo(id) {
    const updatedList = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, isCompleted: !todo.isCompleted };
      }
      return todo;
    });
    setTodos(updatedList);
  }

  return (
    <li className="item">
      <input
        type="checkbox"
        checked={item.isCompleted}
        onChange={() => handleCompleteTodo(item.id)}
        className="checkbox"
      />
      <h3 className={item.isCompleted ? "completed" : ""}>{item.text}</h3>

      <div className="menu">
        {!item.isCompleted && (
          <button onClick={() => handleSetUpdateId(item.id)}>
            <Pencil size={15} />
          </button>
        )}
        <button onClick={() => handleDeleteTodo(item.id)}>
          <Trash2 size={15} />
        </button>
      </div>
    </li>
  );
}

function AddButton({ setIsOpen }) {
  function handleAdd() {
    setIsOpen(true);
  }

  return (
    <button className="add-btn" onClick={() => handleAdd()}>
      <Plus size={50} />
    </button>
  );
}

function Modal({ setIsOpen, setTodos, updateId, todos, setUpdateId }) {
  const [input, setInput] = useState("");

  useEffect(() => {
    if (updateId !== null) {
      const todoToEdit = todos.find((todo) => todo.id === updateId);
      if (todoToEdit) {
        setInput(todoToEdit.text);
      }
    }
  }, [updateId, todos]);

  function handleAdd() {
    if (input === "") return;

    if (updateId !== null) {
      const updatedTodos = todos.map((todo) =>
        todo.id === updateId ? { ...todo, text: input } : todo
      );
      setTodos(updatedTodos);
      toast("Todo updated");
      setUpdateId(null);
    } else {
      let length = 9;
      const newTodo = {
        id: Math.random()
          .toString(36)
          .substring(2, length + 2),
        text: input,
        isCompleted: false,
      };

      setTodos((todos) => [...todos, newTodo]);
      toast("New Todo added!");
    }
    setInput("");
    setIsOpen(false);
  }

  function handleClose() {
    setIsOpen(false);
  }

  return (
    <div className="shadow">
      <div className="modal">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your text..."
        />

        <div className="btn-group">
          <button className="close" onClick={() => handleClose()}>
            Cancel
          </button>
          <button onClick={() => handleAdd()}>
            {updateId !== null ? "Update" : "Apply"}
          </button>
        </div>
      </div>
    </div>
  );
}
