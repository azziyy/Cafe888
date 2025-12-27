const BOT_TOKEN = "8032226679:AAETTGPvYZYSvF_QmdofXKibpOwt4E9Iitc"; 
const CHAT_ID = "519326806"; 

const products = [
    { id: 1, cat: 'Burgerlar', name: 'Cheeseburger', price: 18000, img: 'Images/kolbasa.jpg', desc: 'Yumshoq bulochka va pishloq.' },
    { id: 2, cat: 'Burgerlar', name: 'Double Burger', price: 43000, img: 'Images/bigmag.jpg', desc: 'Ikki qavatli go\'sht.' },
    { id: 3, cat: 'Burgerlar', name: 'Ganburger', price: 30000, img: 'Images/gamburger.jpg', desc: 'Odiy Gamburger.' },
    { id: 4, cat: 'Burgerlar', name: 'Tuxumli Burger', price: 38000, img: 'Images/txburger.jpg', desc: 'Tuxumli Burger.' },
    { id: 5, cat: 'Ichimliklar', name: 'Kofe MacCoffee', price: 7000, img: 'Images/cofemac.jpg', desc: 'Issiq MacCoffee.' },
    { id: 6, cat: 'Ichimliklar', name: 'Cappuccino', price: 10000, img: 'Images/cofecap.jpg', desc: 'Issiq Cappuccino.' },
    { id: 7, cat: 'Ichimliklar', name: 'Fanta 1.5l', price: 17000, img: 'Images/fanta1.jpg', desc: 'Muzdek Fanta.' },
    { id: 8, cat: 'Ichimliklar', name: 'Pepsi 1.5l', price: 13000, img: 'Images/pepsi15.jpg', desc: 'Pepsi Cola.' },
    { id: 9, cat: 'Shirinliklar', name: 'Malibu', price: 25000, img: 'Images/shmalibu.jpg', desc: 'Malibu desert.' },
    { id: 10, cat: 'Shirinliklar', name: 'Qizil tort', price: 24000, img: 'Images/shqizil.jpg', desc: 'Qizil desert.' },
    { id: 11, cat: 'Shirinliklar', name: 'Choco', price: 23000, img: 'Images/shchoco.jpg', desc: 'Choco desert.' },
    { id: 12, cat: 'Shirinliklar', name: 'Snikers Tort', price: 23000, img: 'Images/shsnik.jpg', desc: 'Snikers desert.' }
];

let cart = {}; let userCoords = null; let currentCat = 'Barchasi';

// TELEFON FORMATI
function fixPhone(i) {
    let v = i.value.replace(/[^\d]/g, ''); if (!v.startsWith('998')) v = '998' + v;
    let f = "+998 "; if (v.length > 3) f += v.substring(3, 5) + (v.length > 5 ? " " : "");
    if (v.length > 5) f += v.substring(5, 8) + (v.length > 8 ? " " : "");
    if (v.length > 8) f += v.substring(8, 10) + (v.length > 10 ? " " : "");
    if (v.length > 10) f += v.substring(10, 12); i.value = f.trim();
}

// REGISTRATSIYA
function checkFirstTime() {
    if (!localStorage.getItem('c777_name')) document.getElementById('regScreen').style.display = 'flex';
}

function saveRegistration() {
    const n = document.getElementById('regName').value.trim();
    const p = document.getElementById('regPhone').value.trim();
    if(n.length < 3 || p.length < 17) return alert("Ma'lumotlarni to'ldiring!");
    localStorage.setItem('c777_name', n); localStorage.setItem('c777_phone', p);
    document.getElementById('regScreen').style.display = 'none';
}

// MODALNI OCHISH (ANIMATSIYA BILAN)
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

    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('show'), 10); // Animatsiya boshlanishi uchun
}

// MODALNI YOPISH (ANIMATSIYA BILAN)
function closeModal(id) {
    const modal = document.getElementById(id);
    modal.classList.remove('show');
    setTimeout(() => modal.style.display = 'none', 300); // Animatsiya tugagach butunlay yopish
}

