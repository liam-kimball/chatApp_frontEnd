//---------------- Removes all the users information from local storage logging them out of the system -----------------
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('current_workspace');
    localStorage.removeItem('current_thread');
    localStorage.removeItem('user_id');
    location.reload();
    location.replace("/index.html")
}

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
                if(data.data.message == "Failed")
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
        <form>
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
        workspaceThread:'',
    },
    methods: {
        deleteWorkspace(id, i) {
            // ------------- Deletes the work space by sending the workspce_id-----------------
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
            // --------- Updates the name of the workspaces sent ---------------
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
            //-------------- Adds workspace to the workspace table with the name given --------------
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
                this.workspaces.push(data["Work Space"]);
                localStorage.setItem('current_workspace', data["Work Space"].id);
                this.joinWorkspace(data["Work Space"].id);   
            })
                    
        },
        // -------- saves the current workspace and current thread data to the local storage to up date the message list -------------
        saveCurrentWorkspace(){
            localStorage.setItem('current_workspace', this.current_workspace);
            localStorage.setItem('current_thread', '')
            message.updateMessageList();
        },
        
        joinWorkspace(joinWorkspaceID){
            //------------- Validates if the workspace exisit or not --------------------------------
            fetch("http://206.189.202.188:43554/workspaces/view/"+ joinWorkspaceID +".json", {
                method: "GET",    
                headers: {"Authorization": "Bearer " + localStorage.getItem('token')}
            })
            .then(response => response.json())
            .then((data) => {
                
                if(data.message == "Record not found in table \"workspaces\"")
                {
                    alert("Invlaid Workspace ID");
                }  
            });

            // ----------Adds the user to the workspaceUser table----------------
            fetch("http://206.189.202.188:43554/workspaceUsers/add.json", {
            body: JSON.stringify({
                "workspace_id" : joinWorkspaceID,
                "user_id": localStorage.getItem("user_id")
               
            }),
            method: "POST",    
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('token')
            }
            })
            .then(response => response.json())
            .then((data) => {
              
                this.workspaces = data.New_WorkSpace_User;
                localStorage.setItem('current_workspace', data.New_WorkSpace_User.workspace_id);

                // ---------Fetched all users that are in the same workspace as the User_id that is passed through---------------
                fetch("http://206.189.202.188:43554/workspaces/inWorkspace/"+ localStorage.getItem('user_id') +".json", {
                    method: "GET",    
                    headers: {"Authorization": "Bearer " + localStorage.getItem('token')}
                })
                .then(response => response.json())
                .then((data) => {  
                    this.workspaces = data.Workspaces;
                });

                // ---------Fetched all threads from a specific WorkSpace------------------
                fetch("http://206.189.202.188:43554/threads/inThread/"+ joinWorkspaceID +".json", {
                    method: "GET",    
                    headers: {"Authorization": "Bearer " + localStorage.getItem('token')}
                })
                .then(response => response.json())
                .then((data) => {
                    console.log(data);
                    workspaceThread = data.Threads_in_Workspace;
                    console.log(workspaceThread);
                   
                    for( x in workspaceThread){
                        fetch("http://206.189.202.188:43554/threadsUsers/add.json", {
                            body: JSON.stringify({
                                "user_id": localStorage.getItem('user_id'),
                                "thread_id" : workspaceThread[x].id,
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
                        });
                    }
                    threads.updateThreadsList();
                });
            })
        }
    },
    mounted() {
        //----------- sets current workspace and current thread to null -----
        localStorage.setItem('current_workspace', '');
        localStorage.setItem('current_thread', ''); 

        // ---------Fetched all users that are in the same workspace as the User_id that is passed through---------------
        fetch("http://206.189.202.188:43554/workspaces/inWorkspace/"+ localStorage.getItem('user_id') +".json", {
            method: "GET",    
            headers: {"Authorization": "Bearer " + localStorage.getItem('token')}
        })
        .then(response => response.json())
        .then((data) => {
            this.workspaces = data.Workspaces;
        });
        
    },
    template: `
        <div class="container p-3 mt-5">
            <h4> Workspaces: </h4>
            <li v-for="workspace, i in workspaces" class="list-unstyled btn-group btn-group-toggle btn-block my-1">
                <template v-if="localStorage.getItem('current_workspace') == workspace.id">
                    <label class="btn btn-dark active">
                        <input type="radio" id="{{ workspace.id }}" :value="workspace.id" v-model="current_workspace" v-on:change="saveCurrentWorkspace(); threads.updateThreadsList();">
                        <div class="container text-left">
                            <div v-if="editWorkspace === workspace.id">
                                <input v-on:keyup.enter="updateWorkspace(workspace)" v-model="workspace.name" />
                                <button class="btn btn-outline-light" v-on:click="updateWorkspace(workspace)">save</button>
                            </div>
                            <div v-else>
                                <h6>{{workspace.name}}</h6>
                                <template v-if="workspace.owner_user_id == localStorage.getItem('user_id')">
                                    <button class="btn btn-outline-light" v-on:click="editWorkspace = workspace.id">edit</button>
                                    <button class="btn btn-outline-light" v-on:click="deleteWorkspace(workspace.id, i)">X</button>
                                </template>
                            <h5>Invite ID: {{workspace.id}}</h5>
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
                                <button class="btn btn-outline-light" v-on:click="updateWorkspace(workspace)">save</button>
                            </div>
                            <div v-else>
                                <h6>{{workspace.name}}</h6>
                                <template v-if="workspace.owner_user_id == localStorage.getItem('user_id')">
                                    <button class="btn btn-outline-light" v-on:click="editWorkspace = workspace.id">edit</button>
                                    <button class="btn btn-outline-light" v-on:click="deleteWorkspace(workspace.id, i)">X</button>
                                </template>
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
                    <input class="form-control" v-model="joinWorkspaceID" v-on:keyup.enter='joinWorkspace(joinWorkspaceID)'/>
                    <div class="input-group-append">
                        <button class="btn btn-outline-dark" v-on:click="joinWorkspace(joinWorkspaceID)">Join</button>
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
        threads: [],
        newThread: '',
        current_thread: null,
        threadsUsers: [],
    },
    methods: {
        deleteThread(id, i) {
            //------------- Deletes the thread by thread id passsed through ------------------
            fetch("http://206.189.202.188:43554/threads/" + id + ".json", {
                method: "DELETE"
            })
            .then(() => {
                this.threads.splice(i,1);
            })
        },
        updateThreads(thread) {
            //------------- Updates the thread name for the thread_id that is passed throuhg ---------------
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
            //-------------- adds thread to the thread table with the information given ----------
            if(localStorage.getItem('current_workspace') == ''){
                alert("Select a Workspace to send message to");
            } else {
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
              
                this.threads.push(data["New Thread"]);
            })  
        }           
        },
        updateThreadsList(){
            //------------------ updates the thread list to the threads that belong to the current workspace the user has selected -----------
            fetch("http://206.189.202.188:43554/threads.json", {
                method: "GET",
                headers: {"Authorization": "Bearer " + localStorage.getItem('token')}
            })
            .then(response => response.json())
            .then((data) => {
               
                var filtered = (data.Threads).filter(function (entry) {
                    return JSON.stringify(entry.workspace_id) === localStorage.getItem('current_workspace');
                });
               
                this.threads = filtered;
            })
        },
        // -------------- saves the current thread a user has selected to send messages --------------------
        saveCurrentThread(){
            localStorage.setItem('current_thread', this.current_thread);
        }
    },
    mounted() {
        //----------------- Fetches all the threads in the thread Table ---------------------
        fetch("http://206.189.202.188:43554/threads.json", {
            method: "GET",    
            headers: {"Authorization": "Bearer " + localStorage.getItem('token')}
        })
        .then(response => response.json())
        .then((data) => {
           
            var filtered = (data.Threads).filter(function (entry) {
                if(localStorage.getItem('current_workspace') != "null"){
                    return JSON.stringify(entry.workspace_id) === localStorage.getItem('current_workspace');
                }
            });
           
            this.threads = filtered;
        })
        // -------------- Fetches  all users that are in the same thread as the User_id that is passed through ---------------------
        fetch("http://206.189.202.188:43554/threadsUsers/index/" + localStorage.getItem('user_id') + ".json", {
            method: "GET",    
            headers: {"Authorization": "Bearer " + localStorage.getItem('token')}
        })
        .then(response => response.json())
        .then((data) => {
            
            threadsUsers = data["Threads_Users"];
        });
    },
    template: `
        <div class="container p-3 my-3 border rounded">
            <h4> Threads: </h4>
            <li v-for="thread, i in threads" class="list-unstyled btn-group btn-group-toggle btn-block my-1">
                <template v-if="localStorage.getItem('current_thread') == thread.id">
                    <label class="btn btn-light active">
                        <input type="radio" id="{{ thread.id }}" :value="thread.id" v-model="current_thread" v-on:change="saveCurrentThread(); message.updateMessageList();">
                        <div class="container text-left">                            
                             <h6>{{thread.name}}</h6>
                        </div>
                    </label>
                </template>
                <template v-else>
                    <label class="btn btn-warning">
                        <input type="radio" id="{{ thread.id }}" :value="thread.id" v-model="current_thread" v-on:change="saveCurrentThread(); message.updateMessageList();">
                        <div class="container text-left">
                            <h6>{{thread.name}}</h6>
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

