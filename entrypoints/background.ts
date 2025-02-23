import { handleBookmarkMessage } from '@/lib/bookmark-messaging';
import { getArticles } from '@/lib/memory';

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

  const nextState = prevState === 'ON' ? '' : 'ON';
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
    const articles = getArticles().filter((article) =>
      article.title.toLowerCase().includes(text.toLowerCase())
    );

    suggest(
      articles.map((article) => ({
        content: article.url,
        description: article.title,
      }))
    );
  });

  browser.omnibox.onInputEntered.addListener((text, disposition) => {
    const isURL = text.startsWith('http');
    if (!isURL) {
      const allSavedArticlesURL = browser.runtime.getURL('/saved.html');
      if (disposition === 'currentTab') {
        browser.tabs.update({ url: allSavedArticlesURL });
        return;
      }
      browser.tabs.create({ url: allSavedArticlesURL });
      return;
    }

    const encodedURL = encodeURIComponent(text);
    const savedArticleURL =
      browser.runtime.getURL('/saved.html') + '#/article/' + encodedURL;

    if (disposition === 'currentTab') {
      browser.tabs.update({ url: savedArticleURL });
      return;
    }
    browser.tabs.create({ url: savedArticleURL });
  });

  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    handleBookmarkMessage(message, sendResponse);
    // keep the message port open as we're doing this async
    return true;
  });
});
