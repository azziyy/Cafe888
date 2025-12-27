const BOT_TOKEN = "8032226679:AAETTGPvYZYSvF_QmdofXKibpOwt4E9Iitc"; 
const CHAT_ID = "519326806"; 

const products = [
    { id: 1, cat: 'Burgerlar', name: 'Cheeseburger', price: 18000, img: 'Images/kolbasa.jpg', desc: 'Yumshoq bulochka va pishloq.' },
    { id: 2, cat: 'Burgerlar', name: 'Double Burger', price: 43000, img: 'Images/bigmag.jpg', desc: 'Ikki qavatli go\'sht.' },
    { id: 3, cat: 'Burgerlar', name: 'Ganburger', price: 30000, img: 'Images/gamburger.jpg', desc: 'Odiy Gamburger.' },
    { id: 4, cat: 'Burgerlar', name: 'Tuxumli Burger', price: 38000, img: 'Images/txburger.jpg', desc: 'Tuxumli Burger.' },
    { id: 5, cat: 'Ichimliklar', name: 'Kofe MacCoffee', price: 7000, img: 'Images/cofemac.jpg', desc: 'Issiq Va Yoqimli MacCoffee.' },
    { id: 6, cat: 'Ichimliklar', name: 'Cappuccino', price: 10000, img: 'Images/cofecap.jpg', desc: 'CAPPUCCINO.' },
    { id: 7, cat: 'Ichimliklar', name: 'Fanta 1.5l', price: 17000, img: 'Images/fanta1.jpg', desc: 'Apelsinlik Fanta.' },
    { id: 8, cat: 'Ichimliklar', name: 'Pepsi 1.5l', price: 13000, img: 'Images/pepsi15.jpg', desc: 'Pepsi Cola.' },
    { id: 9, cat: 'Shirinliklar', name: 'Malibu ', price: 25000, img: 'Images/shmalibu.jpg', desc: 'Malibu desert.' },
    { id: 10, cat: 'Shirinliklar', name: 'Qizil tort', price: 24000, img: 'Images/shqizil.jpg', desc: 'Qizil desert.' },
    { id: 11, cat: 'Shirinliklar', name: 'Choco', price: 23000, img: 'Images/shchoco.jpg', desc: 'Choco desert.' },
    { id: 12, cat: 'Shirinliklar', name: 'Snikers Tort', price: 23000, img: 'Images/shsnik.jpg', desc: 'Shokoladli tort.' },
    { id: 13, cat: 'Maxsus', name: 'Combo 777', price: 55000, img: 'https://cdn-icons-png.flaticon.com/512/3050/3050130.png', desc: 'Burger + Fri + Kola.' },
    { id: 14, cat: 'Maxsus', name: 'Big Family', price: 120000, img: 'https://cdn-icons-png.flaticon.com/512/3050/3050130.png', desc: 'Oila uchun.' },
    { id: 15, cat: 'Maxsus', name: 'Student', price: 35000, img: 'https://cdn-icons-png.flaticon.com/512/3050/3050130.png', desc: 'Arzon va to\'yimli.' },
    { id: 16, cat: 'Maxsus', name: 'Night Mix', price: 45000, img: 'https://cdn-icons-png.flaticon.com/512/3050/3050130.png', desc: 'Tungi to\'plam.' }
];

let cart = {}; let userCoords = null; let currentCat = 'Barchasi';

// TELEFON RAQAM FORMATI
function fixPhone(input) {
    let val = input.value.replace(/[^\d]/g, ''); 
    if (!val.startsWith('998')) { val = '998' + val; }
    let formatted = "+998 ";
    if (val.length > 3) formatted += val.substring(3, 5) + (val.length > 5 ? " " : "");
    if (val.length > 5) formatted += val.substring(5, 8) + (val.length > 8 ? " " : "");
    if (val.length > 8) formatted += val.substring(8, 10) + (val.length > 10 ? " " : "");
    if (val.length > 10) formatted += val.substring(10, 12);
    input.value = formatted.trim();
}

// REGISTRATSIYA
function checkFirstTime() {
    if (!localStorage.getItem('c777_name')) {
        document.getElementById('regScreen').style.display = 'flex';
    }
}

function saveRegistration() {
    const n = document.getElementById('regName').value.trim();
    const p = document.getElementById('regPhone').value.trim();
    if(n.length < 3) return alert("Ismingizni kiriting!");
    if(p.length < 17) return alert("Raqamni to'liq kiriting!");
    localStorage.setItem('c777_name', n);
    localStorage.setItem('c777_phone', p);
    document.getElementById('regScreen').style.display = 'none';
    showAlert("Muvaffaqiyatli!", "Xush kelibsiz!", "✅");
}

function openProfile() {
    document.getElementById('editName').value = localStorage.getItem('c777_name');
    document.getElementById('editPhone').value = localStorage.getItem('c777_phone');
    document.getElementById('profileModal').classList.add('open');
}

function updateProfile() {
    const n = document.getElementById('editName').value.trim();
    const p = document.getElementById('editPhone').value.trim();
    if(n.length < 3 || p.length < 17) return alert("To'ldiring!");
    localStorage.setItem('c777_name', n);
    localStorage.setItem('c777_phone', p);
    closeModal('profileModal');
    showAlert("Yangilandi", "Ma'lumotlar saqlandi", "✅");
}

function closeModal(id) {
    document.getElementById(id).classList.remove('open');
}

