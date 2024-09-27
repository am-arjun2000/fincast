const podcastFolder = './podcasts';
const podcastFiles = [
    'MD on Digital payments.mp3',
    'MD on Debit Credit and Prepaid cards.mp3',
    'MD on Information Technology Governance, Risk, Controls and Assurance Practices.mp3',
    'MD on Outsourcing of Information Technology Services.mp3'
];
const podcastGrid = document.getElementById('podcast-grid');
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const backwardBtn = document.getElementById('backward-btn');
const forwardBtn = document.getElementById('forward-btn');
const seekBar = document.getElementById('seek-bar');
const currentTimeDisplay = document.getElementById('current-time');
const totalDurationDisplay = document.getElementById('total-duration');
const currentPodcastName = document.getElementById('current-podcast-name');
const currentEpisodeName = document.getElementById('current-episode-name');
const currentPodcastImg = document.getElementById('current-podcast-img');

let audio = new Audio();
let isPlaying = false;
let currentPodcastIndex = null;

// Create podcast cards
podcastFiles.forEach((file, index) => {
    const card = createPodcastCard(file, index);
    podcastGrid.appendChild(card);
});

function createPodcastCard(file, index) {
    const card = document.createElement('div');
    card.classList.add('podcast-card');
    
    const img = document.createElement('img');
    img.src = `podcast-cover-${index + 1}.jpg`; // You'll need to provide these images
    img.alt = file;
    
    const info = document.createElement('div');
    info.classList.add('podcast-info');
    
    const title = document.createElement('h3');
    title.textContent = file.split('.')[0];
    
    info.appendChild(title);
    card.appendChild(img);
    card.appendChild(info);
    
    card.addEventListener('click', () => playPodcast(index));
    
    return card;
}

function playPodcast(index) {
    currentPodcastIndex = index;
    audio.src = `${podcastFolder}/${podcastFiles[index]}`;
    audio.play();
    isPlaying = true;
    updatePlayerUI();
}

function updatePlayerUI() {
    const fileName = podcastFiles[currentPodcastIndex].split('.')[0];
    currentPodcastName.textContent = fileName;
    currentEpisodeName.textContent = "Episode 1"; // You might want to dynamically set this
    currentPodcastImg.src = `podcast-cover-${currentPodcastIndex + 1}.jpg`;
    playPauseBtn.textContent = isPlaying ? '❚❚' : '▶';

    audio.addEventListener('loadedmetadata', () => {
        totalDurationDisplay.textContent = formatTime(audio.duration);
    });

    audio.addEventListener('timeupdate', () => {
        seekBar.value = (audio.currentTime / audio.duration) * 100;
        currentTimeDisplay.textContent = formatTime(audio.currentTime);
    });
}

playPauseBtn.addEventListener('click', togglePlayPause);
prevBtn.addEventListener('click', playPreviousPodcast);
nextBtn.addEventListener('click', playNextPodcast);
backwardBtn.addEventListener('click', () => seekRelative(-10));
forwardBtn.addEventListener('click', () => seekRelative(30));
seekBar.addEventListener('input', handleSeek);

function togglePlayPause() {
    if (isPlaying) {
        audio.pause();
    } else {
        audio.play();
    }
    isPlaying = !isPlaying;
    playPauseBtn.textContent = isPlaying ? '❚❚' : '▶';
}

function playPreviousPodcast() {
    currentPodcastIndex = (currentPodcastIndex - 1 + podcastFiles.length) % podcastFiles.length;
    playPodcast(currentPodcastIndex);
}

function playNextPodcast() {
    currentPodcastIndex = (currentPodcastIndex + 1) % podcastFiles.length;
    playPodcast(currentPodcastIndex);
}

function handleSeek() {
    const seekTime = (seekBar.value / 100) * audio.duration;
    audio.currentTime = seekTime;
}

function seekRelative(seconds) {
    audio.currentTime = Math.max(0, Math.min(audio.duration, audio.currentTime + seconds));
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}