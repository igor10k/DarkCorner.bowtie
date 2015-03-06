/*global Player */
/*exported themeReady, playStateUpdate, trackUpdate, artworkUpdate, playerUpdate */

var wrap, wrapTest, progress, currentTrackLength, playerName, template, container;

template =
	'<div class="artBox">' +
		'<img src="defaultartwork.png" class="art" alt="artwork" />' +
	'</div>' +
	'<div class="infoBox">' +
		'<div class="title">{{title}}</div>' +
		'<div class="artist-album">' +
			'<div class="artist">{{artist}}</div>' +
			'<div class="album">{{album}}</div>' +
		'</div>' +
	'</div>';

function render(title, album, artist) {
	return template
		.replace('{{title}}', title || 'Nothing')
		.replace('{{album}}', album || 'is playing')
		.replace('{{artist}}', artist || '');
}

function themeReady() {
	wrap = document.getElementById('wrap');
	wrapTest = document.getElementById('wrap-test');

	progress = document.getElementById('progress');
}

function playStateUpdate(playState) {
	if (playState === 0 || playState === 2) {
		wrap.classList.add('pause');
	} else {
		wrap.classList.remove('pause');
	}
}

function trackUpdate(track){
	var title = track.propertyHTML('title');
	var artist = track.propertyHTML('artist');
	var album = track.propertyHTML('album');
	var art = track.propertyHTML('art');

	if (container) {
		(function (oldContainer) {
			oldContainer.classList.add('hide');
			oldContainer.addEventListener('transitionend', function () {
				wrap.removeChild(oldContainer);
			});
		}(container));
	}

	container = document.createElement('div');
	container.className = 'container';
	container.innerHTML = render(title, artist, album, art);

	wrapTest.appendChild(container);
	var newWidth = container.clientWidth + 1;

	container.classList.add('show');
	wrap.appendChild(container);

	setTimeout(function () {
		container.classList.remove('show');
	}, 1);

	wrap.style.width = newWidth + 'px';

	currentTrackLength = track.property('length');
	progress.style.width = '0%';
	playerName = Player.name();
}

function artworkUpdate(artURL){
	setTimeout(function () {
		container.querySelector('.art').src = artURL || 'defaultartwork.png';
	}, 1);
}

function playerUpdate() {
	if (playerName === 'Spotify') {
		progress.style.width = Player.playerPosition() / currentTrackLength * 100 + '%';
	}
}
