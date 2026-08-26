// =====================================================
// LISSA 1K FOLDER
// Script inscription + membres
// =====================================================

const form = document.getElementById("registrationForm");
const message = document.getElementById("formMessage");
const membersList = document.getElementById("membersList");
const memberCount = document.getElementById("memberCount");


// =====================================================
// INSCRIPTION
// =====================================================

if (form) {

    form.addEventListener("submit", async function (e) {

        e.preventDefault();

        const name =
            document.getElementById("name").value.trim();

        const phone =
            document.getElementById("phone").value.trim();

        const country =
            document.getElementById("country").value;

        const email =
            document.getElementById("email").value.trim();


        // ================= VALIDATION =================

        if (name.length < 2) {

            showMessage(
                "Tanpri antre non ou.",
                "#ff6b6b"
            );

            return;
        }


        if (phone.length < 6) {

            showMessage(
                "Tanpri antre yon nimewo WhatsApp valab.",
                "#ff6b6b"
            );

            return;
        }


        if (!country) {

            showMessage(
                "Tanpri chwazi peyi ou.",
                "#ff6b6b"
            );

            return;
        }


        // ================= ENVOI =================

        showMessage(
            "Ap voye demann ou...",
            "#69e89a"
        );


        const button =
            form.querySelector("button[type='submit']");

        if (button) {

            button.disabled = true;

            button.textContent =
                "Ap voye...";

        }


        // ================= SUPABASE =================

        const { error } =
            await supabaseClient
            .from("registrations")
            .insert({

                name: name,

                phone: phone,

                country: country,

                email: email || null,

                status: "pending"

            });


        // ================= RÉACTIVER =================

        if (button) {

            button.disabled = false;

            button.textContent =
                "Envoyer ma demande";

        }


        // ================= ERREUR =================

        if (error) {

            console.error(
                "Erreur Supabase :",
                error
            );

            showMessage(
                "Yon pwoblèm rive. Tanpri eseye ankò.",
                "#ff6b6b"
            );

            return;
        }


        // ================= SUCCÈS =================

        showMessage(
            "Demann ou voye avèk siksè. Tann apwobasyon admin lan.",
            "#69e89a"
        );


        form.reset();


        // Actualiser la liste
        loadMembers();

    });

}


// =====================================================
// MESSAGE
// =====================================================

function showMessage(text, color) {

    if (!message) {

        console.log(text);

        return;
    }

    message.textContent = text;

    message.style.color = color;

}


// =====================================================
// CHARGER LES MEMBRES
// =====================================================

async function loadMembers() {

    if (!membersList) return;


    const { data, error } =
        await supabaseClient
        .from("registrations")
        .select("name")
        .eq("status", "approved")
        .order("created_at", {
            ascending: false
        });


    if (error) {

        console.error(
            "Erreur chargement membres :",
            error
        );

        return;
    }


    // Nombre de membres
    if (memberCount) {

        memberCount.textContent =
            data.length;

    }


    // Aucun membre
    if (!data || data.length === 0) {

        membersList.innerHTML = `
            <div class="empty-members">
                Aucun membre pour le moment.
            </div>
        `;

        return;
    }


    // Affichage uniquement des noms
    membersList.innerHTML =
        data.map(member => {

            return `
                <div class="member-item">
                    <span class="member-name">
                        ${escapeHTML(member.name)}
                    </span>
                </div>
            `;

        }).join("");

}


// =====================================================
// PROTECTION AFFICHAGE NOM
// =====================================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// =====================================================
// INITIALISATION
// =====================================================

loadMembers();
