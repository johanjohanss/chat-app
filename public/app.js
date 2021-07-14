
        var socket = io();

        var form = document.getElementById('form');
        var input = document.getElementById('input');

        let chooseUser = document.querySelector(".choose-username");

        let date = new Date();
        console.log(date.toLocaleTimeString());

        //Display users
        let userDisplay = document.getElementById("userDisplay");

        //Array for users
        let currentUsers;

        //localuser
        let localUser;

        //Room
        var room = "";
        var roomUser = "";

        /*TO DO*/
        //Storing messages in session
        //var sessionMessages;

        //Messages section
        let messagesSection = document.getElementById("messages");

        //Show emoji functionality
        let showEmoji = document.querySelector(".show-emoji-icon");
        let showEmojiDiv = document.querySelector(".show-emoji");
        let emojiPicker = document.getElementById("emoji-wrapper");

        showEmoji.addEventListener("click", showEmojiPicker)

        function showEmojiPicker(){
            emojiPicker.classList.toggle("show-picker");
            showEmojiDiv.classList.toggle("show-emoji-wide");

            /* ADD FUNCTIONALITY */
            //Make sure messages move so the latest message is visible

        }
        function hideEmojiPicker(){
            emojiPicker.classList.remove("show-picker");
        }

        //document.querySelector('emoji-picker')
        //.addEventListener('emoji-click', event => console.log(event.detail));

        document.querySelector('emoji-picker')
        .addEventListener('emoji-click', function(e){
            input.value = input.value + e.detail.unicode;
        });

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            hideEmojiPicker();
            if (input.value) {
                socket.emit('chat message', input.value, room);
                appendMessage(input.value);
                input.value = '';
            }
        });

        socket.on('chat message', function(msgObject) {
            date = new Date();

            let item = document.createElement('li');
            let msgText = document.createElement("p");
            let msgAuthor = document.createElement("p");
            let msgTime = document.createElement("p");

            msgText.classList.add("msg-text");
            msgAuthor.classList.add("msg-author");
            msgTime.classList.add("msg-time");

            msgText.innerText = msgObject.message;
            msgTime.innerText = date.getHours() + ":" + ('0'+date.getMinutes()).slice(-2);
            msgAuthor.innerText = msgObject.user;

            //If private message
            if(msgObject.private){
                msgAuthor.innerText = "Private message from " + msgObject.user;
            }

            item.appendChild(msgAuthor);
            item.appendChild(msgText);
            item.appendChild(msgTime);

            //Style item
            item.classList.add("message");
            item.classList.add("received-message");

            messagesSection.appendChild(item);

        });

        //Update active users
        socket.on('update users', function(users) {
            currentUsers = users;
            userDisplay.innerHTML = "";

            currentUsers.forEach(user => {
                let userDiv = document.createElement("div");
                userDiv.classList.add("user-div");

                let userName = document.createElement("p");
                userName.innerText = user.username;

                //Enter room when clicking on name of user
                userDiv.addEventListener("click", function(){
                    enterRoom(user, userDiv);
                })

                userDiv.appendChild(userName);
                userDisplay.appendChild(userDiv);
            });
        });

        //User joined chat
        socket.on("user joined", function(username){
            appendJoinMessage(username + " joined the chat!", "join-message");
        });

        socket.on("user disconnected", function(username){
            appendJoinMessage(username + " left the chat!", "join-message");
        })

        function appendJoinMessage(msg, style){
            console.log(msg);
            let item = document.createElement('li');
            let msgText = document.createElement("p");

            msgText.classList.add("msg-text");

            msgText.innerText = msg;

            item.appendChild(msgText);

            //Style item
            item.classList.add("message", style);

            messagesSection.appendChild(item);
        }

        //Appends message to chat. Can also accept a style in the form of a class name 
        function appendMessage(msg, style){

            style = style || "sent-message";

            date = new Date();

            let item = document.createElement('li');
            let msgText = document.createElement("p");
            let msgAuthor = document.createElement("p");
            let msgTime = document.createElement("p");

            msgText.classList.add("msg-text");
            msgAuthor.classList.add("msg-author");
            msgTime.classList.add("msg-time");

            msgText.innerText = msg;
            msgTime.innerText = date.getHours() + ":" + ('0'+date.getMinutes()).slice(-2);
            msgAuthor.innerText = localUser;

            //If the message is a private message
            if(room != ""){
                msgAuthor.innerText = "Private message for " + roomUser;
            }

            item.appendChild(msgAuthor);
            item.appendChild(msgText);
            item.appendChild(msgTime);

            //Style item
            item.classList.add("message");
            item.classList.add(style);

            messagesSection.appendChild(item);
        }

        //Choosing username
        let userForm = document.getElementById("userForm");
        let userInput = document.getElementById("userInput");

        userForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (userInput.value) {
                socket.emit('choose nickname', userInput.value);
                localUser = userInput.value;
                appendJoinMessage("You joined the chat!", "join-message-self");

                userInput.value = '';
                hideLogin();
            }
        });

        //Hides login page
        function hideLogin(){
            chooseUser.classList.add("hide");
        }

        //Scroll detect and show arrow
        window.addEventListener("scroll", function(){
            //Check if messages are scrolled up
            //If so, show arrow to scroll back down to latest message
        });

        //Enter room function
        function enterRoom(user, userDiv){
            

            if(userDiv.classList.contains("user-selected")){
                room = "";
                roomUser = "";
                userDiv.classList.remove("user-selected");
            }else{
                //Clearing previously selected div
                let allUserDivs = document.querySelectorAll(".user-selected");
                if(allUserDivs != null){
                    allUserDivs.forEach(div =>{
                        div.classList.remove("user-selected")
                    })
                }
                room = user.id;
                roomUser = user.username;
                userDiv.classList.add("user-selected");
            }   
        }

        //Elements
        /*let privateRoomBg = document.getElementById("messages-bg-2");
        let backarrow = document.getElementById("backarrow");
        backarrow.addEventListener("click", backToGeneralChat);*/

        //Enter room function
        /*function enterRoom(user){

            room = user.id;

            //Hide all messages
            let messages = document.getElementById("messages");
            messages.classList.add("hide");

            //Private chat - show room
            privateRoomBg.classList.add("message-bg-2-active");
            
            messagesSection = document.getElementById("messages-private");
            messagesSection.classList.remove("hide");

            appendJoinMessage("You joined a private chat with " + user.username, "join-message-self");

        }*/

        //Exit room function
        /*function backToGeneralChat(){
            console.log("go back");
            messagesSection = document.getElementById("messages");
            privateRoomBg.classList.remove("message-bg-2-active");
            room = "";
            appendJoinMessage("You rejoined the general chat", "join-message-self");
        }*/