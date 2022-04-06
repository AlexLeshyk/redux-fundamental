// import Counter from "./components/counter/counter";
// import Game from "./components/game/game";
import Footer from "./components/footer/footer";
import Header from "./components/header/header";
import TodoList from "./components/todos/todoList";

const App = () => {
  return (
    <div className="App">
      <nav>
        <section>
          <h1>Redux Fundamentals Example</h1>
          <div className="navContent">
            <div className="navLinks"></div>
          </div>
        </section>
      </nav>
      <main>
        <section className="medium-container">
          <h2>Todos</h2>
          <div className="todoapp">
            <Header />
            <TodoList />
            <Footer />
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
