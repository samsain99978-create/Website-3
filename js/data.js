// ============================================================
// A7 SATTA - Data Layer (localStorage-based persistence)
// ============================================================

const DEFAULT_CREDENTIALS = {
    username: (typeof window !== 'undefined' && window.ENV_CONFIG && window.ENV_CONFIG.ADMIN_USERNAME) ? window.ENV_CONFIG.ADMIN_USERNAME : "Adminx285",
    password: (typeof window !== 'undefined' && window.ENV_CONFIG && window.ENV_CONFIG.ADMIN_PASSWORD) ? window.ENV_CONFIG.ADMIN_PASSWORD : "Admin@2805"
};

const DEFAULT_GAMES_PRIMARY = [
    { name: "मुंबई डे",    slug: "mumbai-day",    time: "12:30 PM", yesterday: "--", today: "" },
    { name: "सदर बाजार",  slug: "sadar-bazar",   time: "01:20 PM", yesterday: "--", today: "" },
    { name: "ग्वालियर",   slug: "gwalior",        time: "02:20 PM", yesterday: "--", today: "" },
    { name: "दिल्ली बाजार",slug: "delhi-bazar",   time: "03:00 PM", yesterday: "--", today: "" },
    { name: "भोपाल सिटी", slug: "bhopal-city",    time: "03:50 PM", yesterday: "--", today: "" },
    { name: "श्री गणेश",  slug: "shree-ganesh",   time: "04:20 PM", yesterday: "--", today: "" },
    { name: "जयपुर सिटी", slug: "jaipur-city",    time: "05:15 PM", yesterday: "--", today: "" },
    { name: "फरीदाबाद",   slug: "faridabad",      time: "05:50 PM", yesterday: "--", today: "" },
    { name: "सूरत",       slug: "surat",           time: "06:45 PM", yesterday: "--", today: "" },
    { name: "अलवर",       slug: "alwar",           time: "07:20 PM", yesterday: "--", today: "" },
    { name: "गाज़ियाबाद", slug: "gaziyabad",       time: "09:30 PM", yesterday: "--", today: "" },
    { name: "पुणे नाईट",  slug: "pune-night",     time: "10:30 PM", yesterday: "--", today: "" },
    { name: "गली",        slug: "gali",            time: "11:30 PM", yesterday: "--", today: "" },
    { name: "दिसावर",     slug: "disawar",         time: "03:00 AM", yesterday: "--", today: "" }
];

const DEFAULT_GAMES_SECONDARY = [];

const DEFAULT_FEATURED = {
    name: "दिसावर",
    slug: "disawar",
    time: "05:10 AM",
    previous: "93",
    current: "51"
};

const DEFAULT_MARQUEE = "A7 Satta King, A7-Satta, A7 सट्टा, Satta king chart, Satta Record Chart, Old Result Chart, Satta king online result, Satta king online, Satta king result today, Gali result, Desawar result, Faridabad result, Gaziyabad result, Satta matka king, Satta king up, Satta king desawar, Satta king gali, Satta king 2019 chart, Satta baba king, Gali live result, Disawar live result, Satta Number, Matka Number, Satta.com, Satta Game, Gali Number, Delhi Satta king, Satta Bazar, Satta king 2017, satta king 2018, Gali Leak Number, Gali Single Jodi, Black Satta Result, Black satta king, Satta King India";

const DEFAULT_HINDI_TEXT = "हा भाई यही आती हे सबसे पहले खबर रूको और देखो";

const DEFAULT_AD_SCHEDULE = {
    topHeader: "--सीधे सट्टा कंपनी का No 1 खाईवाल--",
    khaiwalName: "",
    items: [
        { name: "मुंबई डे",    time: "12:30 PM" },
        { name: "सदर बाजार",  time: "01:20 PM" },
        { name: "ग्वालियर",   time: "02:20 PM" },
        { name: "दिल्ली बाजार",time: "03:00 PM" },
        { name: "भोपाल सिटी", time: "03:50 PM" },
        { name: "श्री गणेश",  time: "04:20 PM" },
        { name: "जयपुर सिटी", time: "05:15 PM" },
        { name: "फरीदाबाद",   time: "05:50 PM" },
        { name: "सूरत",       time: "06:45 PM" },
        { name: "अलवर",       time: "07:20 PM" },
        { name: "गाज़ियाबाद", time: "09:30 PM" },
        { name: "पुणे नाईट",  time: "10:30 PM" },
        { name: "गली",        time: "11:30 PM" },
        { name: "दिसावर",     time: "03:00 AM" }
    ],
    rateTitle: "? Rate list ?",
    jodiRate: "जोड़ी रेट 10-------960",
    harufRate: "हरूफ रेट 100-----960",
    bottomTitle: "",
    linkText: "Game play करने के लिये नीचे लिंक पर क्लिक करे",
    whatsappPhone: "917027405875",
    whatsappUrl: "https://wa.me/message/WTOZYC4GBMWNC1"
};

