import { Route, Routes } from "react-router";
import MainOutlet from "./components/outlets/MainOutlet";
import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import Profile from "./components/pages/Profile";
import Questions from "./components/pages/Questions";
import AskQuestion from "./components/pages/AskQuestions";
import SpecificQuestion from "./components/pages/SpecificQuestion";
import EditQuestion from "./components/pages/EditQuestion";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="" element={<MainOutlet />}>
          <Route index element={<Home />} />
          <Route path="questions" element={<Questions />} />
          <Route path="ask" element={<AskQuestion />} />
          <Route path="questions/:id" element={<SpecificQuestion/>} />
          <Route path="/questions/:id/edit" element={<EditQuestion />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="user" element={<Profile />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;