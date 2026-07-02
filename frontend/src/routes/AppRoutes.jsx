import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Loader from "../components/Loader/Loader";

// Layouts
import PublicLayout from "../layouts/PublicLayout/PublicLayout";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import RecruiterLayout from "../layouts/RecruiterLayout/RecruiterLayout";
import CandidateLayout from "../layouts/CandidateLayout/CandidateLayout";

// Guard
import ProtectedRoute from "./ProtectedRoute";

// Public Pages
import LandingPage from "../pages/LandingPage/LandingPage";
import About from "../pages/About/About";
import Login from "../pages/Login/Login";
import Signup from "../pages/Signup/Signup";
import Unauthorized from "../pages/Unauthorized/Unauthorized";
import NotFound from "../pages/NotFound/NotFound";

// Shared Pages
import SharedProfile from "../pages/Profile/Profile";
import Settings from "../pages/Settings/Settings";

// Recruiter Pages
import RecruiterDashboard from "../pages/RecruiterDashboard/Dashboard";
import CreateJob from "../pages/Jobs/CreateJob";
import ManageJobs from "../pages/Jobs/ManageJobs";
import RecruiterUpload from "../pages/ResumeUpload/UploadResume";
import CandidateSearch from "../pages/Search/CandidateSearch";
import CandidateRanking from "../pages/CandidateRanking/CandidateRanking";
import CandidateDetails from "../pages/CandidateDetails/CandidateDetails";

// Candidate Pages
import CandidateDashboard from "../pages/CandidateDashboard/Dashboard";
import CandidateProfile from "../pages/CandidateProfile/Profile";
import CandidateUpload from "../pages/CandidateResume/ResumeUpload";
import ResumeHistory from "../pages/CandidateResume/ResumeHistory";

// Root index redirect based on role
const RootRedirect = () => {
  const { isSignedIn, isLoaded, role } = useAuth();

  if (!isLoaded) {
    return <Loader text="Synchronizing session..." fullscreen />;
  }

  if (isSignedIn) {
    return (
      <Navigate
        to={role === "recruiter" ? "/recruiter" : "/candidate"}
        replace
      />
    );
  }

  return <LandingPage />;
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/about" element={<About />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Route>

      {/* Auth Pages */}
      <Route element={<AuthLayout />}>
        <Route path="/login/*" element={<Login />} />
        <Route path="/signup/*" element={<Signup />} />
      </Route>

      {/* Recruiter Guarded Routes */}
      <Route
        path="/recruiter"
        element={
          <ProtectedRoute allowedRoles={["recruiter"]}>
            <RecruiterLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<RecruiterDashboard />} />
        <Route path="jobs" element={<ManageJobs />} />
        <Route path="jobs/create" element={<CreateJob />} />
        <Route path="resumes/upload" element={<RecruiterUpload />} />
        <Route path="search" element={<CandidateSearch />} />
        <Route path="ranking" element={<CandidateRanking />} />
        <Route path="candidates/:id" element={<CandidateDetails />} />
        <Route path="profile" element={<SharedProfile />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Candidate Guarded Routes */}
      <Route
        path="/candidate"
        element={
          <ProtectedRoute allowedRoles={["candidate"]}>
            <CandidateLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<CandidateDashboard />} />
        <Route path="profile" element={<CandidateProfile />} />
        <Route path="resume" element={<CandidateUpload />} />
        <Route path="history" element={<ResumeHistory />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Catch-All */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
