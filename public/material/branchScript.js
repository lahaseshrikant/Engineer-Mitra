import { getFirestore, collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const db = getFirestore(app);
let currentTab = 'Theory'; // Variable to store the current active tab

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
  
    const theoryCollection = await getDocs(collection(db, "Engineering_Subjects_Data", "Data", branch, subject, "Theory"));
    const assignmentsCollection = await getDocs(collection(db, "Engineering_Subjects_Data", "Data", branch, subject, "Assignments"));
    const pyqsCollection = await getDocs(collection(db, "Engineering_Subjects_Data", "Data", branch, subject, "PYQs"));
  
    let theoryIndex = '<h2>Theory</h2><ul>';
    let theoryContent ='';
  
    if (!theoryCollection.empty) {
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
    if (!assignmentsCollection.empty) {
      assignmentsContent += '<table><thead><tr><th>Title</th><th>Link</th></tr></thead><tbody>';
      assignmentsCollection.forEach(doc => {
        const data = doc.data();
        assignmentsContent += `<tr><td>${data.assignmentId}</td><td><a href="${data.file_link}">${data.file_linklink}</a></td></tr>`;
      });
      assignmentsContent += '</tbody></table>';
    } else {
      assignmentsContent += '<p>No assignments available.</p>';
    }
  
    let pyqsContent = '<h2>Previous Year Papers</h2>';
    if (!pyqsCollection.empty) {
      pyqsContent += '<table><thead><tr><th>Title</th><th>Year</th><th>College</th><th>Link</th></tr></thead><tbody>';
      pyqsCollection.forEach(doc => {
        const data = doc.data();
        pyqsContent += `<tr><td>${data.pyqId}</td><td>${data.year}</td><td>${data.collegeName}</td><td><a href="${data.file_link}">${data.file_link}</a></td></tr>`;
      });
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
    `;
  
    // Trigger click on the current active tab to maintain the active tab view
    document.querySelector(`.tablinks[data-tab="${currentTab}"][data-subject="${subject}"]`).click();
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



