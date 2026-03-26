const socLoader = document.getElementById("socLoader");

if (socLoader) {
  const progressFill = document.getElementById("loaderProgressFill");
  const progressValue = document.getElementById("loaderProgressValue");
  const eventStream = document.getElementById("loaderEventStream");
  const attackLayer = document.getElementById("loaderAttackLayer");
  const attackNodes = [
    { x: 150, y: 185, name: "San Francisco, US" },
    { x: 210, y: 165, name: "Toronto, CA" },
    { x: 315, y: 292, name: "Sao Paulo, BR" },
    { x: 470, y: 170, name: "London, UK" },
    { x: 560, y: 145, name: "Berlin, DE" },
    { x: 620, y: 250, name: "Dubai, UAE" },
    { x: 710, y: 220, name: "Mumbai, IN" },
    { x: 760, y: 250, name: "Singapore, SG" },
    { x: 835, y: 375, name: "Sydney, AU" },
    { x: 540, y: 220, name: "Cairo, EG" }
  ];
  const actions = ["blocked", "mitigated", "contained", "investigating"];
  const minLoaderDuration = 2600;
  const startTime = performance.now();
  let loadedAt = null;
  let pageLoaded = document.readyState === "complete";
  let progress = 0;
  let attackTimer = null;
  let progressFrame = null;

  const appendEvent = (text) => {
    if (!eventStream) {
      return;
    }

    const line = document.createElement("p");
    line.textContent = text;
    eventStream.prepend(line);
    while (eventStream.children.length > 8) {
      eventStream.removeChild(eventStream.lastChild);
    }
  };

  const spawnAttack = () => {
    if (!attackLayer || attackNodes.length < 2) {
      return;
    }

    const sourceIndex = Math.floor(Math.random() * attackNodes.length);
    let targetIndex = Math.floor(Math.random() * attackNodes.length);
    if (targetIndex === sourceIndex) {
      targetIndex = (targetIndex + 1) % attackNodes.length;
    }

    const source = attackNodes[sourceIndex];
    const target = attackNodes[targetIndex];
    const controlX = (source.x + target.x) / 2 + (Math.random() * 120 - 60);
    const controlY = (source.y + target.y) / 2 - (Math.random() * 70 + 10);
    const attackPath = `M${source.x} ${source.y} Q ${controlX} ${controlY} ${target.x} ${target.y}`;

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", attackPath);
    path.setAttribute("class", "loader-attack-line");
    attackLayer.appendChild(path);

    const hit = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    hit.setAttribute("cx", String(target.x));
    hit.setAttribute("cy", String(target.y));
    hit.setAttribute("r", "4");
    hit.setAttribute("class", "loader-attack-hit");
    attackLayer.appendChild(hit);

    const action = actions[Math.floor(Math.random() * actions.length)];
    appendEvent(`[SOC] ${source.name} -> ${target.name} : ${action.toUpperCase()}`);

    setTimeout(() => {
      path.remove();
      hit.remove();
    }, 1400);
  };

  const finishLoader = () => {
    if (attackTimer) {
      clearInterval(attackTimer);
      attackTimer = null;
    }

    if (progressFrame) {
      cancelAnimationFrame(progressFrame);
      progressFrame = null;
    }

    socLoader.classList.add("is-complete");
    document.body.classList.remove("is-loading");

    setTimeout(() => {
      socLoader.remove();
    }, 620);
  };

  const animateLoaderProgress = (now) => {
    const elapsed = now - startTime;
    const target = pageLoaded
      ? Math.min(100, 88 + ((now - (loadedAt || now)) / 900) * 12)
      : Math.min(88, (elapsed / minLoaderDuration) * 88);

    progress += (target - progress) * 0.12;

    const visualProgress = Math.min(100, progress);
    if (progressFill) {
      progressFill.style.width = `${visualProgress.toFixed(2)}%`;
    }
    if (progressValue) {
      progressValue.textContent = `${Math.round(visualProgress)}%`;
    }

    if (pageLoaded && elapsed >= minLoaderDuration && visualProgress >= 99.5) {
      if (progressFill) {
        progressFill.style.width = "100%";
      }
      if (progressValue) {
        progressValue.textContent = "100%";
      }
      finishLoader();
      return;
    }

    progressFrame = requestAnimationFrame(animateLoaderProgress);
  };

  if (pageLoaded) {
    loadedAt = performance.now();
  }

  window.addEventListener(
    "load",
    () => {
      pageLoaded = true;
      loadedAt = performance.now();
    },
    { once: true }
  );

  appendEvent("[SOC] Global attack map online.");
  spawnAttack();
  attackTimer = setInterval(spawnAttack, 480);
  progressFrame = requestAnimationFrame(animateLoaderProgress);
}

