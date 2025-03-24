/**
 * Extract the PIMS name from a URL path
 * @param {string} pathname - The URL path (e.g., "/cornerstone/scheduler")
 * @returns {string} The PIMS name or "cornerstone" as default
 */
export const getPIMSFromPath = (pathname) => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const pimsName = pathSegments[0] || 'cornerstone';

    return pimsName;
};

/**
 * Create a URL for navigating to a specific route within a PIMS
 * @param {string} pimsName - The PIMS to navigate to
 * @param {string|null} route - The route within the PIMS (e.g., "/scheduler")
 * @returns {string} The complete URL path
 */
export const createPIMSUrl = (pimsName, route = '') => {
    // Handle null or undefined routes
    if (route === null || route === undefined) {
        return `/${pimsName}`;
    }

    // If route already starts with "/", use it as is, otherwise prepend it
    const normalizedRoute = route.startsWith('/') ? route : `/${route}`;

    return `/${pimsName}${normalizedRoute}`;
};

/**
 * When switching PIMS, maintain the same route
 * @param {string} currentPath - The current URL path
 * @param {string} newPIMS - The PIMS to switch to
 * @returns {string} The new URL path
 */
export const createPathForPIMSSwitch = (currentPath, newPIMS) => {
    const pathSegments = currentPath.split('/').filter(Boolean);

    if (pathSegments.length > 1) {
        // If we have a subpath, maintain it when switching PIMS
        const subPath = pathSegments.slice(1).join('/');
        return `/${newPIMS}/${subPath}`;
    } else {
        // Just navigate to the root of the new PIMS
        return `/${newPIMS}`;
    }
}; 