let message = new Vue({
    el: "#message",
    data: {
        welcomeMessage: 'Chat App',
        //chats: chatStorage.fetch(),
        chats: [],
        addChatMessage: '',
        conn: new WebSocket('ws://206.189.202.188:8080?token=' + localStorage.getItem('token')), // ----- connects to websocket and send JWT token for validation of the client connecting ------
        newMessage: ''
    },

    methods: {
        // --------- Adds message to the database and send it to the websocket to be sent to the needed users ------------------
        addChat(text){
            //const text = event.target.value
            //this.chats.push({text, done: false, id: Date.now()})
            // event.target.value = ''
            if(localStorage.getItem('current_thread') == ''){
                alert("Select a thread to send message to");
            } else {
                //-------- Adds message to the databse ---------------
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
                    
        // -------- Sends message to websocket to be sent to the other connected clients that need to recieve this message -----------------
                    this.conn.send(JSON.stringify({
                        "body": text, 
                        "user_id": this.user_id, 
                        "thread_id": localStorage.getItem('current_thread'), 
                        "username": localStorage.getItem('username'),
                    }))
                })  
                this.addChatMessage = '';
                this.newMessage = '';
            }
        },

        // ----------- updates the message list for the current chat ------------------
        updateMessageList() {
            document.getElementById('chats').innerHTML = '';
        // ------------- fetches all the messages in thread_id passed -----------------------
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
         // ------------- fetches all the messages in thread_id passed -----------------------
        fetch("http://206.189.202.188:43554/messages/index/" + localStorage.getItem('current_thread') + ".json", {
            method: "GET",
            headers: { "Authorization": "Bearer " + localStorage.getItem('token') },
        })
        .then(response => response.json())
        .then((data) => {
           
            this.chats = data.Messages;     
        });
        var temp = document.getElementById('chatsWindow');
        temp.scrollTop = temp.scrollHeight;  

        //-------------- Opens connection with the websocket so messages can be sent to it ------------------
        this.conn.onopen = function(e) {
            console.log("Connection established!");
        };

        //--------------- Function recieves the message that was sent to the websocket to update the chat box ----------------
        this.conn.onmessage = function(e) {
            //console.log(e.data);
            var data = JSON.parse(e.data);
            console.log(JSON.stringify(data));
            if(data.thread_id === localStorage.getItem('current_thread')){
                if(data.from == localStorage.getItem('user_id')) {
                    document.getElementById("chats").innerHTML += '<div class="container bg-info p-2 my-1 rounded">' + '<h6>' + data.username + ':</h6><p>' + data.body + '</p><span class="time-right">' + Date(data.created) + '</span></div>';
                } else {
                    document.getElementById("chats").innerHTML += '<div class="container bg-secondary p-2 my-1 rounded">' + '<h6>' + data.username + ':</h6><p>' + data.body + '</p><span class="time-right">' + Date(data.created)+ '</span></div>';
                }
            }
            //-------------- Sends push notification only to people whoe need to see the notification ----
            if(data.from != localStorage.getItem('user_id')) {
                if (Notification.permission === "granted") {
                    //------------ Push notification for a Direct message -----------
                    if (data.workspaceName == null && data.threadName == null)
                    {
                        var notification = new Notification(data.username + ( " (Direct message) "),{
                            body:data.body,
                            icon: '/images/ChatApp.png'
                        });
                    }
                    //------------- push notification for a thread -------------------------
                    else{
                        var notification = new Notification(data.username + ( " (" + data.workspaceName + ", "+data.threadName + ") "),{
                            body:data.body,
                            icon: '/images/ChatApp.png'
                        });
                    }
                  }
                }
            var temp = document.getElementById('chatsWindow');
            temp.scrollTop = temp.scrollHeight;          
            }
        // -------------------- Closes connection with the websocket -----------------
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
                        <div class="container bg-info p-2 my-1 rounded">
                            <h6>{{chat.username}}:</h6>
                            <p>{{chat.body}}</p>
                            <span class="time-right">{{new Date(Date.parse(chat.created))}}</span>
                        </div>
                    </template>
                    <template v-else>
                        <div class="container bg-secondary p-2 my-1 rounded">
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
        //---------- Adds the thread for a Direct message if a thread doesnt exisit for that direct message -------------
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

            //------------------- Adds Person you are trying to Direct message to the thread table with the new thread_id ------------------------
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
             //------------------- Adds Current user to Direct message to the thread table with the new thread_id  ------------------------
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
                   threadsUsers.push(data["New Thread"]);
                });
            });   
            
        }, 
        // -------------- Saves the user you have selected to direct message and selects the thread_id -----------------   
        saveSelectedUser(){
            localStorage.setItem('current_thread', '');
            for( x in threadsUsers){
                if( threadsUsers[x].user_id == this.selected_user){
                    localStorage.setItem('current_thread', threadsUsers[x].thread_id);
                    break;
                }
            }
            if(localStorage.getItem('current_thread') == "null"){
               
                this.addThread();
            }
        },
    },
    mounted() {
        // ------------------- Sets local storage item for current thread and current workspace to null ---------------------
        localStorage.setItem('current_workspace', '');
        localStorage.setItem('current_thread', '');

        // -------------------------- Fetches all the Users in the table but only passes user_id and username ---------------------
        fetch("http://206.189.202.188:43554/users/indexs.json", {
            method: "GET",    
            headers: {"Authorization": "Bearer " + localStorage.getItem('token')}
        })
        .then(response => response.json())
        .then((data) => {
            var filtered = (data.users).filter(function (entry) {
                return JSON.stringify(entry.id) != localStorage.getItem('user_id');
            });
            this.users = filtered;
        });
        
        // -------------- Fetches all users that are in the same thread as the User_id that is passed through ------------------------------
        fetch("http://206.189.202.188:43554/threadsUsers/index/" + localStorage.getItem('user_id') + ".json", {
            method: "GET",    
            headers: {"Authorization": "Bearer " + localStorage.getItem('token')}
        })
        .then(response => response.json())
        .then((data) => {
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
