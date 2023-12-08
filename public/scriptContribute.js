// Show/hide file input or article input based on the selected upload type
document.getElementById('uploadType').addEventListener('change', function() {
    const fileInputSection = document.getElementById('fileInputSection');
    const articleInputSection = document.getElementById('articleInputSection');

    if (this.value === 'file') {
        fileInputSection.style.display = 'block';
        articleInputSection.style.display = 'none';
    } else if (this.value === 'article') {
        fileInputSection.style.display = 'none';
        articleInputSection.style.display = 'block';
    }
});


document.getElementById('materialType').addEventListener('change', function() {
    var yearInput = document.getElementById('year');
    var submissionDateInput = document.getElementById('submissionDate');

    if (this.value === 'previousYearPaper') {
        yearInput.style.display = 'block';
        submissionDateInput.style.display = 'none';
    } else if (this.value === 'assignment') {
        yearInput.style.display = 'none';
        submissionDateInput.style.display = 'block';
    } else {
        yearInput.style.display = 'none';
        submissionDateInput.style.display = 'none';
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

document.getElementById('branch').addEventListener('change', function() {
    var subjectsSelect = document.getElementById('subject');
    var selectedBranch = this.value;

    // Clear current options
    subjectsSelect.innerHTML = "";

    // Get subjects for the selected branch
    var subjects = subjectsByBranch[selectedBranch];

    // Add each subject as a new option in the subjects select field
    subjects.forEach(function(subject) {
        var option = document.createElement('option');
        option.text = subject;
        option.value = subject;
        subjectsSelect.add(option);
    });
});


import { db } from './firebase.js';

function submitContribution() {
    const form = document.getElementById('contributeForm');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const contributionData = {
            uploadType: form.uploadType.value,
            branch: form.branch.value,
            subject: form.subject.value,
            materialType: form.materialType.value,
            college: form.college.value,
            // Add other fields...

            // Additional data (e.g., verification status)
            verified: false,
        };

        // Store data in Firestore
        await db.collection('contributions').add(contributionData);

        // You can add a success message or redirect the user to another page
    });
}