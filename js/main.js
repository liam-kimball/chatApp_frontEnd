let topnav = new Vue({
    el: "#topnav",
    data: {
        username: '',
        token: '',
       
    },

    methods: {
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
    <a  v-if="localStorage.getItem('token') != null" href="users.html">Users</a>
    <a  v-if="localStorage.getItem('token') != null" href="dms.html">Direct Messages</a>
    <a v-if="localStorage.getItem('token') != null" onclick="logout()">Logout</a>
  </div>
    
    `
});


function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('current_workspace');
    localStorage.removeItem('current_thread');
    localStorage.removeItem('user_id');
    location.reload();
    location.replace("/index.html")
}

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
                localStorage.setItem('token', data.data.token);
                try {
                    this.token = localStorage.getItem('token');
                    this.user_id = JSON.parse(atob(this.token.split('.')[1])).sub;
                } catch(e) {
                    console.log('Cant find token');
                    //localStorage.removeItem('token');
                }
                localStorage.setItem('user_id', this.user_id);
                localStorage.setItem('username', this.username);
                location.replace("/channels.html")
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
    `
});

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
            // add proxy url to allow calls from local system, will need to be taken out later
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
                localStorage.setItem('token', data.data.token);
                try {
                    this.token = localStorage.getItem('token');
                    
                } catch(e) {
                    console.log('Cant find token');
                    //localStorage.removeItem('token');
                }
                location.replace("/channels.html")
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

let workspaces = new Vue({
    el: "#workspace",
    data: {
        title: 'Name of current workspaces',
        editWorkspace: null,
        workspaces: [],
        workspaceUsers: [],
        newWorkspace: '',
        current_workspace: null,
        joinWorkspaceID: '',
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
            fetch("https://cors-anywhere.herokuapp.com/" + "http://206.189.202.188:43554/workspaces/" + workspace.id + ".json", {
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
                //console.log(data);
                this.workspaces.push(data["Work Space"]);
            })             
        },
        saveCurrentWorkspace(){
            localStorage.setItem('current_workspace', this.current_workspace);
            localStorage.setItem('current_thread', null)
        },
        joinWorkspace(){
            fetch("http://206.189.202.188:43554/workspacesUsers/.json", {
            method: "POST",    
            headers: {"Authorization": "Bearer " + localStorage.getItem('token')}
        })
        .then(response => response.json())
        .then((data) => {
            //console.log(data.Workspaces);
            this.workspaces = data.Workspaces;
        })
        }
    },
    mounted() {
        localStorage.setItem('current_thread', null);
        fetch("http://206.189.202.188:43554/workspaceUsers/index/" + localStorage.getItem('user_id') + ".json", {
            method: "GET",    
            headers: {"Authorization": "Bearer " + localStorage.getItem('token')}
        })
        .then(response => response.json())
        .then((data) => {
            //console.log(data);
            console.log(data.WorkSpaces);
            workspaceUsers = data.WorkSpaces;
            //this.workspaces = data.Workspaces;
        });
        fetch("http://206.189.202.188:43554/workspaces.json", {
            method: "GET",    
            headers: {"Authorization": "Bearer " + localStorage.getItem('token')}
        })
        .then(response => response.json())
        .then((data) => {
            //console.log(data.Workspaces);
            //console.log(workspaceUsers);
            for( x in workspaceUsers){
                var filtered = (data.Workspaces).filter(function (entry) {
                    //console.log(entry.id);
                    //console.log(workspaceUsers[x].workspace_id);
                    return entry.id === workspaceUsers[x].workspace_id;
                });
                this.workspaces.push(filtered[0]);
            }
            console.log(this.workspaces);
            //this.workspaces = data.Workspaces;
            
        });
    },
    template: `
        <div class="container p-3 my-3 border">
            <h4> Workspaces: </h4>
           <!--<h6> Current workspace: {{ current_workspace }}</h6>-->
            <li v-for="workspace, i in workspaces" class="list-unstyled btn-group btn-group-toggle btn-block my-1">
                <template v-if="localStorage.getItem('current_workspace') == workspace.id">
                    <label class="btn btn-dark active">
                        <input type="radio" id="{{ workspace.id }}" :value="workspace.id" v-model="current_workspace" v-on:change="saveCurrentWorkspace(); threads.updateThreadsList();">
                        <div class="container text-left">
                            <div v-if="editWorkspace === workspace.id">
                                <input v-on:keyup.enter="updateWorkspace(workspace)" v-model="workspace.name" />
                                <button v-on:click="updateWorkspace(workspace)">save</button>
                            </div>
                            <div v-else>
                                <h6>{{workspace.name}}</h6>
                                <template v-if="workspace.owner_user_id == localStorage.getItem('user_id')">
                                    <button v-on:click="editWorkspace = workspace.id">edit</button>
                                    <button v-on:click="deleteWorkspace(workspace.id, i)">X</button>
                                </template>
                            <!--<h5>id: {{workspace.id}}</h5>-->
                            <!--<p>owner_id: {{workspace.owner_user_id}}</p>-->
                            </div>
                        </div>
                    </label>
                </template>
                <template v-else>
                    <label class="btn btn-primary">
                        <input type="radio" id="{{ workspace.id }}" :value="workspace.id" v-model="current_workspace" v-on:change="saveCurrentWorkspace(); threads.updateThreadsList();">
                        <div class="container text-left">
                            <div v-if="editWorkspace === workspace.id">
                                <input v-on:keyup.enter="updateWorkspace(workspace)" v-model="workspace.name" />
                                <button v-on:click="updateWorkspace(workspace)">save</button>
                            </div>
                            <div v-else>
                                <h6>{{workspace.name}}</h6>
                                <template v-if="workspace.owner_user_id == localStorage.getItem('user_id')">
                                    <button v-on:click="editWorkspace = workspace.id">edit</button>
                                    <button v-on:click="deleteWorkspace(workspace.id, i)">X</button>
                                </template>
                                <!--<h5>id: {{workspace.id}}</h5>-->
                                <!--<p>owner_id: {{workspace.owner_user_id}}</p>-->
                            </div>
                        </div>
                    </label>
                </template>
            </li>
            <div>
                <h5>Join a Workspace:</h5>
                <div class="input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text" id="basic-addon1">#</span> 
                    </div>
                    <input class="form-control" v-model="joinWorkspaceID" v-on:keyup.enter='joinWorkspace()'/>
                    <div class="input-group-append">
                        <button class="btn btn-outline-dark" v-on:click="joinWorkspace()">Join</button>
                    </div>            
                </div>
                <small>enter a workspace ID #</small>
            </div><br><br>
            <div>
                <h5>Create a new workspace:</h5>
                <div class="input-group">
                    <input class="form-control" v-model="newWorkspace" v-on:keyup.enter='addWorkspace(newWorkspace)'/>
                    <div class="input-group-append">
                        <button class="btn btn-outline-dark" v-on:click="addWorkspace(newWorkspace)">Add</button>
                    </div>            
                </div>
            </div>
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
        current_thread: null,
        threadsUsers: [],
    },
    methods: {
        deleteThread(id, i) {
            fetch("http://206.189.202.188:43554/threads/" + id + ".json", {
                method: "DELETE"
            })
            .then(() => {
                this.threads.splice(i,1);
            })
        },
        updateThreads(thread) {
            fetch("http://206.189.202.188:43554/threads/" + thread.id + ".json", {
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
            fetch("http://206.189.202.188:43554/threads/add.json", {
                body: JSON.stringify({
                    "name": name,
                    "workspace_id": localStorage.getItem('current_workspace'),
                }),
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem('token')
                },
            })
            .then(response => response.json())
            .then((data) => {
                //console.log(data);
                this.threads.push(data["New Thread"]);
            })             
        },
        updateThreadsList(){
            fetch("http://206.189.202.188:43554/threads.json", {
                method: "GET",
                headers: {"Authorization": "Bearer " + localStorage.getItem('token')}
            })
            .then(response => response.json())
            .then((data) => {
                //console.log(data.Threads);
                var filtered = (data.Threads).filter(function (entry) {
                    return JSON.stringify(entry.workspace_id) === localStorage.getItem('current_workspace');
                });
                //console.log(filtered);
                this.threads = filtered;
            })
        },
        saveCurrentThread(){
            localStorage.setItem('current_thread', this.current_thread);
        }
    },
    mounted() {
        fetch("http://206.189.202.188:43554/threads.json", {
            method: "GET",    
            headers: {"Authorization": "Bearer " + localStorage.getItem('token')}
        })
        .then(response => response.json())
        .then((data) => {
            //console.log(data.Threads);
            var filtered = (data.Threads).filter(function (entry) {
                if(localStorage.getItem('current_workspace') != "null"){
                    return JSON.stringify(entry.workspace_id) === localStorage.getItem('current_workspace');
                }
            });
            //console.log(filtered);
            this.threads = filtered;
        })
        fetch("http://206.189.202.188:43554/threadsUsers/index/" + localStorage.getItem('user_id') + ".json", {
            method: "GET",    
            headers: {"Authorization": "Bearer " + localStorage.getItem('token')}
        })
        .then(response => response.json())
        .then((data) => {
            //console.log(data["Threads_Users"]);
            threadsUsers = data["Threads_Users"];
        });
    },
    template: `
        <div class="container p-3 my-3 border">
            <h4> Threads: </h4>
          <!--  <h6> Current thread: {{ current_thread }}</h6> -->
            <li v-for="thread, i in threads" class="list-unstyled btn-group btn-group-toggle btn-block my-1">
                <template v-if="localStorage.getItem('current_thread') == thread.id">
                    <label class="btn btn-light active">
                        <input type="radio" id="{{ thread.id }}" :value="thread.id" v-model="current_thread" v-on:change="saveCurrentThread(); message.updateMessageList();">
                        <div class="container text-left">
                            <div v-if="editThread === thread.id">
                                <input v-on:keyup.enter="updateThreads(thread)" v-model="thread.name" />
                                <button v-on:click="updateThreads(thread)">save</button>
                            
                            </div>
                            <div v-else>
                                <h6>{{thread.name}}</h6>
                                <!-- 
                                <button v-on:click="editThread = thread.id">edit</button>
                                <button v-on:click="deleteThread(thread.id, i)">X</button>
                                -->
                                
                            <!--<h5>id: {{thread.id}}</h5>-->
                                <!--<h6>workspace_id: {{ thread.workspace_id }}</h6>-->
                            </div>
                        </div>
                    </label>
                </template>
                <template v-else>
                    <label class="btn btn-warning">
                        <input type="radio" id="{{ thread.id }}" :value="thread.id" v-model="current_thread" v-on:change="saveCurrentThread(); message.updateMessageList();">
                        <div class="container text-left">
                            <div v-if="editThread === thread.id">
                                <input v-on:keyup.enter="updateThreads(thread)" v-model="thread.name" />
                                <button v-on:click="updateThreads(thread)">save</button>
                            
                            </div>
                            <div v-else>
                                <h6>{{thread.name}}</h6>
                                <!-- 
                                <button v-on:click="editThread = thread.id">edit</button>
                                <button v-on:click="deleteThread(thread.id, i)">X</button>
                                -->
                                
                            <!--<h5>id: {{thread.id}}</h5>-->
                                <!--<h6>workspace_id: {{ thread.workspace_id }}</h6>-->
                            </div>
                        </div>
                    </label>
                </template>
            </li>
            <h5>Create a new thread:</h5>
            <div class="input-group">
                <input class="form-control" v-model="newThread" v-on:keyup.enter='addThread(newThread)'/>
                <div class="input-group-append">
                    <button class="btn btn-outline-light" v-on:click="addThread(newThread)">Add</button>
                </div>            
            </div>
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
        fetch("http://206.189.202.188:43554/users.json", {
            method: "GET",    
            headers: {"Authorization": "Bearer " + localStorage.getItem('token')}
        })
        .then(response => response.json())
        .then((data) => {
            //console.log(data.users);
            this.users = data.users;
        })
    },
    template: `
        <div class="container p-3 my-3 border">
            <p>**admin only**</p>
            <h4> Users: </h4>
            <li v-for="user, i in users">
                <div class="container p-3 my-3 border">
                    <div v-if="editUser === user.id">
                        <input v-on:keyup.enter="updateUser(user)" v-model="user.username" />
                        <button v-on:click="updateUser(user)">save</button>
                    
                    </div>
                    <div v-else>
                        <!-- <button v-on:click="editUser = user.id">edit</button>
                        <button v-on:click="deleteUser(user.id, i)">X</button> -->
                        <h6>id: {{user.id}}</h6>
                        <h4>username: {{user.username}}</h4>
                        <h5>full name: {{user.first_name}} {{user.last_name}}</h5>
                        <h5>email: {{user.email}}</h5>
                    </div>
                </div>
            </li>
        </div>
    `
});


