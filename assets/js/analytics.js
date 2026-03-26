"use strict";

(() => {
  // Static counter endpoint for portfolio visits (page views).
  const COUNTER_NAMESPACE = "akshay-koshti-portfolio-1f8d53f4";
  const COUNTER_KEY = "site-visits";
  const OWNER_MODE_KEY = "ak_owner_view";

  const isOwnerView = (() => {
    try {
      return localStorage.getItem(OWNER_MODE_KEY) === "1";
    } catch (error) {
      return false;
    }
  })();

  const endpoint = `https://api.countapi.xyz/hit/${COUNTER_NAMESPACE}/${COUNTER_KEY}`;

  const createOwnerBadge = (count) => {
    const existing = document.getElementById("ownerVisitBadge");
    if (existing) {
      existing.textContent = `Visits: ${count.toLocaleString()}`;
      return;
    }

    const badge = document.createElement("aside");
    badge.id = "ownerVisitBadge";
    badge.textContent = `Visits: ${count.toLocaleString()}`;
    badge.setAttribute("aria-label", "Owner-only visitor count");
    badge.style.position = "fixed";
    badge.style.right = "14px";
    badge.style.bottom = "14px";
    badge.style.zIndex = "1800";
    badge.style.padding = "0.42rem 0.62rem";
    badge.style.fontFamily = "\"Oxanium\", \"Space Grotesk\", sans-serif";
    badge.style.fontSize = "0.76rem";
    badge.style.letterSpacing = "0.04em";
    badge.style.color = "#dff5ff";
    badge.style.border = "1px solid rgba(92,174,248,0.5)";
    badge.style.borderRadius = "10px";
    badge.style.background =
      "linear-gradient(135deg, rgba(9,18,33,0.95), rgba(9,18,33,0.82))";
    badge.style.boxShadow = "0 8px 24px rgba(0,0,0,0.35)";
    badge.style.pointerEvents = "none";
    badge.style.userSelect = "none";
    document.body.appendChild(badge);
  };

  const trackVisit = async () => {
    try {
      const response = await fetch(endpoint, {
        method: "GET",
        cache: "no-store",
        mode: "cors"
      });

      if (!response.ok) {
        return;
      }

      const data = await response.json();
      const count = Number(data?.value);
      if (!Number.isFinite(count) || !isOwnerView) {
        return;
      }

      createOwnerBadge(Math.max(0, Math.floor(count)));
    } catch (error) {
      // Silent fail: analytics should never impact site behavior.
    }
  };

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(trackVisit, { timeout: 2200 });
  } else {
    window.setTimeout(trackVisit, 900);
  }
})();
