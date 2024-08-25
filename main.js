
    import { get, set, update } from "https://cdn.jsdelivr.net/npm/idb-keyval@6/+esm";

    set("users", JSON.stringify([{username: "dev", password: "dev123",emails: [], color: "seagreen", description: "uhhh... idk",
                                  last_group_id: 0, likes: 10, notifications: ""}]));
    set("posts", JSON.stringify([{sender_id: 0, content: "pls work", likes: 2}]));
    set("groups", JSON.stringify([{member_ids: [0], posts: [{sender_id: 0, content: "pls work", likes: 2}],
                                  name: "my group!", description: "it's my group!", password: "join", owner_id: 0}]));
    
    /**
     * TO DO:
     * child more [command prompt]
     * edit messages with contenteditable
    */

    const EMOJI_CODES = {
        "star": 11088,
        "heart": 128151,
        "smile": 128512,
        "grin": 128513,
        "laugh": 128518,
        "evil": 128520,
        "wink": 128521,
        "blush": 128522,
        "heart_eyes": 128525,
        "sunglasses": 128526,
        "smirk": 128527,
        "blank": 128528,
        "unamused": 128530,
        "sad": 128532,
        "kiss": 128536,
        "tounge_out": 128539,
        "angry": 128544,
        "tear": 128549,
        "shocked": 128550,
        "cry": 128557,
        "suprised": 128558,
        "omg": 128561,
        "embarrassed": 128563,
        "nerd": 129299,
        "think": 129300,
        "question": 129320,
        "quiet": 129323,
        "mind_blown": 129327,
        "yawn": 129393,
        "party": 129395,
        "closed_smile": 128578,
        "wave": 128075,
        "point_up": 128070,
        "point_down": 128071,
        "point_left": 128072,
        "point_right": 128073,
        "thumbs_up": 128077,
        "fingers_crossed": 129310,
        "clap": 128079,
        "ok": 128076,

        "peacock": 129434,
        "dodo": 129444,
        "badger": 129441,
        "mammoth": 129443,
        "shrimp": 129424,
        "turkey": 129411,
        "fish": 128032,
        "puffer_fish": 128033,
        "rooster": 128019,
        "chicken": 128020,
        "snake": 128013,
        "snail": 128012,
        "dragon": 128009,
        "rat": 128000,
        "bird": 128038,
        "chick": 128036,
        "penguin": 128039,
        "duck": 129414
    };

    const THE_FORUM_ID = 30;

    let g_banned_user_passwords = [];

    let g_users = [];
    let g_current_user_id = -1;

    let g_posts = [];

    let g_mode = "forum";
    let g_theme_color = "rgb(50,50,50)";

    let g_groups = [];
    let g_current_group_id = -1;

    let g_users_with_notifications = [];

    let g_post_mentions = [];

        let zzzz = "this sucks";

    class User {
        username;
        password;
        emails;
        color;
        description;
        last_groud_id;
        likes;
        notifications;

        // settings;

        constructor(username, password) {
            this.username = username;
            this.password = password;
            this.emails = [];
            this.color = "rgb(50,50,50)";
            this.description = "";
            this.last_groud_id = -1;
            this.likes = 0;
            this.notifications = "";

            // this.settings = {
            //     "child_mode": false,
            //     "recieve_notifications": true,
            // };
        }

    }

    class Post {
        sender_id;
        content;
        likes;

        constructor(sender_id, content) {
            this.sender_id = sender_id;
            this.content = content;
            this.likes = [];
        }
    }


    class Group {
        member_ids;
        posts;
        name;
        description;
        password;
        owner_id;

        constructor(name, password, owner_id) {
            this.name = name;
            this.password = password;
            this.owner_id = owner_id;
            this.description = `${name} group`;
            this.member_ids = [owner_id];
            this.posts = [new Post(THE_FORUM_ID, `Welcome to your new group, <b>@${g_users[g_current_user_id].username}!</b>`)];
        }

    }


    // markup formatter
    // supports italics and bold, images, audio, video, few emojis, user mentioning
    function convert_to_HTML(source) {
        let output = "";

        let is_italic = false;
        let is_bold = false;

        let is_embed_type = false;
        let is_embed_source = false;

        let embed_source = "";
        let embed_type = "";

        let is_quote = false;

        let emoji_name = "";
        let is_emoji_name = false;

        let is_mention_name = false;
        let mention_name = "";


        for (let i = 0; i < source.length; ++i) {
            if (source[i] == '\"') {
                if (is_quote) {
                    output += "&#147;";
                    is_quote = false;
                } else {
                    output += "&#148;";
                    is_quote = true;
                }
            } else if (source[i] == '\'') {
                output += "&#146";
            } else if (source[i] == '*') {
                if (is_italic) {
                    output += "</i>";
                    is_italic = false;
                } else {
                    output += "<i>";
                    is_italic = true;
                }
            } else if (source[i] == '^') {
                if (is_bold) {
                    output += "</b>";
                    is_bold = false;
                } else {
                    output += "<b>";
                    is_bold = true;
                }
            } else if (source[i] == '[') {
                is_embed_type = true;
            } else if (source[i] == ']') {
                is_embed_type = false;
            } else if (is_embed_type) {
                embed_type += source[i];
            } else if (source[i] == '{') {
                is_embed_source = true;
            } else if (source[i] == '}') {
                is_embed_source = false;

                if (embed_type == "image") {
                    output += `<img style=\"width:500px;\" src=\"file:///C:/Users/Apple Gooseberry/${embed_source}\" />`;
                } else if (embed_type == "audio") {
                    output += `<audio controls src=\"file:///C:/Users/Apple Gooseberry/${embed_source}\">`;
                } else if (embed_type == "video") {
                    output += `<video style=\"width:500px;\" controls src=\"file:///C:/Users/Apple Gooseberry/${embed_source}\">`;
                } else if (embed_type == "link") {
                    output += `<a href=\"file:///C:/Users/Apple Gooseberry/${embed_source}\">${embed_source}</a>`
                }

                embed_type = "";
                embed_source = "";

            } else if (is_embed_source) {
                embed_source += source[i];
            } else if (source[i] == '$') {
                if (is_emoji_name) {
                    is_emoji_name = false;
                    output += `&#${EMOJI_CODES[emoji_name]}`;
                    emoji_name = "";
                } else {
                    is_emoji_name = true;
                }
            } else if (is_emoji_name) {
                emoji_name += source[i];
            } else if (source[i] == '\\') {
                if (source[i + 1] == 'n') {
                    output += "<br>";
                    i += 1;
                } else {
                    output += source[i + 1];
                    i += 1;
                }
            } else {
                output += source[i];
            }
        }

        // console.log(embed_type);
        // console.log(embed_source);

        return output;
    }

    function create_group() {
        if (g_current_user_id == -1) {
            alert("Please sign in first!");
            return;
        }

        let group_name = prompt("Create a name for your group");
        if (group_name == null) {
            return;
        } else if (group_name == "") {
            alert("Invalid group name");
            return;
        } else if (group_exists(group_name)) {
            alert("Group name is already taken!");
            return;
        }

        let password = prompt("Create a password for your group");
        if (password == null) {
            return;
        } else if (password == "") {
            alert("Invalid password");
            return;
        }

        g_groups.push(new Group(group_name, password, g_current_user_id));
        save_groups();

        alert("Enjoy your new group!");

    }

    function load_groups() {
        get("groups").then((val) => {g_groups = JSON.parse(val);});
    }

    function save_groups() {
        update("groups", (val) => JSON.stringify(g_groups));
    }

    function select_color() {
        let color = prompt("Type a colour code, eg: rgb(200,50,100) or seagreen");

        if (color == "" || color == null) {
            return;
        } else {
            g_users[g_current_user_id].color = color;
            save_users();
            reload_user();
            reload_messages();
        }
    }

    function change_password() {
        if (g_current_user_id == -1) {
            return;
        }

        let password = prompt("Create a new password");

        if (password == null) {
            return;
        } else if (password == "") {
            alert("Invalid password");
            return;
        } else {
            g_users[g_current_user_id].password = password;

            save_users();
        }
    }

    function change_username() {
        if (g_current_user_id == -1) {
            return;
        }

        let username = prompt("Create a new username");

        if (username == null) {
            return;
        } else if (username == "") {
            alert("Invalid username");
            return;
        } else {
            g_users[g_current_user_id].username = username;

            save_users();
            reload_user();
            reload_messages();
        }
    }

    function group_exists(group_name) {
        for (let i = 0; i < g_groups.length; ++i) {
            if (g_groups[i].name == group_name) {
                return true;
            }
        }
        return false;
    }

    function get_group_id(group_name) {
        let group_id = -1;

        for (let i = 0; i < g_groups.length; ++i) {
            if (g_groups[i].name == group_name) {
                group_id = i;
            }
        }

        return group_id;
    }

    function user_is_in_group(group_name) {
        let group_member_ids = g_groups[get_group_id(group_name)].member_ids;

        for (let i = 0; i < group_member_ids.length; ++i) {
            if (group_member_ids[i] == g_current_user_id) {
                return true;
            }
        }

        return false;
    }

    function leave_group() {
        if (!confirm(`Leave group ${g_groups[g_current_group_id].name}?`)) {
            return;
        }
        g_groups[g_current_group_id].posts.push(new Post(THE_FORUM_ID, `<b>@${g_users[g_current_user_id].username}</b> left the group`));
        g_groups[g_current_group_id].member_ids.splice(g_groups[g_current_group_id].member_ids.indexOf(g_current_user_id), 1);
        g_users[g_groups[g_current_group_id].owner_id].notifications += `@${g_users[g_current_user_id].username} left your group ${g_groups[g_current_group_id].name}\n`;
        set_user_has_notifications(g_groups[g_current_group_id].owner_id, true);
        g_current_group_id = -1;
        show_groups();
        save_groups();
        reload_messages();
    }

    function get_groups_containing_user() {
        let groups_containing_user = [];

        for (let i = 0; i < g_groups.length; ++i) {
            for (let j = 0; j < g_groups[i].member_ids.length; ++j) {
                if (g_groups[i].member_ids[j] == g_current_user_id) {
                    groups_containing_user.push(i);
                }
            }
        }

        return groups_containing_user;
    }

    function select_group() {
        g_current_group_id = Number(document.getElementById("group-select").value);
        document.getElementById("global-group-select").value = g_current_group_id;
        if (g_current_group_id != -1) {
            document.getElementById("current_group_name").innerText = g_groups[g_current_group_id].name;
        } else {
            document.getElementById("current_group_name").innerText = "Not in group";
        }

        reload_messages();

    }

    function enter_group() {
        let group_id = document.getElementById("global-group-select").value;
        if (group_id == -1) {
            document.getElementById("current_group_name").innerText = "Not in group";
        } else {
            if (user_is_in_group(g_groups[group_id].name)) {
                g_current_group_id = group_id;
                document.getElementById("current_group_name").innerText = g_groups[g_current_group_id].name;
                document.getElementById("group-select").value = document.getElementById("global-group-select").value;
            } else {
                let password = prompt("What is the password for this group?");
                if (password == null) {
                    document.getElementById("global-group-select").value = g_current_group_id;
                    return;
                } else if (password != g_groups[group_id].password) {
                    document.getElementById("global-group-select").value = g_current_group_id;
                    alert("Incorrect password");
                    return;
                }

                g_groups[group_id].member_ids.push(g_current_user_id);
                g_current_group_id = group_id;
                g_groups[g_current_group_id].posts.push(new Post(THE_FORUM_ID, `<b>@${g_users[g_current_user_id].username}</b> joined the group`));
                document.getElementById("current_group_name").innerText = g_groups[g_current_group_id].name;
                document.getElementById("group-select").innerHTML += `<option value =\"${g_current_group_id}\">${g_groups[g_current_group_id].name}</option>`;
                document.getElementById("group-select").value = document.getElementById("global-group-select").value;

                g_users[g_groups[g_current_group_id].owner_id].notifications += `@${g_users[g_current_user_id].username} joined your group ${g_groups[g_current_group_id].name}\n`;
                set_user_has_notifications(g_groups[g_current_group_id].owner_id, true);
            }
        }

        save_groups();

        reload_messages();
    }

    function show_groups() {
        if (g_current_user_id == -1) {
            alert("Please sign in first!");
            return;
        }

        g_mode = "group";

        if (g_current_group_id == -1) {
            document.getElementById("current_group_name").innerText = "Not in a group";
        } else {
            document.getElementById("current_group_name").innerText = g_groups[g_current_group_id].name;
        }

        document.getElementById("group-select").innerHTML = "<option value=\"-1\">No Group</option>";
        document.getElementById("global-group-select").innerHTML = "<option value=\"-1\">No Group</option>";


        let groups_containing_user = get_groups_containing_user();
        for (let i = 0; i < groups_containing_user.length; ++i) {
            document.getElementById("group-select").innerHTML += `<option value=\"${groups_containing_user[i]}\">${g_groups[groups_containing_user[i]].name}</option>`;
        }

        for (let i = 0; i < g_groups.length; ++i) {
            document.getElementById("global-group-select").innerHTML += `<option value=\"${i}\">${g_groups[i].name}</option>`;
        }

        document.getElementById("group_control").hidden = false;
        document.getElementById("email_address_control").hidden = true;

        reload_messages();
    }

    function save_description() {
        g_users[g_current_user_id].description = document.getElementById("description_input").value;
        reload_messages();
        save_users();
    }

    function show_posts() {
        g_mode = "forum";

        document.getElementById("email_address_control").hidden = true;
        document.getElementById("group_control").hidden = true;

        reload_messages();
    }

    function show_emails() {
        if (g_current_user_id == -1) {
            alert("Please sign in first!");
            return;
        }

        g_mode = "email";
        document.getElementById("email_address_control").hidden = false;
        document.getElementById("group_control").hidden = true;

        reload_messages();
    }

    function load_posts() {
        // g_posts = JSON.parse(localStorage.getItem("posts"));
        get("posts").then((val) => {g_posts = JSON.parse(val);});
    }


    function save_posts() {
        // localStorage.setItem("posts", JSON.stringify(g_posts));
        update("posts", (val) => JSON.stringify(g_posts));
    }

    function load_users() {
        // g_users = JSON.parse(localStorage.getItem("users"));
        get("users").then((val) => {g_users = JSON.parse(val);});
    }

    function save_users() {
        // localStorage.setItem("users", JSON.stringify(g_users));
        update("users", (val) => JSON.stringify(g_users));
    }

    // idk what this does but i think it updates the UI
    function reload_user() {
        if (g_current_user_id == -1) {
            document.getElementById("username_banner").innerHTML = "<b>Not Signed In</b>";
            document.getElementById("chat_control").hidden = true;
            document.getElementById("email_address_control").hidden = true;
            document.getElementById("description_input").hidden = true;
            document.getElementById("hud").style.borderColor = "rgb(50,50,50)";
            g_mode = "forum";
        } else {
            document.getElementById("username_banner").innerHTML = `<b>${g_users[g_current_user_id].username}</b>`;
            document.getElementById("username_banner").title = `You have ${g_users[g_current_user_id].likes} likes`;
            document.getElementById("chat_control").hidden = false;
            document.getElementById("email_address_control").hidden = true;
            document.getElementById("description_input").hidden = false;
            document.getElementById("description_input").value = g_users[g_current_user_id].description;
            document.getElementById("hud").style.borderColor = g_users[g_current_user_id].color;
            g_mode = "forum";
        }
    }

    function get_user_id(username) {
        let id = -1;

        for (let i = 0; i < g_users.length; ++i) {
            if (username == g_users[i].username) {
                id = i;
            }
        }

        return id;
    }

    function username_exists(username) {
        for (let i = 0; i < g_users.length; ++i) {
            if (g_users[i].username == username) {
                return true;
            }
        }

        return false;
    }


    function correct_password(username, password) {

        for (let i = 0; i < g_users.length; i++) {
            if (g_users[i].username == username && g_users[i].password == password) {
                return true;
            }
        }

        return false;
    }

    function sign_in() {
        let username = prompt("Enter username:");
        if (username == null) {
            return;
        } else if (username_exists(username)) {
            let password = prompt("Enter password:");

            if (correct_password(username, password)) {
                g_current_user_id = get_user_id(username);
                g_current_group_id = -1;
                    alert(`Welcome back, ${username}!`);
            } else {
                alert("Incorrect password.");
                return;
            }

        } else {
            alert("Username does not exist.");
            return;
        }

        show_posts();

        save_users();
        reload_user();
        reload_messages();

    }

    function sign_out() {
        if (g_current_user_id == -1) {
            return;
        }

        // alert(`Goodbye, ${g_users[g_current_user_id].username}`);
        g_current_user_id = -1;
        g_current_group_id = -1;

        reload_user();
        g_mode = "forum";

        show_posts();
        reload_messages();
    }

    function sign_up() {

        let username = prompt("Please enter a username...");

        if (username == null) {
            return;
        } else if (username == "") {
            alert("A username is required");
            return;
        } else if (username_exists(username)) {
            alert(`Username \"${username}\" already exists. Please sign in or choose a different one.`);
            return;

        } else {
            let password = prompt("Please make a password...");
            if (password == null) {
                return;
            } else if (password == "") {
                alert("A password is required");
                return;
            } else {

                g_users.push(new User(username, password));
                g_current_user_id = get_user_id(username);

                alert(`Welcome, ${username}!`);

                save_users();
                reload_user();
                reload_messages();

            }
        }
    }

    function edit_post() {

    }

    function delete_post(sender_id, post_id) {
        if (g_current_user_id != sender_id) {
            alert("You can't delete other user's posts");
            return;
        }

        if (g_mode == "forum") {
            if (confirm("Delete post?")) {
                g_posts.splice(post_id, 1);
                save_posts();
            }
        } else if (g_mode == "group") {
            if (confirm("Delete post?")) {
                g_groups[g_current_group_id].posts.splice(post_id, 1);
                save_groups();
            }
        } else if (g_mode == "email") {
            alert("Email deletion is not currently supported");
            return;
        }


        reload_messages();
    }

    function like_message(sender_id, post_id) {

        if (g_mode != "forum") {
            alert("Likes are only available on Forum posts");
            return;
        } else if (g_current_user_id == -1) {
            alert("Please sign in first!");
            return;
        } else if (sender_id == g_current_user_id) {
            alert("Please don't Like your own posts!");
            return;
        }

        if (g_posts[post_id].likes.includes(g_current_user_id)) {
            alert("You've already Liked this post");
            return;
        }

        g_users[sender_id].notifications += `\"${g_users[g_current_user_id].username}\" liked one of your posts\n`;
        set_user_has_notifications(sender_id, true);
        g_users[sender_id].likes++;
        g_posts[post_id].likes.push(g_current_user_id);

        save_users();
        save_posts();
        reload_messages();
    }

    function reload_messages() {
        let html_code = "";

        let source = [];
        if (g_mode == "forum") {
            source = g_posts;
        } else if (g_mode == "email") {
            source = g_users[g_current_user_id].emails;
        } else if (g_mode == "group") {
            if (g_current_group_id == -1) {
                document.getElementById("messages").innerHTML = "Not in any group";
                return;
            } else {
                source = g_groups[g_current_group_id].posts;
            }
        }

        let target_i = (source.length) > 50 ? (source.length - 50) : 0;

        for (let i = (source.length - 1); i > (target_i - 1); --i) {

            if (g_current_user_id == source[i].sender_id) {
                html_code += `<div title=\"This post has ${source[i].likes.length} likes\" class=\"post\" style=\"border-color: ${g_users[source[i].sender_id].color};\">` +
                    `<div class=\"post-title\" title=\"(User has ${g_users[source[i].sender_id].likes} likes) - ${g_users[source[i].sender_id].description}\">${g_users[source[i].sender_id].username}</div>` +
                    `<div class=\"post-content\">${source[i].content}</div><div class=\"post_control\" style=\"text-align:right;\">` +
                    ` <button onclick=\"edit_post(${source[i].sender_id}, ${i})\">Edit</button> <button onclick=\"delete_post(${source[i].sender_id}, ${i})\">Delete</button></div></div>`;
            } else {
                html_code += `<div class=\"post\" style=\"border-color: ${g_users[source[i].sender_id].color};\">` +
                    `<div class=\"post-title\" title=\"(User has ${g_users[source[i].sender_id].likes} likes) - ${g_users[source[i].sender_id].description}\">${g_users[source[i].sender_id].username}</div>` +
                    `<div class=\"post-content\">${source[i].content}</div><div class=\"post_control\" style=\"text-align:right;\">` +
                    `<button title=\"This message has ${source[i].likes.length} likes\" onclick=\"like_message(${source[i].sender_id}, ${i})\">Like</button></div></div>`;
            }
        }

        document.getElementById("messages").innerHTML = html_code;

    }


    function send_message() {

        if (g_mode == "forum") {
            let post_content = convert_to_HTML(document.getElementById("chat_text").value);
            if (post_content == "" || post_content == null) {
                alert("Maybe you should write something first...");
            } else {
                g_posts.push(new Post(g_current_user_id, post_content));
            }

            if (g_post_mentions[0] == "everyone") {
                for (let i = 0; i < g_users.length; ++i) {
                    if (i != g_current_user_id) {
                        g_users[i].notifications += `${g_users[g_current_user_id].username} mentioned you in the Forum\n`;
                        set_user_has_notifications(i, true);
                    }
                }
            } else {
                for (let i = 0; i < g_post_mentions.length; ++i) {
                    if (g_users.includes(get_user_id(g_post_mentions[i]))) {
                        g_users[get_user_id(g_post_mentions[i])].notifications += `${g_users[g_current_user_id].username} mentioned you in the Forum\n`;
                        set_user_has_notifications(get_user_id(g_post_mentions[i]), true);
                    }
                }
            }

            document.getElementById("chat_text").value = "";

            save_posts();

            reload_messages();
        } else if (g_mode == "email") {
            let address_s = document.getElementById("email_address_input").value.split('+');

            let post_content = convert_to_HTML(document.getElementById("chat_text").value);

            if (post_content == "") {
                alert("Perhaps you should write something first!");
                return;
            }

            for (let i = 0; i < address_s.length; ++i) {
                let address = address_s[i];
                if (username_exists(address)) {

                    g_users[get_user_id(address)].emails.push(new Post(g_current_user_id, post_content));
                    g_users[g_current_user_id].emails.push(new Post(g_current_user_id, `To <b>${address}</b><br>${post_content}`));
                    save_users();
                    reload_messages();
                } else {
                    alert(`User with name ${address} does not exist.`);
                }
            }
            document.getElementById("chat_text").value = "";
            document.getElementById("email_address_input").value = "";
        } else if (g_mode == "group") {
            if (g_current_group_id == -1) {
                alert("Please join a group first!");
                return;
            }

            let post_content = convert_to_HTML(document.getElementById("chat_text").value);

            if (post_content == "") {
                alert("Maybe write something first?");
                return;
            } else {
                g_groups[g_current_group_id].posts.push(new Post(g_current_user_id, post_content));
                document.getElementById("chat_text").value = "";
            }

            reload_messages();
            save_groups();

        }
    }

    const _HELP_TEXT = "Please contact: @dev, or @The Forum for help.";

    function help_me() {
        alert(_help_text);
    }

    document.body.onload = () => {

    load_users();

    load_posts();

    load_groups();

    reload_messages();

    document.getElementById("chat_text").addEventListener("keydown", (event) => {
        if (event.code == "Enter" && document.getElementById("chat_text").value != "") {
            send_message();
            document.getElementById("chat_text").blur();
        }
    });

        document.getElementById("sign-in-button").addEventListener("click", (ev) => sign_in());
        document.getElementById("sign-out-button").addEventListener("click", (ev) => sign_out());
        document.getElementById("sign-up-button").addEventListener("click", (ev) => sign_up());
        document.getElementById("send_message").addEventListener("click", (ev) => send_message());
        document.getElementById("forum-button").addEventListener("click", (ev) => show_forum());

    }

