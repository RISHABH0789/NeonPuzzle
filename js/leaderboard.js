// --- CONFIGURATION ---
const SB_URL = 'https://xgccmigqlasyaoiejail.supabase.co';
const SB_KEY = 'sb_publishable_inOd90z8JCPzxKcTjl3Xtw_Qm9PHPjP';

let db;
function initSupabase() {
    try {
        if (typeof supabase !== 'undefined') {
            db = supabase.createClient(SB_URL, SB_KEY);
            console.log("Neon Ghost Database: INITIALIZED");
        } else {
            console.error("Supabase library not found.");
        }
    } catch (error) {
        console.error("Init Error:", error);
    }
}

// --- LOGIC ---
async function fetchLeaderboard(mode) {
    const tableBody = document.getElementById('leaderboard-data');
    tableBody.innerHTML = `<tr><td colspan="3" style="text-align:center; opacity:0.5;">SYNCING...</td></tr>`;

    // 1. Determine which table to target based on the mode
    let targetTable = "";
    if (mode === 'easy') targetTable = "easy_leaderboard";
    else if (mode === 'medium') targetTable = "medium_leaderboard";
    else if (mode === 'hard') targetTable = "hard_leaderboard";

    // Update active tab styling
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('onclick').includes(mode));
    });

    try {
        // 2. Data Fetching from the SPECIFIC table
        const { data, error } = await db
            .from(targetTable) 
            .select('Username, Time_Taken') 
            .order('Time_Taken', { ascending: true })
            .limit(10);

        if (error) throw error;

        tableBody.innerHTML = ''; 
        if (!data || data.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="3" style="text-align:center;">NO OPERATORS IN ${mode.toUpperCase()}</td></tr>`;
            return;
        }

        // 3. Rendering
        data.forEach((entry, index) => {
            const timeVal = entry.Time_Taken || 0; 
            const mins = Math.floor(timeVal / 60).toString().padStart(2, '0');
            const secs = (timeVal % 60).toString().padStart(2, '0');
            
            const displayName = entry.Username ? entry.Username.toUpperCase() : "UNKNOWN";

            tableBody.innerHTML += `
                <tr>
                    <td>#${index + 1}</td>
                    <td style="color: #00C7FF;">${displayName}</td>
                    <td>${mins}:${secs}</td>
                </tr>`;
        });

    } catch (err) {
        console.error("Fetch Error:", err);
        tableBody.innerHTML = `<tr><td colspan="3" style="color:#ff4444;">DATABASE OFFLINE</td></tr>`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initSupabase();
    fetchLeaderboard('easy');
});