

let login = new Vue({
    el: "#login",
    data: {
        username: '',
        password: '',
        token: ''
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
            } catch(e) {
                console.log('Cant find token');
                //localStorage.removeItem('token');
            }
        }
    },

    template: `
        <div> 
            <h1>Login</h1>
            <input type="text" name="username" v-model="username" placeholder="Username" />
            <input type="password" name="password" v-model="password" placeholder="Password" />
            <button type="button" v-on:click="login(username, password)">Login</button>
            <h5>Token: {{token}}</h5>
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
        <div> 
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

let wspace = new Vue({
    el: "#wspace",
    data: {
        title: 'Name of current workspaces',
        editWorkspace: null,
        workspaces: [""],
        newWorkspace: '',
    },
    methods: {
        deleteWorkspace(id, i) {
            fetch("http://206.189.202.188:43554/workspaces" + id, {
                method: "DELETE"
            })
            .then(() => {
                this.workspaces.splice(i,1);
            })
        },
        updateWorkspace(workspace) {
            fetch("http://206.189.202.188:43554/workspaces" + workspace.id, {
                body: JSON.stringify(workspace),
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then(() => {
                this.editWorkspace = null;
            })
        },
        addWorkspace(name){
            fetch("http://206.189.202.188:43554/workspaces/add.json", {
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
                this.workspaces.push(data);
            })             
        }
    },
    mounted() {
        fetch("http://206.189.202.188:43554/workspaces.json")
        .then(response => response.json())
        .then((data) => {
            this.workspaces = data;
        })
    },
    template: `
        <div>
            <h4> Workspaces: </h4>
            <li v-for="workspace, i in workspaces">
                <div v-if="editWorkspace === workspace.id">
                    <input v-on:keyup.enter="updateWorkspace(workspace)" v-model="workspace.name" />
                    <button v-on:click="updateWorkspace(workspace)">save</button>
                
                </div>
                <div v-else>
                    <button v-on:click="editWorkspace = workspace.id">edit</button>
                    <button v-on:click="deleteWorkspace(workspace.id, i)">X</button>
                    <h4>{{workspace.name}}</h4>
                    <h5>id: {{workspace.id}}</h5>
                </div>
            </li>
            <br><br>
            <h5>Create a new workspace:</h5>
            <input v-model="newWorkspace" v-on:keyup.enter='addWorkspace(newWorkspace)'/>
            <button v-on:click="addWorkspace(newWorkspace)">Add</button>
            <small>adding item...{{newWorkspace}}</small>
        </div>
    `
});