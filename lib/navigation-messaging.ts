export type NavigateSavedArticleMessage = {
  type: 'NAVIGATE_SAVED_ARTICLE';
  articleUrl: string;
};

export type NavigateSavedArticleResponse = {
  type: 'NAVIGATE_SAVED_ARTICLE_RESPONSE';
  success: boolean;
};

export function handleNavigateSavedArticleMessage(
  message: NavigateSavedArticleMessage,
  sendResponse: (response: NavigateSavedArticleResponse) => void
) {
  const encodedURL = encodeURIComponent(message.articleUrl);
  const fullURL =
    browser.runtime.getURL('/saved.html') + '#article/' + encodedURL;
  browser.tabs.update({ url: fullURL });

  sendResponse({
    type: 'NAVIGATE_SAVED_ARTICLE_RESPONSE',
    success: true,
  });
}
