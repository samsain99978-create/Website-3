// ============================================================
// A7 SATTA - Main Application Logic
// ============================================================

// Live Clock
function updateClock() {
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    const formatted = now.toLocaleDateString('en-US', options).replace(',', ',');
    const el = document.getElementById('clockbox');
    if (el) el.textContent = formatted;

    if (typeof checkDateRollover === 'function') {
        checkDateRollover();
    }
}

setInterval(updateClock, 1000);

// ============================================================
// Render Functions for Public Pages
// ============================================================

function renderMarquee() {
    const el = document.getElementById('marquee-text');
    if (el) el.innerHTML = '<b>' + getData('marquee') + '</b>';
}

function renderHindiText() {
    const el = document.getElementById('hindi-text');
    if (el) el.textContent = getData('hindi_text');
}

function renderFeatured() {
    const container = document.getElementById('featured-section');
    if (!container) return;
    const featured = getData('featured');
    if (!featured) return;

    container.innerHTML = `
        <a href="#" class="gamenameeach"><h4>${featured.name}</h4></a>
        <p>( ${featured.time} )</p>
        <strong style="font-size:20px;"> { ${featured.previous} } <span class="arrow-anim">➜</span> { ${featured.current} }</strong>
    `;
}

function parseTimeToMinutes(timeStr) {
    if (!timeStr || typeof timeStr !== 'string') return 0;
    const clean = timeStr.trim().toUpperCase();
    const match = clean.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/);
    if (!match) return 0;

    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const period = match[3];

    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    let totalMinutes = hours * 60 + minutes;

    // Early morning times (00:00 AM to 05:59 AM) belong to the end of the daily Satta cycle
    if (period === 'AM' && hours < 6) {
        totalMinutes += 24 * 60;
    }

    return totalMinutes;
}

function renderLiveResults() {
    const container = document.getElementById('live-results');
    if (!container) return;
    const primary = getData('games_primary');
    const secondary = getData('games_secondary');

    const allGames = [...(primary || []), ...(secondary || [])];
    
    // Find the LAST game in table order that has a declared result today
    let lastDeclared = null;
    let lastDeclaredIndex = -1;

    for (let i = 0; i < allGames.length; i++) {
        const g = allGames[i];
        if (g.today && g.today !== '' && g.today !== '-') {
            lastDeclared = g;
            lastDeclaredIndex = i;
        }
    }

    // Find the FIRST waiting game that comes AFTER lastDeclared in table order
    let nextWaiting = null;
    if (lastDeclaredIndex !== -1) {
        for (let i = lastDeclaredIndex + 1; i < allGames.length; i++) {
            const g = allGames[i];
            if (!g.today || g.today === '' || g.today === '-') {
                nextWaiting = g;
                break;
            }
        }
    }

    // Fallback: if no declared game yet, or no waiting game after lastDeclared, pick first waiting game
    if (!nextWaiting) {
        for (let i = 0; i < allGames.length; i++) {
            const g = allGames[i];
            if (!g.today || g.today === '' || g.today === '-') {
                nextWaiting = g;
                break;
            }
        }
    }

    let html = '';

    if (lastDeclared) {
        html += `
            <div class="sattaname"><p>${lastDeclared.name}</p></div>
            <div class="sattaresult">
                <font><span style="font-size:36px;font-weight:900;color:#ff0000;">${lastDeclared.today}</span></font>
            </div>
        `;
    }

    if (nextWaiting) {
        html += `
            <div class="sattaname"><p>${nextWaiting.name}</p></div>
            <div class="sattaresult">
                <span class="star-anim">WAIT</span>
            </div>
        `;
    }

    container.innerHTML = html;
}

function renderPrimaryTable() {
    const tbody = document.getElementById('primary-table-body');
    if (!tbody) return;
    const games = getData('games_primary');
    if (!games) return;

    let html = '';
    games.forEach(game => {
        const todayDisplay = (game.today && game.today !== '' && game.today !== '-')
            ? `<strong style="font-size:20px;color:#000000;">${game.today}</strong>`
            : `<span class="waiting-dots"></span>`;

        html += `<tr>
            <td class="foryellow">
                <a href="#" class="gamenameeach">${game.name}</a><br>${game.time}
            </td>
            <td>${game.yesterday || '--'}</td>
            <td>${todayDisplay}</td>
        </tr>`;
    });
    tbody.innerHTML = html;
}

