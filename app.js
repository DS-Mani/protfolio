const projects = [
  {
    id: "rag-pipeline",
    title: "RAG Data Pipeline",
    summary:
      "Integrated curated Snowflake datasets with a generative AI agent for insight-ready analytics.",
    tags: ["AI", "Data Pipelines", "Snowflake"],
    stack: "Python, Snowflake, FastAPI, AI Agents",
    highlights: [
      "Built ingestion and enrichment workflows to unify structured data sources.",
      "Exposed queryable endpoints with FastAPI for analyst-friendly access.",
      "Documented architecture, data flows, and error handling.",
    ],
    metrics: ["Schema validation", "Production-style data workflow"],
  },
  {
    id: "realtime-streaming",
    title: "Real-Time Event Processing",
    summary:
      "Near real-time pipeline with Kafka + Spark focused on validation, deduplication, and resilience.",
    tags: ["Streaming", "Spark", "Kafka"],
    stack: "Kafka, Spark, Python",
    highlights: [
      "Implemented parsing, validation, and deduplication logic for streaming data.",
      "Designed for fault tolerance and recoverability in continuous runs.",
      "Documented system flow and design decisions for long-term support.",
    ],
    metrics: ["Low-latency processing", "Fault-tolerant design"],
  },
  {
    id: "dbt-medallion",
    title: "Medallion dbt Model Suite",
    summary:
      "Delivered dbt models with robust testing to support analytics-ready marts.",
    tags: ["dbt", "Analytics", "Snowflake"],
    stack: "dbt, Snowflake, SQL",
    highlights: [
      "Designed a raw → staging → marts architecture for consistent analytics output.",
      "Built automated tests for nulls, uniqueness, and relational integrity.",
      "Improved data reliability and reduced onboarding time.",
    ],
    metrics: ["45 dbt models", "90+ automated tests"],
  },
  {
    id: "kpi-dashboards",
    title: "KPI Dashboard Delivery",
    summary:
      "Interactive Tableau dashboards highlighting KPIs, trends, and stakeholder insights.",
    tags: ["BI", "Tableau", "Analytics"],
    stack: "Tableau, SQL, Excel",
    highlights: [
      "Developed dashboards for executive and operational teams.",
      "Built reusable data extracts and reporting layers.",
      "Partnered with stakeholders to refine metrics.",
    ],
    metrics: ["Stakeholder-ready visuals", "Faster decision cycles"],
  },
];

const milestones = [
  {
    year: 2021,
    role: "Data Analyst Intern",
    org: "L&T Technology Services",
    detail:
      "Supported ETL jobs, automated validation checks, and documented workflows for reporting datasets.",
  },
  {
    year: 2022,
    role: "Data Engineer",
    org: "L&T Technology Services",
    detail:
      "Built backend pipelines, Azure → Snowflake integrations, and dbt models following a medallion architecture.",
  },
  {
    year: 2023,
    role: "Data Engineer",
    org: "L&T Technology Services",
    detail:
      "Orchestrated Airflow DAGs, resolved production incidents, and raised on-time success rates.",
  },
  {
    year: 2024,
    role: "MS in Information Technology",
    org: "St. Francis College",
    detail:
      "Focused on analytics foundations, data systems, and applied projects.",
  },
  {
    year: 2025,
    role: "Data Analyst & Data Engineering Support",
    org: "Community Dreams Foundation",
    detail:
      "Joined the Community Dreams Foundation team in Jul 2025 to support analytics and reporting workflows.",
  },
  {
    year: 2026,
    role: "Data Analyst & Data Engineering Support",
    org: "Community Dreams Foundation",
    detail:
      "Extract and clean large datasets with SQL/Python for reliable reporting. Build interactive Tableau dashboards to highlight KPIs and trends. Deliver ad-hoc analyses, automate extraction/transformation scripts, and collaborate cross-functionally on reporting requirements.",
  },
];

const pipelineSteps = [
  "Ingest Sources",
  "Validate + Clean",
  "Transform + Model",
  "Publish to Analytics",
];

const filterGroup = document.getElementById("filterGroup");
const projectGrid = document.getElementById("projectGrid");
const projectSearch = document.getElementById("projectSearch");
const modal = document.getElementById("projectModal");
const modalBody = document.getElementById("modalBody");
const closeModal = document.getElementById("closeModal");

const timelineTrack = document.getElementById("timelineTrack");
const timelineRange = document.getElementById("timelineRange");
const timelineDetail = document.getElementById("timelineDetail");

const qualityScore = document.getElementById("qualityScore");
const scoreRing = document.querySelector(".score-ring");
const qualityChecks = document.querySelectorAll("#qualityDemo input[type='checkbox']");

const pipelineStepsEl = document.getElementById("pipelineSteps");
const pipelineLog = document.getElementById("pipelineLog");
const runPipeline = document.getElementById("runPipeline");

