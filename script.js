const form = document.getElementById("registrationForm");
const message = document.getElementById("formMessage");

const membersList = document.getElementById("membersList");
const memberCount = document.getElementById("memberCount");


// ================= CHARGER LES MEMBRES =================

async function loadMembers() {

    const { data, error } = await supabaseClient
        .from("registrations")
        .select("name, created_at")
        .eq("status", "approved")
        .order("created_at", {
            ascending: false
        });


    if (error) {

        console.error("Erreur Supabase :", error);

        membersList.innerHTML = `
            <div class="empty-members">
                Impossible de charger la liste.
            </div>
        `;

        return;
    }


    memberCount.textContent = data.length;


    if (data.length === 0) {

        membersList.innerHTML = `
            <div class="empty-members">
                Aucun membre approuvé pour le moment.
            </div>
        `;

        return;
    }


    membersList.innerHTML = "";


    data.forEach(member => {

        const element = document.createElement("div");

        element.className = "member";


        const date = new Date(member.created_at);

        const formattedDate = date.toLocaleDateString(
            "fr-FR",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );


        element.innerHTML = `
            <span class="member-name">
                ${escapeHTML(member.name)}
            </span>

            <span class="member-date">
                ${formattedDate}
            </span>
        `;


        membersList.appendChild(element);

    });

}


// ================= PROTECTION HTML =================

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// ================= INSCRIPTION =================

form.addEventListener("submit", async function(event) {

    event.preventDefault();


    const name =
        document.getElementById("name").value.trim();


    const country =
        document.getElementById("country").value;


    const phone =
        document.getElementById("phone").value.trim();


    const email =
        document.getElementById("email").value.trim();


    if (name.length < 2) {

        message.textContent =
            "Tanpri antre non ou.";

        message.style.color = "#ff6b6b";

        return;
    }


    if (phone.length < 6) {

        message.textContent =
            "Tanpri antre yon nimewo WhatsApp valab.";

        message.style.color = "#ff6b6b";

        return;
    }


    message.textContent =
        "Ap voye demann ou...";

    message.style.color =
        "#69e89a";


    const { error } = await supabaseClient
        .from("registrations")
        .insert({

            name: name,

            phone: phone,

            country: country,

            email: email || null,

            status: "pending"

        });


    if (error) {

        console.error(error);

        message.textContent =
            "Yon pwoblèm rive. Tanpri eseye ankò.";

        message.style.color =
            "#ff6b6b";

        return;
    }


    message.textContent =
        "Demann ou voye avèk siksè. Tann apwobasyon admin lan.";

    message.style.color =
        "#69e89a";


    form.reset();

});


// ================= INITIALISATION =================

loadMembers();