function renderSecondaryTable() {
    const tbody = document.getElementById('secondary-table-body');
    if (!tbody) return;
    const games = getData('games_secondary');
    if (!games) return;

    let html = '';
    games.forEach(game => {
        const todayDisplay = (game.today && game.today !== '' && game.today !== '-')
            ? `<strong style="font-size:20px;color:#000000;">${game.today}</strong>`
            : `<span class="waiting-dots"></span>`;

        html += `<tr>
            <td class="foryellow">
                <a href="#" class="gamenameeach">${game.name}</a><br>${game.time}
            </td>
            <td>${game.yesterday || '--'}</td>
            <td>${todayDisplay}</td>
        </tr>`;
    });
    tbody.innerHTML = html;
}

function formatAdHtml(rawHtml) {
    if (!rawHtml || typeof rawHtml !== 'string') return rawHtml;
    if (!rawHtml.includes('-------') && !rawHtml.includes('-------------') && !rawHtml.includes('<p>')) {
        return rawHtml;
    }

    try {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = rawHtml;
        const paragraphs = tempDiv.querySelectorAll('p');
        if (paragraphs.length === 0) return rawHtml;

        let headerHtml = '';
        let scheduleRowsHtml = '';
        let rateLines = [];
        let ctaText = '';
        let ctaHref = '';

        paragraphs.forEach(p => {
            const fullText = p.textContent.trim();
            if (!fullText) return;

            const timeMatch = fullText.match(/(\d{1,2}:\d{2}\s*(?:[APap][Mm])?)/);
            if (fullText.includes('⏰') || timeMatch) {
                let name = '';
                let time = '';
                if (timeMatch) {
                    const timePos = fullText.indexOf(timeMatch[0]);
                    name = fullText.substring(0, timePos).replace(/[⏰\-\–\—\.]/g, '').trim();
                    time = timeMatch[0].trim();
                } else {
                    const parts = fullText.split(/--+/);
                    name = parts[0] ? parts[0].replace('⏰', '').trim() : fullText.replace('⏰', '').trim();
                    time = parts[1] ? parts[1].trim() : '';
                }

                if (name) {
                    scheduleRowsHtml += `
                        <div class="ad-schedule-row">
                            <span class="ad-schedule-name"><span class="clock-icon">⏰</span> ${name}</span>
                            <span class="ad-schedule-leader"></span>
                            <span class="ad-schedule-time">${time}</span>
                        </div>\n`;
                }
            } else if (fullText.includes('Rate list') || fullText.includes('रेट') || fullText.includes('rate')) {
                const lines = p.innerHTML.split(/<br\s*\/?>/i);
                lines.forEach(l => {
                    const clean = l.replace(/<[^>]*>/g, '').trim();
                    if (clean) rateLines.push(clean);
                });
            } else if (p.querySelector('a') || fullText.includes('लिंक') || fullText.includes('क्लिक')) {
                const schedule = getData('ad_schedule');
                const targetUrl = (schedule && schedule.whatsappUrl) ? schedule.whatsappUrl : 'https://wa.me/message/WTOZYC4GBMWNC1';
                ctaHref = targetUrl;
                ctaText = fullText;
            } else {
                headerHtml += `<div class="ad-top-title">${fullText}</div>\n`;
            }
        });

        let output = '';
        if (headerHtml) output += `<div class="ad-header-box">${headerHtml}</div>\n`;
        if (scheduleRowsHtml) output += `<div class="ad-schedule-list">${scheduleRowsHtml}</div>\n`;
        
        if (rateLines.length > 0) {
            output += `<div class="ad-rate-card">\n`;
            rateLines.forEach((rl, idx) => {
                if (idx === 0) output += `  <div class="ad-rate-title">${rl}</div>\n`;
                else output += `  <div class="ad-rate-item">${rl}</div>\n`;
            });
            output += `</div>\n`;
        }

        if (ctaText) {
            const cleanCtaText = ctaText.replace(/[📱🎛️]/g, '').trim();
            const waSvgIcon = `<svg class="ad-wa-icon" viewBox="0 0 24 24" width="22" height="22" fill="currentColor" style="vertical-align:-4px;margin-right:8px;display:inline-block;"><path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.76.459 3.477 1.33 4.988l-1.414 5.163 5.281-1.385c1.458.796 3.104 1.215 4.79 1.216h.004c5.505 0 9.989-4.478 9.99-9.984 0-2.669-1.038-5.178-2.924-7.064a9.927 9.927 0 0 0-7.067-2.918zm0 1.834c4.493 0 8.151 3.658 8.153 8.15.001 2.181-.848 4.232-2.391 5.776-1.543 1.543-3.595 2.393-5.776 2.393h-.003c-1.479 0-2.923-.396-4.18-1.144l-.3-.178-3.109.815.829-3.029-.196-.312a8.106 8.106 0 0 1-1.246-4.321c.002-4.492 3.66-8.15 8.153-8.15zm-4.633 4.218c-.126 0-.327.047-.498.234-.171.188-.654.639-.654 1.558 0 .919.668 1.807.762 1.932.094.125 1.303 2.062 3.208 2.854.453.189.807.301 1.083.389.455.144.869.124 1.197.075.365-.054 1.125-.46 1.286-.905.161-.445.161-.826.113-.905-.047-.078-.171-.125-.36-.219-.188-.094-1.125-.555-1.3-.618-.175-.063-.303-.094-.431.094-.128.188-.498.639-.611.764-.113.125-.226.141-.414.047-.188-.094-.795-.293-1.514-.934-.56-.499-.938-1.116-1.048-1.304-.11-.188-.012-.29.082-.383.085-.084.188-.219.283-.328.094-.109.126-.188.188-.313.063-.125.031-.234-.016-.328-.047-.094-.431-1.037-.591-1.422-.156-.375-.315-.324-.431-.33h-.368z"/></svg>`;
            output += `<div class="ad-cta-container">
                <a href="${ctaHref}" target="_blank" class="ad-whatsapp-btn">
                    ${waSvgIcon}<span>${cleanCtaText}</span>
                </a>
            </div>\n`;
        }

        return output;
    } catch (e) {
        return rawHtml;
    }
}

