<script>
  import { navigate } from 'svelte-routing';

  let name = '';
  let email = '';
  let password = '';
  let role = 'employee';
  let team = '';
  let errorMessage = '';

  const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ e_name: name, e_dept: team, e_email: email, e_password: password, e_role: role })
            });

            if (response.ok) {
                alert('Sign Up Successful!');
                navigate('/employee-management');
            } else {
                const { message } = await response.json();
                errorMessage = message || 'Error while signing up';
            }
        } catch (error) {
            console.error('Error during signup:', error);
            errorMessage = 'An unexpected error occurred';
        }
    };

    const handleLogin = () => {
        navigate('/');
    };
</script>

<div class="container">
  {#if errorMessage}
        <p style="color: red;">{errorMessage}</p>
  {/if}
  <h2>Sign Up</h2>
  <input type="text" placeholder="Name" bind:value={name} />
  <input type="team" placeholder="Team" bind:value={team} />
  <input type="email" placeholder="Email" bind:value={email} />
  <input type="password" placeholder="Password" bind:value={password} />
  <select bind:value={role} class="role-select">
    <option value="employee">Employee</option>
    <option value="admin">Admin</option>
  </select>
  <button class="button1" on:click={fetchData}>Sign Up</button>
  <div class="redirect">
    <button class="button2" on:click={handleLogin}>Already have an account?</button>
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
    width: 95%;
    padding: 12px;
    margin-bottom: 1rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 16px;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: border-color 0.3s, box-shadow 0.3s;
  }

  input:focus {
    border-color: #28a745;
    box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.25);
    outline: none;
  }

  .button1 {
    width: 100%;
    padding: 12px;
    background: linear-gradient(45deg, #28a745, #218838);
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    cursor: pointer;
    transition: background 0.3s, transform 0.3s;
  }

  .button1:hover {
    background: linear-gradient(45deg, #218838, #1e7e34);
    transform: scale(1.05);
  }

  .button1:active {
    transform: scale(0.98);
  }

  .redirect {
    text-align: center;
    margin-top: 1rem;
  }

  .button2 {
    padding: 12px;
    font-size: 16px;
    border: 2px solid #007bff;
    background-color: white;
    color: #007bff;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.3s, color 0.3s;
  }

  .button2:hover {
    background-color: #007bff;
    color: white;
    transform: scale(1.05);
  }
  .button2:active {
    transform: scale(0.98);
  }
  .role-select {
    width: 100%;
    padding: 12px;
    margin-bottom: 1rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 16px;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: border-color 0.3s, box-shadow 0.3s;
  }

  .role-select:focus {
    border-color: #007bff; /* Change border color when focused */
    box-shadow: 0 0 0 0.2rem rgba(38, 143, 255, 0.25); /* Blue shadow on focus */
  }

  .role-select option {
    padding: 10px; /* Padding inside each option */
  }
</style>
