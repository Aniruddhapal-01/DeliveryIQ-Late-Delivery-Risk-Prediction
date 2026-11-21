"use strict";

/* =========================================================
   DeliveryIQ · front-end demo
   Sections: config · backend integration point · rendering ·
   validation · form handling · navigation · init
   ========================================================= */

/* ---------- Config ---------- */
const BRAZIL_STATES = ["AC","AL","AM","AP","BA","CE","DF","ES","GO","MA","MG","MS","MT","PA","PB","PE","PI","PR","RJ","RN","RO","RR","RS","SC","SE","SP","TO"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];


const FIELD_LABELS = {
  customer_state: "Customer state",
  total_items: "Total items",
  total_price: "Total price",
  total_freight: "Total freight",
  payment_count: "Payment count",
  avg_installments: "Average installments",
  total_product_weight: "Total product weight",
  avg_product_weight: "Average product weight",
  avg_product_length: "Average product length",
  avg_product_height: "Average product height",
  seller_state_count: "Seller state count",
  seller_city_count: "Seller city count",
  unique_product_categories: "Unique product categories",
  customer_lat: "Customer latitude",
  customer_lng: "Customer longitude",
  avg_seller_lat: "Average seller latitude",
  avg_seller_lng: "Average seller longitude",
  customer_seller_distance_km: "Customer–seller distance (km)",
  purchase_hour: "Purchase hour",
  purchase_month: "Purchase month",
  approval_hour: "Approval hour",
  approval_time_hours: "Approval time (hours)",
  estimated_delivery_days: "Estimated delivery days",
  estimated_delivery_dayofweek: "Estimated delivery weekday"
};

const SAMPLE_ORDER = {
  customer_state: "SP",
  total_items: 2,
  total_price: 149.9,
  total_freight: 22.4,
  payment_count: 1,
  avg_installments: 3,
  total_product_weight: 1200,
  avg_product_weight: 600,
  avg_product_length: 20,
  avg_product_height: 12,
  seller_state_count: 1,
  seller_city_count: 2,
  unique_product_categories: 1,
  customer_lat: -23.55,
  customer_lng: -46.63,
  avg_seller_lat: -22.90,
  avg_seller_lng: -43.20,
  customer_seller_distance_km: 450,
  purchase_hour: 14,
  purchase_month: 11,
  approval_hour: 14,
  approval_time_hours: 4.5,
  estimated_delivery_days: 18,
  estimated_delivery_dayofweek: 4
};


let lastSubmittedOrder = null;

/* ---------- Backend integration ---------- */
const API_URL = "https://YOUR-RENDER-SERVICE-URL.onrender.com/predict";

async function analyzeOrder(orderData) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(orderData)
  });

  if (!response.ok) {
    let message = `API request failed: HTTP ${response.status}`;

    try {
      const errorData = await response.json();

      if (errorData.detail) {
        message = typeof errorData.detail === "string"
          ? errorData.detail
          : JSON.stringify(errorData.detail);
      }
    } catch (_) {}

    throw new Error(message);
  }

  const result = await response.json();

  const probability = Number(result.late_probability);
  const prediction = Number(result.prediction);
  const threshold = Number(result.threshold);

  if (
    !Number.isFinite(probability) ||
    !Number.isFinite(prediction) ||
    !Number.isFinite(threshold)
  ) {
    throw new Error("Invalid prediction received from the API.");
  }

  const level =
    probability < 0.33 ? "low" :
    probability < 0.66 ? "medium" :
    "high";

  return {
    level,
    probability,
    title: result.status,
    explanation:
      `Model prediction: ${result.status}. ` +
      `Late-delivery probability: ${formatPercent(probability)}. ` +
      `Decision threshold: ${formatPercent(threshold)}.`,
    isDemo: false,
    input: orderData
  };
}


/* ---------- Backend integration point ---------- */
/**
 * The form now submits all 24 engineered features with the exact model column names.
 * This is still a UI demo: fixed sample probabilities are returned below.
 * When the API is ready, replace this function with fetch() to POST orderData.
 * The API must validate the schema, feature order/semantics and missing values.
 */

async function analyzeOrder(orderData) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(orderData)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Prediction failed");
  }

  const result = await response.json();

  const probability = Number(result.late_probability);

  const level =
    probability < 0.33 ? "low" :
    probability < 0.66 ? "medium" :
    "high";

  return {
    level: level,
    probability: probability,
    title: result.status,
    explanation: `Late-delivery probability: ${(probability * 100).toFixed(2)}%.`,
    isDemo: false,
    input: orderData
  };
}


/* ---------- Rendering ---------- */
const $ = (selector, root = document) => root.querySelector(selector);
const formatPercent = value => `${Math.round(value * 100)}%`;

function formatFactorValue(key, value) {
  if (key === "purchase_month") return MONTHS[value - 1];
  if (key === "total_price" || key === "total_freight") return `R$ ${Number(value).toFixed(2)}`;
  if (key === "purchase_hour" || key === "approval_hour") return `${String(value).padStart(2, "0")}:00`;
  if (key === "estimated_delivery_dayofweek") return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][Number(value)] ?? value;
  return value;
}