function compileAdContentFromSchedule(schedule) {
    if (!schedule) return '';
    let html = '';

    // Top Header & Khaiwal Name
    if (schedule.topHeader || schedule.khaiwalName) {
        html += `<div class="ad-header-box">\n`;
        if (schedule.topHeader) {
            html += `<div class="ad-top-title">${schedule.topHeader}</div>\n`;
        }
        if (schedule.khaiwalName) {
            html += `<div class="ad-khaiwal-title">${schedule.khaiwalName}</div>\n`;
        }
        html += `</div>\n`;
    }

    // Schedule Rows with Dotted Leaders
    if (schedule.items && schedule.items.length) {
        html += `<div class="ad-schedule-list">\n`;
        schedule.items.forEach(item => {
            if (item.name) {
                const timeStr = item.time || '';
                html += `  <div class="ad-schedule-row">
                    <span class="ad-schedule-name"><span class="clock-icon">⏰</span> ${item.name}</span>
                    <span class="ad-schedule-leader"></span>
                    <span class="ad-schedule-time">${timeStr}</span>
                </div>\n`;
            }
        });
        html += `</div>\n`;
    }

    // Rate Card
    if (schedule.rateTitle || schedule.jodiRate || schedule.harufRate) {
        html += `<div class="ad-rate-card">\n`;
        if (schedule.rateTitle) html += `<div class="ad-rate-title">${schedule.rateTitle}</div>\n`;
        if (schedule.jodiRate) html += `<div class="ad-rate-item">${schedule.jodiRate}</div>\n`;
        if (schedule.harufRate) html += `<div class="ad-rate-item">${schedule.harufRate}</div>\n`;
        html += `</div>\n`;
    }

    // Bottom Title & WhatsApp Button
    if (schedule.bottomTitle) {
        html += `<div class="ad-bottom-title">${schedule.bottomTitle}</div>\n`;
    }
    if (schedule.linkText) {
        const linkUrl = schedule.whatsappUrl || (schedule.whatsappPhone ? `https://wa.me/${schedule.whatsappPhone}` : 'https://wa.me/message/WTOZYC4GBMWNC1');
        const waSvgIcon = `<svg class="ad-wa-icon" viewBox="0 0 24 24" width="22" height="22" fill="currentColor" style="vertical-align:-4px;margin-right:8px;display:inline-block;"><path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.76.459 3.477 1.33 4.988l-1.414 5.163 5.281-1.385c1.458.796 3.104 1.215 4.79 1.216h.004c5.505 0 9.989-4.478 9.99-9.984 0-2.669-1.038-5.178-2.924-7.064a9.927 9.927 0 0 0-7.067-2.918zm0 1.834c4.493 0 8.151 3.658 8.153 8.15.001 2.181-.848 4.232-2.391 5.776-1.543 1.543-3.595 2.393-5.776 2.393h-.003c-1.479 0-2.923-.396-4.18-1.144l-.3-.178-3.109.815.829-3.029-.196-.312a8.106 8.106 0 0 1-1.246-4.321c.002-4.492 3.66-8.15 8.153-8.15zm-4.633 4.218c-.126 0-.327.047-.498.234-.171.188-.654.639-.654 1.558 0 .919.668 1.807.762 1.932.094.125 1.303 2.062 3.208 2.854.453.189.807.301 1.083.389.455.144.869.124 1.197.075.365-.054 1.125-.46 1.286-.905.161-.445.161-.826.113-.905-.047-.078-.171-.125-.36-.219-.188-.094-1.125-.555-1.3-.618-.175-.063-.303-.094-.431.094-.128.188-.498.639-.611.764-.113.125-.226.141-.414.047-.188-.094-.795-.293-1.514-.934-.56-.499-.938-1.116-1.048-1.304-.11-.188-.012-.29.082-.383.085-.084.188-.219.283-.328.094-.109.126-.188.188-.313.063-.125.031-.234-.016-.328-.047-.094-.431-1.037-.591-1.422-.156-.375-.315-.324-.431-.33h-.368z"/></svg>`;
        html += `<div class="ad-cta-container">
            <a href="${linkUrl}" target="_blank" class="ad-whatsapp-btn">
                ${waSvgIcon}<span>${schedule.linkText}</span>
            </a>
        </div>\n`;
    }
    return html;
}

