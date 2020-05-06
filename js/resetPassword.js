let resetPassword = new Vue({
    el: "#resetPassword",
    data: {
     password: '',
     reenterPassword : ''   
    },

    methods: {
        resetPassword(password, reEnterPassword) {
           
        }
    },
    mounted() {
       
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