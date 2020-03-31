//var STORAGE_KEY = 'chatApp-chat-12345'
//var chatStorage = {
    //fetch: function () {
        //var chats = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      //  return chats;
        //parse is the opposite of stringify
    //},
    //save: function (chats) {
    //    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  //  }
//}

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
            <h5>User ID: {{ user_id }} </h5>
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
        current_workspace: null,
    },
    methods: {
        deleteWorkspace(id, i) {
            fetch("https://cors-anywhere.herokuapp.com/" + "http://206.189.202.188:43554/workspaces/" + id + ".json", {
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
        },
        saveCurrentWorkspace(){
            localStorage.setItem('current_workspace', this.current_workspace);
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
                <input type="radio" id="{{ workspace.id }}" :value="workspace.id" v-model="current_workspace" v-on:change="saveCurrentWorkspace()">
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
            <span>Selected: {{ current_workspace }}</span>
            <h5>Create a new workspace:</h5>
            <input v-model="newWorkspace" v-on:keyup.enter='addWorkspace(newWorkspace)'/>
            <button v-on:click="addWorkspace(newWorkspace)">Add</button>
            <small>adding item...{{newWorkspace}}</small>
        </div>
    `
});
let app = new Vue({
    el: "#chatApp",
    data: {
        welcomeMessage: 'Chat App',
        //chats: chatStorage.fetch(),
        chats: '',
       
        addChatMessage: '',
        conn: new WebSocket('ws://206.189.202.188:8080')
    },

    watch: {
        //chats: {
          //  handler: function(chats) {
            //    chatStorage.save(chats);
            //}
        //}
    },

    methods: {
        addChat(event){
            const text = event.target.value
           //this.chats.push({text, done: false, id: Date.now()})
            // event.target.value = ''
            fetch("https://cors-anywhere.herokuapp.com/" + "http://206.189.202.188:43554/messages/add.json", {
                body: JSON.stringify({"body": text}),
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
                this.conn.send(JSON.stringify(data))
            })  
            //this.chats = ({message:this.text, id:this.user_id})
            this.addChatMessage = ''
        },

        removeChat(id) {
            //this.chats = this.chats.filter(chat => chat.id !== id)
        },



    },
    mounted() {
        this.conn.onopen = function(e) {
            console.log("Connection established!");
        };
        this.conn.onmessage = function(e) {
        console.log(e.data);
        };

        this.conn.onclose = function(e) {
            console.log("Connection Closed!");
        }
    },
});
