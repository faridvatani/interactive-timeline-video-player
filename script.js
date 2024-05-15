document.addEventListener('DOMContentLoaded', function () {
  const video = document.querySelector('#video'),
    marker = document.querySelector('.video-marker'),
    timeline = document.querySelector('.video-timeline'),
    cursor = document.querySelector('.cursor'),
    cursorText = document.querySelector('.cursor p');

  let isPlaying = true;
  let videoHasEnded = false;

  function updateMarker(percentage) {
    if (videoHasEnded) {
      marker.style.left = '16px';
    } else {
      marker.style.left = `calc(${percentage * 100}% - 1px)`;
    }
  }

  video.addEventListener('timeupdate', function () {
    const percentage = video.currentTime / video.duration;
    updateMarker(percentage);

    isPlaying = handlePlayPauseState(video.paused, video, cursorText);
  });

  timeline.addEventListener('click', function (e) {
    e.stopPropagation(); // to prevent the click event on the video
    const rect = timeline.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const percentage = clickPosition / rect.width;

    video.pause();
    video.currentTime = video.duration * percentage;
    updateMarker(percentage);
    setTimeout(function () {
      video.play();
    }, 1000);
  });

  video.addEventListener('seeked', function () {
    const percentage = video.currentTime / video.duration;
    updateMarker(percentage);

    isPlaying = handlePlayPauseState(video.paused, video, cursorText);
  });

  function handlePlayPauseState(isPlaying, video, cursorText) {
    const action = isPlaying ? 'pause' : 'play';
    const text = isPlaying ? '[Play]' : '[Pause]';

    video[action]();
    cursorText.textContent = text;

    return !isPlaying;
  }

  document.addEventListener('click', function (e) {
    if (!timeline.contains(e.target)) {
      isPlaying = handlePlayPauseState(isPlaying, video, cursorText);
    }
  });

  document.addEventListener('mousemove', function (e) {
    cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  });

  video.addEventListener('ended', function () {
    video.currentTime = 0;
    videoHasEnded = true;
    updateMarker(0);
  });

  video.addEventListener('play', function () {
    videoHasEnded = false;
  });

});
