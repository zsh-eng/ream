export function getCurrentPageFaviconUrl() {
  let favicon = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
  return favicon ? favicon.href : '/favicon.ico';
}

export function getCurrentPageTitle() {
  let title = document.title;
  // Common separators
  const separators = [' | ', ' - ', ' : '];

  for (const separator of separators) {
    if (title.includes(separator)) {
      return title.split(separator).pop()?.trim();
    }
  }

    // Fallback: If no separator is found, assume the whole title is the site name
    return title.trim();
}
