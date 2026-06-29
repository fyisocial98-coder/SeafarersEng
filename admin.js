// ======================== ADMIN PANEL (Firebase) ========================
const ADMIN = { user: "zkp", pass: "zello@1500" };

function adminLogin() {
    const u = document.getElementById('adminUsername').value.trim();
    const p = document.getElementById('adminPassword').value.trim();
    if (u === ADMIN.user && p === ADMIN.pass) {
        document.getElementById('adminAuth').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        loadUsers(); // Firebase မှ ကျောင်းသားစာရင်းကို ဆွဲယူမည်
    } else {
        alert('❌ Invalid credentials');
    }
}

function adminLogout() {
    document.getElementById('adminAuth').style.display = 'flex';
    document.getElementById('adminPanel').style.display = 'none';
}

// ======================== ADD USER (Firebase) ========================
function addUser() {
    const username = document.getElementById('newUsername').value.trim();
    const password = document.getElementById('newPassword').value.trim();
    const expireDate = document.getElementById('expireDate').value;
    if (!username || !password || !expireDate) {
        alert('⚠️ အားလုံးဖြည့်ပါ');
        return;
    }
    // Firebase တွင် သိမ်းဆည်းခြင်း
    db.ref('users/' + username).set({
        username: username,
        password: password,
        expireDate: expireDate,
        createdAt: new Date().toISOString()
    }).then(() => {
        alert('✅ ကျောင်းသားထည့်ပြီးပါပြီ');
        document.getElementById('newUsername').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('expireDate').value = '';
        loadUsers(); // စာရင်းပြန်တင်ရန်
    }).catch(error => {
        alert('❌ ထည့်သွင်း၍မရပါ: ' + error.message);
    });
}

// ======================== DELETE USER (Firebase) ========================
function deleteUser(username) {
    if (!confirm(`"${username}" ကိုဖျက်မှာသေချာလား?`)) return;
    db.ref('users/' + username).remove()
        .then(() => {
            alert('🗑 ဖျက်ပြီးပါပြီ');
            loadUsers();
        })
        .catch(error => {
            alert('❌ ဖျက်၍မရပါ: ' + error.message);
        });
}

// ======================== LOAD USERS FROM FIREBASE ========================
function loadUsers() {
    db.ref('users').once('value')
        .then(snapshot => {
            const users = [];
            snapshot.forEach(child => {
                users.push(child.val());
            });
            displayUsers(users);
        });
}

function displayUsers(users) {
    let html = `<h4>စုစုပေါင်း ကျောင်းသား: ${users.length} ဦး</h4>`;
    if (users.length === 0) {
        html += '<p>ကျောင်းသားမရှိသေးပါ</p>';
    } else {
        html += `<table><tr><th>Username</th><th>Password</th><th>Expire</th><th>Status</th><th></th></tr>`;
        const today = new Date(); today.setHours(0,0,0,0);
        users.forEach(u => {
            const exp = new Date(u.expireDate);
            const status = today > exp ? '❌ Expired' : '✅ Active';
            html += `<tr>
                <td>${u.username}</td>
                <td>${u.password}</td>
                <td>${u.expireDate}</td>
                <td>${status}</td>
                <td><button class="delete-btn" onclick="deleteUser('${u.username}')">Del</button></td>
            </tr>`;
        });
        html += '</table>';
    }
    document.getElementById('userTable').innerHTML = html;
    document.getElementById('statsContainer').innerHTML = `<div class="stat-card"><h4>Total</h4><p>${users.length}</p></div>`;
}