function renderResult(result) {
  const panel = $("#result");
  panel.dataset.level = result.level;
  $("#result-empty").hidden = true;
  $("#result-content").hidden = false;

  const pill = $("#risk-pill");
  const pillClass = { low: "pill--low", medium: "pill--med", high: "pill--high" }[result.level];
  pill.className = `pill ${pillClass}`;
  pill.textContent = result.level[0].toUpperCase() + result.level.slice(1);

  $("#risk-title").textContent = result.title;
  $("#prob-value").textContent = formatPercent(result.probability);
  $("#risk-explain").textContent = result.explanation;
  $("#meter").setAttribute("aria-valuenow", Math.round(result.probability * 100));

  const fill = $("#meter-fill");
  fill.style.background = `var(--${{ low: "low", medium: "med", high: "high" }[result.level]})`;
  requestAnimationFrame(() => { fill.style.width = formatPercent(result.probability); });

  const factors = $("#factors");
  factors.replaceChildren();
  Object.entries(result.input).forEach(([key, value]) => {
    const row = document.createElement("div");
    const dt = document.createElement("dt");
    const dd = document.createElement("dd");
    dt.textContent = FIELD_LABELS[key];
    dd.textContent = formatFactorValue(key, value);
    row.append(dt, dd);
    factors.append(row);
  });

  $("#result-source").textContent = result.isDemo
    ? "Demonstration output. It is a fixed sample and does not come from the trained model. Probability bands: Low < 33%, Medium 33–66%, High > 66%."
    : "Result returned by the prediction API.";

  panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

/* ---------- Validation ---------- */
function validateField(el) {
  const field = el.closest(".field");
  const message = $(".err", field);
  let error = "";
  const raw = el.value.trim();

  if (raw === "") {
    error = `${FIELD_LABELS[el.name]} is required.`;
  } else if (el.tagName === "INPUT") {
    const num = Number(raw);
    const min = el.min !== "" ? Number(el.min) : -Infinity;
    const max = el.max !== "" ? Number(el.max) : Infinity;
    if (Number.isNaN(num)) error = "Enter a valid number.";
    else if (num < min || num > max) error = `Enter a value between ${el.min} and ${el.max}.`;
    else if (el.step === "1" && !Number.isInteger(num)) error = "Enter a whole number.";
  }

  field.classList.toggle("invalid", Boolean(error));
  el.setAttribute("aria-invalid", error ? "true" : "false");
  message.textContent = error;
  return !error;
}

function collectOrderData(form) {
  const data = {};
  new FormData(form).forEach((value, key) => {
    data[key] = key === "customer_state" ? value : Number(value);
  });
  return data;
}

/* ---------- Form handling ---------- */
function setLoading(isLoading) {
  const button = $("#submit-btn");
  button.disabled = isLoading;
  button.classList.toggle("is-loading", isLoading);
  $(".btn__label", button).textContent = isLoading ? "Analyzing…" : "Analyze Order";
}

async function handleSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const errorBox = $("#form-error");
  const controls = [...form.elements].filter(el => el.name);
  const results = controls.map(validateField);

  if (results.includes(false)) {
    const count = results.filter(ok => !ok).length;
    errorBox.hidden = false;
    errorBox.textContent =
      error.message || "The analysis could not be completed.";
    controls[results.indexOf(false)].focus();
    return;
  }

  errorBox.hidden = true;
  setLoading(true);
  try {
    lastSubmittedOrder = collectOrderData(form);
    renderResult(await analyzeOrder(lastSubmittedOrder));
  } 
  catch (error) {
    console.error("Prediction API error:", error);

    errorBox.hidden = false;
    errorBox.textContent = error.message;
  }
  finally {
    setLoading(false);
  }
}

function resetForm() {
  $("#form-error").hidden = true;
  document.querySelectorAll(".field").forEach(f => { f.classList.remove("invalid"); $(".err", f).textContent = ""; });
  $("#result-empty").hidden = false;
  $("#result-content").hidden = true;
  $("#result").removeAttribute("data-level");
  $("#meter-fill").style.width = "0";
  lastSubmittedOrder = null;
}

function fillSample() {
  const form = $("#risk-form");
  Object.entries(SAMPLE_ORDER).forEach(([key, value]) => { form.elements[key].value = value; });
  form.querySelectorAll(".invalid").forEach(f => { f.classList.remove("invalid"); $(".err", f).textContent = ""; });
  $("#form-error").hidden = true;
}

function populateSelects() {
  const state = $("#customer_state");
  const month = $("#purchase_month");
  BRAZIL_STATES.forEach(code => state.add(new Option(code, code)));
  MONTHS.forEach((name, i) => month.add(new Option(name, i + 1)));
}


/* ---------- Navigation ---------- */
function initNavigation() {
  const toggle = $("#nav-toggle");
  const links = $("#nav-links");
  const setOpen = open => {
    links.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.innerHTML = `<i data-lucide="${open ? "x" : "menu"}"></i>`;
    window.lucide && lucide.createIcons();
  };
  toggle.addEventListener("click", () => setOpen(!links.classList.contains("open")));
  links.addEventListener("click", e => { if (e.target.closest("a")) setOpen(false); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") setOpen(false); });

  // Highlight the current section in the nav
  const map = { overview: "#overview", "risk-analysis": "#risk-analysis", "model-insights": "#model-insights", about: "#about" };
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.querySelectorAll("a").forEach(a => a.classList.toggle("active", a.getAttribute("href") === map[entry.target.id]));
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  Object.keys(map).forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el); });
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  populateSelects();
  const form = $("#risk-form");
  form.addEventListener("submit", handleSubmit);
  form.addEventListener("reset", resetForm);
  form.addEventListener("focusout", e => { if (e.target.name && e.target.value !== "") validateField(e.target); });
  form.addEventListener("input", e => { if (e.target.closest(".invalid")) validateField(e.target); });
  $("#fill-sample").addEventListener("click", fillSample);
  document.querySelectorAll("[data-placeholder]").forEach(a => a.addEventListener("click", e => e.preventDefault()));
  initNavigation();
  window.lucide && lucide.createIcons();
});
