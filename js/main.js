// Cuando la página carga- ejecuta esta instruccion
document.addEventListener('DOMContentLoaded', async() => {
    await loadComponents(); //carga el header y footer
    document.querySelectorAll('.nav-link').forEach(link => link.href.endsWith(location.pathname.split('/').pop() || 'index.html') && link.classList.add('active'));

    //Detectar en que pagina estamos y cargar su contenido
    const pageId = document.body.id;
    
    if (document.getElementById('history-container')) renderHistory();
    if (document.getElementById('squad-container')) renderSquad();
    if (document.getElementById('matches-container')) renderMatches();
    if (document.getElementById('stadium-container')) renderStadium();
    if (document.getElementById('home-container')) renderHome();

});


// Funcion para cargar HTMLs
async function loadComponents() {
    const loadHTML = async (elementId, filePath) => {
        const element = document.getElementById(elementId);
        const response = await fetch(filePath);
        element.innerHTML = await response.text();
    };

    await loadHTML('header-placeholder', 'components/header.html');
    await loadHTML('footer-placeholder', 'components/footer.html')
    
}

//History
function renderHistory(){
    const element = document.getElementById('history-container');
    element.innerHTML = window.clubHistory.map(function(item) {
        let image = '';
        image = `<img src="${item.image}"
                class="img-fluid rounder mb-3 shadow-sm w-100"
                style="max-height:400px; object-fit:cover;">`;
        return `
            <div class="timeline-item">
                ${image}
                <div class="timeline-year">${item.year}</div>
                <h4 class="h4">${item.title}</h4>
                <p class="text-muted">${item.description}</p>
            </div>`;
    }).join('');
}

//Squad
function renderSquad() {
    const container = document.getElementById('squad-container');

    const grouped = {
        "Portero": [],
        "Defensa": [],
        "Mediocampista": [],
        "Delantero": []
    };

    // Agrupar jugadores por posición
    window.clubSquad.forEach(player => {
        grouped[player.position].push(player);
    });

    // Generar HTML por cada grupo
    container.innerHTML = Object.keys(grouped).map(position => {

        const playersHTML = grouped[position].map(player => `
            <div class="col-md-4 col-lg-3 mb-4">
                <div class="card player-card h-100 shadow-sm border-0">
                    <div class="position-badge">${player.number}</div>
                    <img src="${player.photo}" class="card-img-top" alt="${player.name}">
                    <div class="card-body text-center">
                        <h5 class="card-title fw-bold">${player.name}</h5>
                        <p class="text-muted mb-1">${player.position}</p>
                        <small>${player.nationality} · ${player.age} años</small>
                    </div>
                </div>
            </div>
        `).join('');

        return `
            <div class="mb-5">
                <h2 class="fw-bold text-club-red mb-4">${position.toUpperCase()}</h2>
                <div class="row">
                    ${playersHTML}
                </div>
            </div>
        `;
    }).join('');
}

//Matches
function renderMatches() {

    const container = document.getElementById('matches-container');
    const season = window.clubMatches.season26;

    container.innerHTML = `
        <div class="row g-4">
            ${season.map(match => {

                const isPlayed = match.results && match.results !== "";

                const resultSection = isPlayed
                    ? `<div class="match-result played">${match.results}</div>`
                    : `<div class="match-result upcoming">PRÓXIMO</div>`;

                return `
                    <div class="col-md-6 col-lg-4">
                        <div class="match-card shadow-sm">

                            <div class="match-header">
                                LIGA BBVA MX · Jornada ${match.jornada}
                            </div>

                            <div class="match-body">

                                <div class="teams">
                                    <div class="team">
                                        <img src="assets/toluca_logo.png" width="40">
                                        <span>Toluca</span>
                                    </div>

                                    <div class="vs">VS</div>

                                    <div class="team">
                                        <img src="${match.logo}" width="40">
                                        <span>${match.opponent}</span>
                                    </div>
                                </div>

                                ${resultSection}

                                <div class="match-info">
                                    <div><i class="bi bi-calendar"></i> ${match.date}</div>
                                    <div><i class="bi bi-clock"></i> ${match.time}</div>
                                    <div><i class="bi bi-geo-alt"></i> ${match.venue}</div>
                                </div>

                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}