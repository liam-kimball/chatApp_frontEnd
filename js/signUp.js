let signUp = new Vue({
    el: "#signUp",
    data: {
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        password: '',
        super_user: 0,
        token: ''
    },

    methods: {
        signUp(first_name, last_name, username, email, password) {
            // ------ Adds user to the User table in the data base -------------
            fetch("http://206.189.202.188:43554/users/add.json", {
                body: JSON.stringify({
                    "first_name" : first_name,
                    "last_name" : last_name,
                    "username" : username,
                    "email" : email,
                    "password" : password,
                    "super_user": 0
                }),
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
            })
            .then(response => response.json())
            .then((data) => {
                if(data.message == "Failed")
                {
                    alert("User with that username or email already exsist");
                }
                else{
                localStorage.setItem('token', data.data.token);
                try {
                    this.token = localStorage.getItem('token');
                    
                } catch(e) {
                    console.log('Cant find token');
                   
                }
                location.replace("/channels.html")
            }
            })
            
        }
    },


    template: `
       
        <div id="signUpbox">
     <h1>ChatApp Sign Up</h1>
        <div class="form-group col-lg-9">
            <input class="form-control" type="text" name="first_name" v-model="first_name" placeholder="First name" />
        </div>
        <div class="form-group col-lg-9">
            <input class="form-control" type="text" name="last_name" v-model="last_name" placeholder="Last name" />
        </div>
        <div class="form-group col-lg-9">
            <input class="form-control" type="text" name="username" v-model="username" placeholder="Username" />
        </div>
        <div class="form-group col-lg-9">
            <input class="form-control" type="text" name="email" v-model="email" placeholder="Email" />
        </div>
        <div class="form-group col-lg-9">
            <input class="form-control" type="password" name="password" v-model="password" placeholder="Password" />
        </div>
        <div>
 <div id="log-btndiv">
 <button class="btn btn-outline-light btn-lg " type="button" v-on:click="signUp(first_name, last_name, username, email, password)">Create</button>
 </div>
  </form>
</div>
    
    `
});