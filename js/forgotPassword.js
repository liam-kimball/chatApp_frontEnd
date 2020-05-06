let forgotPassword = new Vue({
    el: "#forgotPassword",
    data: {
     email: '',
        
    },

    methods: {
        forgotPassword(email) {
            //------------ Allows the login information to be sent and being able to get the token to store it into local storage -----------------
            fetch("http://206.189.202.188:43554/users/forgotPassword/"+ email +".json", {
                body: JSON.stringify({
                   
                }),
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
            })
            .then(response => response.json())
            .then((data) => {
             if(data.email == "Email Has Been Sent")
            {
                alert("An Email Has Been Sent to Reset Your Password");
                location.replace("/index.html")
            }
            else
            {
                alert("An Error Occured Please Check if Email is correct")
            }
            
            })
            
        }
    },
    mounted() {
       
    },

    template: `
      
        <div id="loginbox">
    <h1>Forgot Password</h1>
         <div class="form-group col-lg-9">
         <input class="form-control" type="text" name="email" v-model="email" placeholder="Email" />
         </div>
        <div>
    <div id="log-btndiv">
    <button class="btn btn-outline-light btn-lg " type="button" v-on:click="forgotPassword(email)" >Forgot Password</button>
    </div>
    
   </div>
    `
});