import { getFirestore, collection, getDocs, doc, getDoc,  query, orderBy  } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const db = getFirestore(app);

let currentTab = 'Theory'; // Variable to store the current active tab
let currentContentIndex = 0; // To track the current content (assignment or PYQ)
let assignmentsArray = []; // To store all the assignments for navigation
let pyqsArray = []; // To store all the PYQs for navigation

window.openTab = function (evt, tabName, subject) {
  let i, tabcontent, tablinks;

  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  document.getElementById(tabName + '-' + subject).style.display = "block";
  evt.currentTarget.className += " active";
  currentTab = tabName; // Update the current active tab
}

document.addEventListener('DOMContentLoaded', () => {
  const branch = determineBranchFromUrlOrTitle(); // Function to determine branch from URL or title
  
  const subjectDropdown = document.getElementById('subjectDropdown');
  
  const defaultOption = document.createElement('option');
  defaultOption.value = "";
  defaultOption.textContent = "Select a subject";
  subjectDropdown.appendChild(defaultOption);

  getDocs(collection(db, "Engineering_Subjects_Data", "Data", branch)).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const subject = doc.id;
      const option = document.createElement('option');
      option.value = subject;
      option.textContent = subject;
      subjectDropdown.appendChild(option);
    });

    subjectDropdown.addEventListener('change', (event) => {
      const selectedSubject = event.target.value;
      if (selectedSubject) {
        loadSubjectDetails(selectedSubject);
      } else {
        displayDefaultContent();
      }
    });

    displayDefaultContent();
  });

  document.querySelectorAll('.tablinks').forEach(button => {
    button.addEventListener('click', function(event) {
      const tabName = this.getAttribute('data-tab');
      const subject = this.getAttribute('data-subject');
      openTab(event, tabName, subject);
    });
  });

  function displayDefaultContent() {
    const detailsContainer = document.getElementById('subjectDetails');
    detailsContainer.innerHTML = `
      <h2>Branch Information</h2>
      <p>Select a subject to see details about Theory, Assignments, and Previous Year Papers.</p>
    `;
  }

  async function loadSubjectDetails(subject) {
    const detailsContainer = document.getElementById('subjectDetails');
  
    // Construct the query with sorting
    const theoryQuery = query(
      collection(db, "Engineering_Subjects_Data", "Data", branch, subject, "Theory"),
      orderBy("index") // Ensure "index" is the field you want to sort by
    );

    const theoryCollection = await getDocs(theoryQuery);
    const assignmentsCollection = await getDocs(collection(db, "Engineering_Subjects_Data", "Data", branch, subject, "Assignments"));
    const pyqsCollection = await getDocs(collection(db, "Engineering_Subjects_Data", "Data", branch, subject, "PYQs"));
  
    let theoryIndex = '<h2>Theory</h2><ul>';
    let theoryContent ='';
  
    if (!theoryCollection.empty) {
      // Assuming theoryCollection is an array of objects and we're sorting by the 'name' property
      
      theoryCollection.forEach(doc => {
        const data = doc.data();
        theoryIndex += `<li><a href="#${data.index}">${data.index}</a></li>`;
        theoryContent += `<div id="${data.index}" class="theoryChapter">${data.content}</div>`;
      });
    } else {
      theoryIndex += '<li>No theory content available.</li>';
    }
    theoryIndex += '</ul>';
  
    let assignmentsContent = '<h2>Assignments</h2>';
    assignmentsArray = [];
    if (!assignmentsCollection.empty) {
      assignmentsContent += '<table><thead><tr><th>Title</th><th>Link</th></tr></thead><tbody>';
      for (const doc of assignmentsCollection.docs) {
        const data = doc.data();
        assignmentsContent += `<tr><td><a href="#" class="assignment-title" data-subject="${subject}" data-assignment-id="${data.assignmentId}">${data.assignmentId}</a></td><td><a href="${data.file_link}">${data.file_link}</a></td></tr>`;
        assignmentsArray.push(data); // Add data to assignmentsArray for navigation
      }
      assignmentsContent += '</tbody></table>';
    } else {
      assignmentsContent += '<p>No assignments available.</p>';
    }
  
    let pyqsContent = '<h2>Previous Year Papers</h2>';
    pyqsArray = [];
    if (!pyqsCollection.empty) {
      pyqsContent += '<table><thead><tr><th>Title</th><th>Year</th><th>College</th><th>Link</th></tr></thead><tbody>';
      for (const doc of pyqsCollection.docs) {
        const data = doc.data();
        pyqsContent += `<tr><td><a href="#" class="pyq-title" data-subject="${subject}" data-pyq-id="${data.pyqId}">${data.pyqId}</a></td><td>${data.year}</td><td>${data.collegeName}</td><td><a href="${data.file_link}">${data.file_link}</a></td></tr>`;
        pyqsArray.push(data); // Add data to pyqsArray for navigation
      }
      pyqsContent += '</tbody></table>';
    } else {
      pyqsContent += '<p>No previous year papers available.</p>';
    }
  
    detailsContainer.innerHTML = `
      <div class="tab">
        <button class="tablinks active" data-tab="Theory" data-subject="${subject}" onclick="openTab(event, 'Theory', '${subject}')">Theory</button>
        <button class="tablinks" data-tab="Assignments" data-subject="${subject}" onclick="openTab(event, 'Assignments', '${subject}')">Assignments</button>
        <button class="tablinks" data-tab="Papers" data-subject="${subject}" onclick="openTab(event, 'Papers', '${subject}')">Previous Year Papers</button>
      </div>
      <div id="Theory-${subject}" class="tabcontent" style="display: block;">
          <div class="theoryIndex"> 
              ${theoryIndex}
          </div>
          <div class="theoryContent">
              ${theoryContent}
          </div>
      </div>
      <div id="Assignments-${subject}" class="tabcontent">
        ${assignmentsContent}
      </div>
      <div id="Papers-${subject}" class="tabcontent">
        ${pyqsContent}
      </div>
      <div id="ContentFrame" class="content-frame" style="display: none;">
        <button id="closeFrame">X</button>
        <button id="prevContent">Prev</button>
        <button id="nextContent">Next</button>
        <h2>Content Details</h2>
        <div id="ContentDetails"></div>
      </div>
    `;
  
    // Trigger click on the current active tab to maintain the active tab view
    document.querySelector(`.tablinks[data-tab="${currentTab}"][data-subject="${subject}"]`).click();

    // Add event listeners to assignment titles
    document.querySelectorAll('.assignment-title').forEach(title => {
      title.addEventListener('click', async function(event) {
        event.preventDefault();
        const subject = this.getAttribute('data-subject');
        const assignmentId = this.getAttribute('data-assignment-id');
        currentContentIndex = assignmentsArray.findIndex(assignment => assignment.assignmentId === assignmentId);
        await showContentDetails('Assignments', currentContentIndex, subject);
      });
    });

    // Add event listeners to PYQ titles
    document.querySelectorAll('.pyq-title').forEach(title => {
      title.addEventListener('click', async function(event) {
        event.preventDefault();
        const subject = this.getAttribute('data-subject');
        const pyqId = this.getAttribute('data-pyq-id');
        currentContentIndex = pyqsArray.findIndex(pyq => pyq.pyqId === pyqId);
        await showContentDetails('PYQs', currentContentIndex, subject);
      });
    });

    // Handle previous and next buttons
    document.getElementById('prevContent').addEventListener('click', function() {
      if (currentContentIndex > 0) {
        currentContentIndex--;
        showContentDetails(currentTab, currentContentIndex, subject);
      }
    });

    document.getElementById('nextContent').addEventListener('click', function() {
      if (currentContentIndex < (currentTab === 'Assignments' ? assignmentsArray.length : pyqsArray.length) - 1) {
        currentContentIndex++;
        showContentDetails(currentTab, currentContentIndex, subject);
      }
    });

    document.getElementById('closeFrame').addEventListener('click', function() {
      document.getElementById('ContentFrame').style.display = 'none';
    });
  }

  async function showContentDetails(type, index, subject) {
    let contentData;
    if (type === 'Assignments') {
      contentData = assignmentsArray[index];
    } else if (type === 'PYQs') {
      contentData = pyqsArray[index];
    }

    if (contentData) {
      const questionsCollection = collection(db, "Engineering_Subjects_Data", "Data", determineBranchFromUrlOrTitle(), subject, type, contentData.assignmentId || contentData.pyqId, "Questions");
      const questionsSnapshot = await getDocs(questionsCollection);
      const questionsData = [];

      questionsSnapshot.forEach((doc) => {
        questionsData.push(doc.data());
      });

      const contentFrame = document.getElementById('ContentFrame');
      const contentDetails = document.getElementById('ContentDetails');
      const title = type === 'Assignments' ? contentData.assignmentId : contentData.pyqId;
      const link = contentData.file_link;
      let questionsHtml = '';

      questionsData.forEach((question) => {
        questionsHtml += `<div class="question"><h3>Question</h3><p>${question.questionText}</p><h4>Solution:</h4><p>${question.solution}</p></div>`;
      });

      contentDetails.innerHTML = `
        <h2>${title}</h2>
        <p>Link: <a href="${link}" target="_blank">${link}</a></p>
        ${questionsHtml}
      `;
      contentFrame.style.display = 'block';
    }
  }

  function determineBranchFromUrlOrTitle() {
    // Example: Check URL for branch name
    const url = window.location.href;
    if (url.includes('civil')) {
        return 'civil';
    } else if (url.includes('chemical')) {
        return 'chemical';
    } else if (url.includes('electrical')) {
        return 'electrical';
    } else if (url.includes('electronics')) {
        return 'electronics';
    } else if (url.includes('mechanical')) {
        return 'mechanical';
    } else if (url.includes('metallurgy')) {
        return 'metallurgy';
    } else if (url.includes('computerscience')) {
        return 'computer science';
    }
    // Default to a specific branch if not found in URL or title
    return 'defaultBranch';
  }
});



