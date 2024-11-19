<script>
  import { navigate } from 'svelte-routing';

  let email = '';
  let password = '';
  let error = '';

  const handleLogin = async () => {
      try {
          const response = await fetch('http://localhost:3000/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ e_email: email, e_password: password }),
              credentials: 'include'
          });
          if (response.ok) {
              const data = await response.json();

              const { token, userRole } = data;

              if (!userRole || !token) {
                  error = 'Unexpected response format';
                  console.error('Token or userRole is missing:', data);
                  return;
              }

              localStorage.setItem('token', token);
              localStorage.setItem('userRole', userRole);

              switch (userRole) {
                  case 'admin':
                      navigate('/admin');
                      break;
                  case 'employee':
                      navigate('/employee');
                      break;
                  default:
                      navigate('/employee');
                      break;
              }
          } else {
              const { message } = await response.json();
              error = message || 'Login failed';
          }
      } catch (error) {
          console.error('Login error:', error);
          error = 'Login failed';
      }
  };
</script>

<div class="container">
  <h2>Login</h2>
  {#if error}
      <p style="color: red;">{error}</p>
  {/if}
  <input type="email" placeholder="Email" bind:value={email} required />
  <input type="password" placeholder="Password" bind:value={password} required />
  <div class="btn1Container">
      <button class="btn1" on:click={handleLogin}>Login</button>
  </div>
</div>

<style>
  .container {
    max-width: 400px;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    margin: auto; 
  }

  h2 {
    text-align: center;
    color: #333;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
    font-weight: bold;
  }

  input {
    width: 100%;
    padding: 12px;
    margin-bottom: 1rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 16px;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  input:focus {
    border-color: #007bff;
    outline: none;
    /* outline: none; is used to remove the outline that browsers typically apply to focused elements */
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
  }

  .btn1Container {
    margin-top: 1rem;
  }

  .btn1 {
    width: 100%;
    padding: 12px;
    background: linear-gradient(45deg, #007bff, #0056b3);
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    cursor: pointer;
    transition: background 0.3s, transform 0.3s;
  }

  .btn1:hover {
    background: linear-gradient(45deg, #0056b3, #003d7a);
    transform: scale(1.05);
  }

</style>