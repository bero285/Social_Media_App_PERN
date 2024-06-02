import { Link } from "react-router-dom";
import "./login.scss";

export const Login = () => {
  return (
    <div className="login">
      <div className="card">
        <dic className="left">
          <h1>Hello World</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Voluptatibus nobis deleniti magni dicta explicabo, earum et? Dolores
            sunt facilis non aut aliquid quos, dolore officiis enim corporis
            deleniti. Vitae, cumque.
          </p>
          <span>Don't you have an account?</span>
          <Link to="/register">
            <button>Register</button>
          </Link>
        </dic>
        <div className="right">
          <h1>Login</h1>
          <form>
            <input type="text" placeholder="Username" />
            <input type="password" placeholder="Password" />
            <button>Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};
