import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyAvsKMRtnF0CY0RvNbG6_XoleZhJOs6Ub0",
    authDomain: "engineer-mitra.firebaseapp.com",
    databaseURL: "https://engineer-mitra-default-rtdb.firebaseio.com",
    projectId: "engineer-mitra",
    storageBucket: "engineer-mitra.appspot.com",
    messagingSenderId: "999063294330",
    appId: "1:999063294330:web:d7b8b673986f858e53c6c3",
    measurementId: "G-J2NB2EBPJQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the Firestore service
const db = getFirestore(app);

// Get a reference to the Firebase Storage service
const storage = getStorage(app);

async function submitContribution() {
    const form = document.getElementById('contributeForm');
    const file = form.fileUpload.files[0];

    // Get user inputs
    let branch = form.branch.value;
    let materialType = form.materialType.value;
    let subject = form.subject.value;
    let college = form.college.value;

    // Check if subject or college is not selected
    if (!branch || branch === 'Choose Branch') {
        branch = '.NoBranch';  // Set branch to 'NoBranch' if branch is not selected
    }
    if (!materialType || materialType === 'Choose Material Type') {
        materialType = '.NoMaterialType';
    }
    if (!subject || subject === 'Select Subject') {
        subject = '.NoSubject';
    }
    if (!college || college === 'Select College') {
        college = '.NoCollege';
    }
    // Create a dynamic path based on user inputs
    const filePath = `contributions/${college}/${branch}/${subject}/${materialType}/${file.name}`;

    // Create a storage reference
    const storageRef = ref(storage, filePath);

    // Upload file to Firebase Storage
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on('state_changed',
        (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
        },
        (error) => {
            // Handle unsuccessful uploads
            console.error('Upload failed:', error);
        },
        () => {
            // Handle successful uploads on complete
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                console.log('File available at', downloadURL);

                // Create contribution data
                const contributionData = {
                    branch: form.branch.value,
                    subject: form.subject.value,
                    materialType: form.materialType.value,
                    college: form.college.value,
                    year: form.year.value,
                    submissionDate: form.submissionDate.value,
                    article: form.articleContent.value,
                    file: downloadURL,
                };

                // Store data in Firestore
                addDoc(collection(db, "contributions"), contributionData)
                    .then((docRef) => {
                        console.log("Document written with ID: ", docRef.id);
                    })
                    .catch((error) => {
                        console.error("Error adding document: ", error);
                    });
            });
        }
    );
}

window.onload = function () {
    const uploadType = document.getElementById('uploadType');
    const fileInputSection = document.getElementById('fileInputSection');
    const articleInputSection = document.getElementById('articleInputSection');
    const materialType = document.getElementById('materialType');
    const year = document.getElementById('year');
    const submissionDate = document.getElementById('submissionDate');

    uploadType.addEventListener('change', function () {
        if (this.value === 'file') {
            fileInputSection.style.display = 'block';
            articleInputSection.style.display = 'none';
        } else if (this.value === 'article') {
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

    // Add an event listener to the form to trigger the submitContribution function
    document.getElementById('contributeForm').addEventListener('submit', function (e) {
        e.preventDefault();
        submitContribution();
    });
}