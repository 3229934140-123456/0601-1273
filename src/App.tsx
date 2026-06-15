import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProjectList from "@/pages/ProjectList";
import ProjectInfo from "@/pages/ProjectInfo";
import Materials from "@/pages/Materials";
import Copywriting from "@/pages/Copywriting";
import Compliance from "@/pages/Compliance";
import Budget from "@/pages/Budget";
import Collaboration from "@/pages/Collaboration";
import Publish from "@/pages/Publish";
import Results from "@/pages/Results";
import { ProjectLayout } from "@/components/Layout/ProjectLayout";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProjectList />} />
        <Route path="/project/:id" element={<ProjectLayout />}>
          <Route index element={<ProjectInfo />} />
          <Route path="materials" element={<Materials />} />
          <Route path="copywriting" element={<Copywriting />} />
          <Route path="compliance" element={<Compliance />} />
          <Route path="budget" element={<Budget />} />
          <Route path="collaboration" element={<Collaboration />} />
          <Route path="publish" element={<Publish />} />
          <Route path="results" element={<Results />} />
        </Route>
      </Routes>
    </Router>
  );
}
