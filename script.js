let lat = null
let lon = null
let map
let marker
const w = document.getElementById("demo4")
const x = document.getElementById("demo1")
const y = document.getElementById("demo2")
const z = document.getElementById("demo3")
const a = document.getElementById("imsak")
const b = document.getElementById("fajr")
const c = document.getElementById("dhuhr")
const d = document.getElementById("asr")
const e = document.getElementById("maghrib")
const f = document.getElementById("isha")
const g = document.getElementById("sunrise")
//Imsak,Fajr,Sunrise,Dhuhr,Asr,Maghrib,Sunset,Isha,Midnight
function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(success, error, {
			enableHighAccuracy: true,
			maximumAge: 0,
			timeout: 5000
		})
	}
	else {
		alert("Geolocation is not supported by this browser.")
	}
}

function success(position) {
	const lat = position.coords.latitude
	const lon = position.coords.longitude
	const accu = position.coords.accuracy
	console.log(accu)
	let today = new Date()
	let hari = today.getDate()
	let bulan = today.getMonth() + 1
	let tahun = today.getFullYear()
	hari = cekWaktu(hari)
	bulan = cekWaktu(bulan)
	let tanggal = `${hari}-${bulan}-${tahun}`
	console.log(`${lat}, ${lon}​`)
	let angka1 = toDMS(lat, true)
	let angka2 = toDMS(lon, false)
	const url = `https://api.aladhan.com/v1/timings/${tanggal}?latitude=${lat}&longitude=${lon}&method=99&methodSettings=18,,18&tune=2,2,-2,3,2,2,0,2,0`
	console.log(url)
	fetch(url)
		.then(function (response) {
			// Ubah respons menjadi format JSON
			return response.json();
		})
		.then(function (data) {
			// --- JIKA DATA SHOLAT BERHASIL DIAMBIL ---
			if (data.code === 200) {
				const jadwal = data.data.timings
				const hijri = data.data.date.hijri.date
				a.innerHTML = jadwal.Imsak
				b.innerHTML = jadwal.Fajr
				c.innerHTML = jadwal.Dhuhr
				d.innerHTML = jadwal.Asr
				e.innerHTML = jadwal.Maghrib
				f.innerHTML = jadwal.Isha
				g.innerHTML = jadwal.Sunrise
				//console.log(hijri)
			}
		})
		.catch(function (error) {
			// Tangkap error jika gagal menghubungi API
			console.error("Gagal mengambil data dari API:", error);
		});
	x.innerHTML = `Latitude : ${angka1}`
	y.innerHTML = `Longitude : ${angka2}`
	//console.log(`${lat}, ${lon}`)


	let map = L.map('map').setView([lat, lon], 15);

	L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);
	
	L.control.scale({
		metric: true,       // Menampilkan satuan meter/kilometer
		imperial: false,    // Menyembunyikan satuan kaki/mil
		position: 'bottomleft' // Posisi di pojok kiri bawah
	}).addTo(map);
	
	L.control.fullscreen({
		position: 'topleft', // Posisi tombol fullscreen
		title: 'Tampilkan Layar Penuh', // Teks saat kursor diarahkan ke tombol
		titleCancel: 'Keluar dari Layar Penuh'
	}).addTo(map);

	let marker = L.marker([lat, lon]).addTo(map).bindPopup(`Akurasi ${accu} m`).closePopup();

	let circle = L.circle([lat, lon], {
		color: 'blue',
		fillColor: 'blue',
		fillOpacity: 0.25,
		radius: accu
	}).addTo(map);
}

function error() {
	alert("Sorry, no position available. Error code: " + error.code + ", Error message: " + error.message);
}

function toDMS(coord, isLat) {
	const absDD = Math.abs(coord)
	const d = Math.floor(absDD)
	const minFrac = (absDD - d) * 60
	const m = Math.floor(minFrac)
	const s = ((minFrac - m) * 60).toFixed(2)
	let dir = ""
	if (isLat) {
		dir = coord >= 0 ? "N" : "S"
	}
	else {
		dir = coord >= 0 ? "E" : "W"
	}
	return `${d}° ${m}' ${s}'' ${dir}`
}

function waktu() {
	const options = {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		weekday: 'long',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		timeZoneName: 'short',
		hour12: false
	};
	const today = new Date()
	let j = today.getHours()
	let m = today.getMinutes()
	let d = today.getSeconds()
	let timeZone = -(today.getTimezoneOffset() / 60)
	if (-(today.getTimezoneOffset() / 60) > 0) {
		timeZone = "+" + timeZone
	}
	j = cekWaktu(j)
	m = cekWaktu(m)
	d = cekWaktu(d)
	//z.innerHTML = `Jam : ${j}:${m}:${d}`
	z.innerHTML = today.toLocaleString("id-ID", options)
	setTimeout(waktu, 1)
}

function cekWaktu(i) {
	if (i < 10) {
		i = "0" + i
	}
	return i
}

function tanggal() {
	const today = new Date()
	let hari = today.getDate()
	let bulan = today.getMonth() + 1
	let tahun = today.getFullYear()
	hari = cekWaktu(hari)
	bulan = cekWaktu(bulan)
	let tanggal = `Tanggal : ${hari}-${bulan}-${tahun}`
	w.innerHTML = tanggal
}