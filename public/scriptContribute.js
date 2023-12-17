window.onload = function () {
    const uploadType = document.getElementById('uploadType');
    const fileInputSection = document.getElementById('fileInputSection');
    const articleInputSection = document.getElementById('articleInputSection');
    const materialType = document.getElementById('materialType');
    const year = document.getElementById('year');
    const submissionDate = document.getElementById('submissionDate');

    uploadType.addEventListener('change', function () {
        console.log('uploadType change event triggered');
        if (this.value === 'file') {
            console.log('uploadType is file');
            fileInputSection.style.display = 'block';
            articleInputSection.style.display = 'none';
        } else if (this.value === 'article') {
            console.log('uploadType is article');
            fileInputSection.style.display = 'none';
            articleInputSection.style.display = 'block';
        }
    });

    // Manually trigger the 'change' event
    uploadType.dispatchEvent(new Event('change'));

    materialType.addEventListener('change', function () {
        if (this.value === 'previousYearPaper') {
            year.style.display = 'block';
            submissionDate.style.display = 'none';
        } else if (this.value === 'assignment') {
            year.style.display = 'none';
            submissionDate.style.display = 'block';
        } else {
            year.style.display = 'none';
            submissionDate.style.display = 'none';
        }
    });

    var subjectsByBranch = {
        mechanical: ["Subject1", "Subject2", "Subject3"],
        electrical: ["Subject1", "Subject2", "Subject3"],
        civil: ["Solid Mechanics", "Structural Analysis", "Subject3"],
        computer: ["Subject1", "Subject2", "Subject3"],
        electronics: ["Subject1", "Subject2", "Subject3"],
        chemical: ["Subject1", "Subject2", "Subject3"]
        // Add more branches and subjects as needed
    };

    document.getElementById('branch').addEventListener('change', function () {
        var subjectsSelect = document.getElementById('subject');
        var selectedBranch = this.value;

        // Clear current options
        subjectsSelect.innerHTML = "";

        // Get subjects for the selected branch
        var subjects = subjectsByBranch[selectedBranch];

        // Add each subject as a new option in the subjects select field
        subjects.forEach(function (subject) {
            var option = document.createElement('option');
            option.text = subject;
            option.value = subject;
            subjectsSelect.add(option);
        });
    });
}

import { db } from './firebase.js';

function submitContribution() {
    const form = document.getElementById('contributeForm');
    const uploadType = form.uploadType.value;

    const contributionData = {
        uploadType: uploadType,
        branch: form.branch.value,
        subject: form.subject.value,
        materialType: form.materialType.value,
        college: form.college.value,
        // Add other fields...

        // Additional data (e.g., verification status)
        verified: false,
    };

    if (form.uploadType.value === 'file') {
        contributionData.file = form.fileUpload.files[0];
    } else if (form.uploadType.value === 'article') {
        contributionData.articleContent = form.articleContent.value;
    }


    // Store data in Firestore
    // Store data in Firestore
    db.collection('contributions').add(contributionData)
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
}

// Add an event listener to the form to trigger the submitContribution function
document.getElementById('contributeForm').addEventListener('submit', function (e) {
    e.preventDefault();
    submitContribution();
});