const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
const navAnchors = Array.from(document.querySelectorAll(".nav-links a"));

const loadDeferredImage = (image) => {
  if (!(image instanceof HTMLImageElement)) {
    return;
  }

  const deferredSrc = image.dataset.src;
  if (!deferredSrc) {
    return;
  }

  if (image.getAttribute("src") !== deferredSrc) {
    image.src = deferredSrc;
  }

  image.removeAttribute("data-src");
};

const loadImagesWithin = (scope) => {
  if (!(scope instanceof Element)) {
    return;
  }

  scope.querySelectorAll("img[data-src]").forEach((image) => {
    loadDeferredImage(image);
  });
};

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
}

navAnchors.forEach((link) => {
  link.addEventListener("click", () => {
    if (navLinks) {
      navLinks.classList.remove("open");
    }
  });
});

const revealItems = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);
revealItems.forEach((item) => revealObserver.observe(item));

const sectionIds = ["about", "toolstack", "skills", "experience", "achievements", "certifications", "contact"];

const sections = sectionIds
  .map((id) => document.getElementById(id))
  .filter(Boolean);

const setActiveLink = (id) => {
  navAnchors.forEach((anchor) => {
    anchor.classList.toggle("active", anchor.getAttribute("href") === `#${id}`);
  });
};

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActiveLink(entry.target.id);
      }
    });
  },
  { threshold: 0.45 }
);
sections.forEach((section) => sectionObserver.observe(section));

const metricValues = document.querySelectorAll(".metric-value");
let metricsAnimated = false;

const computeMetricTarget = (element) => {
  const metric = element.dataset.metric || "";

  if (metric === "experienceYears") {
    const countedRoles = Array.from(document.querySelectorAll('.timeline-date[data-count-experience="true"]'));

    if (countedRoles.length > 0) {
      const parseIsoDateSafe = (value) => {
        if (!value) {
          return null;
        }

        const parts = value.split("-").map((item) => Number(item));
        if (parts.length !== 3 || parts.some((item) => !Number.isFinite(item))) {
          return null;
        }

        return new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
      };

      const diffWholeMonths = (startDate, endDate) => {
        let years = endDate.getUTCFullYear() - startDate.getUTCFullYear();
        let months = endDate.getUTCMonth() - startDate.getUTCMonth();
        const days = endDate.getUTCDate() - startDate.getUTCDate();

        if (days < 0) {
          months -= 1;
        }

        if (months < 0) {
          years -= 1;
          months += 12;
        }

        if (years < 0 || (years === 0 && months < 0)) {
          return 0;
        }

        return years * 12 + months;
      };

      const now = new Date();
      const todayUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
      const totalMonths = countedRoles.reduce((sum, role) => {
        const startDate = parseIsoDateSafe(role.dataset.startDate || "");
        const endDate = parseIsoDateSafe(role.dataset.endDate || "") || todayUtc;

        if (!startDate) {
          return sum;
        }

        return sum + diffWholeMonths(startDate, endDate);
      }, 0);

      return totalMonths / 12;
    }

    const startDateRaw = element.dataset.startDate || "2021-01-01";
    const startDate = new Date(startDateRaw);
    const now = new Date();
    const years = (now - startDate) / (1000 * 60 * 60 * 24 * 365.2425);
    return Math.max(0, years);
  }

  if (metric === "projectsCount" || metric === "certificationsCount" || metric === "toolingCount") {
    const sourceSelector = element.dataset.source;
    if (!sourceSelector) {
      return 0;
    }
    return document.querySelectorAll(sourceSelector).length;
  }

  const fallbackTarget = Number(element.dataset.target || "0");
  return Number.isFinite(fallbackTarget) ? fallbackTarget : 0;
};

