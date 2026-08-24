const members = [
    {
        name: "Jean Baptiste",
        date: "24 août 2026"
    },
    {
        name: "Marie Pierre",
        date: "24 août 2026"
    },
    {
        name: "David Joseph",
        date: "23 août 2026"
    }
];


const membersList = document.getElementById("membersList");
const memberCount = document.getElementById("memberCount");


function displayMembers() {

    memberCount.textContent = members.length;


    if (members.length === 0) {

        membersList.innerHTML = `
            <div class="empty-members">
                Aucun membre pour le moment.
            </div>
        `;

        return;
    }


    membersList.innerHTML = "";


    members.forEach(member => {

        const element = document.createElement("div");

        element.className = "member";

        element.innerHTML = `
            <span class="member-name">
                ${member.name}
            </span>

            <span class="member-date">
                ${member.date}
            </span>
        `;

        membersList.appendChild(element);

    });

}


displayMembers();


// ================= FORMULAIRE =================

const form = document.getElementById("registrationForm");

const message = document.getElementById("formMessage");


form.addEventListener("submit", function(event) {

    event.preventDefault();


    message.textContent =
        "Demann ou pare pou être envoyée.";


    message.style.color =
        "#69e89a";

});
