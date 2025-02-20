async function handleCommand(tab: chrome.tabs.Tab) {
  if (!tab.id) {
    return true;
  }

  const prevState = await browser.action.getBadgeText({ tabId: tab.id });
  if (!prevState) {
    await browser.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content-scripts/content.js'],
    });
  }

  const nextState = prevState === 'ON' ? 'OFF' : 'ON';
  await browser.action.setBadgeText({
    tabId: tab.id,
    text: nextState,
  });

  if (nextState === 'ON') {
    try {
      await browser.tabs.sendMessage(tab.id!, { action: 'mount' });
    } catch (error) {
      console.warn('Failed to send mount message:', error);
    }
  } else {
    try {
      await browser.tabs.sendMessage(tab.id!, { action: 'unmount' });
    } catch (error) {
      console.warn('Failed to send unmount message:', error);
    }
  }

  return true;
}

export default defineBackground(() => {
  browser.action.onClicked.addListener(handleCommand);
  browser.commands.onCommand.addListener(async (command, tab) => {
    if (command === '_execute_action') {
      return handleCommand(tab);
    }
    return true;
  });

  browser.omnibox.setDefaultSuggestion({
    description: 'View saved articles',
  });

  browser.omnibox.onInputChanged.addListener((text, suggest) => {
    suggest([
      { content: 'https://archive.today', description: 'Archive.today' },
    ]);
  });

  browser.omnibox.onInputEntered.addListener((text) => {
    const url = browser.runtime.getURL('/saved.html');

    if (text === 'https://archive.today') {
      browser.tabs.create({ url: `${url}#/saved` });
      return;
    }

    browser.tabs.create({ url: url });
  });
});
