const BOT_TOKEN = "8032226679:AAETTGPvYZYSvF_QmdofXKibpOwt4E9Iitc"; 
const CHAT_ID = "519326806"; 

const products = [
    { id: 1, cat: 'Burgerlar', name: 'Cheeseburger', price: 18000, img: 'Images/kolbasa.jpg', desc: 'Yumshoq bulochka va pishloq.' },
    { id: 2, cat: 'Burgerlar', name: 'Double Burger', price: 43000, img: 'Images/bigmag.jpg', desc: 'Ikki qavatli go\'shtli burger.' },
    { id: 3, cat: 'Burgerlar', name: 'Gamburger', price: 30000, img: 'Images/gamburger.jpg', desc: 'Klassik va mazali gamburger.' },
    { id: 4, cat: 'Burgerlar', name: 'Tuxumli Burger', price: 38000, img: 'Images/txburger.jpg', desc: 'Maxsus tuxumli burger.' },
    { id: 5, cat: 'Ichimliklar', name: 'Kofe MacCoffee', price: 7000, img: 'Images/cofemac.jpg', desc: 'Issiq va xushbo\'y kofe.' },
    { id: 6, cat: 'Ichimliklar', name: 'Cappuccino', price: 10000, img: 'Images/cofecap.jpg', desc: 'Ko\'pikli ajoyib cappuccino.' },
    { id: 7, cat: 'Ichimliklar', name: 'Fanta 1.5l', price: 17000, img: 'Images/fanta1.jpg', desc: 'Muzdek apelsinli Fanta.' },
    { id: 8, cat: 'Ichimliklar', name: 'Pepsi 1.5l', price: 13000, img: 'Images/pepsi15.jpg', desc: 'Klassik Pepsi-Cola.' },
    { id: 9, cat: 'Shirinliklar', name: 'Malibu Desert', price: 25000, img: 'Images/shmalibu.jpg', desc: 'Malibu shirinligi.' },
    { id: 10, cat: 'Shirinliklar', name: 'Qizil Tort', price: 24000, img: 'Images/shqizil.jpg', desc: 'Red Velvet torti.' },
    { id: 11, cat: 'Shirinliklar', name: 'Choco Cake', price: 23000, img: 'Images/shchoco.jpg', desc: 'Shokoladli mayin desert.' },
    { id: 12, cat: 'Shirinliklar', name: 'Snikers Tort', price: 23000, img: 'Images/shsnik.jpg', desc: 'Snikers uslubidagi tort.' }
];

let cart = {}; let userCoords = null; let currentCat = 'Barchasi';

// TELEFON FORMATI
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

// RO'YXATDAN O'TISH LOGIKASI
function checkUser() {
    if (!localStorage.getItem('c777_name')) {
        document.getElementById('regScreen').style.display = 'flex';
    } else {
        renderMenu(); // Agar foydalanuvchi bo'lsa darhol menyuni chiqarish
    }
}

function saveRegistration() {
    const name = document.getElementById('regName').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    if (name.length < 3 || phone.length < 17) return alert("To'liq ma'lumot kiriting!");
    localStorage.setItem('c777_name', name);
    localStorage.setItem('c777_phone', phone);
    document.getElementById('regScreen').style.display = 'none';
    renderMenu();
}

// MENU RENDER (OCHILGANDA BARCHASI KO'RINADI)
function renderMenu() {
    const display = document.getElementById('menuDisplay');
    const filtered = currentCat === 'Barchasi' ? products : products.filter(p => p.cat === currentCat);
    
    display.innerHTML = filtered.map((p, i) => `
        <div class="card" style="animation-delay: ${i * 0.05}s">
            <div class="img-container" onclick="viewProduct(${p.id})">
                <img src="${p.img}" onerror="this.src='https://via.placeholder.com/150'">
            </div>
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

function filterMenu(cat, btn) {
    currentCat = cat;
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderMenu();
}

// MODALNI ANIMATSIYA BILAN OCHISH/YOPISH
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

function closeModal(id) {
    const modal = document.getElementById(id);
    modal.classList.remove('open');
}

function updateQty(id, change) {
    cart[id] = (cart[id] || 0) + change;
    if (cart[id] <= 0) delete cart[id];
    
    // UI yangilash (jim yangilash)
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
        html += `<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee;">
                    <span>${p.name} (x${cart[id]})</span> 
                    <span>${(p.price * cart[id]).toLocaleString()}</span>
                 </div>`;
    }
    list.innerHTML = html || "<p style='color:#999;text-align:center;'>Bo'sh</p>";
    document.getElementById('totalPrice').innerText = total.toLocaleString();
}

function getLocation() {
    const btn = document.getElementById('locBtn'); btn.innerText = "Aniqlanmoqda...";
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            userCoords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
            btn.innerText = "✅ MANZIL ANIQLANDI";
            btn.style.borderColor = "var(--green)"; btn.style.color = "var(--green)";
        },
        () => { showAlert("Xato", "GPSni yoqing", "❌"); btn.innerText = "📍 MANZILNI ANIQLASH"; }
    );
}

async function sendOrder() {
    const name = localStorage.getItem('c777_name');
    const phone = localStorage.getItem('c777_phone');
    if (Object.keys(cart).length === 0) return showAlert("Savat bo'sh", "Mahsulot tanlang", "🛒");
    if (!userCoords) return showAlert("Manzil", "Lokatsiyani aniqlang", "📍");

    const btn = document.getElementById('submitBtn'); btn.disabled = true;
    let items = ""; for (const id in cart) items += `- ${products.find(x=>x.id==id).name} (x${cart[id]})\n`;

    const text = `🚀 <b>YANGI BUYURTMA</b>\n\n👤 ${name}\n📞 ${phone}\n\n📦 <b>Mahsulotlar:</b>\n${items}\n💰 JAMI: ${document.getElementById('totalPrice').innerText} so'm\n📍 <a href="https://www.google.com/maps?q=${userCoords.lat},${userCoords.lon}">Xaritada ko'rish</a>`;

    try {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: CHAT_ID, text: text, parse_mode: 'HTML' })
        });
        showAlert("Raxmat!", "Buyurtmangiz qabul qilindi!", "✅");
        cart = {}; renderMenu(); renderCart();
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

// SAHIFA YUKLANGANDA ISHGA TUSHISH
window.onload = checkUser;
