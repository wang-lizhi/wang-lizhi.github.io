(() => {
  "use strict";

  const root = document.documentElement;
  const languageButton = document.querySelector(".lang-switch");
  const nav = document.querySelector(".site-nav-modern");
  const brand = document.querySelector(".brand");
  const metaDescription = document.querySelector('meta[name="description"]');
  const publicationCards = Array.from(document.querySelectorAll('#publications > table[height="98"]'));
  const publicationToggle = document.querySelector(".publication-toggle");
  const publicationCount = document.querySelector(".publication-count");
  const initialPublicationCount = 10;
  let publicationsExpanded = false;
  let currentLanguage = "zh";

  const text = {
    zh: {
      title: "王立志 Lizhi Wang｜北京师范大学",
      description: "王立志，北京师范大学人工智能学院教授、博导、国家优青，研究方向包括计算机视觉、计算成像、计算摄影与人工智能。课题组长期招收博士生、硕士生、科研实习生和博士后。",
      switchLabel: "Switch to English",
      navLabel: "主要导航",
      brandLabel: "王立志个人学术主页",
      showAll: "查看全部论文",
      collapse: "收起论文列表",
      count: (shown, total) => `显示 ${shown} / 共 ${total} 篇`
    },
    en: {
      title: "Lizhi Wang | Beijing Normal University",
      description: "Lizhi Wang is a professor and Ph.D. advisor at Beijing Normal University working on computer vision, computational imaging, computational photography, and artificial intelligence. The lab welcomes Ph.D. and master's students, research interns, and postdoctoral researchers.",
      switchLabel: "切换到中文",
      navLabel: "Primary navigation",
      brandLabel: "Lizhi Wang academic homepage",
      showAll: "Show all publications",
      collapse: "Show fewer publications",
      count: (shown, total) => `Showing ${shown} of ${total} publications`
    }
  };

  function updatePublicationView() {
    const visibleCount = publicationsExpanded ? publicationCards.length : Math.min(initialPublicationCount, publicationCards.length);
    publicationCards.forEach((card, index) => {
      card.classList.toggle("publication-card-hidden", index >= visibleCount);
    });

    if (!publicationToggle || !publicationCount) return;
    publicationToggle.hidden = publicationCards.length <= initialPublicationCount;
    publicationToggle.setAttribute("aria-expanded", String(publicationsExpanded));
    const zhLabel = publicationToggle.querySelector(".publication-toggle__zh");
    const enLabel = publicationToggle.querySelector(".publication-toggle__en");
    if (zhLabel) zhLabel.textContent = publicationsExpanded ? text.zh.collapse : text.zh.showAll;
    if (enLabel) enLabel.textContent = publicationsExpanded ? text.en.collapse : text.en.showAll;
    publicationCount.textContent = text[currentLanguage].count(visibleCount, publicationCards.length);
  }

  function setLanguage(language, persist = true) {
    currentLanguage = language === "en" ? "en" : "zh";
    const strings = text[currentLanguage];
    root.dataset.lang = currentLanguage;
    root.lang = currentLanguage === "zh" ? "zh-CN" : "en";
    document.title = strings.title;
    if (metaDescription) metaDescription.content = strings.description;
    if (languageButton) {
      languageButton.setAttribute("aria-pressed", String(currentLanguage === "en"));
      languageButton.setAttribute("aria-label", strings.switchLabel);
    }
    if (nav) nav.setAttribute("aria-label", strings.navLabel);
    if (brand) brand.setAttribute("aria-label", strings.brandLabel);
    document.querySelectorAll("img[data-alt-zh][data-alt-en]").forEach((image) => {
      image.alt = image.dataset[currentLanguage === "zh" ? "altZh" : "altEn"];
    });
    updatePublicationView();
    if (persist) {
      try { localStorage.setItem("lizhi-wang-home-language", currentLanguage); } catch (_) { /* Storage may be disabled. */ }
    }
  }

  publicationCards.forEach((card, index) => {
    card.classList.add("publication-card");
    const title = card.querySelector(".papertitle")?.textContent?.trim() || `Publication ${index + 1}`;
    const image = card.querySelector("img");
    if (image) {
      image.dataset.altZh = `论文示意图：${title}`;
      image.dataset.altEn = `Figure for: ${title}`;
      image.loading = index < 2 ? "eager" : "lazy";
      image.decoding = "async";
    }
  });

  languageButton?.addEventListener("click", () => {
    setLanguage(currentLanguage === "zh" ? "en" : "zh");
  });

  publicationToggle?.addEventListener("click", () => {
    publicationsExpanded = !publicationsExpanded;
    updatePublicationView();
  });

  let savedLanguage = "zh";
  try { savedLanguage = localStorage.getItem("lizhi-wang-home-language") || "zh"; } catch (_) { /* Use Chinese by default. */ }
  setLanguage(savedLanguage === "en" ? "en" : "zh", false);

  const year = document.getElementById("site-year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
