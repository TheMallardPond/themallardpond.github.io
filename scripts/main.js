
import { get, set, update } from "https://cdn.jsdelivr.net/npm/idb-keyval@6/+esm";

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
    console.log('inside sign in func');
    set("hello", "hi");
    console.log('leaving sign in func');
    update("varia", (val) => "hiya!");
    
}

function signOut() {
    console.log('inside sign out func');
    alert(get("hello").then((val) => {console.log(val);}));
    console.log('leaving sign out func');
    get('varia').then((val) => alert(val));
}

function signUp() {

}

document.body.onload = function () {
    document.getElementById("sign-in-button").addEventListener('click', (event)=>{
        alert("'Sign In' clicked");
        signIn();
    });
    document.getElementById("sign-out-button").addEventListener('click', (event)=>{
        alert("'Sign Out' clicked");
        signOut();
    });
};
