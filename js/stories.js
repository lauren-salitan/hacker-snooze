"use strict";

let storyList;

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

function generateStoryMarkup(story) {
  const hostName = story.getHostName();
  const isFavorite = currentUser.favorites.some(
    (s) => s.storyId === story.storyId
  );
  const favoriteIcon = isFavorite ? "fas" : "far";
  const isUserStory = currentUser && story.username === currentUser.username;
  const deleteIcon = isUserStory
    ? "<span class='delete-icon'>&times;</span>"
    : "";

  return $(`
  <li id="${story.storyId}">
      ${deleteIcon}
  <li id="${story.storyId}">
  <span class="favorite-icon">
    <i class="${favoriteIcon} fa-heart"></i>
  </span>
  <a href="${story.url}" target="a_blank" class="story-link">
    ${story.title}
  </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}
$allStoriesList.on("click", ".favorite-icon", handleFavoriteClick);
$allStoriesList.on("click", ".delete-icon", handleDeleteClick);

async function handleDeleteClick(evt) {
  const storyId = $(evt.target).closest("li").attr("id");
  await currentUser.deleteStory(storyId);
  putStoriesOnPage();
}

async function handleFavoriteClick(evt) {
  const $target = $(evt.target);
  const storyId = $target.closest("li").attr("id");
  if ($target.hasClass("far")) {
    await currentUser.addFavorite(storyId);
    $target.removeClass("far").addClass("fas");
  } else {
    await currentUser.removeFavorite(storyId);
    $target.removeClass("fas").addClass("far");
  }
}

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

async function submitNewStory(evt) {
  evt.preventDefault();
  const title = $("#new-story-title").val();
  const author = $("#new-story-author").val();
  const url = $("#new-story-url").val();
  const story = await storyList.addStory(currentUser, { title, author, url });
  $("#new-story-title").val("");
  $("#new-story-author").val("");
  $("#new-story-url").val("");

  putStoriesOnPage();
}
$("#new-story-form").on("submit", submitNewStory);