const DEFAULT_AD_CONTENT = compileAdContentFromSchedule(DEFAULT_AD_SCHEDULE);

if (typeof window !== 'undefined') {
    window.DEFAULT_AD_SCHEDULE = DEFAULT_AD_SCHEDULE;
    window.DEFAULT_AD_CONTENT = DEFAULT_AD_CONTENT;
    window.compileAdContentFromSchedule = compileAdContentFromSchedule;
}

// Chart 1: Green table — games 1–5
const DEFAULT_CHART1_HEADERS = ["मुंबई डे", "सदर बाजार", "ग्वालियर", "दिल्ली बाजार", "भोपाल सिटी"];
const DEFAULT_CHART1_DATA = [
    { date: "01-08", values: ["-", "-", "-", "-", "-"] },
    { date: "02-08", values: ["-", "-", "-", "-", "-"] },
    { date: "03-08", values: ["-", "-", "-", "-", "-"] },
    { date: "04-08", values: ["-", "-", "-", "-", "-"] },
    { date: "05-08", values: ["-", "-", "-", "-", "-"] },
    { date: "आज",   values: ["-", "-", "-", "-", "-"] }
];

// Chart 2: Blue table — games 6–10
const DEFAULT_CHART2_HEADERS = ["श्री गणेश", "जयपुर सिटी", "फरीदाबाद", "सूरत", "अलवर"];
const DEFAULT_CHART2_DATA = [
    { date: "01-08", values: ["-", "-", "-", "-", "-"] },
    { date: "02-08", values: ["-", "-", "-", "-", "-"] },
    { date: "03-08", values: ["-", "-", "-", "-", "-"] },
    { date: "04-08", values: ["-", "-", "-", "-", "-"] },
    { date: "05-08", values: ["-", "-", "-", "-", "-"] },
    { date: "आज",   values: ["-", "-", "-", "-", "-"] }
];

// Chart 3: Orange table — games 11–14
const DEFAULT_CHART3_HEADERS = ["गाज़ियाबाद", "पुणे नाईट", "गली", "दिसावर"];
const DEFAULT_CHART3_DATA = [
    { date: "01-08", values: ["-", "-", "-", "-"] },
    { date: "02-08", values: ["-", "-", "-", "-"] },
    { date: "03-08", values: ["-", "-", "-", "-"] },
    { date: "04-08", values: ["-", "-", "-", "-"] },
    { date: "05-08", values: ["-", "-", "-", "-"] },
    { date: "आज",   values: ["-", "-", "-", "-"] }
];

// Full chart page data — all 14 games
const DEFAULT_FULLCHART_HEADERS = [
    "मुंबई डे", "सदर बाजार", "ग्वालियर", "दिल्ली बाजार",
    "भोपाल सिटी", "श्री गणेश", "जयपुर सिटी", "फरीदाबाद",
    "सूरत", "अलवर", "गाज़ियाबाद", "पुणे नाईट",
    "गली", "दिसावर"
];

const DEFAULT_FULLCHART_DATA = [
    { date: "01-08", values: ["-","-","-","-","-","-","-","-","-","-","-","-","-","-"] },
    { date: "02-08", values: ["-","-","-","-","-","-","-","-","-","-","-","-","-","-"] },
    { date: "03-08", values: ["-","-","-","-","-","-","-","-","-","-","-","-","-","-"] },
    { date: "04-08", values: ["-","-","-","-","-","-","-","-","-","-","-","-","-","-"] },
    { date: "05-08", values: ["-","-","-","-","-","-","-","-","-","-","-","-","-","-"] },
    { date: "आज",   values: ["-","-","-","-","-","-","-","-","-","-","-","-","-","-"] }
];

