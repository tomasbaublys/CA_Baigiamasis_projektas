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
import NotFound from "./components/pages/NotFound";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import PublicRoute from "./components/routes/PublicRoute";


const App = () => {

  return (
    <Routes>
      <Route path="" element={<MainOutlet />}>
        <Route index element={<Home />} />
        <Route path="questions" element={<Questions />} />
        <Route path="questions/:id" element={<SpecificQuestion />} />
        <Route path="ask" element={<AskQuestion />} />
        
        <Route
          path="questions/:id/edit"
          element={
            <ProtectedRoute>
              <EditQuestion />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="user"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route path="login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;