const formatMetricValue = (value, element, isFinal = false) => {
  const format = element.dataset.format || "int";

  if (format === "decimal1-plus") {
    const safe = Number.isFinite(value) ? value : 0;
    const out = (isFinal ? safe : Math.floor(safe * 10) / 10).toFixed(1);
    return `${out}+`;
  }

  if (format === "int-plus") {
    const safePlus = Math.max(0, Math.floor(Number.isFinite(value) ? value : 0));
    return `${safePlus}+`;
  }

  const safeInt = Math.max(0, Math.floor(Number.isFinite(value) ? value : 0));
  return String(safeInt);
};

metricValues.forEach((metric) => {
  const target = computeMetricTarget(metric);
  metric.dataset.target = String(target);
  metric.textContent = "0";
});

const animateCounter = (element) => {
  const target = Number(element.dataset.target);
  const duration = 1000;
  const startTime = performance.now();

  const tick = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;
    element.textContent = formatMetricValue(value, element, progress >= 1);
    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
};

const metricsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !metricsAnimated) {
        metricValues.forEach((metric) => animateCounter(metric));
        metricsAnimated = true;
      }
    });
  },
  { threshold: 0.35 }
);

const operatorPanel = document.querySelector(".operator-panel");
if (operatorPanel) {
  metricsObserver.observe(operatorPanel);
}

const timelineDates = Array.from(document.querySelectorAll(".timeline-date[data-start-date]"));

const parseIsoDate = (value) => {
  if (!value) {
    return null;
  }

  const parts = value.split("-").map((item) => Number(item));
  if (parts.length !== 3 || parts.some((item) => !Number.isFinite(item))) {
    return null;
  }

  return new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
};

const formatDuration = (years, months) => {
  const safeYears = Math.max(0, years);
  const safeMonths = Math.max(0, months);
  const chunks = [];

  if (safeYears > 0) {
    chunks.push(`${safeYears} year${safeYears === 1 ? "" : "s"}`);
  }

  if (safeMonths > 0 || safeYears === 0) {
    chunks.push(`${safeMonths} month${safeMonths === 1 ? "" : "s"}`);
  }

  return chunks.join(" ");
};