const copyEmail = document.getElementById("copyEmail");
const progressBar = document.getElementById("progressBar");
const ambientLayer = document.querySelector(".ambient");
const asciiPanel = document.querySelector(".ascii-panel");

let activeFilter = "All";
let revealObserver;

const uniqueTags = [
  "All",
  ...Array.from(new Set(projects.flatMap((project) => project.tags))),
];

const applyStagger = (container, delayStep = 90) => {
  if (!container) return;
  const items = Array.from(container.querySelectorAll(".stagger-item"));
  items.forEach((item, index) => {
    item.style.setProperty("--reveal-delay", `${index * delayStep}ms`);
  });
};

const renderFilters = () => {
  filterGroup.innerHTML = "";
  uniqueTags.forEach((tag) => {
    const button = document.createElement("button");
    button.className = `filter-btn ${tag === activeFilter ? "active" : ""}`;
    button.textContent = tag;
    button.addEventListener("click", () => {
      activeFilter = tag;
      renderFilters();
      renderProjects();
    });
    filterGroup.appendChild(button);
  });
};

const renderProjects = () => {
  const query = projectSearch.value.toLowerCase();
  const filtered = projects.filter((project) => {
    const matchesFilter =
      activeFilter === "All" || project.tags.includes(activeFilter);
    const haystack = `${project.title} ${project.summary} ${project.stack} ${project.tags.join(" ")}`.toLowerCase();
    const matchesSearch = haystack.includes(query);
    return matchesFilter && matchesSearch;
  });

  projectGrid.innerHTML = "";

  filtered.forEach((project, index) => {
    const card = document.createElement("article");
    card.className = "project-card stagger-item";
    card.setAttribute("data-reveal", "");
    card.style.setProperty("--reveal-delay", `${index * 90}ms`);
    card.innerHTML = `
      <div class="project-tags">
        ${project.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
      </div>
      <div>
        <h3>${project.title}</h3>
        <p>${project.summary}</p>
      </div>
      <p class="project-meta">${project.stack}</p>
      <button class="btn ghost" data-project="${project.id}">View Case Study</button>
    `;
    projectGrid.appendChild(card);
    if (revealObserver) {
      revealObserver.observe(card);
    }
  });

  projectGrid.querySelectorAll("button[data-project]").forEach((button) => {
    button.addEventListener("click", (event) => {
      const projectId = event.currentTarget.dataset.project;
      const project = projects.find((item) => item.id === projectId);
      if (project) {
        openModal(project);
      }
    });
  });
};

const openModal = (project) => {
  modalBody.innerHTML = `
    <h3>${project.title}</h3>
    <p>${project.summary}</p>
    <p><strong>Stack:</strong> ${project.stack}</p>
    <ul>
      ${project.highlights.map((item) => `<li>${item}</li>`).join("")}
    </ul>
    <div class="project-tags">
      ${project.metrics.map((item) => `<span class="tag">${item}</span>`).join("")}
    </div>
  `;
  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
};

const closeModalHandler = () => {
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
};

closeModal.addEventListener("click", closeModalHandler);
modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModalHandler();
  }
});

projectSearch.addEventListener("input", renderProjects);

const renderTimeline = () => {
  timelineTrack.innerHTML = "";
  milestones.forEach((milestone, index) => {
    const item = document.createElement("div");
    item.className = "timeline-item stagger-item";
    item.dataset.year = milestone.year;
    item.setAttribute("data-reveal", "");
    item.style.setProperty("--reveal-delay", `${index * 80}ms`);
    item.innerHTML = `
      <strong>${milestone.year}</strong>
      <p>${milestone.role}</p>
    `;
    timelineTrack.appendChild(item);
    if (revealObserver) {
      revealObserver.observe(item);
    }
  });
};

const updateTimeline = (year) => {
  const selected = milestones.reduce((closest, milestone) => {
    if (!closest) return milestone;
    const currentDiff = Math.abs(milestone.year - year);
    const closestDiff = Math.abs(closest.year - year);
    return currentDiff < closestDiff ? milestone : closest;
  }, null);

  timelineTrack.querySelectorAll(".timeline-item").forEach((item) => {
    const itemYear = Number(item.dataset.year);
    item.classList.toggle("active", itemYear === selected.year);
  });

  timelineDetail.innerHTML = `
    <h3>${selected.year} · ${selected.role}</h3>
    <p><strong>${selected.org}</strong></p>
    <p>${selected.detail}</p>
  `;
};

timelineRange.addEventListener("input", (event) => {
  updateTimeline(Number(event.target.value));
});