let message = new Vue({
    el: "#message",
    data: {
        welcomeMessage: 'Chat App',
        //chats: chatStorage.fetch(),
        chats: [],
        addChatMessage: '',
        conn: new WebSocket('ws://206.189.202.188:8080?token=' + localStorage.getItem('token')),
        newMessage: ''
    },

    watch: {
        //chats: {
          //  handler: function(chats) {
            //    chatStorage.save(chats);
            //}
        //}
    },

    methods: {
        addChat(text){
            //const text = event.target.value
           //this.chats.push({text, done: false, id: Date.now()})
            // event.target.value = ''
            if(localStorage.getItem('current_thread') == "null"){
                alert("Select a thread to send message to");
            } else {
                fetch("http://206.189.202.188:43554/messages/add.json", {
                    body: JSON.stringify({
                        "body": text,
                        "thread_id": localStorage.getItem('current_thread'),
                        "username": localStorage.getItem('username'),
                    }),
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem('token')
                    },
                })
                .then(response => response.json())
                .then((data) => {
                    console.log(data);
                    this.token = localStorage.getItem('token');
                    this.user_id = JSON.parse(atob(this.token.split('.')[1])).sub;
                    //this.workspaces.push(data.Work_Space);
                    //localStorage.setItem('user_id', data.user_id);
                    this.conn.send(JSON.stringify({
                        "body": text, 
                        "user_id": this.user_id, 
                        "thread_id": localStorage.getItem('current_thread'), 
                        "username": localStorage.getItem('username'),
                    }))
                })  
                //this.chats = ({message:this.text, id:this.user_id})
                this.addChatMessage = '';
                this.newMessage = '';
            }
        },

        removeChat(id) {
            //this.chats = this.chats.filter(chat => chat.id !== id)
        },

        updateMessageList() {
            document.getElementById('chats').innerHTML = '';
            fetch("http://206.189.202.188:43554/messages/index/" + localStorage.getItem('current_thread') + ".json", {
                method: "GET",
                headers: { "Authorization": "Bearer " + localStorage.getItem('token') },
            })
            .then(response => response.json())
            .then((data) => {
                //console.log(data);
                this.chats = data.Messages;     
            });
            var temp = document.getElementById('chatsWindow');
            temp.scrollTop = temp.scrollHeight;  
        }

    },
    mounted() {
        fetch("http://206.189.202.188:43554/messages/index/" + localStorage.getItem('current_thread') + ".json", {
            method: "GET",
            headers: { "Authorization": "Bearer " + localStorage.getItem('token') },
        })
        .then(response => response.json())
        .then((data) => {
            //console.log(data);
            this.chats = data.Messages;     
        });
        var temp = document.getElementById('chatsWindow');
        temp.scrollTop = temp.scrollHeight;  

        this.conn.onopen = function(e) {
            console.log("Connection established!");
        };
        this.conn.onmessage = function(e) {
            //console.log(e.data);
            var data = JSON.parse(e.data);
            console.log(JSON.stringify(data));
            if(data.thread_id === localStorage.getItem('current_thread')){
                if(data.from == "Me") {
                    document.getElementById("chats").innerHTML += '<div class="container bg-info p-2 my-1 border">' + '<h6>' + data.username + ':</h6><p>' + data.body + '</p><span class="time-right">' + Date(data.created) + '</span></div>';
                } else {
                    document.getElementById("chats").innerHTML += '<div class="container bg-secondary p-2 my-1 border">' + '<h6>' + data.username + ':</h6><p>' + data.body + '</p><span class="time-right">' + Date(data.created)+ '</span></div>';
                }
            }
            var temp = document.getElementById('chatsWindow');
            temp.scrollTop = temp.scrollHeight;          
            
        }
        this.conn.onclose = function(e) {
            console.log("Connection Closed!");
        }
    },
    template: `
        <div class="container p-3 my-3 border rounded">
            <h4> Messages: </h4>
            <div id="chatsWindow" class="overflow-auto border rounded p-1" style="height: 600px;">
                <li v-for="chat, i in chats" style="list-style-type:none;">
                    <template v-if="chat.user_id == localStorage.getItem('user_id')">
                        <div class="container bg-info p-2 my-1 border">
                            <h6>{{chat.username}}:</h6>
                            <p>{{chat.body}}</p>
                            <span class="time-right">{{new Date(Date.parse(chat.created))}}</span>
                        </div>
                    </template>
                    <template v-else>
                        <div class="container bg-secondary p-2 my-1 border">
                            <h6>{{chat.username}}:</h6>
                            <p>{{chat.body}}</p>
                            <span class="time-right">{{new Date(Date.parse(chat.created))}}</span>
                        </div>
                    </template>
                </li>
                <div id="chats"></div>
                
            </div>
            <div class="input-group w-100 my-3">
                <input class="form-control" v-model="newMessage" v-on:keyup.enter="addChat(newMessage)"/>
                <div class="input-group-append">
                    <button class="btn btn-outline-light" v-on:click="addChat(newMessage)">Send</button>
                </div> 

        </div>
    `
});