// Previous month chart — all 14 games
const DEFAULT_PREV_FULLCHART_HEADERS = DEFAULT_FULLCHART_HEADERS;
const DEFAULT_PREV_FULLCHART_DATA = [
    { date: "01-07", values: ["-","-","-","-","-","-","-","-","-","-","-","-","-","-"] },
    { date: "02-07", values: ["-","-","-","-","-","-","-","-","-","-","-","-","-","-"] },
    { date: "03-07", values: ["-","-","-","-","-","-","-","-","-","-","-","-","-","-"] },
    { date: "04-07", values: ["-","-","-","-","-","-","-","-","-","-","-","-","-","-"] },
    { date: "05-07", values: ["-","-","-","-","-","-","-","-","-","-","-","-","-","-"] },
    { date: "06-07", values: ["-","-","-","-","-","-","-","-","-","-","-","-","-","-"] },
    { date: "07-07", values: ["-","-","-","-","-","-","-","-","-","-","-","-","-","-"] },
    { date: "08-07", values: ["-","-","-","-","-","-","-","-","-","-","-","-","-","-"] },
    { date: "09-07", values: ["-","-","-","-","-","-","-","-","-","-","-","-","-","-"] },
    { date: "10-07", values: ["-","-","-","-","-","-","-","-","-","-","-","-","-","-"] },
    { date: "11-07", values: ["-","-","-","-","-","-","-","-","-","-","-","-","-","-"] },
    { date: "12-07", values: ["-","-","-","-","-","-","-","-","-","-","-","-","-","-"] },
    { date: "13-07", values: ["-","-","-","-","-","-","-","-","-","-","-","-","-","-"] },
    { date: "14-07", values: ["-","-","-","-","-","-","-","-","-","-","-","-","-","-"] },
    { date: "15-07", values: ["-","-","-","-","-","-","-","-","-","-","-","-","-","-"] },
    { date: "16-07", values: ["-","-","-","-","-","-","-","-","-","-","-","-","-","-"] },
    { date: "17-07", values: ["-","-","-","-","-","-","-","-","-","-","-","-","-","-"] },
    { date: "18-07", values: ["-","-","-","-","-","-","-","-","-","-","-","-","-","-"] },
    { date: "19-07", values: ["-","-","-","-","-","-","-","-","-","-","-","-","-","-"] },
    { date: "20-07", values: ["-","-","-","-","-","-","-","-","-","-","-","-","-","-"] },
    { date: "21-07", values: ["-","-","-","-","-","-","-","-","-","-","-","-","-","-"] },
    { date: "22-07", values: ["-","-","-","-","-","-","-","-","-","-","-","-","-","-"] },
    { date: "23-07", values: ["-","-","-","-","-","-","-","-","-","-","-","-","-","-"] },
    { date: "24-07", values: ["-","-","-","-","-","-","-","-","-","-","-","-","-","-"] },
    { date: "25-07", values: ["-","-","-","-","-","-","-","-","-","-","-","-","-","-"] },
    { date: "26-07", values: ["-","-","-","-","-","-","-","-","-","-","-","-","-","-"] },
    { date: "27-07", values: ["-","-","-","-","-","-","-","-","-","-","-","-","-","-"] },
    { date: "28-07", values: ["-","-","-","-","-","-","-","-","-","-","-","-","-","-"] },
    { date: "29-07", values: ["-","-","-","-","-","-","-","-","-","-","-","-","-","-"] },
    { date: "30-07", values: ["-","-","-","-","-","-","-","-","-","-","-","-","-","-"] },
    { date: "31-07", values: ["-","-","-","-","-","-","-","-","-","-","-","-","-","-"] }
];

const ALL_GAME_LIST = [
    { name: "मुंबई डे",    slug: "mumbai-day" },
    { name: "सदर बाजार",  slug: "sadar-bazar" },
    { name: "ग्वालियर",   slug: "gwalior" },
    { name: "दिल्ली बाजार",slug: "delhi-bazar" },
    { name: "भोपाल सिटी", slug: "bhopal-city" },
    { name: "श्री गणेश",  slug: "shree-ganesh" },
    { name: "जयपुर सिटी", slug: "jaipur-city" },
    { name: "फरीदाबाद",   slug: "faridabad" },
    { name: "सूरत",       slug: "surat" },
    { name: "अलवर",       slug: "alwar" },
    { name: "गाज़ियाबाद", slug: "gaziyabad" },
    { name: "पुणे नाईट",  slug: "pune-night" },
    { name: "गली",        slug: "gali" },
    { name: "दिसावर",     slug: "disawar" }
];

