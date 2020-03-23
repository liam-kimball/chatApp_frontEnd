
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
            //console.log(JSON.stringify({"username": username, "password": password}));
            // add proxy url to allow calls from local system, will need to be taken out later
            fetch("https://cors-anywhere.herokuapp.com/" + "http://206.189.202.188:43554/users/login.json", {
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
                localStorage.setItem('token', data.data.token);
                try {
                    this.token = localStorage.getItem('token');
                    this.user_id = JSON.parse(atob(this.token.split('.')[1])).sub;
                } catch(e) {
                    console.log('Cant find token');
                    //localStorage.removeItem('token');
                }
                
            })
            
        }
    },
    mounted() {
        if (localStorage.getItem('token')) {
            try {
                this.token = localStorage.getItem('token');
                this.user_id = JSON.parse(atob(this.token.split('.')[1])).sub;
            } catch(e) {
                console.log('Cant find token');
                //localStorage.removeItem('token');
            }
            
        }
    },

    template: `
        <div class="container bg-dark p-3 my-3 border"> 
            <h1>Login</h1>
            <input type="text" name="username" v-model="username" placeholder="Username" />
            <input type="password" name="password" v-model="password" placeholder="Password" />
            <button type="button" v-on:click="login(username, password)">Login</button>
            <h5>Token: {{token}}</h5>
            <h5>User ID: {{ user_id }}
            <br><br>
        </div>
    
    `
});

let singUp = new Vue({
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
            // add proxy url to allow calls from local system, will need to be taken out later
            fetch("https://cors-anywhere.herokuapp.com/" + "http://206.189.202.188:43554/users/add.json", {
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
                localStorage.setItem('token', data.data.token);
                try {
                    this.token = localStorage.getItem('token');
                } catch(e) {
                    console.log('Cant find token');
                    //localStorage.removeItem('token');
                }
            })
            
        }
    },


    template: `
        <div class="container bg-dark p-3 my-3 border"> 
            <h2>Create an account</h2>
            <input type="text" name="first_name" v-model="first_name" placeholder="First name" />
            <input type="text" name="last_name" v-model="last_name" placeholder="Last name" />
            <input type="text" name="username" v-model="username" placeholder="Username" />
            <input type="text" name="email" v-model="email" placeholder="Email" />
            <input type="password" name="password" v-model="password" placeholder="Password" />
            <button type="button" v-on:click="signUp(first_name, last_name, username, email, password)">Create</button>
            <h5>Token: {{token}}</h5>
            <br><br>
        </div>
    
    `
});

let workspaces = new Vue({
    el: "#workspace",
    data: {
        title: 'Name of current workspaces',
        editWorkspace: null,
        workspaces: [],
        newWorkspace: '',
    },
    methods: {
        deleteWorkspace(id, i) {
            fetch("https://cors-anywhere.herokuapp.com/" + "http://206.189.202.188:43554/workspaces/" + workspace.id, {
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('token')
                },
            })
            .then(() => {
                this.workspaces.splice(i,1);
            })
        },
        updateWorkspace(workspace) {
            fetch("https://cors-anywhere.herokuapp.com/" + "http://206.189.202.188:43554/workspaces/" + workspace.id, {
                body: JSON.stringify(workspace),
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem('token')
                },
            })
            .then(() => {
                this.editWorkspace = null;
            })
        },
        addWorkspace(name){
            fetch("https://cors-anywhere.herokuapp.com/" + "http://206.189.202.188:43554/workspaces/add.json", {
                body: JSON.stringify({"name": name}),
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem('token')
                },
            })
            .then(response => response.json())
            .then((data) => {
                console.log(data);
                //this.workspaces.push(data.Work_Space);
            })             
        }
    },
    mounted() {
        fetch("https://cors-anywhere.herokuapp.com/" + "http://206.189.202.188:43554/workspaces.json", {
            method: "GET",    
            headers: {"Authorization": "Bearer " + localStorage.getItem('token')}
        })
        .then(response => response.json())
        .then((data) => {
            console.log(data.Workspaces);
            this.workspaces = data.Workspaces;
        })
    },
    template: `
        <div class="container bg-dark p-3 my-3 border">
            <h4> Workspaces: </h4>
            <li v-for="workspace, i in workspaces">
                <div class="container p-3 my-3 border">
                    <div v-if="editWorkspace === workspace.id">
                        <input v-on:keyup.enter="updateWorkspace(workspace)" v-model="workspace.name" />
                        <button v-on:click="updateWorkspace(workspace)">save</button>
                    
                    </div>
                    <div v-else>
                        <button v-on:click="editWorkspace = workspace.id">edit</button>
                        <button v-on:click="deleteWorkspace(workspace.id, i)">X</button>
                        <h4>{{workspace.name}}</h4>
                        <h5>id: {{workspace.id}}</h5>
                        <p>owner_id: {{workspace.owner_user_id}}</p>
                    </div>
                </div>
            </li>
            <h5>Create a new workspace:</h5>
            <input v-model="newWorkspace" v-on:keyup.enter='addWorkspace(newWorkspace)'/>
            <button v-on:click="addWorkspace(newWorkspace)">Add</button>
            <small>adding item...{{newWorkspace}}</small>
        </div>
    `
});

