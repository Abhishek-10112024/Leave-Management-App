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

<!-- <div class="container">
  <h2>Login</h2>
  {#if error}
      <p style="color: red;">{error}</p>
  {/if}
  <input type="email" placeholder="Email" bind:value={email} required />
  <input type="password" placeholder="Password" bind:value={password} required />
  <div class="btn1Container">
      <button class="btn1" on:click={handleLogin}>Login</button>
  </div>
</div> -->

<section class="h-100 gradient-form" style="background-color: #eee;">
  <div class="container py-5 h-100">
    <div class="row d-flex justify-content-center align-items-center h-100">
      <div class="col-xl-10">
        <div class="card rounded-3 text-black">
          <div class="row g-0">
            <div class="col-lg-6">
              <div class="card-body p-md-5 mx-md-4">

                <div class="text-center">
                  <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
                    style="width: 185px;" alt="logo">
                  <h4 class="mt-1 mb-5 pb-1">We are The Lotus Team</h4>
                </div>

                <form>
                  <p>Please login to your account</p>

                  <div data-mdb-input-init class="form-outline mb-4">
                    <input type="email" id="form2Example11" class="form-control"
                      placeholder="email address" bind:value={email} required/>
                  </div>

                  <div data-mdb-input-init class="form-outline mb-4">
                    <input type="password" id="form2Example22" class="form-control" placeholder="Password" bind:value={password} required/>
                  </div>

                  <div class="text-center pt-1 mb-5 pb-1">
                    <button data-mdb-button-init data-mdb-ripple-init class="btn btn-primary btn-block fa-lg gradient-custom-2 mb-3" type="button" on:click={handleLogin}>Log
                      in</button>
                  </div>

                </form>

              </div>
            </div>
            <div class="col-lg-6 d-flex align-items-center gradient-custom-2">
              <div class="text-white px-3 py-4 p-md-5 mx-md-4">
                <h4 class="mb-4">We are more than just a company</h4>
                <p class="small mb-0">Based in Silicon Valley, we are a highly motivated team of Entrepreneurs, Doctors, Engineers and Data Scientists with the mission to develop innovative software products, help our collaborators find a
                  Cure-for-Cancer and make a societal impact, globally.
                  Founded by experienced management team with proven track record of founding 5 companies, raising over $50M in investment and creating over $500M of exit value.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
.gradient-custom-2 {
/* fallback for old browsers */
background: #fccb90;

/* Chrome 10-25, Safari 5.1-6 */
background: -webkit-linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593);

/* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
background: linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593);
}

@media (min-width: 768px) {
.gradient-form {
height: 100vh !important;
}
}
@media (min-width: 769px) {
.gradient-custom-2 {
border-top-right-radius: .3rem;
border-bottom-right-radius: .3rem;
}
}

form {
  font-weight: bold;
}

.card-body{
  line-height: 0px;
}

.col-xl-10{
  margin-top: -25px;
}
</style>


<!-- <style>
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

</style> -->