// ============================================================
// SATTA RECORD CHART — Game List (from Image 2)
// ============================================================

const DEFAULT_RECORD_GAMES = [
    { name: "फरीदाबाद",     slug: "faridabad",    display: "FARIDABAD" },
    { name: "गाज़ियाबाद",   slug: "gaziyabad",    display: "GAZIYABAD" },
    { name: "गली",          slug: "gali",          display: "GALI" },
    { name: "दिल्ली बाजार", slug: "delhi-bazar",  display: "DELHI BAZAR" },
    { name: "श्री गणेश",   slug: "shree-ganesh", display: "SHREE GANESH" },
    { name: "दिसावर",       slug: "disawar",       display: "DISAWAR" },
    { name: "ताजपुर",       slug: "tajpur",        display: "Tajpur" },
    { name: "जयपुर सिटी",  slug: "jaipur-city",  display: "Jaipur city" },
    { name: "सदर बाजार",   slug: "sadar-bazar",  display: "SADAR BAZAR" },
    { name: "ग्वालियर",    slug: "gwalior",       display: "GWALIOR" },
    { name: "अलवर",         slug: "alwar",         display: "ALWAR" },
    { name: "बैंगलोर नाइट",slug: "banglor-night", display: "BANGLOR NIGHT" },
    { name: "नोएडा दरबार", slug: "noida-darbar",  display: "NOIDA DARBAR" },
    { name: "आगरा सिटी",   slug: "agra-city",    display: "AGRA CITY" },
    { name: "द्वारका दरबार",slug: "dwarka-darbar",display: "DWARKA DARBAR" },
    { name: "कानपुर डे",   slug: "kanpur-day",   display: "KANPUR DAY" },
    { name: "सदर मटका",    slug: "sadar-matka",  display: "SADAR MATKA" }
];

// Column headers for yearly charts (display names)
const DEFAULT_YEAR_HEADERS = DEFAULT_RECORD_GAMES.map(function(g) { return g.display; });

// Generate 12 monthly rows for a yearly chart (JAN–DEC)
function generateYearlyChartData(year) {
    var months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    var gameCount = DEFAULT_RECORD_GAMES.length;
    return months.map(function(m) {
        var vals = [];
        for (var i = 0; i < gameCount; i++) vals.push('-');
        return { date: m + ' ' + year, values: vals };
    });
}

const DEFAULT_YEAR_2026_DATA = generateYearlyChartData(2026);
const DEFAULT_YEAR_2025_DATA = generateYearlyChartData(2025);
const DEFAULT_YEAR_2024_DATA = generateYearlyChartData(2024);
const DEFAULT_YEAR_2023_DATA = generateYearlyChartData(2023);

if (typeof window !== 'undefined') {
    window.DEFAULT_RECORD_GAMES = DEFAULT_RECORD_GAMES;
    window.DEFAULT_YEAR_HEADERS = DEFAULT_YEAR_HEADERS;
}

const DEFAULT_DISCLAIMER = "!! DISCLAIMER:- This is a demo website. Viewing This Website Is Your Own Risk, All The Information Shown On Website Is Sponsored And We Warn You That Matka Gambling/Satta May Be Banned Or Illegal In Your Country..., We Are Not Responsible For Any Issues Or Scam..., We Respect All Country Rules/Laws... If You Not Agree With Our Site Disclaimer... Please Quit Our Site Right Now. Thank You.";

// ============================================================
// Data Access Functions
// ============================================================

