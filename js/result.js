// 1. Setup variables (Use your actual project details)
const SB_URL = 'https://xgccmigqlasyaoiejail.supabase.co'; // Replace with your actual URL
const SB_KEY = 'sb_publishable_inOd90z8JCPzxKcTjl3Xtw_Qm9PHPjP'; // Replace with your actual Key
let dbClient;

async function initResults() {
    // A. Wait for the Supabase Library to load from the CDN
    if (typeof window.supabase === 'undefined') {
        setTimeout(initResults, 500);
        return;
    }

    // B. Initialize the connection
    dbClient = window.supabase.createClient(SB_URL, SB_KEY);

    // C. Get data from the game (LocalStorage)
    const score = parseInt(localStorage.getItem('nodesSecured')) || 0; // Ensure it's a number
    const skips = localStorage.getItem('totalSkips') || 0;
    const timeString = localStorage.getItem('finalTime') || '00:00'; 
    const user = localStorage.getItem('username') || 'Agent_Unknown';
    const mode = localStorage.getItem('gameMode') || 'easy';

    // D. Convert Time
    const timeParts = timeString.split(':');
    const minutes = parseInt(timeParts[0], 10);
    const seconds = parseInt(timeParts[1], 10);
    const totalSeconds = (minutes * 60) + seconds;

    // E. Update HTML
    if(document.getElementById('score-val')) document.getElementById('score-val').innerText = score;
    if(document.getElementById('skip-val')) document.getElementById('skip-val').innerText = skips;
    if(document.getElementById('display-time')) document.getElementById('display-time').innerText = timeString;

    // F. Choose the right table
    let tableName = "easy_leaderboard";
    if (mode === "medium") tableName = "medium_leaderboard";
    if (mode === "hard") tableName = "hard_leaderboard";

    const statusEl = document.getElementById('upload-status');

    // G. The High-Score Logic (With Completion Condition)
    try {
        // --- ADDED CONDITION START ---
        // Only proceed if the user completed all five levels (no skipping the whole game)
        if (score < 5) {
            if (statusEl) {
                statusEl.innerText = "MISSION INCOMPLETE: LEADERBOARD ENTRY RESTRICTED";
                statusEl.style.color = "#ff8800";
            }
            return; // Exit the function early
        }
        // --- ADDED CONDITION END ---

        if (statusEl) statusEl.innerText = "CHECKING FOR PERSONAL BEST...";

        // 1. Check if this user already has a score
        const { data: existingEntry, error: fetchError } = await dbClient
            .from(tableName)
            .select('Time_Taken')
            .eq('Username', user)
            .maybeSingle();

        if (fetchError) throw fetchError;

        // 2. Determine if we should save the new score
        if (!existingEntry || totalSeconds < existingEntry.Time_Taken) {
            
            const { error: upsertError } = await dbClient
                .from(tableName)
                .upsert({ 
                    Username: user, 
                    Time_Taken: totalSeconds 
                }, { onConflict: 'Username' });

            if (upsertError) throw upsertError;

            if (statusEl) {
                statusEl.innerText = existingEntry ? "NEW PERSONAL BEST ARCHIVED!" : "MISSION DATA INITIALIZED!";
                statusEl.style.color = "#00ff88";
            }
        } else {
            if (statusEl) {
                statusEl.innerText = "MISSION COMPLETE: BEST TIME RETAINED";
                statusEl.style.color = "#00C7FF";
            }
        }

    } catch (err) {
        console.error("Critical Error:", err.message || err);
        if (statusEl) {
            statusEl.innerText = "UPLOAD FAILED: OFFLINE MODE";
            statusEl.style.color = "#ff4444";
        }
    }
}

window.onload = initResults;