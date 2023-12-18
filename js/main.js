"use strict";

// So we don't have to keep re-finding things on page, find DOM elements once:

const $body = $("body");
const $storiesLoadingMsg = $("#stories-loading-msg");
const $allStoriesList = $("#all-stories-list");
// const $userFavoritesList = $("#user-favorites-list");
// const $userStories = $("#user-stories");
const $loginForm = $("#login-form");
const $signupForm = $("#signup-form");
// const $newStoryForm = $("#new-story-form");
// const $mainNavLinks = $("#main-nav-links");
const $navLogin = $("#nav-login");
const $navUserProfile = $("#nav-user-profile");
const $navLogOut = $("#nav-logout");
// const $navSubmit = $("#nav-submit");
// const $navFavorites = $("#nav-favorites");
// const $navUserStories = $("#nav-user-stories");
// const $storyTitle = $("#story-title");
// const $storyAuthor = $("#story-author");
// const $storyUrl = $("#story-url");


/** To make it easier for individual components to show just themselves, this
 * is a useful function that hides pretty much everything on the page. After
 * calling this, individual components can re-show just what they want.
 */

function hidePageComponents() {
  const components = [
    // $userFavoritesList,
    // $userStories,
    // $newStoryForm,
    $allStoriesList,
    $loginForm,
    $signupForm,
  ];
  components.forEach(c => c.hide());
}

async function start() {
  console.debug("start");
  await checkForRememberedUser();
  await getAndShowStoriesOnStart();
  if (currentUser) updateUIOnUserLogin();
}
console.warn("HEY STUDENT: This program sends many debug messages to" +
  " the console. If you don't see the message 'start' below this, you're not" +
  " seeing those helpful debug messages. In your browser console, click on" +
  " menu 'Default Levels' and add Verbose");
$(start);


// "use strict";
// const $body = $("body");
// const $storiesLoadingMsg = $("#stories-loading-msg");
// const $allStoriesList = $("#all-stories-list");
// const $loginForm = $("#login-form");
// const $signupForm = $("#signup-form");
// const $navLogin = $("#nav-login");
// const $navUserProfile = $("#nav-user-profile");
// const $navLogOut = $("#nav-logout");
// function hidePageComponents() {
//   const components = [
//     $allStoriesList,
//     $loginForm,
//     $signupForm,
//   ];
//   components.forEach(c => c.hide());
// }
// async function start() {
//   console.debug("start");
//   await checkForRememberedUser();
//   await getAndShowStoriesOnStart();
//   if (currentUser) updateUIOnUserLogin();
// }
// console.warn("HEY STUDENT: This program sends many debug messages to" +
//   " the console. If you don't see the message 'start' below this, you're not" +
//   " seeing those helpful debug messages. In your browser console, click on" +
//   " menu 'Default Levels' and add Verbose");
// $(start);