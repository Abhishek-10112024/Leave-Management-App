<script>
  import { Router, Route } from 'svelte-routing';
  import Register from './components/SignUp.svelte'; 
  import Login from './components/login.svelte';
  import adminDashboard from './components/adminDashboard.svelte'; 
  import Logout from './components/Logout.svelte';
  import employeeDashboard from './components/employeeDashboard.svelte';
  
  export let url = '';
</script>

<Router {url}>
  <div>
    <Route path="/" component={Login} />
    <Route path="/logout" component={Logout} />
    <Route path="/register" component={Register} />
    <Route path="/admin" component={adminDashboard} />
    <Route path="/employee" component={employeeDashboard} />
  </div>
</Router>
