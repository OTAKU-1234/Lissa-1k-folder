// =====================================================
// LISSA 1K FOLDER — SCRIPT PRINCIPAL
// =====================================================

// ================= VARIABLES =================

const form = document.getElementById("regForm");
const message =
    document.getElementById("message") ||
    document.getElementById("alertBox");


// ================= LISTE DES PAYS =================

const countrySelect =
    document.getElementById("countryCode");

const phoneInput =
    document.getElementById("phone");

const dialPrefix =
    document.getElementById("dialPrefix");

const phoneHint =
    document.getElementById("phoneHint");


if (countrySelect && typeof COUNTRIES !== "undefined") {

    COUNTRIES.forEach((c) => {

        const option =
            document.createElement("option");

        option.value = c.code;

        option.textContent =
            `${c.iso} +${c.code} · ${c.name}`;

        countrySelect.appendChild(option);

    });

    // Haïti par défaut
    countrySelect.value = "509";
}


// ================= MISE À JOUR DU PAYS =================

function updateCountry() {

    if (!countrySelect) return;

    const country =
        findCountryByCode(
            countrySelect.value
        );

    if (!country) return;


    // Affiche le préfixe
    if (dialPrefix) {

        dialPrefix.textContent =
            `+${country.code}`;

    }


    // Affiche l'indication du nombre de chiffres
    if (phoneHint) {

        const min =
            country.len[0];

        const max =
            country.len[1];

        const lengthText =
            min === max
                ? `${min} chif`
                : `ant ${min} ak ${max} chif`;

        phoneHint.textContent =
            `${country.name}: nimewo a dwe gen ${lengthText}, san kod peyi a.`;

    }

}


if (countrySelect) {

    countrySelect.addEventListener(
        "change",
        updateCountry
    );

}

updateCountry();


// =====================================================
// MESSAGE
// =====================================================

function showMessage(text, color) {

    if (!message) return;

    message.textContent = text;

    message.style.color = color;

}


// =====================================================
// STATISTIQUES ACCUEIL
// =====================================================

async function loadHomeStats() {

    const totalElement =
        document.getElementById(
            "homeTotalCount"
        );

    const todayElement =
        document.getElementById(
            "homeTodayCount"
        );


    if (!totalElement || !todayElement) {
        return;
    }


    const { data, error } =
        await supabaseClient
        .from("registrations")
        .select("created_at");


    if (error) {

        console.error(
            "Erreur statistiques :",
            error
        );

        return;
    }


    totalElement.textContent =
        data.length.toLocaleString("fr-FR");


    const today =
        new Date().toDateString();


    const todayCount =
        data.filter((item) => {

            return new Date(
                item.created_at
            ).toDateString() === today;

        }).length;


    todayElement.textContent =
        todayCount.toLocaleString("fr-FR");

}


loadHomeStats();


// =====================================================
// FORMULAIRE D'INSCRIPTION
// =====================================================

