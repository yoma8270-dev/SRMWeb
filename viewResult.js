import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
    getFirestore,
    doc,
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

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

async function loadStudent(){

    const studentId =
    localStorage.getItem(
        "selectedStudent"
    );

    const docRef =
    doc(
        db,
        "students",
        studentId
    );

    const docSnap =
    await getDoc(docRef);

    if(!docSnap.exists()){

        alert("Student Not Found");

        return;
    }

    const data =
    docSnap.data();

    document.getElementById("school")
        .innerText =
        data.school;

    document.getElementById("studentName")
        .innerText =
        data.studentName;

    document.getElementById("rollNumber")
        .innerText =
        data.rollNumber;

    document.getElementById("standard")
        .innerText =
        data.standard;

    document.getElementById("percentage")
        .innerText =
        "Percentage: " +
        data.percentage;

    document.getElementById("grade")
        .innerText =
        "Grade: " +
        data.grade;

    document.getElementById("status")
        .innerText =
        "Status: " +
        data.status;

    const tbody =
    document.getElementById(
        "subjectTable"
    );

    data.subjects.forEach(subject=>{

        tbody.innerHTML += `

        <tr>

            <td>${subject.name}</td>

            <td>${subject.obtained}</td>

            <td>${subject.total}</td>

        </tr>

        `;
    });

}

loadStudent();