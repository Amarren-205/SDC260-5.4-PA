/*
    Author:Amarren Hopkins
    Date:10/1/26
    Purpose: Tracks and displays the last satellite uplink connection time and manages the page theme based on online status.
*/

const LAST_UPLINK_COOKIE = "lastUplink";

function getCookie(name) {
	const cookies = document.cookie.split("; ");
	const cookie = cookies.find((item) => item.startsWith(name + "="));
	return cookie ? decodeURIComponent(cookie.split("=").slice(1).join("=")) : "";
}

function setLastUplinkCookie(timestamp) {
	document.cookie = `${LAST_UPLINK_COOKIE}=${encodeURIComponent(timestamp)}; max-age=2592000; path=/; SameSite=Lax`;
}

function formatTimestamp(timestamp) {
	const date = new Date(timestamp);
	if (Number.isNaN(date.getTime())) {
		return timestamp;
	}
	return date.toLocaleString();
}

function getConnectionDetails() {
	const host = window.location.hostname || "localhost";
	const protocol = window.location.protocol.replace(":", "").toUpperCase();
	let port = window.location.port;

	if (!port) {
		port = protocol === "HTTPS" ? "443" : protocol === "HTTP" ? "80" : "N/A";
	}

	document.getElementById("hostInfo").textContent = host;
	document.getElementById("portInfo").textContent = port;
	document.getElementById("protocolInfo").textContent = protocol;
}

function updateTheme() {
	const isLive = navigator.onLine;
	const body = document.body;
	const heroTitle = document.getElementById("heroTitle");
	const heroText = document.getElementById("heroText");
	const connectionStatus = document.getElementById("connectionStatus");

	body.classList.toggle("uplink-mode", isLive);
	body.classList.toggle("standby-mode", !isLive);

	if (isLive) {
		heroTitle.textContent = "UPLINK ESTABLISHED";
		heroText.textContent = "Satellite uplink has been established. Command systems are online.";
		connectionStatus.textContent = "Online — Uplink Active";
	} else {
		heroTitle.textContent = "GROUND STANDBY";
		heroText.textContent = "Awaiting Uplink Authorization...";
		connectionStatus.textContent = "Offline — Ground Standby";
	}
}

function recordLaunchAndDisplayLastVisit() {
	const previousLaunch = getCookie(LAST_UPLINK_COOKIE);
	const lastOnline = document.getElementById("lastOnline");

	if (previousLaunch) {
		lastOnline.textContent = formatTimestamp(previousLaunch);
	} else {
		lastOnline.textContent = "No previous uplink records found.";
	}

	// Store this launch after displaying the previous value so a refresh shows the last visit.
	const currentLaunch = new Date().toISOString();
	setLastUplinkCookie(currentLaunch);
}

function refreshPage() {
	window.location.reload();
}

function initialize() {
	getConnectionDetails();
	updateTheme();
	recordLaunchAndDisplayLastVisit();
	document.getElementById("refreshButton").addEventListener("click", refreshPage);

	window.addEventListener("online", updateTheme);
	window.addEventListener("offline", updateTheme);
}

document.addEventListener("DOMContentLoaded", initialize);
