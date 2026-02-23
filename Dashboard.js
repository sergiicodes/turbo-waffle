/**
 * Main logic for the MPLS Ledger frontend rendering.
 * Includes mimicking Astro/Tailwind data binding and injecting D3 voting blocs.
 */

document.addEventListener("DOMContentLoaded", () => {
    setupTabs();
    renderAgendaFeed();
    initializeD3VotingMatrix();
    fetchNewsTicker();
});

async function fetchNewsTicker() {
    const tickerContainer = document.getElementById("news-ticker-content");
    if (!tickerContainer) return;

    try {
        const res = await fetch("news.json");
        if (!res.ok) throw new Error("Network response was not ok");
        const headlines = await res.json();

        let html = "";
        headlines.forEach(news => {
            html += `
                <span class="mx-3 text-blue-300">•</span>
                <a href="${news.url}" target="_blank" rel="noopener noreferrer" class="hover:text-amber-300 transition-colors uppercase cursor-pointer hover:underline text-[13px] tracking-wide">${news.title}</a>
            `;
        });
        tickerContainer.innerHTML = html;
    } catch (error) {
        console.error("Failed to load news:", error);
        tickerContainer.innerHTML = `
            <span class="mx-3 text-blue-300">•</span>
            <span class="text-white text-[13px] uppercase tracking-wide">Unable to load Twin Cities live news. Check pipeline.</span>
        `;
    }
}

function setupTabs() {
    const tabSummaries = document.getElementById("tab-summaries");
    const tabTracker = document.getElementById("tab-tracker");
    const rightSidebar = document.getElementById("right-sidebar");
    const agendaFeed = document.getElementById("agenda-feed");

    tabSummaries.addEventListener("click", () => {
        tabSummaries.className = "tab-active pb-1 transition-colors";
        tabTracker.className = "tab-inactive pb-1 transition-colors";

        // Mobile view logic
        if (window.innerWidth < 1024) {
            agendaFeed.classList.remove("hidden");
            rightSidebar.classList.add("hidden");
            rightSidebar.classList.remove("flex", "flex-col");
        }
    });

    tabTracker.addEventListener("click", () => {
        tabTracker.className = "tab-active pb-1 transition-colors";
        tabSummaries.className = "tab-inactive pb-1 transition-colors";

        // Mobile view logic
        if (window.innerWidth < 1024) {
            agendaFeed.classList.add("hidden");
            rightSidebar.classList.remove("hidden");
            rightSidebar.classList.add("flex", "flex-col");
        }
    });
}

async function renderAgendaFeed() {
    const feed = document.getElementById('agenda-feed');

    // Mock Data representing D1 REST API responses
    const res = await fetch("https://turbo-waffle.sergiojhernandezacosta.workers.dev/api/agenda");
    const agendaData = await res.json();

    feed.innerHTML = ""; // Clear loader

    agendaData.forEach(item => {
        const card = document.createElement('article');
        card.className = "bg-white p-7 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300";

        // Define color tag loosely based on category
        const tagColors = {
            "Transit": "bg-blue-50 text-blue-700",
            "Housing": "bg-purple-50 text-purple-700",
            "Public Safety": "bg-red-50 text-red-700"
        };
        const colorClass = tagColors[item.category] || "bg-gray-100 text-gray-700";

        card.innerHTML = `
            <div class="flex items-center justify-between mb-4">
                <span class="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${colorClass}">${item.category}</span>
                <span class="text-sm font-semibold text-gray-500 flex items-center gap-2">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    ${item.date}
                </span>
            </div>
            <h3 class="text-2xl font-bold mb-3 leading-snug text-gray-900">${item.title}</h3>
            <div class="bg-gray-50 p-4 rounded-xl mb-4 border border-gray-100">
                <div class="flex items-center gap-2 mb-2">
                    <svg class="w-5 h-5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd"></path></svg>
                    <span class="text-sm font-bold text-indigo-900">Gemini 3 Pro Summary</span>
                </div>
                <p class="text-gray-700 leading-relaxed text-[15px]">${item.ai_summary}</p>
            </div>
            <div class="flex justify-between items-center text-sm font-medium">
                <span class="text-gray-500">Status: <span class="text-gray-900 font-bold ml-1">${item.status}</span></span>
                <button class="text-blue-600 hover:text-blue-800 transition-colors font-bold">Read Full Text &rarr;</button>
            </div>
        `;
        feed.appendChild(card);
    });
}

function initializeD3VotingMatrix() {
    const containerNode = document.getElementById("d3-placeholder");
    const containerSelect = d3.select("#d3-placeholder");

    containerSelect.select("span").remove(); // Clear loader

    // 1. DATA SCIENCE MAPPING
    // In production, this will come from your 'data_science_logic.py' via an API call.
    const members = ["Payne", "Wonsley", "Osman", "Chughtai", "Chavez", "Palmisano", "Rainville", "Vetaw"];

    // Mock Correlation Data: 1 is perfect alignment, -1 is total opposition
    const correlationData = [];
    members.forEach(a => {
        members.forEach(b => {
            let correlation = (a === b) ? 1 : (Math.random() * 2 - 1); // Mock random correlation
            correlationData.push({ memberA: a, memberB: b, value: correlation });
        });
    });

    // 2. DIMENSIONS
    const margin = { top: 40, right: 20, bottom: 60, left: 70 };
    const width = containerNode.getBoundingClientRect().width - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = containerSelect.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // 3. SCALES
    const x = d3.scaleBand().range([0, width]).domain(members).padding(0.05);
    const y = d3.scaleBand().range([height, 0]).domain(members).padding(0.05);

    // Divergent Color Scale: Blue (Align), White (Neutral), Red (Oppose)
    const colorScale = d3.scaleLinear()
        .domain([-1, 0, 1])
        .range(["#ef4444", "#f8fafc", "#3b82f6"]);

    // 4. DRAW HEATMAP CELLS
    svg.selectAll()
        .data(correlationData)
        .enter()
        .append("rect")
        .attr("x", d => x(d.memberA))
        .attr("y", d => y(d.memberB))
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .style("fill", d => colorScale(d.value))
        .attr("rx", 4) // Rounded corners for Zulu's clean aesthetic
        .attr("class", "cursor-pointer transition-opacity hover:opacity-80")
        .on("mouseover", function (event, d) {
            // Simple logic for a tooltip could go here
            d3.select(this).style("stroke", "#1e293b").style("stroke-width", "2");
        })
        .on("mouseleave", function () {
            d3.select(this).style("stroke", "none");
        });

    // 5. AXES & LABELS
    svg.append("g")
        .style("font-size", "10px")
        .style("font-weight", "600")
        .call(d3.axisLeft(y).tickSize(0))
        .select(".domain").remove();

    svg.append("g")
        .style("font-size", "10px")
        .style("font-weight", "600")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickSize(0))
        .select(".domain").remove();

    // Rotate X-axis labels for readability
    svg.selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em");
}
