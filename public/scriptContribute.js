const app = window.app;
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// Get a reference to the Firestore service
const db = getFirestore(app);

// Get a reference to the Firebase Storage service
const storage = getStorage(app);

async function submitContribution() {
    const form = document.getElementById('contributeForm');

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

    if (form.uploadType.value === 'article') {
        const articleContent = form.articleContent.value;

        // Check if article content is provided
        if (!articleContent.trim()) {
            console.error('Article content is empty');
            alert('Article content is empty');
            return;
        }

        // Generate a unique filename based on the current time
        const time = new Date().getTime();
        const articleFileName = `article_${time}.txt`;

        // Create a Blob containing the article content
        const articleBlob = new Blob([articleContent], { type: 'text/plain' });

        // Create a storage reference for the article
        const articleStorageRef = ref(storage, `contributions/${college}/${branch}/${subject}/${materialType}/${articleFileName}`);

        // Upload the article file to Firebase Storage
        const articleUploadTask = uploadBytesResumable(articleStorageRef, articleBlob);

        // Wait for the article file to be uploaded
        await articleUploadTask;

        // Get the download URL of the uploaded article file
        const articleDownloadURL = await getDownloadURL(articleStorageRef);

        console.log('Article file available at', articleDownloadURL);

        const contributionData = {
            branch: form.branch.value,
            subject: form.subject.value,
            materialType: form.materialType.value,
            college: form.college.value,
            year: form.year.value,
            submissionDate: form.submissionDate.value,
            article: form.articleContent.value,
            file: articleDownloadURL,
            time: time
        };

        // Store data in Firestore
        addDoc(collection(db, "contributions"), contributionData)
            .then((docRef) => {
                console.log("Document written with ID: ", docRef.id);
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
        document.getElementById('contributeForm').style.display = 'none';
        document.getElementById('message').style.display = 'block';
        document.getElementById('message').innerHTML = '<p>Thanks for Contributing!</p><a href="contribute.html" id="ContributeMoreLink">Contribute more</a>';

    } else {
        // If the user selected 'file', get the file from the file input
        const file = form.fileUpload.files[0];

        // Check if a file is selected
        if (!file) {
            console.error('No file selected');
            return;
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
                document.getElementById('contributeForm').style.display = 'none';
                document.getElementById('message').style.display = 'block';
                document.getElementById('message').innerHTML = 'Uploading...'+progress+'%'+'please wait';
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
                        time: new Date().getTime()
                    };

                    // Store data in Firestore
                    addDoc(collection(db, "contributions"), contributionData)
                        .then((docRef) => {
                            console.log("Document written with ID: ", docRef.id);
                        })
                        .catch((error) => {
                            console.error("Error adding document: ", error);
                        });

                    document.getElementById('contributeForm').style.display = 'none';
                    document.getElementById('message').style.display = 'block';
                    document.getElementById('message').innerHTML = '<p>Thanks for contributing!</p><a href="contribute.html" id="ContributeMoreLink">Contribute more</a>';
                });
            }
        );
    }


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