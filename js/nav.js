// --- Nave bar function ---
let topnav = new Vue({
    el: "#topnav",
    data: {
        username: '',
        token: '',
       
    },

    methods: {
        //------ checks if there is a token ----
        updateUser() {
            this.token = localStorage.getItem('token');
        }
    },
    mounted() {

    },

    template: `
    <div>
    <a> <h6>ChatApp</h6></a>
    <a v-if="localStorage.getItem('token') == null" href="index.html">Login</a>
    <a v-if="localStorage.getItem('token') == null" href="signup.html">Signup</a>
    <a  v-if="localStorage.getItem('token') != null" href="channels.html">Channel</a>
    <a  v-if="localStorage.getItem('token') != null" href="dms.html">Direct Messages</a>
    <a v-if="localStorage.getItem('token') != null" onclick="logout()">Logout</a>
  </div>
    
    `
});