function renderAdContent() {
    const container = document.getElementById('ad-content');
    if (!container) return;
    let content = getData('ad_content');

    const hasText = function(str) {
        if (!str || typeof str !== 'string') return false;
        const stripped = str.replace(/<[^>]*>/g, '').trim();
        return stripped.length > 0;
    };

    const compiler = (typeof compileAdContentFromSchedule === 'function') ? compileAdContentFromSchedule : (window.compileAdContentFromSchedule || null);
    const schedule = getData('ad_schedule');

    if (!hasText(content)) {
        if (schedule && typeof compiler === 'function') {
            content = compiler(schedule);
        }
    }
    const defaultAd = (typeof DEFAULT_AD_CONTENT !== 'undefined' ? DEFAULT_AD_CONTENT : window.DEFAULT_AD_CONTENT);
    if (!hasText(content) && defaultAd) {
        content = defaultAd;
    }
    content = content || '';

    // Apply layout transformer for perfect flex rows with dotted leaders
    content = formatAdHtml(content);

    // Automatically wrap clock icon in <span class="clock-icon">⏰</span> for enlarged styling
    content = content.replace(/<span class="clock-icon">⏰<\/span>/g, '⏰');
    content = content.replace(/⏰/g, '<span class="clock-icon">⏰</span>');
    container.innerHTML = content;
}

function renderChart(tableId, headerKey, dataKey, colorClass) {
    const table = document.getElementById(tableId);
    if (!table) return;
    const headers = getData(headerKey);
    const data = getData(dataKey);
    if (!headers || !data) return;

    let html = '<tbody>';
    // Header row
    html += '<tr>';
    html += '<td class="table_chart_section_01 forfirtcolor"><strong class="fon">दिनांक</strong></td>';
    headers.forEach(h => {
        html += `<td class="table_chart_section forfirtcolor text-center">${h}</td>`;
    });
    html += '</tr>';

    // Data rows
    data.forEach(row => {
        html += '<tr>';
        html += `<td class="forfirtcolor"><span class="fon">${row.date}</span></td>`;
        (row.values || []).slice(0, headers.length).forEach(val => {
            html += `<td style="background-color: ${colorClass};"><span class="table_chart_section_02">${val}</span></td>`;
        });
        html += '</tr>';
    });

    html += '</tbody>';
    table.innerHTML = html;
}

function renderRecordChart() {
    const container = document.getElementById('record-chart-table');
    if (!container) return;

    let games = getData('record_games');
    if (!games || !Array.isArray(games) || games.length === 0) {
        games = (typeof DEFAULT_RECORD_GAMES !== 'undefined' ? DEFAULT_RECORD_GAMES : (window.DEFAULT_RECORD_GAMES || []));
    }

    const years = [2026, 2025, 2024, 2023];
    let html = '';
    games.forEach(game => {
        html += '<tr>';
        html += `<td class="table_chart_section2">${game.name || game.display}</td>`;
        years.forEach(year => {
            html += `<td class="table_chart_section"><a href="chart.html#year-${year}">${year}</a></td>`;
        });
        html += '</tr>';
    });
    container.innerHTML = html;
}

function renderDisclaimer() {
    const el = document.getElementById('disclaimer-text');
    if (el) el.textContent = getData('disclaimer') || '';
}

