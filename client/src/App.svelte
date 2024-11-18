<script>
  import { Router, Route, navigate } from 'svelte-routing';
  import { onMount } from 'svelte';
  // The Router component acts as the main container for your application's routes
  // It keeps track of the current location in the app and renders the appropriate route based on the URL
  // The Route component defines a specific route in your application
  // You specify a path and the component that should be rendered when that path is matched.
  import Register from './components/authComponents/SignUp.svelte'; 
  import Login from './components/authComponents/Login.svelte';
  import adminDashboard from './components/adminComponents/adminDashboard.svelte'; 
  import Logout from './components/authComponents/Logout.svelte';
  import employeeDashboard from './components/employeeComponents/EmployeeDashboard.svelte';
  import EmployeeManagement from './components/adminComponents/EmployeeManagement.svelte';
  import LeaveManagement from './components/adminComponents/LeaveManagement.svelte';
  
  let url = '';

  // let url = '';: This line declares a variable named url, which can be passed to the Router component
  // It allows the Router to be aware of the current URL, enabling navigation and rendering of the appropriate route
</script>

<Router {url}>
  <!-- This initializes the router, which manages the application's routing -->
  <!-- The {url} allows the router to handle navigation based on the current URL -->
  <div>
    <Route path="/" component={Login} />
    <!-- Each <Route> component defines a specific route and the corresponding component to render when that route is active -->
    <Route path="/logout" component={Logout} />
    <Route path="/register" component={Register} />
    <Route path="/admin" component={adminDashboard} />
    <Route path="/employee" component={employeeDashboard} />
    <Route path="/leave-management" component={LeaveManagement} />
    <Route path="/employee-management" component={EmployeeManagement} />
  </div>
</Router>

<!-- Routing enables single-page applications (SPAs) to navigate between different views without a full page reload. Each route corresponds to a different part of the application -->
<!-- The svelte-routing library uses a declarative approach to define routes, making it easy to visualize which components correspond to which URLs -->
<!-- Each component (like Login, Logout, Register, etc.) is a separate Svelte component that will be rendered when its respective route is matched -->
<!-- The <Router> component manages which of the <Route> components is currently active based on the browser's URL. It handles the rendering of the appropriate component automatically. -->
<!-- If you have a navigation bar or links, ensure you use <Link> components from svelte-routing to enable client-side navigation -->
 <!-- Here’s how you could add a catch-all route for unmatched URLs: <Route path="*" component={NotFound} /> -->