if (form) {

    form.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();


            // ================= RÉCUPÉRATION =================

            const name =
                document
                .getElementById("name")
                .value
                .trim();


            const phoneRaw =
                document
                .getElementById("phone")
                .value
                .trim()
                .replace(/\D/g, "");


            const email =
                document
                .getElementById("email")
                .value
                .trim();


            // ================= PAYS =================

            const selectedCountry =
                findCountryByCode(
                    countrySelect.value
                );


            if (!selectedCountry) {

                showMessage(
                    "Tanpri chwazi peyi ou.",
                    "#ff6b6b"
                );

                return;
            }


            // ================= VALIDATION NOM =================

            if (name.length < 2) {

                showMessage(
                    "Tanpri antre non ou.",
                    "#ff6b6b"
                );

                return;
            }


            // ================= VALIDATION TÉLÉPHONE =================

            const phoneValid =
                isValidLocalNumber(
                    selectedCountry,
                    phoneRaw
                );


            if (!phoneValid) {

                showMessage(
                    "Tanpri antre yon nimewo WhatsApp valab.",
                    "#ff6b6b"
                );

                return;
            }


            // ================= EMAIL =================

            const emailValid =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                .test(email);


            if (!emailValid) {

                showMessage(
                    "Tanpri antre yon imèl ki valab.",
                    "#ff6b6b"
                );

                return;
            }


            // ================= NUMÉRO COMPLET =================

            const fullPhone =
                `+${selectedCountry.code}${phoneRaw}`;


            // ================= MESSAGE =================

            showMessage(
                "Ap voye demann ou...",
                "#69e89a"
            );


            // ================= BOUTON =================

            const submitButton =
                document.getElementById(
                    "submitBtn"
                );


            if (submitButton) {

                submitButton.disabled = true;

                submitButton.textContent =
                    "Ap voye...";

            }


            // =================================================
            // ENREGISTREMENT SUPABASE
            // =================================================

            const { data, error } =
                await supabaseClient
                .from("registrations")
                .insert({

                    name: name,

                    phone: fullPhone,

                    country: selectedCountry.name,

                    email: email,

                    status: "pending"

                })
                .select()
                .single();


            // ================= RÉACTIVER =================

            if (submitButton) {

                submitButton.disabled = false;

                submitButton.textContent =
                    "Enskri m kounye a";

            }


            // ================= ERREUR =================

            if (error) {

                console.error(
                    "ERREUR SUPABASE :",
                    error
                );


                if (error.code === "23505") {

                    showMessage(
                        "Nimewo sa a deja enskri.",
                        "#ff6b6b"
                    );

                } else {

                    showMessage(
                        "Yon pwoblèm rive. Tanpri eseye ankò.",
                        "#ff6b6b"
                    );

                }

                return;
            }


            // =================================================
            // INSCRIPTION RÉUSSIE
            // =================================================

            showMessage(
                "Demann ou voye avèk siksè. Tann apwobasyon admin lan.",
                "#69e89a"
            );


            // ================= CARTE BIENVENUE =================

            const welcomeCard =
                document.getElementById(
                    "welcomeCard"
                );


            const welcomeTitle =
                document.getElementById(
                    "welcomeTitle"
                );


            const welcomeIcon =
                document.getElementById(
                    "welcomeIcon"
                );


            if (welcomeTitle) {

                const firstName =
                    name.split(" ")[0];

                welcomeTitle.textContent =
                    `Byenveni, ${firstName}!`;

            }


            if (
                welcomeIcon &&
                typeof ICONS !== "undefined"
            ) {

                welcomeIcon.innerHTML =
                    ICONS.check;

            }


            if (welcomeCard) {

                welcomeCard.style.display =
                    "block";


                welcomeCard.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            }


            // =================================================
            // PARTAGE WHATSAPP
            // =================================================

            const whatsappShare =
                document.getElementById(
                    "whatsappShareBtn"
                );


            if (whatsappShare) {

                const siteUrl =
                    window.location.origin +
                    window.location.pathname
                        .replace("index.html", "");


                const shareText =
                    `Mwen fèk enskri sou Lissa 1K Folder pou mete Statut WhatsApp mwen devan tout moun! Vin enskri ou tou, se gratis: ${siteUrl}`;


                whatsappShare.href =
                    `https://wa.me/?text=${
                        encodeURIComponent(
                            shareText
                        )
                    }`;

            }


            // ================= RESET =================

            form.reset();


            if (countrySelect) {

                countrySelect.value =
                    "509";

                updateCountry();

            }


            // ================= STATS =================

            loadHomeStats();


            // ================= LISTE =================

            if (
                typeof loadMembers ===
                "function"
            ) {

                loadMembers();

            }

        }
    );

}


// =====================================================
// BOUTON "GADE LIS MANM YO"
// =====================================================

const viewListButton =
    document.getElementById(
        "viewListBtn"
    );


if (viewListButton) {

    viewListButton.addEventListener(
        "click",
        () => {

            window.location.href =
                "list.html";

        }
    );

}


// =====================================================
// FIN
// =====================================================
