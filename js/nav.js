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
        <a class="mx-3"><img  src="images/ChatApp.png"></a>
        <a v-if="localStorage.getItem('token') == null" href="index.html"><h4>Login</h4></a>
        <a v-if="localStorage.getItem('token') == null" href="signup.html"><h4>Signup</h4></a>
        <a v-if="localStorage.getItem('token') != null" href="channels.html"><h3>Channels</h3></a>
        <a v-if="localStorage.getItem('token') != null" href="dms.html"><h3>Direct Messages</h3></a>
        <a v-if="localStorage.getItem('token') != null" onclick="logout()"><h3>Logout</h3></a>
    </div>
    `
});