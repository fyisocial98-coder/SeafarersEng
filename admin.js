// ======================== SUBSCRIPTIONS (Hardcoded) ========================
const subscriptions = {
    "mts": { key: "mts@2026", startDate: "2026-06-01", expireDate: "2026-07-01", name: "mts" },
    "zkp": { key: "zkp1", startDate: "2026-05-15", expireDate: "2026-07-15", name: "Kyaw Kyaw Min" },
    // Admin account
    "zkp": { key: "set1@2026", startDate: "2026-01-01", expireDate: "2030-12-31", name: "Admin" }
};

const ADMIN = { user: "zkp", pass: "zello@1500" }; // Admin login credentials

// ======================== ADMIN LOGIN ========================
function adminLogin() {
    const u = document.getElementById('adminUsername').value.trim();
    const p = document.getElementById('adminPassword').value.trim();
    if (u === ADMIN.user && p === ADMIN.pass) {
        document.getElementById('adminAuth').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        loadUsersFromSubscriptions();
    } else {
        alert('❌ Invalid credentials');
    }
}

function adminLogout() {
    document.getElementById('adminAuth').style.display = 'flex';
    document.getElementById('adminPanel').style.display = 'none';
}

// ======================== LOAD USERS FROM SUBSCRIPTIONS ========================
function loadUsersFromSubscriptions() {
    const users = [];
    for (const [username, data] of Object.entries(subscriptions)) {
        users.push({ username, ...data });
    }
    displayUsers(users);
}

function displayUsers(users) {
    let html = `<h4>စုစုပေါင်း ကျောင်းသား: ${users.length} ဦး</h4>`;
    if (users.length === 0) {
        html += '<p>ကျောင်းသားမရှိသေးပါ</p>';
    } else {
        html += `<table><tr><th>Username</th><th>Password</th><th>Start</th><th>Expire</th><th>Status</th></tr>`;
        const today = new Date(); today.setHours(0,0,0,0);
        users.forEach(u => {
            const start = new Date(u.startDate);
            const exp = new Date(u.expireDate);
            let status = '✅ Active';
            if (today < start) status = '⏳ Not Started';
            else if (today > exp) status = '❌ Expired';
            html += `<tr>
                <td>${u.username}</td>
                <td>${u.key}</td>
                <td>${u.startDate}</td>
                <td>${u.expireDate}</td>
                <td>${status}</td>
            </tr>`;
        });
        html += '</table>';
    }
    document.getElementById('userTable').innerHTML = html;
    document.getElementById('statsContainer').innerHTML = `<div class="stat-card"><h4>Total</h4><p>${users.length}</p></div>`;
}