// ============================================================
// Full Chart Page Render
// ============================================================

function renderFullChart(tableId, headerKey, dataKey) {
    const table = document.getElementById(tableId);
    if (!table) return;
    const headers = getData(headerKey);
    const data = getData(dataKey);
    if (!headers || !data) return;

    let html = '<tbody>';
    // Header row
    html += '<tr>';
    html += '<td class="table_chart_section_01 forfirtcolor"><strong class="fon">दिनांक</strong></td>';
    headers.forEach(h => {
        html += `<td class="table_chart_section forfirtcolor text-center">${h}</td>`;
    });
    html += '</tr>';

    // Data rows
    data.forEach(row => {
        html += '<tr>';
        html += `<td class="forfirtcolor"><span class="fon">${row.date}</span></td>`;
        (row.values || []).slice(0, headers.length).forEach(val => {
            html += `<td><span class="table_chart_section_02">${val}</span></td>`;
        });
        html += '</tr>';
    });

    html += '</tbody>';
    table.innerHTML = html;
}

// ============================================================
// Initialize Pages
// ============================================================

function initHomePage() {
    updateClock();
    renderMarquee();
    renderHindiText();
    renderFeatured();
    renderLiveResults();
    renderPrimaryTable();
    renderSecondaryTable();
    renderAdContent();
    renderChart('chart1-table', 'chart1_headers', 'chart1_data', '#dbec95');
    renderChart('chart2-table', 'chart2_headers', 'chart2_data', '#95ceec');
    renderChart('chart3-table', 'chart3_headers', 'chart3_data', '#FAA435');
    renderRecordChart();
}

function initChartPage() {
    updateClock();
    renderMarquee();
    renderLiveResults();
    renderFullChart('fullchart-table', 'fullchart_headers', 'fullchart_data');
    renderFullChart('prev-fullchart-table', 'prev_fullchart_headers', 'prev_fullchart_data');
    renderYearlyCharts();
    renderRecordChart();
}

// ============================================================
// Yearly Record Charts (2026, 2025, 2024, 2023)
// ============================================================

function renderYearlyChart(year) {
    const tableId = 'year-chart-' + year;
    const table = document.getElementById(tableId);
    if (!table) return;

    let headers = getData('year_headers');
    if (!headers || !Array.isArray(headers) || headers.length === 0) {
        headers = (typeof DEFAULT_YEAR_HEADERS !== 'undefined' ? DEFAULT_YEAR_HEADERS : (window.DEFAULT_YEAR_HEADERS || []));
    }
    let data = getData('year_' + year + '_data');
    if (!data || !Array.isArray(data) || data.length === 0) {
        if (typeof generateYearlyChartData === 'function') {
            data = generateYearlyChartData(year);
        }
    }
    if (!headers || !headers.length || !data || !data.length) return;

    let html = '<tbody>';
    // Header row
    html += '<tr>';
    html += '<td class="table_chart_section_01 forfirtcolor"><strong class="fon">Month</strong></td>';
    headers.forEach(h => {
        html += `<td class="table_chart_section forfirtcolor text-center" style="font-size:10px;padding:4px 3px;">${h}</td>`;
    });
    html += '</tr>';

    // Data rows
    data.forEach(row => {
        html += '<tr>';
        html += `<td class="forfirtcolor"><span class="fon" style="font-size:12px;">${row.date}</span></td>`;
        (row.values || []).slice(0, headers.length).forEach(val => {
            html += `<td><span class="table_chart_section_02">${val}</span></td>`;
        });
        html += '</tr>';
    });

    html += '</tbody>';
    table.innerHTML = html;
}

function renderYearlyCharts() {
    [2026, 2025, 2024, 2023].forEach(year => renderYearlyChart(year));
}

function initContactPage() {
    renderMarquee();
    renderRecordChart();
    renderDisclaimer();
}

function initLoginPage() {
    renderMarquee();
    renderRecordChart();
    renderDisclaimer();

    const form = document.getElementById('login-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('user_pass').value.trim();
            const creds = getData('credentials');

            if (creds && username === creds.username && password === creds.password) {
                sessionStorage.setItem('a7_logged_in', 'true');
                window.location.href = 'admin.html';
            } else {
                const errEl = document.getElementById('login-error');
                if (errEl) {
                    errEl.textContent = 'Invalid username or password!';
                    errEl.style.display = 'block';
                }
            }
        });
    }

    // Prevent spaces in inputs
    ['username', 'user_pass'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('keydown', function(e) {
                if (e.key === ' ') e.preventDefault();
            });
        }
    });
}