let DMSusers = new Vue({
    el: "#DMSusers",
    data: {
        title: 'Current users',
        editUser: null,
        users: [],
        threadsUsers: [],
        selected_user: '',
        current_thread: '',
    },
    methods: {
        addThread(){
            fetch("http://206.189.202.188:43554/threads/add.json", {
                body: JSON.stringify({
                    "name": '',
                }),
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem('token')
                },
            })
            .then(response => response.json())
            .then((data) => {
                console.log(data);
                //this.threads.push(data["New Thread"]);
                //console.log(data["New Thread"].id);
                localStorage.setItem('current_thread', data["New Thread"].id);
                this.current_thread = data["New Thread"].id;
                fetch("http://206.189.202.188:43554/threadsUsers/add.json", {
                    body: JSON.stringify({
                        "thread_id": this.current_thread,
                        "user_id": this.selected_user,
                    }),
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem('token')
                    },
                })
                .then(response => response.json())
                .then((data) => {
                    console.log(data);
                    threadsUsers.push(data["New Thread"]);
                    //console.log(this.threadsUsers)
                });
                fetch("http://206.189.202.188:43554/threadsUsers/add.json", {
                    body: JSON.stringify({
                        "user_id": localStorage.getItem('user_id'),
                        "thread_id": this.current_thread,
                    }),
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem('token')
                    },
                })
                .then(response => response.json())
                .then((data) => {
                   //console.log(data);
                   threadsUsers.push(data["New Thread"]);
                   //console.log(threadsUsers)
                });
            });   
            
        },    
        saveSelectedUser(){
            localStorage.setItem('current_thread', null);
            //console.log(threadsUsers);
            //console.log(this.selected_user);
            for( x in threadsUsers){
                //console.log(x);
                //console.log(threadsUsers[x].user_id);
                if( threadsUsers[x].user_id == this.selected_user){
                    localStorage.setItem('current_thread', threadsUsers[x].thread_id);
                    break;
                }
            }
            if(localStorage.getItem('current_thread') == "null"){
                //console.log("adding a new thread");
                this.addThread();
            }
           
        },
    },
    mounted() {
        localStorage.setItem('current_workspace', null);
        localStorage.setItem('current_thread', null);
        fetch("http://206.189.202.188:43554/users/indexs.json", {
            method: "GET",    
            headers: {"Authorization": "Bearer " + localStorage.getItem('token')}
        })
        .then(response => response.json())
        .then((data) => {
            //console.log(data.users);
            var filtered = (data.users).filter(function (entry) {
                return JSON.stringify(entry.id) != localStorage.getItem('user_id');
            });
            this.users = filtered;
        });
        fetch("http://206.189.202.188:43554/threadsUsers/index/" + localStorage.getItem('user_id') + ".json", {
            method: "GET",    
            headers: {"Authorization": "Bearer " + localStorage.getItem('token')}
        })
        .then(response => response.json())
        .then((data) => {
            //console.log(data["Threads_Users"]);
            threadsUsers = data["Threads_Users"];
        });
    },
    template: `
        <div class="container p-3 my-3 border">
            <h4>{{ title }}</h4>
           
           
            <li v-for="user, i in users" class="list-unstyled btn-group btn-group-toggle btn-block my-1">
                <template v-if="selected_user == user.id">
                    <label class="btn btn-light active">
                        <input type="radio" id="{{ user.id }}" :value="user.id" v-model="selected_user" v-on:change="saveSelectedUser(); message.updateMessageList();">
                        <div class="container text-left">
                            <h6>username: </h6><h4>{{user.username}}</h4>
                            <h6>user_id: {{user.id}}</h6>
                        </div>
                    </label>
                </template>
                <template v-else>
                    <label class="btn btn-warning">
                        <input type="radio" id="{{ user.id }}" :value="user.id" v-model="selected_user" v-on:change="saveSelectedUser(); message.updateMessageList();">
                        <div class="container text-left">
                            <h6>username: </h6><h4>{{user.username}}</h4>
                            <h6>user_id: {{user.id}}</h6>
                        </div>
                    </label>
                </template>
            </li> 
        
               
        </div>
    `
});
