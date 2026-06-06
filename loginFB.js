import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail
}
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    setDoc,
    getDoc
}
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const firebaseConfig = {

  apiKey: "AIzaSyC1gci50EuvNL1YQCGbe0PfsCSlqHEKtTs",

  authDomain: "result-print-automacit.firebaseapp.com",

  projectId: "result-print-automacit",

  storageBucket: "result-print-automacit.firebasestorage.app",

  messagingSenderId: "1029253513630",

  appId: "1:1029253513630:web:9ca367314fb0c09a0e568f"

};

const app =
initializeApp(firebaseConfig);

const auth =
getAuth(app);

const db =
getFirestore(app);

document
.getElementById("loginBtn")
.addEventListener("click", async ()=>{

    let email =
    document.getElementById("email").value;

    let password =
    document.getElementById("password").value;

    if(email === "" || password === ""){

        alert("Fill all fields");

        return;
    }

    try{

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        alert(
            "Login Successful"
        );

        window.location.href = "dashboard.html";

    }
    catch(error){

        alert(
            error.message
        );
    }

});

document
.getElementById("registerBtn")
.addEventListener("click", async ()=>{

    let email =
    document.getElementById("email").value;

    let password =
    document.getElementById("password").value;

    if(email === "" || password === ""){

        alert("Fill all fields");

        return;
    }

    try{

        await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        alert(
            "Teacher Registered Successfully"
        );

    }
    catch(error){

        alert(
            error.message
        );
    }

});

document
.getElementById("forgotBtn")
.addEventListener("click", async ()=>{

    let email =
    document.getElementById("email").value;

    if(email === ""){

        alert(
            "Enter your email first"
        );

        return;
    }

    try{

        await sendPasswordResetEmail(
            auth,
            email
        );

        alert(
            "Password reset email sent. Check your inbox."
        );

    }
    catch(error){

        alert(
            error.message
        );

    }

});