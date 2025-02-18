export default defineBackground(() => {
  browser.action.onClicked.addListener(async (tab) => {
    const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
    // Next state will always be the opposite
    const nextState = prevState === 'ON' ? 'OFF' : 'ON';

    // Set the action badge to the next state
    await chrome.action.setBadgeText({
      tabId: tab.id,
      text: nextState,
    });

    if (nextState === 'ON') {
      await chrome.tabs.sendMessage(tab.id!, { action: 'mount' });
    } else {
      await chrome.tabs.sendMessage(tab.id!, { action: 'unmount' });
    }
  });
});
