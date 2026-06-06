import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs,
    deleteDoc,
    doc,
    query,
    where
}
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

import {
    getAuth,
    onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

const firebaseConfig = {

    apiKey: "AIzaSyC1gci50EuvNL1YQCGbe0PfsCSlqHEKtTs",

    authDomain:
    "result-print-automacit.firebaseapp.com",

    projectId:
    "result-print-automacit",

    storageBucket:
    "result-print-automacit.firebasestorage.app",

    messagingSenderId:
    "1029253513630",

    appId:
    "1:1029253513630:web:9ca367314fb0c09a0e568f"

};

const app =
initializeApp(firebaseConfig);

const db =
getFirestore(app);

const auth =
getAuth(app);

async function loadResults(user){

    const tbody =
    document.getElementById("resultsBody");

    const classFilter =
    document.getElementById("classFilter");

    tbody.innerHTML = "";

    const q = query(

        collection(db,"students"),

        where(
            "teacherId",
            "==",
            user.uid
        )

    );

    const snapshot =
    await getDocs(q);

    console.log(
        "Documents Found:",
        snapshot.size
    );

    let classes =
    new Set();

    snapshot.forEach((docItem)=>{

        const data =
        docItem.data();

        classes.add(
            data.standard
        );

        tbody.innerHTML += `

        <tr>

            <td>${data.rollNumber}</td>

            <td>${data.studentName}</td>

            <td class="studentClass">
                ${data.standard}
            </td>

            <td>${data.percentage}</td>

            <td>${data.grade}</td>

            <td>${data.status}</td>

            <td>

                <button
                onclick="viewStudent('${docItem.id}')">
                View
                </button>

                <button
                onclick="editStudent('${docItem.id}')">
                Edit
                </button>

                <button
                onclick="deleteStudent('${docItem.id}')">
                Delete
                </button>

            </td>

        </tr>

        `;
    });

    classFilter.innerHTML = `
        <option value="">
            All Classes
        </option>
    `;

    classes.forEach(className => {

        classFilter.innerHTML += `
            <option value="${className}">
                ${className}
            </option>
        `;
    });

}

window.viewStudent = function(id){

    localStorage.setItem(
        "selectedStudent",
        id
    );

    window.location.href =
    "viewResult.html";

};

window.editStudent = function(id){

    localStorage.setItem(
        "editStudentId",
        id
    );

    window.location.href =
    "editResult.html";

};

window.searchStudent = function(){

    let input =
    document.getElementById("searchBox")
    .value
    .toLowerCase();

    let rows =
    document.querySelectorAll(
        "#resultsBody tr"
    );

    rows.forEach(row => {

        let text =
        row.innerText.toLowerCase();

        if(text.includes(input)){

            row.style.display = "";

        }else{

            row.style.display = "none";

        }

    });

};

window.filterClass = function(){

    let selectedClass =
    document.getElementById("classFilter")
    .value;

    let rows =
    document.querySelectorAll(
        "#resultsBody tr"
    );

    rows.forEach(row => {

        let classValue =
        row.querySelector(
            ".studentClass"
        ).innerText.trim();

        if(
            selectedClass === "" ||
            classValue === selectedClass
        ){

            row.style.display = "";

        }
        else{

            row.style.display = "none";

        }

    });

};

window.deleteStudent =
async function(id){

    let confirmDelete =
    confirm(
        "Delete this result?"
    );

    if(!confirmDelete){

        return;

    }

    try{

        await deleteDoc(
            doc(
                db,
                "students",
                id
            )
        );

        alert(
            "Result Deleted"
        );

        location.reload();

    }
    catch(error){

        console.error(error);

        alert(
            "Delete Failed"
        );

    }

};

onAuthStateChanged(
    auth,
    (user)=>{

        if(user){

            loadResults(user);

        }
        else{

            window.location.href =
            "index.html";

        }

    }
);