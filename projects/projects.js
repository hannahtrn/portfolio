import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

const projects = await fetchJSON('../lib/projects.json');

const projectsContainer = document.querySelector('.projects');
const titleEl = document.querySelector('.projects-title');
const searchInput = document.querySelector('.searchBar');
const svg = d3.select('#projects-pie-plot');
const legend = d3.select('.legend');

// ---- state: the ONLY two things the UI depends on ----
let query = '';
let selectedYear = null; // null = no wedge selected

// ---- D3 helpers ----
const arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
const sliceGenerator = d3.pie().value((d) => d.value);

// Key colors by year (not by slice index) so a year keeps its color while searching
const allYears = [...new Set(projects.map((p) => p.year))].sort((a, b) => b - a);
const colors = d3.scaleOrdinal(d3.schemeTableau10).domain(allYears);

// ---- filtering ----
function matchesQuery(project) {
  // skip the image URL so searching e.g. "lab" doesn't match every project
  const { title, year, description } = project;
  return [title, year, description].join('\n').toLowerCase().includes(query.toLowerCase());
}

function toggleYear(year) {
  selectedYear = selectedYear === year ? null : year;
  update();
}

// ---- pie + legend ----
function renderPieChart(searchedProjects) {
  const data = d3
    .rollups(searchedProjects, (v) => v.length, (d) => d.year)
    .sort((a, b) => b[0] - a[0])
    .map(([year, count]) => ({ value: count, label: year }));

  const arcData = sliceGenerator(data);

  // clear old stuff before redrawing
  svg.selectAll('path').remove();
  legend.selectAll('li').remove();

  arcData.forEach((d, i) => {
    const year = data[i].label;
    svg
      .append('path')
      .attr('d', arcGenerator(d))
      .attr('fill', colors(year))
      .attr('class', year === selectedYear ? 'selected' : null)
      .on('click', () => toggleYear(year));
  });

  data.forEach((d) => {
    legend
      .append('li')
      .attr('style', `--color:${colors(d.label)}`)
      .attr('class', d.label === selectedYear ? 'legend-item selected' : 'legend-item')
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
      .on('click', () => toggleYear(d.label));
  });
}

// ---- single source of truth: search AND year applied together ----
function update() {
  const searched = projects.filter(matchesQuery);

  // if the selected year got searched away, clear it
  if (selectedYear !== null && !searched.some((p) => p.year === selectedYear)) {
    selectedYear = null;
  }

  const visible =
    selectedYear === null ? searched : searched.filter((p) => p.year === selectedYear);

  renderProjects(visible, projectsContainer, 'h2');
  titleEl.textContent = `Projects (${visible.length})`;

  // pie is built from the search-filtered list (NOT year-filtered),
  // otherwise selecting a year would collapse the pie to one slice
  renderPieChart(searched);
}

searchInput.addEventListener('input', (event) => {
  query = event.target.value;
  update();
});

update(); // draw on page load