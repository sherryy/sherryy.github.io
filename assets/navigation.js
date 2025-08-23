// Navigation loader for all pages
function loadNavigation() {
    const navHTML = `
        <div class="nav-menu">
            <a href="index.html">Home</a> |
            <a href="group.html">Group</a> |
            <a href="publications.html">Publications</a> |
            <a href="talks.html">Talks</a> |
            <a href="services.html">Services</a> |
            <a href="teaching.html">Teaching</a>
        </div>
    `;
    
    // Insert navigation at the beginning of the body
    const body = document.body;
    if (body.firstChild) {
        body.insertAdjacentHTML('afterbegin', navHTML);
    } else {
        body.innerHTML = navHTML + body.innerHTML;
    }
}

// Load navigation when DOM is ready
document.addEventListener('DOMContentLoaded', loadNavigation);
