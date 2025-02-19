export default defineBackground(() => {
  browser.action.onClicked.addListener(async (tab) => {
    const prevState = await browser.action.getBadgeText({ tabId: tab.id });
    // Next state will always be the opposite
    const nextState = prevState === 'ON' ? 'OFF' : 'ON';

    // Set the action badge to the next state
    await browser.action.setBadgeText({
      tabId: tab.id,
      text: nextState,
    });

    if (nextState === 'ON') {
      await browser.tabs.sendMessage(tab.id!, { action: 'mount' });
    } else {
      await browser.tabs.sendMessage(tab.id!, { action: 'unmount' });
    }
  });
});
