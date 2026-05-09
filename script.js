const menuButton = document.querySelector("[data-menu-button]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const modal = document.querySelector("[data-modal]");
const openModalButtons = document.querySelectorAll("[data-open-modal]");
const closeModalButton = document.querySelector("[data-close-modal]");
const panelCount = document.querySelector("#panelCount");
const panelOutput = document.querySelector("[data-panel-output]");
const serviceType = document.querySelector("#serviceType");
const nameInput = document.querySelector("#customerName");
const areaInput = document.querySelector("#customerArea");
const problemInput = document.querySelector("#problemText");
const whatsappLinks = document.querySelectorAll("[data-whatsapp-link]");
const responseLabel = document.querySelector("[data-response-label]");
const cleaningNote = document.querySelector("[data-cleaning-note]");
const tabButtons = document.querySelectorAll("[data-tab]");
const tabPanel = document.querySelector("[data-tab-panel]");
const serviceCards = document.querySelectorAll("[data-service-card]");
const timelineButtons = document.querySelectorAll("[data-step]");
const timelineDetail = document.querySelector("[data-timeline-detail]");
const contactDock = document.querySelector(".contact-dock");
const footer = document.querySelector(".site-footer");
const hero = document.querySelector(".hero");

let isHeroVisible = true;
let isFooterVisible = false;

const tabContent = {
  fault: {
    title: "Fault support",
    text: "Best for inverter alarms, low generation, system shutdown, meter alerts, or wiring checks."
  },
  clean: {
    title: "Panel cleaning",
    text: "Best for dust, stains, bird droppings, leaves, and regular solar panel surface care."
  },
  care: {
    title: "Annual care",
    text: "Best for customers who want support follow-up, cleaning reminders, and visible condition checks."
  }
};

const timelineText = [
  "Share your issue on call or WhatsApp. Our customer care support records the details and starts the service flow.",
  "The support team reviews symptoms, asks for basic checks, and identifies whether remote guidance or a visit is needed.",
  "A cleaning or troubleshooting team is assigned according to the job type, location, and urgency.",
  "After the work is done, SR Solar Solutions follows up so customers know the status clearly."
];

function buildWhatsAppUrl() {
  const panels = panelCount?.value || "20";
  const selectedService = serviceType?.value || "Solar service";
  const customer = nameInput?.value.trim() || "Customer";
  const area = areaInput?.value.trim() || "Not shared";
  const problem = problemInput?.value.trim() || "Please call me for details.";
  const text = [
    "Hello SR Solar Solutions, I need support.",
    `Name: ${customer}`,
    `Area: ${area}`,
    `Service: ${selectedService}`,
    `Panels: ${panels}`,
    `Details: ${problem}`
  ].join("\n");

  return `https://wa.me/917905151736?text=${encodeURIComponent(text)}`;
}

function updateSupportPreview() {
  if (!panelCount || !panelOutput || !serviceType) return;

  const panels = Number(panelCount.value);
  panelOutput.textContent = panels;

  if (panels <= 16) {
    cleaningNote.textContent = "Recommended: quick cleaning and visual condition check.";
  } else if (panels <= 42) {
    cleaningNote.textContent = "Recommended: full surface wash and frame check.";
  } else {
    cleaningNote.textContent = "Recommended: team visit with staged cleaning plan.";
  }

  const isCleaning = serviceType.value.toLowerCase().includes("cleaning");
  responseLabel.textContent = isCleaning ? "Team visit" : "Under 24 hrs";

  whatsappLinks.forEach((link) => {
    link.href = buildWhatsAppUrl();
  });
}

menuButton?.addEventListener("click", () => {
  const isOpen = mobileMenu.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

mobileMenu?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    mobileMenu.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
  }
});

openModalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    updateSupportPreview();
    if (typeof modal.showModal === "function") {
      modal.showModal();
    }
  });
});

closeModalButton?.addEventListener("click", () => {
  modal?.close();
});

modal?.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.close();
  }
});

[panelCount, serviceType, nameInput, areaInput, problemInput].forEach((field) => {
  field?.addEventListener("input", updateSupportPreview);
});

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.dataset.tab;
    const content = tabContent[key];
    if (!content) return;

    tabButtons.forEach((item) => {
      item.classList.toggle("active", item === button);
      item.setAttribute("aria-selected", String(item === button));
    });

    tabPanel.innerHTML = `<h3>${content.title}</h3><p>${content.text}</p>`;

    const cardKey = key === "fault" ? "troubleshooting" : key === "clean" ? "cleaning" : "support";
    serviceCards.forEach((card) => {
      card.classList.toggle("active", card.dataset.serviceCard === cardKey);
    });
  });
});

timelineButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const step = Number(button.dataset.step);
    timelineButtons.forEach((item) => item.classList.toggle("active", item === button));
    timelineDetail.textContent = timelineText[step] || timelineText[0];
  });
});

document.querySelectorAll("details").forEach((detail) => {
  detail.addEventListener("toggle", () => {
    if (!detail.open) return;

    document.querySelectorAll("details").forEach((other) => {
      if (other !== detail) {
        other.open = false;
      }
    });
  });
});

function updateDockVisibility() {
  if (!contactDock) return;
  contactDock.classList.toggle("is-hidden", isHeroVisible || isFooterVisible);
  contactDock.classList.toggle("over-footer", isFooterVisible);
}

if (contactDock && "IntersectionObserver" in window) {
  if (hero) {
    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        isHeroVisible = entry.isIntersecting;
        updateDockVisibility();
      },
      { threshold: 0.18 }
    );

    heroObserver.observe(hero);
  }

  if (footer) {
    const footerObserver = new IntersectionObserver(
      ([entry]) => {
        isFooterVisible = entry.isIntersecting;
        updateDockVisibility();
      },
      { threshold: 0.08 }
    );

    footerObserver.observe(footer);
  }
}

updateSupportPreview();
updateDockVisibility();
