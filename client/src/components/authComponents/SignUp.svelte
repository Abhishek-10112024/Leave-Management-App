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
            // syntax: const value = localStorage.getItem(key);
            // key: The name of the item you want to retrieve from storage (a string)
            // If the key exists in storage, getItem returns the associated value as a string.
            // If the key does not exist, it returns null.
            // String Storage: All values are stored as strings, 
            // so if you need to store objects or arrays, you would typically convert them to a string using JSON.stringify() before storing and parse them with JSON.parse() when retrieving.

            const response = await fetch('http://localhost:3000/api/auth/register', {
// The await keyword is used to pause the execution of the function until the promise returned by fetch is resolved. This makes it easier to work with asynchronous code.
                method: 'POST',
                credentials: 'include',
// Controls whether credentials (like cookies and authorization headers) are sent with the request, especially for cross-origin resources.
// omit: No credentials are sent (default for cross-origin).
// same-origin: Credentials are sent only for same-origin requests.
// include: Credentials are always sent, regardless of origin.
                headers: {
                    'Content-Type': 'application/json',
// This header indicates the media type of the resource being sent to the server.
// In this case, it tells the server that the request body contains JSON data. 
                    'Authorization': `Bearer ${token}`
// The Bearer scheme indicates that the client is providing a token to access a protected resource.
// The ${token} part should be replaced with the actual token retrieved from localStorage, which we already got uppser in code using getItem method.
                },
                body: JSON.stringify({ e_name: name, e_dept: team, e_email: email, e_password: password, e_role: role })
            });
