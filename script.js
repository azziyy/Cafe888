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
    let v = input.value.replace(/[^\d]/g, ''); if (!v.startsWith('998')) v = '998' + v;
    let f = "+998 "; if (v.length > 3) f += v.substring(3, 5) + (v.length > 5 ? " " : "");
    if (v.length > 5) f += v.substring(5, 8) + (v.length > 8 ? " " : "");
    if (v.length > 8) f += v.substring(8, 10) + (v.length > 10 ? " " : "");
    if (v.length > 10) f += v.substring(10, 12); input.value = f.trim();
}

// OCHILGANDA ISHGA TUSHISH
window.onload = () => {
    if (!localStorage.getItem('c777_name')) {
        document.getElementById('regScreen').style.display = 'flex';
    } else {
        renderMenu();
    }
};

function saveRegistration() {
    const n = document.getElementById('regName').value.trim();
    const p = document.getElementById('regPhone').value.trim();
    if (n.length < 3 || p.length < 17) return alert("Ma'lumotlarni to'ldiring");
    localStorage.setItem('c777_name', n);
    localStorage.setItem('c777_phone', p);
    document.getElementById('regScreen').style.display = 'none';
    renderMenu();
}

// MAHSULOT MODALINI OCHISH (KATTALASHISH)
function viewProduct(id) {
    const p = products.find(x => x.id === id);
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
    
    const modal = document.getElementById('productModal');
    modal.classList.remove('closing');
    modal.classList.add('open');
}

// MAHSULOT MODALINI YOPISH (KICHIKLASHISH)
function closeProductModal() {
    const modal = document.getElementById('productModal');
    modal.classList.add('closing'); // Kichrayish animatsiyasi klassi
    setTimeout(() => {
        modal.classList.remove('open', 'closing');
    }, 400);
}

// TAHRIRLASH FUNKSIYASI (TO'LIQ ISHLAYDI)
function openProfile() {
    document.getElementById('editName').value = localStorage.getItem('c777_name');
    document.getElementById('editPhone').value = localStorage.getItem('c777_phone');
    document.getElementById('profileModal').classList.add('open');
}

function updateProfile() {
    const n = document.getElementById('editName').value.trim();
    const p = document.getElementById('editPhone').value.trim();
    if(n.length < 3 || p.length < 17) return alert("Xato!");
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
    const display = document.getElementById('menuDisplay');
    const filtered = currentCat === 'Barchasi' ? products : products.filter(p => p.cat === currentCat);
    display.innerHTML = filtered.map((p, i) => `
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

function filterMenu(cat, btn) {
    currentCat = cat;
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderMenu();
}

function updateQty(id, change) {
    cart[id] = (cart[id] || 0) + change;
    if (cart[id] <= 0) delete cart[id];
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
                    <span>${p.name} x${cart[id]}</span> 
                    <b>${(p.price * cart[id]).toLocaleString()}</b>
                 </div>`;
    }
    list.innerHTML = html || "<p style='color:#999;text-align:center;'>Savat bo'sh</p>";
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

// BUYURTMA BERISH (STATUS BILAN)
async function sendOrder() {
    if (Object.keys(cart).length === 0) return showAlert("Savat bo'sh", "Mahsulot tanlang", "🛒");
    if (!userCoords) return showAlert("Manzil", "Lokatsiyani aniqlang", "📍");

    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.innerText = "YUBORILMOQDA..."; // Status o'zgarishi

    let items = ""; for (const id in cart) items += `- ${products.find(x=>x.id==id).name} (x${cart[id]})\n`;
    const text = `🚀 YANGI BUYURTMA\n\n👤 ${localStorage.getItem('c777_name')}\n📞 ${localStorage.getItem('c777_phone')}\n\n📦 Mahsulotlar:\n${items}\n💰 JAMI: ${document.getElementById('totalPrice').innerText} so'm\n📍 Xaritada: https://www.google.com/maps?q=${userCoords.lat},${userCoords.lon}`;

    try {
        const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: CHAT_ID, text: text })
        });
        if(res.ok) {
            showAlert("Raxmat!", "Buyurtmangiz yuborildi!", "✅");
            cart = {}; renderMenu(); renderCart();
        }
    } catch (e) {
        showAlert("Xatolik", "Internetni tekshiring", "❌");
    }
    
    btn.disabled = false;
    btn.innerText = "BUYURTMA BERISH";
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
