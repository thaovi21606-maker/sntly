window.onload = () => {
    const characterContainer = document.getElementById('character-container'); 
    const characterImg = document.getElementById('character');
    const frame = document.getElementById('frame');
    const pullString = document.getElementById('pull-string');
    const clickableGift = document.getElementById('clickable-gift');
    const ctaText = document.getElementById('cta-text');
    const finalGift = document.getElementById('final-gift');
    const confettiContainer = document.getElementById('confetti-container');
    const singerContainer = document.getElementById('singer-container');
    const audio = document.getElementById('birthday-audio');
    const finalMusic = document.getElementById('final-music');
    const bdayContainer = document.getElementById('birthday-person-container');
    const bdayBubble = document.getElementById('birthday-bubble');

    let finalSceneTriggered = false; 

    // Hiệu ứng pháo giấy
    const createConfetti = () => {
        const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#ffeb3b', '#ff9800'];
        for (let i = 0; i < 50; i++) {
            const piece = document.createElement('div');
            piece.classList.add('confetti');
            piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            piece.style.left = Math.random() * 100 + '%';
            piece.style.top = Math.random() * 100 + '%';
            piece.style.animationDelay = Math.random() * 2 + 's';
            confettiContainer.appendChild(piece);
            setTimeout(() => piece.remove(), 5000);
        }
    };

    // Logic lời bài Rap
    const startRapping = () => {
        const rapInner = document.getElementById('rap-inner');
        const lines = document.querySelectorAll('.rap-line');
        const rapBubble = document.getElementById('rap-bubble');
        if (rapBubble) rapBubble.style.display = 'block';

        const lyricsTimeline = [
            { time: 0.1 }, { time: 1.2 }, { time: 2.2 }, { time: 3.2 },
            { time: 4.3 }, { time: 5.4 }, { time: 6.4 }, { time: 7.2 },
            { time: 8.3 }, { time: 8.8 }, { time: 9.8 }, { time: 10.4 },
            { time: 12.6 }, { time: 13.2 }, { time: 14.2 }, { time: 15.2 }
        ];

        let lastIndex = -1;
        audio.addEventListener('timeupdate', () => {
            const currentTime = audio.currentTime;
            let currentIndex = lyricsTimeline.findIndex((item, index) => {
                const nextItem = lyricsTimeline[index + 1];
                return currentTime >= item.time && (!nextItem || currentTime < nextItem.time);
            });

            if (currentIndex !== -1 && currentIndex !== lastIndex) {
                lines.forEach(line => line.classList.remove('active'));
                lines[currentIndex].classList.add('active');
                if (rapInner) rapInner.style.transform = `translateY(-${currentIndex * 26}px)`;
                lastIndex = currentIndex;
            }

            if (currentTime >= 18.2 && !finalSceneTriggered) {
                triggerFinalScene();
            }
        });
    };

    // Mở đầu: Kéo dây
    setTimeout(() => {
        if (characterImg) characterImg.classList.add('jumping');
        setTimeout(() => {
            if (pullString) pullString.style.height = "120px"; 
            if (frame) frame.classList.add('open'); 
            setTimeout(() => {
                if (pullString) pullString.style.opacity = "0";
                if (characterContainer) characterContainer.classList.add('fly-away'); 
            }, 600); 
        }, 300);
    }, 3500);

    // Mở quà
    if (clickableGift) {
        clickableGift.addEventListener('click', () => {
            if (finalMusic) finalMusic.play().then(() => finalMusic.pause()).catch(() => {});
            if (ctaText) ctaText.style.display = 'none';
            clickableGift.classList.add('gift-fly-shake');
            createConfetti();

            setTimeout(() => {
                if (finalGift) finalGift.classList.add('show-final-gift');
                document.querySelectorAll('.char-wrapper').forEach(w => w.classList.add('active-jumping'));
                document.querySelectorAll('.speech-bubble:not(.final-bubble)').forEach(b => b.style.display = 'block');
                
                setTimeout(() => {
                    if (singerContainer) singerContainer.classList.add('singer-arrive');
                    if (frame) frame.classList.add('shifted');
                    if (audio) audio.play().then(() => startRapping());
                }, 3000); 
            }, 700);
        });
    }

    // Kết thúc: Dàn hàng ngang
    function triggerFinalScene() {
        if (finalSceneTriggered) return; 
        finalSceneTriggered = true;

        const stage = document.getElementById('stage');
        const friends = [
            document.getElementById('friend-1'),
            document.getElementById('friend-2'),
            document.getElementById('birthday-person-container'),
            document.getElementById('singer-container'),
            document.getElementById('character-container')
        ];
        
        // Đưa tất cả ra Stage và xóa style cũ để CSS dàn hàng
        friends.forEach(el => {
            if (el) {
                stage.appendChild(el);
                el.style.left = "";
                el.style.right = "";
                el.style.transform = "";
                el.classList.add('active-jumping');
            }
        });

        document.body.classList.add('final-scene-active');

        setTimeout(() => {
            if (bdayBubble) bdayBubble.style.display = 'block';
            if (finalMusic) finalMusic.play();
            setTimeout(() => {
                document.querySelectorAll('.yeah-bubble').forEach(b => b.style.display = 'block');
            }, 1000); 
        }, 1500);
    }
};