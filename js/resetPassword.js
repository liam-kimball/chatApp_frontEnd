let resetPassword = new Vue({
    el: "#resetPassword",
    data: {
     password: '',
     reenterPassword : '', 
     email :'',
     token : ''
    },

    methods: {

        // -------- Resets password to the given password then fetches the reset password from the Api and validates the token -------
        resetPassword(password, reEnterPassword) {
           
            if(password == reEnterPassword)
            {
                fetch("http://206.189.202.188:43554/users/resetPassword/"+this.email+"?token="+this.token+"&password=" + password , {
                    body: JSON.stringify({
                   
                    }),
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept" : "application/json"
                    },
                })
                .then(response => response.json())
                .then((data) => {
                 if(data.password == "Token Expired.")
                {
                    alert("Token Expired.");
                }
                else if (data.password == "Your password has been updated."){
                    alert("Your password has been updated.");
                    location.replace("/index.html")
                }
                else
                {
                    alert("Error Occured");
                }
                })
            }
            else
            {
                alert("Passwords Dont Match!");
            }

        }
    },
    mounted() {
        //------ Splits email and token from the link ----------
        var parameters = location.search.substring(1).split("&");
        var email = parameters[0].split("=");
        this.email = email[1]
        console.log(email);
        var token = parameters[1].split("=");
        this.token = token[1];
        console.log(token);

    },

    template: `
      
        <div id="loginbox">
    <h1>Reset Password</h1>
         <div class="form-group col-lg-9">
         <input class="form-control" type="text" name="password" v-model="password" placeholder="Password" />
         </div>
         <div class="form-group col-lg-9">
         <input class="form-control" type="text" name="reenterPassword" v-model="reenterPassword" placeholder="Reenter Password" />
         </div>
        <div>
    <div id="log-btndiv">
    <button class="btn btn-outline-light btn-lg " type="button" v-on:click="resetPassword(password, reenterPassword)" >Reset Password</button>
    </div>
    
   </div>
    `
});