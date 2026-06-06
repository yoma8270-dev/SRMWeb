import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
    getFirestore,
    doc,
    getDoc,
    updateDoc
}
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

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

const studentId =
localStorage.getItem("editStudentId");

function addSubject(
    name="",
    obtained="",
    total=""
){

    const container =
    document.getElementById(
        "subjectsContainer"
    );

    const div =
    document.createElement("div");

    div.classList.add(
        "subject-box"
    );

    div.innerHTML = `

    <input
    type="text"
    class="subjectName"
    placeholder="Subject Name"
    value="${name}">

    <input
    type="number"
    class="obtainedMarks"
    placeholder="Obtained Marks"
    value="${obtained}">

    <input
    type="number"
    class="totalMarks"
    placeholder="Total Marks"
    value="${total}">

    <button
    onclick="removeSubject(this)">
    Delete Subject
    </button>

    `;

    container.appendChild(div);
}

window.removeSubject =
function(button){

    button.parentElement.remove();

};

window.addSubject =
addSubject;

async function loadStudent(){

    const docRef =
    doc(
        db,
        "students",
        studentId
    );

    const snapshot =
    await getDoc(docRef);

    if(!snapshot.exists()){

        alert(
            "Student not found"
        );

        return;
    }

    const data =
    snapshot.data();

    document.getElementById(
        "schoolName"
    ).value =
    data.school;

    document.getElementById(
        "studentStd"
    ).value =
    data.standard;

    document.getElementById(
        "studentName"
    ).value =
    data.studentName;

    document.getElementById(
        "rollNumber"
    ).value =
    data.rollNumber;

    data.subjects.forEach(
        subject => {

        addSubject(
            subject.name,
            subject.obtained,
            subject.total
        );

    });

}

window.updateResult =
async function(){

    let school =
    document.getElementById(
        "schoolName"
    ).value;

    let standard =
    document.getElementById(
        "studentStd"
    ).value;

    let studentName =
    document.getElementById(
        "studentName"
    ).value;

    let rollNumber =
    document.getElementById(
        "rollNumber"
    ).value;

    let subjectNames =
    document.querySelectorAll(
        ".subjectName"
    );

    let obtainedMarks =
    document.querySelectorAll(
        ".obtainedMarks"
    );

    let totalMarks =
    document.querySelectorAll(
        ".totalMarks"
    );

    let subjects = [];

    let totalObtained = 0;

    let totalMaximum = 0;

    let status = "Pass";

    for(
        let i=0;
        i<subjectNames.length;
        i++
    ){

        let obtained =
        Number(
            obtainedMarks[i].value
        );

        let total =
        Number(
            totalMarks[i].value
        );

        subjects.push({

            name:
            subjectNames[i].value,

            obtained:
            obtained,

            total:
            total

        });

        totalObtained +=
        obtained;

        totalMaximum +=
        total;

        if(
            obtained <
            total * 0.35
        ){

            status =
            "Fail";

        }

    }

    let percentage =
    (
        totalObtained /
        totalMaximum
    ) * 100;

    let grade = "F";

    if(percentage >= 90){
        grade = "A+";
    }
    else if(percentage >= 80){
        grade = "A";
    }
    else if(percentage >= 70){
        grade = "B";
    }
    else if(percentage >= 60){
        grade = "C";
    }
    else if(percentage >= 50){
        grade = "D";
    }

    await updateDoc(

        doc(
            db,
            "students",
            studentId
        ),

        {

            school,
            standard,
            studentName,
            rollNumber,
            subjects,

            percentage:
            percentage.toFixed(2)
            + "%",

            grade,
            status

        }

    );

    alert(
        "Result Updated Successfully"
    );

    window.location.href =
    "results.html";

};

loadStudent();