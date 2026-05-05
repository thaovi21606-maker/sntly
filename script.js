window.onload = () => {
    // --- 1. KHAI BÁO BIẾN ---
    const characterContainer = document.getElementById('character-container'); 
    const characterImg = document.getElementById('character');
    const frame = document.getElementById('frame');
    const pullString = document.getElementById('pull-string');
    const clickableGift = document.getElementById('clickable-gift');
    const ctaText = document.getElementById('cta-text');
    const finalGift = document.getElementById('final-gift');
    const sideChars = document.querySelectorAll('.side-character'); 
    const confettiContainer = document.getElementById('confetti-container');
    const singerContainer = document.getElementById('singer-container');
    const audio = document.getElementById('birthday-audio');
    
    // Khai báo thêm nhạc kết thúc
    const finalMusic = document.getElementById('final-music');
    const bdayContainer = document.getElementById('birthday-person-container');
    const bdayBubble = document.getElementById('birthday-bubble');

    let finalSceneTriggered = false; 

    // --- 2. HIỆU ỨNG PHÁO GIẤY ---
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
            setTimeout(() => { piece.remove(); }, 5000);
        }
    };

    // --- 3. LOGIC RAP & DELAY ---
    const startRapping = () => {
        const rapInner = document.getElementById('rap-inner');
        const lines = document.querySelectorAll('.rap-line');
        const rapBubble = document.getElementById('rap-bubble');
        if (rapBubble) rapBubble.style.display = 'block';

        const lastLyricStartTime = 15.2; 
        const targetTime = lastLyricStartTime + 3; 

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
                const offset = currentIndex * 26; 
                if (rapInner) rapInner.style.transform = `translateY(-${offset}px)`;
                lastIndex = currentIndex;
            }

            if (currentTime >= targetTime && !finalSceneTriggered) {
                triggerFinalScene();
            }
        });

        audio.addEventListener('ended', () => {
            if (!finalSceneTriggered) {
                const remainingTime = (targetTime - audio.currentTime) * 1000;
                setTimeout(() => { triggerFinalScene(); }, Math.max(0, remainingTime));
            }
        });
    };

    // --- 4. CẢNH MỞ ĐẦU ---
    // Tìm dòng này ở phần 4 (Cảnh mở đầu) và sửa lại con số:
const stopPoint = (window.innerWidth / 2) - 200; // Tăng khoảng cách để nhân vật kéo rèm đứng cân đối hơn
    setTimeout(() => { if (characterContainer) characterContainer.style.left = stopPoint + "px"; }, 500);

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

    // --- 5. LOGIC CLICK MỞ QUÀ ---
    if (clickableGift) {
        clickableGift.addEventListener('click', () => {
            
            // ---> ĐOẠN FIX CHO ĐIỆN THOẠI BẮT ĐẦU TỪ ĐÂY <---
            // Mở khóa audio thứ 2 ngay khi người dùng click
            if (finalMusic) {
                finalMusic.play().catch(e => console.log("Unlock audio"));
                finalMusic.pause();
                finalMusic.currentTime = 0;
            }
            // ---> KẾT THÚC ĐOẠN FIX <---

            if (ctaText) ctaText.style.display = 'none';
            clickableGift.classList.add('gift-fly-shake');
            createConfetti();

            setTimeout(() => {
                if (finalGift) finalGift.classList.add('show-final-gift');
                
                document.querySelectorAll('.char-wrapper').forEach(wrapper => {
                    wrapper.classList.add('active-jumping');
                    const img = wrapper.querySelector('.side-character');
                    if(img) img.classList.remove('active-jumping');
                });

                document.querySelectorAll('.speech-bubble:not(.final-bubble)').forEach(bubble => {
                    bubble.style.display = 'block';
                });
                
                setTimeout(() => {
                    if (singerContainer) singerContainer.classList.add('singer-arrive');
                    if (frame) frame.classList.add('shifted');
                    if (audio) {
                        audio.play().then(() => { startRapping(); }).catch(e => console.log("Cần tương tác"));
                    }
                }, 3000); 
            }, 700);
        });
    }

    // --- 6. HÀM KÍCH HOẠT CẢNH KẾT THÚC ---
    function triggerFinalScene() {
        if (finalSceneTriggered) return; 
        finalSceneTriggered = true;

        const stage = document.getElementById('stage');
        const friend1 = document.getElementById('friend-1');
        const friend2 = document.getElementById('friend-2');
        
        if (stage && friend1) stage.appendChild(friend1);
        if (stage && friend2) stage.appendChild(friend2);

        document.body.classList.add('final-scene-active');

        if (characterContainer) {
            characterContainer.classList.remove('fly-away');
            characterContainer.classList.add('active-jumping');
        }
        if (singerContainer) singerContainer.classList.add('active-jumping');

        setTimeout(() => {
            if (bdayContainer) {
                bdayContainer.classList.add('run-up');

                // Lần chờ 1: Đợi nhân vật hiện lên hoàn toàn (3s)
                setTimeout(() => {
                    if (bdayBubble) bdayBubble.style.display = 'block';

                    // Lần chờ 2: 2 giây sau khi ô thoại xuất hiện thì phát nhạc
                    setTimeout(() => {
                        if (finalMusic) {
                            finalMusic.play().catch(e => console.log("Lỗi phát nhạc cuối"));
                        }
                    }, 2000); // 2s delay nhạc

                    // Lần chờ 3: Hiện các ô thoại Yeah
                    setTimeout(() => {
                        document.querySelectorAll('.yeah-bubble').forEach(bubble => {
                            bubble.style.display = 'block';
                        });
                    }, 1000); 
                }, 3000); 
            }
        }, 1000);
    }
};
