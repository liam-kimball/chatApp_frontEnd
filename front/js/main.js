var STORAGE_KEY = 'chatApp-chat-12345'
var chatStorage = {
    fetch: function () {
        var chats = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        return chats;
        //parse is the opposite of stringify
    },
    save: function (chats) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
    }
}


let app = new Vue({
    el: "#chatApp",
    data: {
        welcomeMessage: 'Chat App',
        chats: chatStorage.fetch(),
        addChatMessage: '',
    },

    watch: {
        chats: {
            handler: function(chats) {
                chatStorage.save(chats);
            }
        }
    },

    methods: {
        addChat(event){
            const text = event.target.value
            this.chats.push({text, done: false, id: Date.now()})
            // event.target.value = ''
            this.addChatMessage = ''
        },

        removeChat(id) {
            this.chats = this.chats.filter(chat => chat.id !== id)
        },



    },
    mounted() {

    },
});
