import { Link } from "react-router-dom";
import "./register.scss";

export const Register = () => {
  return (
    <div className="register">
      <div className="card">
        <dic className="left">
          <h1>Hello World</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Voluptatibus nobis deleniti magni dicta explicabo, earum et? Dolores
            sunt facilis non aut aliquid quos, dolore officiis enim corporis
            deleniti. Vitae, cumque.
          </p>
          <span>Do you have an account?</span>
          <Link  to="/login">
            <button>Login</button>
          </Link>
        </dic>
        <div className="right">
          <h1>Register</h1>
          <form>
            <input type="text" placeholder="Username" />
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <input type="text" placeholder="Name" />
            <button>Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};
