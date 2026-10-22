import {
    fetchJSON,
    renderProjects,
    fetchGitHubData
  } from './global.js';
  
  // Load and display the latest 3 projects
  const projects = await fetchJSON('./lib/projects.json');
  const latestProjects = projects.slice(0, 3);
  const projectsContainer = document.querySelector('.projects');
  
  renderProjects(latestProjects, projectsContainer, 'h2');
  
  // Load and display GitHub stats
  const githubData = await fetchGitHubData('hannahtrn');
const profileStats = document.querySelector('#profile-stats');

if (profileStats && githubData.login) {
  profileStats.innerHTML = `
    <h2>My GitHub Stats</h2>
    <dl>
      <dt>Public Repos</dt>
      <dd>${githubData.public_repos}</dd>

      <dt>Public Gists</dt>
      <dd>${githubData.public_gists}</dd>

      <dt>Followers</dt>
      <dd>${githubData.followers}</dd>

      <dt>Following</dt>
      <dd>${githubData.following}</dd>
    </dl>
  `;
}