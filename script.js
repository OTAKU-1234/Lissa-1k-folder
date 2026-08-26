const form = document.getElementById("regForm");
const alertBox = document.getElementById("alertBox");
const submitBtn = document.getElementById("submitBtn");

const countrySelect = document.getElementById("countryCode");
const phoneHint = document.getElementById("phoneHint");
const dialPrefix = document.getElementById("dialPrefix");


// =====================================================
// ICÔNES
// =====================================================

if (typeof ICONS !== "undefined") {

    const brandMark = document.getElementById("brandMark");
    const cardIcon = document.getElementById("cardIcon");
    const chevronIcon = document.getElementById("chevronIcon");
    const chatIcon1 = document.getElementById("chatIcon1");
    const chatIcon2 = document.getElementById("chatIcon2");
    const lockIcon = document.getElementById("lockIcon");
    const eyebrowTag = document.getElementById("eyebrowTag");

    if (brandMark) brandMark.innerHTML = ICONS.joker;
    if (cardIcon) cardIcon.innerHTML = ICONS.joker;
    if (chevronIcon) chevronIcon.innerHTML = ICONS.chevron;
    if (chatIcon1) chatIcon1.innerHTML = ICONS.chat;
    if (chatIcon2) chatIcon2.innerHTML = ICONS.chat;
    if (lockIcon) lockIcon.innerHTML = ICONS.lock;

    if (eyebrowTag) {
        eyebrowTag.innerHTML =
            `<span class="icon-inline">${ICONS.flame}</span> 500,000 VIEWS AP TANN OU`;
    }
}


// =====================================================
// PAYS
// =====================================================

if (countrySelect && typeof COUNTRIES !== "undefined") {

    COUNTRIES.forEach((c) => {

        const option = document.createElement("option");

        option.value = c.code;

        option.textContent =
            `${c.iso} +${c.code} · ${c.name}`;

        countrySelect.appendChild(option);

    });

    countrySelect.value = "509";
}


function updateHint() {

    if (!countrySelect) return;

    const country =
        findCountryByCode(countrySelect.value);

    if (!country) return;

    const min = country.len[0];
    const max = country.len[1];

    const lenTxt =
        min === max
            ? `${min} chif`
            : `ant ${min} ak ${max} chif`;

    if (phoneHint) {
        phoneHint.textContent =
            `${country.name}: nimewo a dwe gen ${lenTxt}, san kod peyi a.`;
    }

    if (dialPrefix) {
        dialPrefix.textContent =
            `+${country.code}`;
    }
}


if (countrySelect) {
    countrySelect.addEventListener(
        "change",
        updateHint
    );
}

updateHint();


// =====================================================
// ALERT
// =====================================================

function showAlert(type, msg, icon) {

    if (!alertBox) return;

    alertBox.className =
        `alert alert-${type} show`;

    if (
        icon &&
        typeof ICONS !== "undefined" &&
        ICONS[icon]
    ) {

        alertBox.innerHTML =
            `<span class="icon-inline">${ICONS[icon]}</span> ${msg}`;

    } else {

        alertBox.textContent = msg;

    }
}


// =====================================================
// ERREUR CHAMPS
// =====================================================

function setFieldError(id, hasError) {

    const field =
        document.getElementById(id);

    if (field) {

        field.classList.toggle(
            "has-error",
            hasError
        );

    }
}


// =====================================================
// STATISTIQUES
// =====================================================

async function loadHomeStats() {

    const totalElement =
        document.getElementById("homeTotalCount");

    const todayElement =
        document.getElementById("homeTodayCount");

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
// FORMULAIRE
// =====================================================

if (!form) {

    console.error(
        "ERREUR : le formulaire #regForm est introuvable."
    );

} else {

    form.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();


            // ==============================
            // RÉCUPÉRER LES INFORMATIONS
            // ==============================

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


            const country =
                findCountryByCode(
                    countrySelect.value
                );


            // ==============================
            // VALIDATION NOM
            // ==============================

            const nameOK =
                name.length >= 2;

            setFieldError(
                "nameField",
                !nameOK
            );


            // ==============================
            // VALIDATION TÉLÉPHONE
            // ==============================

            const phoneOK =
                country &&
                isValidLocalNumber(
                    country,
                    phoneRaw
                );

            setFieldError(
                "phoneField",
                !phoneOK
            );


            // ==============================
            // VALIDATION EMAIL
            // ==============================

            const emailOK =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                .test(email);

            setFieldError(
                "emailField",
                !emailOK
            );


            if (!nameOK || !phoneOK || !emailOK) {

                showAlert(
                    "error",
                    "Tanpri korije chan ki make an wouj yo.",
                    "warning"
                );

                return;
            }


            // ==============================
            // NUMÉRO COMPLET
            // ==============================

            const fullPhone =
                `+${country.code}${phoneRaw}`;


            // ==============================
            // BOUTON
            // ==============================

            submitBtn.disabled = true;

            submitBtn.innerHTML =
                '<span class="spinner"></span> Ap voye...';


            showAlert(
                "success",
                "Ap voye demann ou...",
                null
            );


            // =================================================
            // SUPABASE
            // =================================================

            const { error } =
                await supabaseClient
                .from("registrations")
                .insert({

                    name: name,

                    phone: fullPhone,

                    country: country.name,

                    email: email || null,

                    status: "pending"

                });


            // ==============================
            // RÉACTIVER BOUTON
            // ==============================

            submitBtn.disabled = false;

            submitBtn.textContent =
                "Enskri m kounye a";


            // ==============================
            // ERREUR
            // ==============================

            if (error) {

                console.error(
                    "ERREUR SUPABASE :",
                    error
                );


                if (error.code === "23505") {

                    showAlert(
                        "error",
                        "Nimewo sa a deja enskri.",
                        "warning"
                    );

                } else {

                    showAlert(
                        "error",
                        "Yon pwoblèm rive. Tanpri eseye ankò.",
                        "warning"
                    );

                }

                return;
            }


            // =================================================
            // SUCCÈS
            // =================================================

            showAlert(
                "success",
                "Demann ou voye avèk siksè. Tann apwobasyon admin lan.",
                "check"
            );


            // ==============================
            // CARTE BIENVENUE
            // ==============================

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

                welcomeTitle.textContent =
                    `Byenveni, ${name.split(" ")[0]}!`;

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

                const siteURL =
                    window.location.origin +
                    window.location.pathname
                        .replace("index.html", "");


                const shareMessage =
                    `Mwen fèk enskri sou Lissa 1K Folder pou mete Statut WhatsApp mwen devan tout moun! Vin enskri ou tou, se gratis: ${siteURL}`;


                whatsappShare.href =
                    `https://wa.me/?text=${
                        encodeURIComponent(
                            shareMessage
                        )
                    }`;

            }


            // ==============================
            // RESET
            // ==============================

            form.reset();

            countrySelect.value = "509";

            updateHint();


            // ==============================
            // STATS
            // ==============================

            loadHomeStats();

        }
    );

}


// =====================================================
// BOUTON LISTE
// =====================================================

const viewListBtn =
    document.getElementById(
        "viewListBtn"
    );


if (viewListBtn) {

    viewListBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                "list.html";

        }
    );

}