let threads = new Vue({
    el: "#thread",
    data: {
        title: 'Current threads',
        editThread: null,
        threads: [],
        newThread: '',
    },
    methods: {
        deleteThread(id, i) {
            fetch("https://cors-anywhere.herokuapp.com/" + "http://206.189.202.188:43554/threads/" + id, {
                method: "DELETE"
            })
            .then(() => {
                this.threads.splice(i,1);
            })
        },
        updateThreads(thread) {
            fetch("https://cors-anywhere.herokuapp.com/" + "http://206.189.202.188:43554/threads/" + thread.id, {
                body: JSON.stringify(thread),
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem('token')
                },
            })
            .then(() => {
                this.editWorkspace = null;
            })
        },
        addThread(name){
            fetch("https://cors-anywhere.herokuapp.com/" + "http://206.189.202.188:43554/threads/add.json", {
                body: JSON.stringify({"name": name}),
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem('token')
                },
            })
            .then(response => response.json())
            .then((data) => {
                console.log(data);
                //this.workspaces.push(data);
            })             
        }
    },
    mounted() {
        fetch("https://cors-anywhere.herokuapp.com/" + "http://206.189.202.188:43554/threads.json", {
            method: "GET",    
            headers: {"Authorization": "Bearer " + localStorage.getItem('token')}
        })
        .then(response => response.json())
        .then((data) => {
            console.log(data.Threads);
            this.threads = data.Threads;
        })
    },
    template: `
        <div class="container bg-dark p-3 my-3 border">
            <h4> Threads: </h4>
            <li v-for="thread, i in threads">
                <div class="container p-3 my-3 border">
                    <div v-if="editThread === thread.id">
                        <input v-on:keyup.enter="updateThread(thread)" v-model="thread.name" />
                        <button v-on:click="updateThread(thread)">save</button>
                    
                    </div>
                    <div v-else>
                        <button v-on:click="editThread = thread.id">edit</button>
                        <button v-on:click="deleteThread(thread.id, i)">X</button>
                        <h4>{{thread.name}}</h4>
                        <h5>id: {{thread.id}}</h5>
                    </div>
                </div>
            </li>
            <h5>Create a new thread:</h5>
            <input v-model="newThread" v-on:keyup.enter='addThread(newThread)'/>
            <button v-on:click="addThread(newThread)">Add</button>
            <small>adding item...{{newThread}}</small>
        </div>
    `
});

let users = new Vue({
    el: "#users",
    data: {
        title: 'All users',
        editUser: null,
        users: [],
    },
    methods: {
        deleteUser(id, i) {
            fetch("http://rest.learncode.academy/api/lkimball/workspace/" + id, {
                method: "DELETE"
            })
            .then(() => {
                this.threads.splice(i,1);
            })
        },
        updateUser(user) {
            fetch("http://rest.learncode.academy/api/lkimball/thread/" + user.id, {
                body: JSON.stringify(user),
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then(() => {
                this.editUser = null;
            })
        },
    },
    mounted() {
        fetch("https://cors-anywhere.herokuapp.com/" + "http://206.189.202.188:43554/users.json", {
            method: "GET",    
            headers: {"Authorization": "Bearer " + localStorage.getItem('token')}
        })
        .then(response => response.json())
        .then((data) => {
            console.log(data.users);
            this.users = data.users;
        })
    },
    template: `
        <div class="container bg-dark p-3 my-3 border">
            <p>**admin only**</p>
            <h4> Users: </h4>
            <li v-for="user, i in users">
                <div class="container p-3 my-3 border">
                    <div v-if="editUser === user.id">
                        <input v-on:keyup.enter="updateUser(user)" v-model="user.username" />
                        <button v-on:click="updateUser(user)">save</button>
                    
                    </div>
                    <div v-else>
                        <button v-on:click="editUser = user.id">edit</button>
                        <button v-on:click="deleteUser(user.id, i)">X</button>
                        <h4>{{user.username}}</h4>
                        <h5>{{user.first_name}} {{user.last_name}}</h5>
                    </div>
                </div>
            </li>
        </div>
    `
});