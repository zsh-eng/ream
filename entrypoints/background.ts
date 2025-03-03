import { handleGetArticlesMessage } from '@/lib/article-messaging';
import { handleBookmarkMessage } from '@/lib/bookmark-messaging';
import { getArticles } from '@/lib/memory';
import { handleNavigateSavedArticleMessage } from '@/lib/navigation-messaging';
import '~/assets/main.css';

async function handleToggleReamCommand(tab: chrome.tabs.Tab) {
  if (!tab.id) {
    return true;
  }

  const prevState = await browser.action.getBadgeText({ tabId: tab.id });

  let isScriptExecuted = false;
  if (!prevState) {
    try {
      isScriptExecuted = await browser.tabs.sendMessage(tab.id!, {
        action: 'content-script-loaded',
      });
    } catch {
      console.log('Script not executed, executing it now');
    } finally {
      if (!isScriptExecuted) {
        await browser.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content-scripts/main.js'],
        });
      }
    }
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

async function executeSidePanelScriptIfNotExecuted(tabId: number) {
  let isScriptExecuted = false;
  try {
    isScriptExecuted = await browser.tabs.sendMessage(tabId, {
      action: 'side-panel-content-script-loaded',
    });
    console.log('message reply is', isScriptExecuted);
  } catch {
    console.log('Side panel content script not executed, executing it now');
  } finally {
    if (!isScriptExecuted) {
      await browser.scripting.executeScript({
        target: { tabId: tabId },
        files: ['content-scripts/side-panel.js'],
      });
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
}

async function handleToggleSidepanelCommand(tab: chrome.tabs.Tab) {
  if (!tab.id) {
    return true;
  }

  await executeSidePanelScriptIfNotExecuted(tab.id!);
  await browser.tabs.sendMessage(tab.id!, { action: 'toggle-sidepanel' });
  return true;
}

async function handleToggleSaveCommand(tab: chrome.tabs.Tab) {
  if (!tab.id) {
    return true;
  }

  await executeSidePanelScriptIfNotExecuted(tab.id!);
  await browser.tabs.sendMessage(tab.id!, { action: 'toggle-save-article' });
  return true;
}

export default defineBackground(() => {
  // CLICK ACTION LISTENER
  browser.action.onClicked.addListener(handleToggleReamCommand);

  // COMMAND LISTENER
  browser.commands.onCommand.addListener(async (command, tab) => {
    console.log('received command', command);
    if (command === '_execute_action') {
      return handleToggleReamCommand(tab);
    }
    if (command === 'toggle-ream') {
      return handleToggleReamCommand(tab);
    }
    if (command === 'toggle-sidepanel') {
      return handleToggleSidepanelCommand(tab);
    }
    if (command === 'toggle-save') {
      return handleToggleSaveCommand(tab);
    }
    return true;
  });

  // OMNIBOX LISTENERS
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

  // MESSAGE LISTENERS
  browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    console.log('received message', message.type);
    if (message.type === 'GET_ARTICLES') {
      handleGetArticlesMessage(message, sendResponse);
    } else if (message.type === 'NAVIGATE_SAVED_ARTICLE') {
      handleNavigateSavedArticleMessage(message, sendResponse);
    } else {
      handleBookmarkMessage(message, sendResponse);
    }
    // keep the message port open as we're doing this async
    return true;
  });
});