// Map of alternative names for reliable header matching
const GAME_NAME_MAP = {
    "MUMBAI DAY":   ["मुंबई डे",    "mumbai-day",  "MUMBAI DAY"],
    "SADAR BAZAR":  ["सदर बाजार",  "sadar-bazar", "SADAR BAZAR"],
    "GWALIOR":      ["ग्वालियर",   "gwalior",     "GWALIOR"],
    "DELHI BAZAR":  ["दिल्ली बाजार","delhi-bazar", "DELHI BAZAR"],
    "BHOPAL CITY":  ["भोपाल सिटी", "bhopal-city", "BHOPAL CITY"],
    "SHREE GANESH": ["श्री गणेश",  "shree-ganesh","SHREE GANESH"],
    "JAIPUR CITY":  ["जयपुर सिटी", "jaipur-city", "JAIPUR CITY"],
    "FARIDABAD":    ["फरीदाबाद",   "faridabad",   "FARIDABAD"],
    "SURAT":        ["सूरत",       "surat",        "SURAT"],
    "ALWAR":        ["अलवर",       "alwar",        "ALWAR"],
    "GAZIYABAD":    ["गाज़ियाबाद", "gaziyabad",   "GAZIYABAD"],
    "PUNE NIGHT":   ["पुणे नाईट",  "pune-night",  "PUNE NIGHT"],
    "GALI":         ["गली",        "gali",         "GALI"],
    "DISAWAR":      ["दिसावर",     "disawar",      "DISAWAR"]
};

function findHeaderColumnIndex(headers, game) {
    if (!headers || !game) return -1;
    // 1. Direct name match
    var idx = headers.indexOf(game.name);
    if (idx !== -1) return idx;

    // 2. Map match
    var targetList = [game.name, game.slug];
    if (GAME_NAME_MAP[game.name]) targetList = targetList.concat(GAME_NAME_MAP[game.name]);

    for (var i = 0; i < headers.length; i++) {
        var header = headers[i];
        if (targetList.indexOf(header) !== -1) return i;
        if (GAME_NAME_MAP[header] && GAME_NAME_MAP[header].indexOf(game.name) !== -1) return i;
        if (game.slug && header.toLowerCase().replace(/\s+/g, '-') === game.slug.toLowerCase()) return i;
    }
    return -1;
}

function autoSyncTodayResults() {
    var primary = getData('games_primary') || [];
    var secondary = getData('games_secondary') || [];
    var allGames = primary.concat(secondary);

    var now = new Date();
    var dd = String(now.getDate()).padStart(2, '0');
    var mm = String(now.getMonth() + 1).padStart(2, '0');
    var currentDateStr = dd + '-' + mm; // e.g. "06-08"

    function updateChartDataset(headerKey, dataKey) {
        var headers = getData(headerKey);
        var data = getData(dataKey);
        if (!headers || !data) return;

        var updated = false;
        var targetRowIndex = -1;

        for (var r = 0; r < data.length; r++) {
            if (data[r].date === currentDateStr || data[r].date === "आज" || data[r].date === "Today") {
                targetRowIndex = r;
                if (data[r].date === "Today" || data[r].date === "आज") {
                    data[r].date = currentDateStr;
                    updated = true;
                }
                break;
            }
        }

        if (targetRowIndex === -1) {
            var emptyValues = headers.map(function() { return '-'; });
            data.push({ date: currentDateStr, values: emptyValues });
            targetRowIndex = data.length - 1;
            updated = true;
        }

        headers.forEach(function(headerName, colIndex) {
            var matchingGame = null;
            for (var g = 0; g < allGames.length; g++) {
                if (findHeaderColumnIndex([headerName], allGames[g]) !== -1) {
                    matchingGame = allGames[g];
                    break;
                }
            }

            var expectedVal = '-';
            if (matchingGame && matchingGame.today && matchingGame.today !== '' && matchingGame.today !== '-') {
                expectedVal = matchingGame.today;
            }

            if (!data[targetRowIndex].values) {
                data[targetRowIndex].values = [];
            }

            if (data[targetRowIndex].values[colIndex] !== expectedVal) {
                data[targetRowIndex].values[colIndex] = expectedVal;
                updated = true;
            }
        });

        if (updated) {
            localStorage.setItem('a7_' + dataKey, JSON.stringify(data));
            localStorage.setItem('a7_' + headerKey, JSON.stringify(headers));
            if (typeof pushToFirebase === 'function') pushToFirebase(dataKey, data);
        }
    }

    updateChartDataset('chart1_headers', 'chart1_data');
    updateChartDataset('chart2_headers', 'chart2_data');
    updateChartDataset('chart3_headers', 'chart3_data');
    updateChartDataset('fullchart_headers', 'fullchart_data');
}