const getDurationFromDates = (startDate, endDate) => {
  let years = endDate.getUTCFullYear() - startDate.getUTCFullYear();
  let months = endDate.getUTCMonth() - startDate.getUTCMonth();
  const days = endDate.getUTCDate() - startDate.getUTCDate();

  if (days < 0) {
    months -= 1;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (years < 0 || (years === 0 && months < 0)) {
    return { years: 0, months: 0 };
  }

  return { years, months };
};

timelineDates.forEach((item) => {
  const startDate = parseIsoDate(item.dataset.startDate || "");
  const endDateRaw = item.dataset.endDate || "";
  const now = new Date();
  const todayUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const endDate = parseIsoDate(endDateRaw) || todayUtc;
  const durationTarget = item.querySelector(".timeline-duration");

  if (!startDate || !durationTarget) {
    return;
  }

  const { years, months } = getDurationFromDates(startDate, endDate);
  durationTarget.textContent = formatDuration(years, months);
});

const projectCarousel = document.getElementById("projectCarousel");

if (projectCarousel) {
  const allSlides = Array.from(projectCarousel.querySelectorAll(".project-slide"));
  const dotsContainer = projectCarousel.querySelector(".project-dots");
  const prevButton = projectCarousel.querySelector("[data-project-prev]");
  const nextButton = projectCarousel.querySelector("[data-project-next]");
  const groupButtons = Array.from(projectCarousel.querySelectorAll("[data-project-group]"));
  const intervalRaw = Number(projectCarousel.dataset.interval || "5200");
  const intervalMs = Number.isFinite(intervalRaw) && intervalRaw >= 2500 ? intervalRaw : 5200;
  let activeGroup = groupButtons.find((button) => button.classList.contains("is-active"))?.dataset.projectGroup || "academic";
  let filteredSlides = [];
  let activeIndex = 0;
  let dots = [];
  let rotationTimer = null;
  let carouselVisible = true;

  const getSlidesForGroup = () =>
    allSlides.filter((slide) => (slide.dataset.group || "work").toLowerCase() === activeGroup);

  const updateGroupButtons = () => {
    groupButtons.forEach((button) => {
      button.classList.toggle("is-active", (button.dataset.projectGroup || "") === activeGroup);
    });
  };

  const bindDots = () => {
    dots = Array.from(projectCarousel.querySelectorAll("[data-project-dot]"));
    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        const idx = Number(dot.dataset.projectDot || "0");
        applySlide(Number.isFinite(idx) ? idx : 0);
        startRotation();
      });
    });
  };

  const buildDots = () => {
    if (!dotsContainer) {
      return;
    }

    dotsContainer.innerHTML = "";
    filteredSlides.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "project-dot";
      dot.dataset.projectDot = String(index);
      dot.setAttribute("aria-label", `Go to project ${index + 1}`);
      dotsContainer.appendChild(dot);
    });

    bindDots();
  };

  const applySlide = (index) => {
    filteredSlides = getSlidesForGroup();

    if (!filteredSlides.length) {
      return;
    }

    activeIndex = (index + filteredSlides.length) % filteredSlides.length;
    const activeSlide = filteredSlides[activeIndex];

    allSlides.forEach((slide) => {
      const inGroup = filteredSlides.includes(slide);
      const isActive = inGroup && slide === activeSlide;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });

    dots.forEach((dot, idx) => {
      const isActive = idx === activeIndex;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-current", isActive ? "true" : "false");
    });

    loadImagesWithin(activeSlide);
    const nextSlide = filteredSlides[(activeIndex + 1) % filteredSlides.length];
    if (nextSlide && nextSlide !== activeSlide) {
      loadImagesWithin(nextSlide);
    }
  };

  const stopRotation = () => {
    if (rotationTimer) {
      clearInterval(rotationTimer);
      rotationTimer = null;
    }
  };

  const startRotation = () => {
    stopRotation();
    if (!carouselVisible || document.hidden) {
      return;
    }
    if (filteredSlides.length > 1) {
      rotationTimer = setInterval(() => {
        applySlide(activeIndex + 1);
      }, intervalMs);
    }
  };

  if (prevButton) {
    prevButton.addEventListener("click", () => {
      applySlide(activeIndex - 1);
      startRotation();
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      applySlide(activeIndex + 1);
      startRotation();
    });
  }

  projectCarousel.addEventListener("focusin", stopRotation);
  projectCarousel.addEventListener("focusout", (event) => {
    const target = event.relatedTarget;
    if (!(target instanceof Node) || !projectCarousel.contains(target)) {
      startRotation();
    }
  });

  groupButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextGroup = (button.dataset.projectGroup || "").toLowerCase();
      if (!nextGroup || nextGroup === activeGroup) {
        return;
      }

      activeGroup = nextGroup;
      activeIndex = 0;
      updateGroupButtons();
      filteredSlides = getSlidesForGroup();
      buildDots();
      applySlide(activeIndex);
      startRotation();
    });
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopRotation();
    } else {
      startRotation();
    }
  });

  if ("IntersectionObserver" in window) {
    const projectVisibilityObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        carouselVisible = Boolean(entry?.isIntersecting);
        if (carouselVisible) {
          startRotation();
        } else {
          stopRotation();
        }
      },
      { threshold: 0.18 }
    );
    projectVisibilityObserver.observe(projectCarousel);
  }

  filteredSlides = getSlidesForGroup();
  buildDots();
  updateGroupButtons();
  applySlide(activeIndex);
  startRotation();
}

const toolWall = document.getElementById("toolWall");