// MENU RENDER
function renderMenu() {
    const filtered = currentCat === 'Barchasi' ? products : products.filter(p => p.cat === currentCat);
    const display = document.getElementById('menuDisplay');
    display.innerHTML = ''; 

    filtered.forEach((p, index) => {
        const qty = cart[p.id] || 0;
        const card = document.createElement('div');
        card.className = 'card';
        card.style.animationDelay = `${index * 0.05}s`; // Har bir karta ketma-ket chiqishi uchun
        card.innerHTML = `
            <div class="img-container" onclick="viewProduct(${p.id})"><img src="${p.img}"></div>
            <div class="card-info">
                <h4>${p.name}</h4>
                <b>${p.price.toLocaleString()} so'm</b>
                <div class="counter-box">
                    <button class="count-btn" onclick="updateQty(${p.id}, -1)">-</button>
                    <span class="qty-label" id="qty-${p.id}">${qty}</span>
                    <button class="count-btn" onclick="updateQty(${p.id}, 1)">+</button>
                </div>
            </div>`;
        display.appendChild(card);
    });
}

function filterMenu(cat, btn) {
    currentCat = cat;
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderMenu();
}

function updateQty(id, change) {
    cart[id] = (cart[id] || 0) + change;
    if (cart[id] <= 0) delete cart[id];
    
    // UI yangilash (miltillashsiz)
    const label = document.getElementById(`qty-${id}`);
    if(label) label.innerText = cart[id] || 0;
    
    const modalLabel = document.getElementById(`mqty-${id}`);
    if(modalLabel) modalLabel.innerText = cart[id] || 0;
    
    renderCart();
}

function renderCart() {
    const list = document.getElementById('cartList');
    let total = 0; let html = "";
    for (const id in cart) {
        const p = products.find(x => x.id == id);
        total += p.price * cart[id];
        html += `<div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #eee; animation: fadeIn 0.3s;">
                    <span>${p.name} (x${cart[id]})</span> 
                    <span>${(p.price * cart[id]).toLocaleString()}</span>
                 </div>`;
    }
    list.innerHTML = html || "<p style='text-align:center; color:#999'>Savatcha bo'sh</p>";
    document.getElementById('totalPrice').innerText = total.toLocaleString();
}

function viewProduct(id) {
    const p = products.find(x => x.id === id);
    const modal = document.getElementById('productModal');
    document.getElementById('viewImg').src = p.img;
    document.getElementById('viewTitle').innerText = p.name;
    document.getElementById('viewDesc').innerText = p.desc;
    document.getElementById('viewPrice').innerText = p.price.toLocaleString() + " so'm";
    document.getElementById('modalCounter').innerHTML = `
        <div class="counter-box">
            <button class="count-btn" onclick="updateQty(${p.id}, -1)">-</button>
            <span class="qty-label" id="mqty-${p.id}">${cart[p.id] || 0}</span>
            <button class="count-btn" onclick="updateQty(${p.id}, 1)">+</button>
        </div>`;
    modal.classList.add('open');
}

function getLocation() {
    const btn = document.getElementById('locBtn');
    btn.innerText = "Aniqlanmoqda...";
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            userCoords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
            btn.innerText = "✅ MANZIL ANIQLANDI";
            btn.style.borderColor = "var(--green)"; btn.style.color = "var(--green)";
        },
        () => { 
            showAlert("Xatolik", "GPS ruxsatini yoqing!", "❌"); 
            btn.innerText = "📍 MANZILNI ANIQLASH";
        }
    );
}

async function sendOrder() {
    const name = localStorage.getItem('c777_name');
    const phone = localStorage.getItem('c777_phone');
    
    if (Object.keys(cart).length === 0) return showAlert("Savat bo'sh", "Mahsulot tanlang", "🛒");
    if (!userCoords) return showAlert("Manzil yo'q", "Manzilni aniqlang", "📍");

    const btn = document.getElementById('submitBtn');
    btn.disabled = true; btn.innerText = "YUBORILMOQDA...";

    let itemsText = "";
    for (const id in cart) {
        itemsText += ` - ${products.find(x=>x.id==id).name} (x${cart[id]})\n`;
    }

    const message = `🚀 <b>YANGI BUYURTMA</b>\n\n👤 <b>Mijoz:</b> ${name}\n📞 <b>Tel:</b> ${phone}\n\n📦 <b>Mahsulotlar:</b>\n${itemsText}\n💰 <b>JAMI: ${document.getElementById('totalPrice').innerText} so'm</b>\n\n📍 <a href="https://www.google.com/maps?q=${userCoords.lat},${userCoords.lon}">Xaritada ko'rish</a>`;

    try {
        const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: 'HTML' })
        });
        if (res.ok) {
            showAlert("Raxmat!", "Buyurtma yuborildi!", "✅");
            cart = {}; renderMenu(); renderCart();
        }
    } catch (e) { showAlert("Xato", "Aloqa yo'q!", "❌"); }
    btn.disabled = false; btn.innerText = "BUYURTMA BERISH";
}

function showAlert(t, m, i) {
    document.getElementById('alertTitle').innerText = t;
    document.getElementById('alertMsg').innerText = m;
    document.getElementById('alertIcon').innerText = i;
    document.getElementById('overlay').style.display = 'block';
    const alert = document.getElementById('customAlert');
    alert.style.display = 'block';
    setTimeout(() => alert.classList.add('show'), 10);
}

function closeAlert() {
    const alert = document.getElementById('customAlert');
    alert.classList.remove('show');
    setTimeout(() => {
        alert.style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
    }, 300);
}

window.onload = () => { checkFirstTime(); renderMenu(); };