function checkDateRollover() {
    var now = new Date();
    var year = now.getFullYear();
    var month = String(now.getMonth() + 1).padStart(2, '0');
    var day = String(now.getDate()).padStart(2, '0');
    var todayDateStr = year + '-' + month + '-' + day; // e.g. "2026-08-12"

    var lastActiveDate = localStorage.getItem('a7_last_active_date');

    if (!lastActiveDate) {
        localStorage.setItem('a7_last_active_date', todayDateStr);
        autoSyncTodayResults();
        return;
    }

    if (lastActiveDate !== todayDateStr) {
        console.log('[A7 Date Rollover] Date changed from ' + lastActiveDate + ' to ' + todayDateStr + '. Auto-shifting results...');

        // 1. Shift primary table results: today -> yesterday, today -> ""
        var primary = getData('games_primary');
        if (Array.isArray(primary)) {
            primary.forEach(function(g) {
                if (g.today && g.today !== '' && g.today !== '-') {
                    g.yesterday = g.today;
                }
                g.today = '';
            });
            localStorage.setItem('a7_games_primary', JSON.stringify(primary));
            if (typeof pushToFirebase === 'function') pushToFirebase('games_primary', primary);
        }

        // 2. Shift secondary table results if present
        var secondary = getData('games_secondary');
        if (Array.isArray(secondary)) {
            secondary.forEach(function(g) {
                if (g.today && g.today !== '' && g.today !== '-') {
                    g.yesterday = g.today;
                }
                g.today = '';
            });
            localStorage.setItem('a7_games_secondary', JSON.stringify(secondary));
            if (typeof pushToFirebase === 'function') pushToFirebase('games_secondary', secondary);
        }

        // 3. Update last active date to today
        localStorage.setItem('a7_last_active_date', todayDateStr);

        // 4. Auto sync chart datasets to ensure a new empty row for the new date is added to the result table below
        autoSyncTodayResults();

        // 5. Re-render UI if functions exist
        if (typeof window !== 'undefined') {
            if (typeof renderPrimaryTable === 'function') renderPrimaryTable();
            if (typeof renderSecondaryTable === 'function') renderSecondaryTable();
            if (typeof renderLiveResults === 'function') renderLiveResults();
            if (typeof renderFeatured === 'function') renderFeatured();
            if (typeof renderAdminPrimaryTable === 'function') renderAdminPrimaryTable();
            if (typeof renderAdminChart === 'function') {
                renderAdminChart('admin-chart1', 'chart1_headers', 'chart1_data', 0);
                renderAdminChart('admin-chart2', 'chart2_headers', 'chart2_data', 1);
                renderAdminChart('admin-chart3', 'chart3_headers', 'chart3_data', 2);
                renderAdminChart('admin-fullchart', 'fullchart_headers', 'fullchart_data', 3);
            }
            if (typeof initChartPage === 'function' && window.location && window.location.pathname && window.location.pathname.indexOf('chart.html') !== -1) {
                initChartPage();
            }
        }
    } else {
        autoSyncTodayResults();
    }
}

if (typeof window !== 'undefined') {
    window.checkDateRollover = checkDateRollover;
}

