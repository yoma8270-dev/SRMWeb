import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc
}
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

import {
    getAuth
}
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

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

const db =
getFirestore(app);

const auth =
getAuth(app);

function addSubject() {

    let container =
        document.getElementById("subjectsContainer");

    let subjectDiv =
        document.createElement("div");

    subjectDiv.classList.add("subject-box");

    subjectDiv.innerHTML = `

        <input type="text"
               class="subjectName"
               placeholder="Subject Name">

        <input type="number"
               class="obtainedMarks"
               placeholder="Obtained Marks">

        <input type="number"
               class="totalMarks"
               placeholder="Total Marks">

        <button type="button"
                onclick="removeSubject(this)">
            Delete Subject
        </button>

    `;

    container.appendChild(subjectDiv);
}

function removeSubject(button){

    button.parentElement.remove();
}

function calculateResult(){

    let school =
        document.getElementById("schoolName").value;

    let std =
        document.getElementById("studentStd").value;

    let name =
        document.getElementById("studentName").value;

    let roll =
        document.getElementById("rollNumber").value;

    if(
        school.trim() === "" ||
        std.trim() === "" ||
        name.trim() === "" ||
        roll.trim() === ""
    ){
        alert("Please fill all student details");
        return;
    }

    let subjectNames =
        document.querySelectorAll(".subjectName");

    let obtainedMarks =
        document.querySelectorAll(".obtainedMarks");

    let totalMarks =
        document.querySelectorAll(".totalMarks");

    let totalObtained = 0;

    let totalMaximum = 0;

    let status = "Pass";

    let tableBody =
        document.querySelector("#resultTable tbody");

    tableBody.innerHTML = "";

    for(let i = 0; i < subjectNames.length; i++){

        let subject =
            subjectNames[i].value;

        let obtained =
            Number(obtainedMarks[i].value);

        let maximum =
            Number(totalMarks[i].value);

        if(subject.trim() === ""){
            alert("Enter Subject Name");
            return;
        }

        if(obtained > maximum){

            alert(
                "Obtained marks cannot be greater than total marks"
            );

            return;
        }

        totalObtained += obtained;

        totalMaximum += maximum;

        let passMarks = maximum * 0.35;

        if(obtained < passMarks){

            status = "Fail";
        }

        let row = `

            <tr>

                <td>${i + 1}</td>

                <td>${subject}</td>

                <td>${obtained}</td>

                <td>${maximum}</td>

            </tr>

        `;

        tableBody.innerHTML += row;
    }

    if(totalMaximum === 0){
        alert("Add at least one subject");
        return;
    }

    let percentage =
        (totalObtained / totalMaximum) * 100;

    let grade = "";

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
    else{
        grade = "F";
    }

    document.getElementById("resultBox")
        .style.display = "block";

    document.getElementById("collegeHeading")
        .innerText = school;

    document.getElementById("nameResult")
        .innerText = name;

    document.getElementById("rollResult")
        .innerText = roll;

    document.getElementById("stdResult")
        .innerText = std;

    document.getElementById("totalResult")
        .innerText =
            totalObtained + " / " + totalMaximum;

    document.getElementById("percentageResult")
        .innerText =
            percentage.toFixed(2) + "%";

    document.getElementById("gradeResult")
        .innerText = grade;

    document.getElementById("statusResult")
        .innerText = status;

    document.getElementById("saveBtn")
        .disabled = false;
}

async function saveResult(){

    let school =
        document.getElementById("schoolName").value;

    let standard =
        document.getElementById("studentStd").value;

    let studentName =
        document.getElementById("studentName").value;

    let rollNumber =
        document.getElementById("rollNumber").value;

    let percentage =
        document.getElementById("percentageResult").innerText;

    let grade =
        document.getElementById("gradeResult").innerText;

    let status =
        document.getElementById("statusResult").innerText;

    let subjects = [];

    let subjectNames =
        document.querySelectorAll(".subjectName");

    let obtainedMarks =
        document.querySelectorAll(".obtainedMarks");

    let totalMarks =
        document.querySelectorAll(".totalMarks");

    for(let i=0;i<subjectNames.length;i++){

        subjects.push({

            name:
            subjectNames[i].value,

            obtained:
            Number(obtainedMarks[i].value),

            total:
            Number(totalMarks[i].value)

        });
    }

    try{

        await addDoc(
            collection(db,"students"),
            {
                teacherId:
                auth.currentUser.uid,
                school,
                standard,
                studentName,
                rollNumber,
                percentage,
                grade,
                status,
                subjects,
                createdAt:
                new Date().toISOString()
            }
        );

        alert(
            "Result Saved Successfully"
        );

        document.getElementById("saveBtn")
            .disabled = true;

    }
    catch(error){

        console.error(error);

        alert(
            "Error Saving Data"
        );
    }
}

window.addSubject = addSubject;
window.removeSubject = removeSubject;
window.calculateResult = calculateResult;
window.saveResult = saveResult;

window.onload = function(){

    addSubject();

    document.getElementById("saveBtn")
        .disabled = true;
};