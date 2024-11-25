document.querySelector('#searchButton').addEventListener('click', searchVideos);
// busqueda de videos
function searchVideos() {
    const query = document.querySelector('#searchInput').value;
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${query}&type=video&key=AIzaSyDuS6FdR0LkfEJ74ILAnRPMQvKLDRzubmk`;
    fetch(url).then((severdata) => {
        return severdata.json();
    }).then(data => {
        const videoList = document.querySelector('#videoList');
        videoList.innerHTML = '';
        data.items.forEach(item => {
            const videoDiv = document.createElement('div');
            videoDiv.innerHTML = `
                <img src="${item.snippet.thumbnails.default.url}" alt="${item.snippet.title}">
                <p>${item.snippet.title}</p>
                <button class="addToPlaylist">Agregar a Playlist</button>
            `;
            videoDiv.querySelector('img').addEventListener('click', () => {
                document.querySelector('#videoPlayer').src = `https://www.youtube.com/embed/${item.id.videoId}`;
            });
            videoDiv.querySelector('.addToPlaylist').addEventListener('click', () => {
                addToPlaylist(item);
            });
            videoList.appendChild(videoDiv);
        });
    });
}
//playlist
function addToPlaylist(video) {
    const playlist = document.querySelector('#playlist');
    const li = document.createElement('li');
    li.innerHTML = `
        <img src="${video.snippet.thumbnails.default.url}" alt="${video.snippet.title}">
        <p>${video.snippet.title}</p>
    `;
    playlist.appendChild(li);
    savePlaylist();
}
//reproduccion
document.querySelector('#playPause').addEventListener('click', () => {
    const player = document.querySelector('#videoPlayer');
    const playerWindow = player.contentWindow;
    playerWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
});

document.querySelector('#savePlaylist').addEventListener('click', savePlaylist);
//guardar
function savePlaylist() {
    const playlist = [];
    document.querySelectorAll('#playlist li').forEach(li => {
        playlist.push(li.innerHTML);
    });
    localStorage.setItem('playlist', JSON.stringify(playlist));
}
//reinicio
window.onload = () => {
    const savedPlaylist = JSON.parse(localStorage.getItem('playlist'));
    if (savedPlaylist) {
        const playlist = document.querySelector('#playlist');
        savedPlaylist.forEach(videoHTML => {
            const li = document.createElement('li');
            li.innerHTML = videoHTML;
            playlist.appendChild(li);
        });
    }
};