function initData(forceReset) {
    if (forceReset || !localStorage.getItem('a7_initialized_v11')) {
        localStorage.setItem('a7_credentials', JSON.stringify(DEFAULT_CREDENTIALS));
        localStorage.setItem('a7_games_primary', JSON.stringify(DEFAULT_GAMES_PRIMARY));
        localStorage.setItem('a7_games_secondary', JSON.stringify(DEFAULT_GAMES_SECONDARY));
        localStorage.setItem('a7_featured', JSON.stringify(DEFAULT_FEATURED));
        localStorage.setItem('a7_marquee', DEFAULT_MARQUEE);
        localStorage.setItem('a7_hindi_text', DEFAULT_HINDI_TEXT);
        localStorage.setItem('a7_ad_schedule', JSON.stringify(DEFAULT_AD_SCHEDULE));
        localStorage.setItem('a7_ad_content', DEFAULT_AD_CONTENT);
        localStorage.setItem('a7_chart1_headers', JSON.stringify(DEFAULT_CHART1_HEADERS));
        localStorage.setItem('a7_chart1_data', JSON.stringify(DEFAULT_CHART1_DATA));
        localStorage.setItem('a7_chart2_headers', JSON.stringify(DEFAULT_CHART2_HEADERS));
        localStorage.setItem('a7_chart2_data', JSON.stringify(DEFAULT_CHART2_DATA));
        localStorage.setItem('a7_chart3_headers', JSON.stringify(DEFAULT_CHART3_HEADERS));
        localStorage.setItem('a7_chart3_data', JSON.stringify(DEFAULT_CHART3_DATA));
        localStorage.setItem('a7_fullchart_headers', JSON.stringify(DEFAULT_FULLCHART_HEADERS));
        localStorage.setItem('a7_fullchart_data', JSON.stringify(DEFAULT_FULLCHART_DATA));
        localStorage.setItem('a7_prev_fullchart_headers', JSON.stringify(DEFAULT_PREV_FULLCHART_HEADERS));
        localStorage.setItem('a7_prev_fullchart_data', JSON.stringify(DEFAULT_PREV_FULLCHART_DATA));
        localStorage.setItem('a7_disclaimer', DEFAULT_DISCLAIMER);
        localStorage.setItem('a7_initialized_v11', 'true');
    }

    // v12: Initialize yearly record chart data (preserves existing chart data)
    if (forceReset || !localStorage.getItem('a7_initialized_v12') || !localStorage.getItem('a7_record_games')) {
        localStorage.setItem('a7_record_games', JSON.stringify(DEFAULT_RECORD_GAMES));
        localStorage.setItem('a7_year_headers', JSON.stringify(DEFAULT_YEAR_HEADERS));
        localStorage.setItem('a7_year_2026_data', JSON.stringify(DEFAULT_YEAR_2026_DATA));
        localStorage.setItem('a7_year_2025_data', JSON.stringify(DEFAULT_YEAR_2025_DATA));
        localStorage.setItem('a7_year_2024_data', JSON.stringify(DEFAULT_YEAR_2024_DATA));
        localStorage.setItem('a7_year_2023_data', JSON.stringify(DEFAULT_YEAR_2023_DATA));
        localStorage.setItem('a7_initialized_v12', 'true');
    }
    // v14: Reset games_primary so Gwalior (98) is the last declared game and Delhi Bazar is next
    if (forceReset || !localStorage.getItem('a7_initialized_v14')) {
        var prim = getData('games_primary');
        if (Array.isArray(prim)) {
            prim.forEach(function(g) {
                if (g.slug === 'mumbai-day') g.today = '57';
                else if (g.slug === 'sadar-bazar') g.today = '82';
                else if (g.slug === 'gwalior') g.today = '98';
                else g.today = '';
            });
            localStorage.setItem('a7_games_primary', JSON.stringify(prim));
            if (typeof pushToFirebase === 'function') pushToFirebase('games_primary', prim);
        }
        localStorage.setItem('a7_initialized_v14', 'true');
    }

    // Trim any extra trailing elements in dataset row values so row.values.length matches headers.length
    ['chart1', 'chart2', 'chart3', 'fullchart', 'prev_fullchart'].forEach(function(prefix) {
        var h = getData(prefix + '_headers');
        var d = getData(prefix + '_data');
        if (Array.isArray(h) && Array.isArray(d)) {
            var mod = false;
            d.forEach(function(row) {
                if (row.values && row.values.length > h.length) {
                    row.values = row.values.slice(0, h.length);
                    mod = true;
                }
            });
            if (mod) localStorage.setItem('a7_' + prefix + '_data', JSON.stringify(d));
        }
    });

    var yHeaders = getData('year_headers');
    if (Array.isArray(yHeaders)) {
        [2026, 2025, 2024, 2023].forEach(function(yr) {
            var d = getData('year_' + yr + '_data');
            if (Array.isArray(d)) {
                var mod = false;
                d.forEach(function(row) {
                    if (row.values && row.values.length > yHeaders.length) {
                        row.values = row.values.slice(0, yHeaders.length);
                        mod = true;
                    }
                });
                if (mod) localStorage.setItem('a7_year_' + yr + '_data', JSON.stringify(d));
            }
        });
    }

    checkDateRollover();
}

function getData(key) {
    const val = localStorage.getItem('a7_' + key);
    try { return JSON.parse(val); } catch (e) { return val; }
}

function setData(key, value) {
    if (typeof value === 'object') {
        localStorage.setItem('a7_' + key, JSON.stringify(value));
    } else {
        localStorage.setItem('a7_' + key, value);
    }
    if (key === 'games_primary' || key === 'games_secondary') {
        autoSyncTodayResults();
    }
}

function resetAllData() {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('a7_'));
    keys.forEach(k => localStorage.removeItem(k));
    initData(true);
}

// Initialize on load
initData();