// MENU RENDER
function renderMenu() {
    const f = currentCat === 'Barchasi' ? products : products.filter(p => p.cat === currentCat);
    document.getElementById('menuDisplay').innerHTML = f.map((p, i) => `
        <div class="card" style="animation-delay: ${i * 0.05}s">
            <div class="img-container" onclick="viewProduct(${p.id})"><img src="${p.img}"></div>
            <div class="card-info">
                <h4>${p.name}</h4>
                <b>${p.price.toLocaleString()} so'm</b>
                <div class="counter-box">
                    <button class="count-btn" onclick="updateQty(${p.id}, -1)">-</button>
                    <span class="qty-label" id="qty-${p.id}">${cart[p.id] || 0}</span>
                    <button class="count-btn" onclick="updateQty(${p.id}, 1)">+</button>
                </div>
            </div>
        </div>`).join('');
}

function filterMenu(c, b) {
    currentCat = c;
    document.querySelectorAll('.cat-btn').forEach(x => x.classList.remove('active'));
    b.classList.add('active'); renderMenu();
}

function updateQty(id, change) {
    cart[id] = (cart[id] || 0) + change;
    if (cart[id] <= 0) delete cart[id];
    
    // UI yangilash
    if(document.getElementById(`qty-${id}`)) document.getElementById(`qty-${id}`).innerText = cart[id] || 0;
    if(document.getElementById(`mqty-${id}`)) document.getElementById(`mqty-${id}`).innerText = cart[id] || 0;
    
    renderCart();
}

function renderCart() {
    const list = document.getElementById('cartList');
    let total = 0; let html = "";
    for (const id in cart) {
        const p = products.find(x => x.id == id);
        total += p.price * cart[id];
        html += `<div style="display:flex; justify-content:space-between; padding:5px 0; border-bottom:1px solid #eee;">
                    <span>${p.name} (x${cart[id]})</span> 
                    <span>${(p.price * cart[id]).toLocaleString()}</span>
                 </div>`;
    }
    list.innerHTML = html || "<p style='color:#999'>Savatcha bo'sh</p>";
    document.getElementById('totalPrice').innerText = total.toLocaleString();
}

function getLocation() {
    const btn = document.getElementById('locBtn'); btn.innerText = "Aniqlanmoqda...";
    navigator.geolocation.getCurrentPosition(
        (p) => {
            userCoords = { lat: p.coords.latitude, lon: p.coords.longitude };
            btn.innerText = "✅ MANZIL ANIQLANDI";
            btn.style.borderColor = "var(--green)"; btn.style.color = "var(--green)";
        },
        () => { showAlert("Xato", "GPSni yoqing", "❌"); btn.innerText = "📍 MANZILNI ANIQLASH"; }
    );
}

async function sendOrder() {
    if (Object.keys(cart).length === 0) return showAlert("Savat bo'sh", "Mahsulot tanlang", "🛒");
    if (!userCoords) return showAlert("Manzil yo'q", "Lokatsiyani aniqlang", "📍");

    const btn = document.getElementById('submitBtn'); btn.disabled = true;
    let items = ""; for (const id in cart) items += `- ${products.find(x=>x.id==id).name} (x${cart[id]})\n`;

    const text = `🚀 <b>YANGI BUYURTMA</b>\n\n👤 ${localStorage.getItem('c777_name')}\n📞 ${localStorage.getItem('c777_phone')}\n\n📦 <b>Mahsulotlar:</b>\n${items}\n💰 JAMI: ${document.getElementById('totalPrice').innerText} so'm\n📍 <a href="https://www.google.com/maps?q=${userCoords.lat},${userCoords.lon}">Xaritada ko'rish</a>`;

    try {
        const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: CHAT_ID, text: text, parse_mode: 'HTML' })
        });
        if (res.ok) { showAlert("Raxmat!", "Buyurtmangiz yuborildi!", "✅"); cart = {}; renderMenu(); renderCart(); }
    } catch (e) { showAlert("Xato", "Internetni tekshiring", "❌"); }
    btn.disabled = false;
}

function showAlert(t, m, i) {
    document.getElementById('alertTitle').innerText = t;
    document.getElementById('alertMsg').innerText = m;
    document.getElementById('alertIcon').innerText = i;
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('customAlert').classList.add('active');
}

function closeAlert() {
    document.getElementById('customAlert').classList.remove('active');
    document.getElementById('overlay').style.display = 'none';
}

window.onload = () => { checkFirstTime(); renderMenu(); };