if (toolWall) {
  const toolPanel = toolWall.closest(".tool-wall-panel");
  const toolGroups = toolPanel ? toolPanel.querySelector(".tool-groups") : null;
  const toolItems = Array.from(toolWall.querySelectorAll(".logo-item"));
  const toolButtons = Array.from(document.querySelectorAll(".tool-group-btn[data-tool-group]"));
  const intervalRaw = Number(toolGroups?.dataset.rotateInterval || "4200");
  const rotateMs = Number.isFinite(intervalRaw) && intervalRaw >= 2200 ? intervalRaw : 4200;
  let activeToolGroup =
    toolButtons.find((button) => button.classList.contains("is-active"))?.dataset.toolGroup || "security";
  let toolRotationTimer = null;
  let toolPanelVisible = true;

  const groupCounts = toolItems.reduce((acc, item) => {
    const key = (item.dataset.toolGroup || "security").toLowerCase();
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  toolButtons.forEach((button) => {
    const key = (button.dataset.toolGroup || "").toLowerCase();
    const countTarget = button.querySelector(".tool-group-count");
    if (countTarget) {
      countTarget.textContent = String(groupCounts[key] || 0);
    }
  });

  const applyToolGroup = (group) => {
    activeToolGroup = group;
    let visibleCount = 0;

    toolItems.forEach((item) => {
      const isVisible = (item.dataset.toolGroup || "security") === activeToolGroup;
      item.classList.toggle("is-hidden", !isVisible);
      item.setAttribute("aria-hidden", String(!isVisible));
      if (isVisible) {
        visibleCount += 1;
        loadImagesWithin(item);
      }
    });

    if (visibleCount === 0) {
      toolItems.forEach((item) => {
        item.classList.remove("is-hidden");
        item.setAttribute("aria-hidden", "false");
        loadImagesWithin(item);
      });
    }

    toolButtons.forEach((button) => {
      button.classList.toggle("is-active", (button.dataset.toolGroup || "") === activeToolGroup);
    });
  };

  const stopToolRotation = () => {
    if (toolRotationTimer) {
      clearInterval(toolRotationTimer);
      toolRotationTimer = null;
    }
  };

  const startToolRotation = () => {
    stopToolRotation();
    if (!toolPanelVisible || document.hidden) {
      return;
    }
    if (toolButtons.length > 1) {
      toolRotationTimer = setInterval(() => {
        const index = toolButtons.findIndex((button) => (button.dataset.toolGroup || "") === activeToolGroup);
        const nextIndex = index >= 0 ? (index + 1) % toolButtons.length : 0;
        const nextGroup = toolButtons[nextIndex]?.dataset.toolGroup || "security";
        applyToolGroup(nextGroup);
      }, rotateMs);
    }
  };

  toolButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextGroup = button.dataset.toolGroup || "security";
      if (nextGroup !== activeToolGroup) {
        applyToolGroup(nextGroup);
        startToolRotation();
      }
    });
  });

  const rotationScope = toolPanel || toolWall;
  rotationScope.addEventListener("mouseenter", stopToolRotation);
  rotationScope.addEventListener("mouseleave", startToolRotation);
  rotationScope.addEventListener("focusin", stopToolRotation);
  rotationScope.addEventListener("focusout", (event) => {
    const target = event.relatedTarget;
    if (!(target instanceof Node) || !rotationScope.contains(target)) {
      startToolRotation();
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopToolRotation();
    } else {
      startToolRotation();
    }
  });

  if ("IntersectionObserver" in window) {
    const toolVisibilityObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        toolPanelVisible = Boolean(entry?.isIntersecting);
        if (toolPanelVisible) {
          startToolRotation();
        } else {
          stopToolRotation();
        }
      },
      { threshold: 0.2 }
    );
    toolVisibilityObserver.observe(rotationScope);
  }

  applyToolGroup(activeToolGroup);
  startToolRotation();
}

const logs = [
  "[SOC] Correlation rules loaded. Monitoring stream healthy.",
  "[BLUE TEAM] Phishing simulation cycle complete. Awareness improved.",
  "[XDR] Endpoint telemetry normalized. Investigation queue optimized.",
  "[IR] Response workflow synced with SLA checkpoints.",
  "[THREAT INTEL] IOC feed refreshed. Domain watchlist updated."
];

const socLog = document.getElementById("socLog");
let logIndex = 0;

if (socLog) {
  setInterval(() => {
    socLog.textContent = logs[logIndex % logs.length];
    logIndex += 1;
  }, 2500);
}
