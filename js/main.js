// Chat Window App
let chatapp = new Vue({
    el: "#chatWindow",
    data: {
        title: 'Name of current channel',
    
        lists: [
            //{ id:1, item:'play games',},
            //{ id:2, item:'learn more'},
            //{ id:3, item:'take nap'}
        ],
        newItem:'',
    },
    methods: {
        addItem:function(){
            //generate id
            let id = this.lists.length + 1
            if(this.newItem !== ''){
                // create new list instance
                const newList = {id:id, item:this.newItem, completed:false}
                // add it to array
                this.lists.push(newList)
                // turn the new item to an empty string
                this.newItem = ''
                // save the new list
                this.saveLists();

            }
        },
        removeList:function(id){
            Vue.delete(this.lists, id);
            this.saveLists();
        },
        saveLists:function(){
            const parsed = JSON.stringify(this.lists);
            localStorage.setItem('lists', parsed);
        },
        toggleCompleted:function(list){
            list.completed = !list.completed;
            this.saveLists();
        }
    },
    mounted() {
        if (localStorage.getItem('lists')) {
            try {
              this.lists = JSON.parse(localStorage.getItem('lists'));
            } catch(e) {
              localStorage.removeItem('lists');
            }
          }
    },
});


let workspace = new Vue({
    el: "#workspace",
    data: {
        lists: [
            { id:1, item:'Workspace 1',},
            { id:2, item:'Workspace 2'},
            { id:3, item:'Workspace 3'}
        ],
        newItem: '',
    },
methods: {
        addItem:function(){
            //generate id
            let id = this.lists.length + 1
            if(this.newItem !== ''){
                // create new list instance
                const newList = {id:id, item:this.newItem, completed:false}
                // add it to array
                this.lists.push(newList)
                // turn the new item to an empty string
                this.newItem = ''
                // save the new list
                this.saveLists();
            }
        },
        removeList:function(id){
            Vue.delete(this.lists, id);
            this.saveLists();
        },
        saveLists:function(){
            const parsed = JSON.stringify(this.lists);
            localStorage.setItem('lists', parsed);
        },
        toggleCompleted:function(list){
            list.completed = !list.completed;
            this.saveLists();
        }
    },
    mounted() {
        if (localStorage.getItem('lists')) {
            try {
              this.lists = JSON.parse(localStorage.getItem('lists'));
            } catch(e) {
              localStorage.removeItem('lists');
            }
          }
    },
});