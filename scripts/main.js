
import { get, set } from "https://cdn.jsdelivr.net/npm/idb-keyval@6/+esm";

class User {
    name;
    pass;
    id;

    constructor(name, pass, id) {
        this.name = name;
        this.pass = pass;
        this.id = id;
    }
}

class Message {
    senderID;
    id;
    content;
    targetID;

    constructor(senderID, id, content, targetID) {
        this.senderID = senderID;
        this.id = id;
        this.content = content;
        this.targetID = targetID;
    }
}

let gUsers = [];
let gUserID = -1;

function loadUsers() {
    // gUsers = JSON.parse(localStorage.getItem("users"));
}

function saveUsers() {
    // localStorage.setItem("users", JSON.stringify(gUsers));
}

function signIn() {
    set("hello", "hi");
}

function signOut() {
    alert(get("hello"));
}

function signUp() {

}

document.body.onload = function () {
    document.getElementById("sign-in-button").addEventListener('click', (event)=>{alert('hiya!');});
};
