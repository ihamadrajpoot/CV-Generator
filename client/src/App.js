import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing";
import Navbar from "./components/layout/Navbar";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Route path="/" component={Landing} exact />
        <Route path="/register" component={Register} exact />
        <Route path="/login" component={Login} exact />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