// body: This key in the request options specifies the data you want to send to the server. It’s used primarily with POST or PUT requests.
// JSON.stringify(...): This method converts a JavaScript object into a JSON string. This is necessary because the body of the request needs to be in a format that the server can understand, and JSON is a common format for APIs.

            if (response.ok) {
                alert('Sign Up Successful!');
                navigate('/employee-management');
// navigate: This function is part of routing libraries (like svelte-routing or others) that manage navigation in single-page applications (SPAs).
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

<!-- <div class="container">
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
</div> -->

<section class="vh-100 bg-image"
  style="background-image: url('https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp');">
  <div class="mask d-flex align-items-center h-100 gradient-custom-3">
    <div class="container h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-12 col-md-9 col-lg-7 col-xl-6">
          <div class="card" style="border-radius: 15px;">
            <div class="card-body p-5">
              <h2 class="text-uppercase text-center mb-5">Create an account</h2>

              <form>

                <div data-mdb-input-init class="form-outline mb-4">
                  <input type="text" id="form3Example1cg" class="form-control form-control-lg" placeholder="Name" bind:value={name}/>
                </div>

                <div data-mdb-input-init class="form-outline mb-4">
                  <input type="email" id="form3Example3cg" class="form-control form-control-lg" placeholder="Email" bind:value={email}/>
                </div>

                <div data-mdb-input-init class="form-outline mb-4">
                  <input type="password" id="form3Example4cg" class="form-control form-control-lg" placeholder="Password" bind:value={password}/>
                </div>

                <div data-mdb-input-init class="form-outline mb-4">
                  <input type="email" id="form3Example3cg" class="form-control form-control-lg" placeholder="Team" bind:value={team}/>
                </div>

                <div data-mdb-input-init class="form-outline mb-4">
                  <select bind:value={role} class="role-select">
                    <option value="employee">Employee</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div class="d-flex justify-content-center">
                  <button  type="button" data-mdb-button-init
                    data-mdb-ripple-init class="btn btn-success btn-block btn-lg gradient-custom-4 text-body" on:click={fetchData}>Register</button>
                </div>

                <p class="text-center text-muted mt-5 mb-0">Have already an account? <a href="#!"
                    class="fw-bold text-body" on:click={handleLogin}><u>Login here</u></a></p>

              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
.gradient-custom-3 {
  /* fallback for old browsers */
  background: #84fab0;
  
  /* Chrome 10-25, Safari 5.1-6 */
  background: -webkit-linear-gradient(to right, rgba(132, 250, 176, 0.5), rgba(143, 211, 244, 0.5));
  
  /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  background: linear-gradient(to right, rgba(132, 250, 176, 0.5), rgba(143, 211, 244, 0.5))
  }
  .gradient-custom-4 {
  /* fallback for old browsers */
  background: #84fab0;
  
  /* Chrome 10-25, Safari 5.1-6 */
  background: -webkit-linear-gradient(to right, rgba(132, 250, 176, 1), rgba(143, 211, 244, 1));
  
  /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  background: linear-gradient(to right, rgba(132, 250, 176, 1), rgba(143, 211, 244, 1))
  }
  .card{
    line-height: 0%;
  }
</style>

<!-- <style>
  .container {
    max-width: 400px; 
    /* This ensures the element doesn't exceed this width, making it responsive on larger screens */
    margin: auto;
    /* Centers the element horizontally within its parent container. When used with a defined width (or max-width), it will center the element on the page. */
    padding: 2rem;
    /* This creates space between the content and the border, improving readability */
    border: 1px solid #ddd;
    /* Adds a light gray border (hex code #ddd) around the element, giving it a defined edge */
    border-radius: 10px;
    /* Rounds the corners of the element with a radius of 10 pixels, creating a softer, more modern appearance. */
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    /* Applies a subtle shadow effect beneath the element. The values define the horizontal offset (0), vertical offset (6px), blur radius (12px), and color (a semi-transparent black), giving a sense of depth. */
    background-color: #fff;
    /* Sets the background color of the element to white (#fff), providing a clean and simple look. */
  }

  h2 {
    text-align: center;
    /* Centers the text horizontally within the element. This is useful for headings, titles, or any text that you want to draw attention to. */
    color: #333;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
  }

  input {
    width: 95%;
    /* Sets the width of the input element to 95% of its parent container, allowing for responsiveness while maintaining some margin on the sides. */
    padding: 12px;
    margin-bottom: 1rem;
    /* Creates space below the input field, helping to separate it from other elements (like buttons or subsequent inputs). */
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 16px;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
    /* Applies a subtle inner shadow effect, which gives the input a slightly recessed look. This enhances depth and focus on the input area. */
    transition: border-color 0.3s, box-shadow 0.3s;
    /* Enables smooth transitions for the border color and box shadow when these properties change (e.g., on focus). This improves the visual feedback for user interactions. */
  }

  input:focus {
    /* The CSS snippet styles input elements when they are focused (i.e., when the user clicks or tabs into them). */
    border-color: #28a745;
    /* Changes the border color of the input to a shade of green */
    box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.25);
    /* Adds an outer glow effect around the input field with a green tint. */
    outline: none;
    /* Removes the default outline that browsers apply to focused elements. */
  }

  .button1 {
    width: 100%;
    padding: 12px;
    background: linear-gradient(45deg, #28a745, #218838);
    /* The background property is a shorthand for several background-related properties, including background-color, background-image, background-repeat, background-position, background-size, and background-attachment.
    You can use it to define multiple background aspects in one line. For example, you can set a color and an image simultaneously. */
    /* The background-color property specifically targets only the background color of an element. */
    color: white;
    /* Sets the text color to white */
    border: none;
    border-radius: 6px;
    font-size: 16px;
    cursor: pointer;
    /* Press cltr + space to get the list of all the possible values for cursor property of CSS */
    /* Changes the cursor to pointer while hovering over the button */
    transition: background 0.3s, transform 0.3s;
    /* Specifies that changes to the background and transform properties will animate over 0.3 seconds, creating a smooth transition effect when the button state changes (e.g., on hover). */
  }

  .button1:hover {
    background: linear-gradient(45deg, #218838, #1e7e34);
    /* When the element is hovered over, its background changes to a linear gradient that transitions from a dark green shade (#218838) to a slightly lighter green (#1e7e34), oriented at a 45-degree angle. */
    transform: scale(1.05);
    /* The transform: scale(1.05) property slightly increases the size of the element, making it appear larger when hovered. */
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
    /* sets the background color to white 
    The background-color property specifically targets only the background color of an element.*/
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
</style> -->