const updateQualityScore = () => {
  const total = Array.from(qualityChecks)
    .filter((check) => check.checked)
    .reduce((sum, check) => sum + Number(check.dataset.score), 0);
  const bounded = Math.min(100, total);
  qualityScore.textContent = bounded;
  const angle = Math.round((bounded / 100) * 360);
  scoreRing.style.setProperty("--ring-angle", `${angle}deg`);
};

qualityChecks.forEach((check) => {
  check.addEventListener("change", updateQualityScore);
});

const renderPipelineSteps = () => {
  pipelineStepsEl.innerHTML = "";
  pipelineSteps.forEach((step) => {
    const stepEl = document.createElement("div");
    stepEl.className = "pipeline-step";
    stepEl.dataset.status = "pending";
    stepEl.innerHTML = `
      <span>${step}</span>
      <small>Waiting</small>
    `;
    pipelineStepsEl.appendChild(stepEl);
  });
};

const logLine = (text) => {
  const timestamp = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  pipelineLog.innerHTML = `${timestamp} · ${text}<br />${pipelineLog.innerHTML}`;
};

let pipelineRunning = false;

const runPipelineSequence = async () => {
  if (pipelineRunning) return;
  pipelineRunning = true;
  pipelineLog.innerHTML = "";

  const steps = Array.from(pipelineStepsEl.children);
  for (const [index, step] of steps.entries()) {
    step.dataset.status = "running";
    step.querySelector("small").textContent = "Running";
    logLine(`Step ${index + 1}: ${step.querySelector("span").textContent} started.`);
    await new Promise((resolve) => setTimeout(resolve, 800));
    step.dataset.status = "done";
    step.querySelector("small").textContent = "Done";
    logLine(`Step ${index + 1}: Completed successfully.`);
  }
  logLine("Pipeline run finished with 0 errors.");
  pipelineRunning = false;
};

runPipeline.addEventListener("click", runPipelineSequence);

copyEmail.addEventListener("click", async () => {
  const email = "manireddyyerolla@gmail.com";
  try {
    await navigator.clipboard.writeText(email);
    copyEmail.textContent = "Copied";
    setTimeout(() => (copyEmail.textContent = "Copy Email"), 1600);
  } catch (error) {
    copyEmail.textContent = "Copy failed";
    setTimeout(() => (copyEmail.textContent = "Copy Email"), 1600);
  }
});

const setupReveal = () => {
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { threshold: 0.2 }
  );

  document.querySelectorAll("[data-stagger]").forEach((container) => {
    applyStagger(container);
  });

  document.querySelectorAll("[data-reveal]").forEach((element) => {
    revealObserver.observe(element);
  });
};

const parallaxTargets = [
  { el: ambientLayer, speed: 0.06 },
  { el: asciiPanel, speed: 0.14 },
];

const bubbleTerms = [
  "SQL",
  "Python",
  "Snowflake",
  "Airflow",
  "Tableau",
  "dbt",
  "ETL",
  "Pipelines",
  "Analytics",
  "Quality",
  "Insights",
  "Data",
];

const spawnBubble = (x, y) => {
  const bubble = document.createElement("div");
  bubble.className = "click-bubble";
  const word = bubbleTerms[Math.floor(Math.random() * bubbleTerms.length)];
  bubble.textContent = word;
  const drift = Math.round((Math.random() * 2 - 1) * 60);
  const rise = Math.round(80 + Math.random() * 80);
  bubble.style.setProperty("--x", `${x}px`);
  bubble.style.setProperty("--y", `${y}px`);
  bubble.style.setProperty("--drift-x", `${drift}px`);
  bubble.style.setProperty("--rise", `${rise}px`);
  document.body.appendChild(bubble);
  bubble.addEventListener("animationend", () => bubble.remove());
};

let latestScroll = 0;
let ticking = false;

const updateOnScroll = () => {
  const total = document.body.scrollHeight - window.innerHeight;
  const progress = total > 0 ? latestScroll / total : 0;
  if (progressBar) {
    progressBar.style.width = `${Math.min(100, Math.max(0, progress * 100))}%`;
  }
  parallaxTargets.forEach(({ el, speed }) => {
    if (!el) return;
    const offset = Math.min(120, latestScroll * speed);
    el.style.transform = `translate3d(0, ${offset}px, 0)`;
  });
  ticking = false;
};

const onScroll = () => {
  latestScroll = window.scrollY;
  if (!ticking) {
    window.requestAnimationFrame(updateOnScroll);
    ticking = true;
  }
};

document.addEventListener("click", (event) => {
  const target = event.target;
  if (target.closest(".btn, a, input, textarea, select")) return;
  spawnBubble(event.clientX, event.clientY);
});

setupReveal();
window.addEventListener("scroll", onScroll, { passive: true });

renderFilters();
renderProjects();
renderTimeline();
updateTimeline(Number(timelineRange.value));
updateQualityScore();
renderPipelineSteps();
updateOnScroll();
