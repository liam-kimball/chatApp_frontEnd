let login = new Vue({
    el: "#login",
    data: {
        username: '',
        password: '',
        token: '',
        user_id: ''
    },

    methods: {
        login(username, password) {
            //------------ Allows the login information to be sent and being able to get the token to store it into local storage -----------------
            fetch("http://206.189.202.188:43554/users/login.json", {
                body: JSON.stringify({
                    "username": username,
                    "password": password
                }),
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
            })
            .then(response => response.json())
            .then((data) => {
             if(data.message == "Invalid username or password")
            {
                alert("Invalid username or password");
            }
            else{
                localStorage.setItem('token', data.data.token);
                try {
                    this.token = localStorage.getItem('token');
                    this.user_id = JSON.parse(atob(this.token.split('.')[1])).sub;
                } catch(e) {
                    console.log('Cant find token');
                  
                }
                localStorage.setItem('user_id', this.user_id);
                localStorage.setItem('username', this.username);
                location.replace("/channels.html")
            }
            })
            
        }
    },
    mounted() {
        // -------- stores the user_id to local storage to be used later -----------
        if (localStorage.getItem('token')) {
            try {
                this.token = localStorage.getItem('token');
                this.user_id = JSON.parse(atob(this.token.split('.')[1])).sub;
                
            } catch(e) {
                console.log('Cant find token');
               
            }
            localStorage.setItem('user_id', this.user_id);
        }
        else {
            localStorage.setItem('user_id', null);
        }
    },

    template: `
      
        <div id="loginbox">
    <h1>ChatApp Login</h1>
         <div class="form-group col-lg-9">
         <input class="form-control" type="text" name="username" v-model="username" placeholder="Username" />
         </div>
        <div class="form-group col-lg-9">
         <input class="form-control" type="password" name="password" v-model="password" placeholder="Password" v-on:keyup.enter="login(username, password)"/>
        </div>
        <div>
    <div id="log-btndiv">
    <button class="btn btn-outline-light btn-lg " type="button" v-on:click="login(username, password)" >Login</button>
    </div>
    
   </div>
   <div>
   <a href="forgotPassword.html" >Forgot Password?</a>
   </div>
    `
});