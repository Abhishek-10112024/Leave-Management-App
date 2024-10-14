<script>
    import { navigate } from 'svelte-routing';
  
    let email = '';
    let password = '';
    let error = '';
    let role = 'employee';
  
    const handleLogin = async () => {
      try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
        credentials: 'include'
      });
      if (response.ok) {
    const data = await response.json();
        console.log('Response data:', data); // Debug log

        const { token, userRole, id } = data;

        
        if (!userRole || !token) {
          error = 'Unexpected response format';
          console.error('Token or userRole is missing:', data);
          return;
        }
        if (userRole !== role) {
          error = 'Role mismatch. Please select the correct role.';
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

  const handleSignUp = () => {
    navigate('/register');
  };
</script>

<div class="container">
  <h2>Login</h2>
  <input type="email" placeholder="Email" bind:value={email} />
  <input type="password" placeholder="Password" bind:value={password} />
  <select bind:value={role} class="role-select">
    <option value="employee">Employee</option>
    <option value="admin">Admin</option>
  </select>
  <div class="btn1Container">
    <button class="btn1" on:click={handleLogin}>Login</button>
  </div>
  <div class="btn2">
    <button class="btn2" on:click={handleSignUp}>Create an account</button>
  </div>
</div>

<style>
  .container {
    max-width: 400px;
    margin: auto;
    padding: 2rem;
    border: 1px solid #ddd;
    border-radius: 10px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    background-color: #fff;
  }

  h2 {
    text-align: center;
    color: #333;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
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

  .btn1:active {
    transform: scale(0.98);
  }

  .btn2 {
    text-align: center;
    margin-top: 1rem;
  }

  .btn2 button {
    padding: 12px;
    font-size: 16px;
    border: 2px solid #0056b3;
    background-color: white;
    color: #0056b3;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.3s, color 0.3s;
  }

  .btn2 button:hover {
    background-color: #0056b3;
    color: white;
    transform: scale(1.05);
  }
  .btn2:active {
    transform: scale(0.98);
  }
  .role-select {
    background-color: #fff; /* White background */
    border: 1px solid #ccc; /* Light gray border */
    border-radius: 4px; /* Rounded corners */
    padding: 10px 15px; /* Padding inside the dropdown */
    font-size: 16px; /* Larger text for better readability */
    color: #333; /* Dark text color */
    outline: none; /* Remove default outline */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow for a 3D effect */
    transition: all 0.3s ease; /* Smooth transition for hover effect */
    cursor: pointer; /* Pointer cursor on hover */
    width: 100%; /* Full width */
  }

  .role-select:focus {
    border-color: #007bff; /* Change border color when focused */
    box-shadow: 0 0 0 0.2rem rgba(38, 143, 255, 0.25); /* Blue shadow on focus */
  }

  .role-select option {
    padding: 10px; /* Padding inside each option */
  }
</style>