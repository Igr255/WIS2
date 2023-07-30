import './App.css';
import HomePage from './pages/HomePage';
import { Route, Routes } from 'react-router-dom';
import StudentPage from './pages/StudentPage';
import EmployeePage from './pages/EmployeePage';
import SubjectDetailsPage from './pages/SubjectDetailsPage';
import RegisteredSubjectsPage from './pages/RegisteredSubjectsPage';
import SubjectRegistrationPage from './pages/SubjectRegistrationPage';
import LecturedCourses from './pages/LecturedCourses';
import LecturedCourseDetail from './pages/LecturedCourseDetail';
import UserProfile from './pages/UserProfile';
import NoAccPage from './pages/NoAccPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import GarantPage from './pages/GarantPage';
import LecturedCoursesLectures from './pages/LecturedCoursesLectures';
import PrivateRouteUser from './components/ProtectedRouteUser';
import PrivateRouteAdmin from './components/ProtectedRouteAdmin';
import TimeTablePage from './pages/TimeTablePage';

function App() {

  var apiPath = "/api";

  return (
    <Routes>
      <Route element={<PrivateRouteAdmin apiPath={apiPath}/>}>
        <Route path="/adminPage" element={<AdminPage apiPath={apiPath}/>}/>
      </Route>

      <Route element={<PrivateRouteUser apiPath={apiPath}/>}> 
        <Route path="/student" element={<StudentPage apiPath={apiPath}/>}/>
        <Route path="/courseRegistration" element={<SubjectRegistrationPage apiPath={apiPath}/>}/>
        <Route path="/subjectDetails" element={<SubjectDetailsPage apiPath={apiPath}/>}/>
        <Route path="/home" element={<HomePage apiPath={apiPath}/>}/>
        <Route path="/employee" element={<EmployeePage apiPath={apiPath}/>}/>
        <Route path="/registeredSubjects" element={<RegisteredSubjectsPage apiPath={apiPath}/>}/>
        <Route path="/registeredSubjects/registeredSubjectsDetails/:subName/:id" element={<SubjectDetailsPage apiPath={apiPath}/>}/>
        <Route path="/lecturedCourses" element={<LecturedCourses apiPath={apiPath}/>}/>
        <Route path="/lecturedCourseDetail/:id" element={<LecturedCourseDetail apiPath={apiPath}/>}/>
        <Route path="/userProfile" element={<UserProfile apiPath={apiPath}/>}/>
        <Route path="/lecturedCourseLectures/:id" element={<LecturedCoursesLectures apiPath={apiPath}/>}/>
        <Route path="/timeTable" element={<TimeTablePage apiPath={apiPath}/>}/>
        <Route path="/garant" element={<GarantPage apiPath={apiPath}/>}/>
      </Route>
      
      <Route path="/noAccount" element={<NoAccPage apiPath={apiPath}/>}/>
      <Route path="/" element={<LoginPage apiPath={apiPath}/>}/>
    </Routes>
  );
}

export default App;
