window.onload = () => {
    // --- 1. KHAI BÁO BIẾN ---
    const stage = document.getElementById('stage');
    const frame = document.getElementById('frame');
    const characterContainer = document.getElementById('character-container'); 
    const characterImg = document.getElementById('character');
    const pullString = document.getElementById('pull-string');
    const clickableGift = document.getElementById('clickable-gift');
    const ctaText = document.getElementById('cta-text');
    const finalGift = document.getElementById('final-gift');
    const confettiContainer = document.getElementById('confetti-container');
    const singerContainer = document.getElementById('singer-container');
    const audio = document.getElementById('birthday-audio');
    const finalMusic = document.getElementById('final-music');
    
    // Nhân vật chính và các bạn thân
    const bdayContainer = document.getElementById('birthday-person-container');
    const bdayBubble = document.getElementById('birthday-bubble');
    const friend1 = document.getElementById('friend-1');
    const friend2 = document.getElementById('friend-2');

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
            if (confettiContainer) confettiContainer.appendChild(piece);
            setTimeout(() => { piece.remove(); }, 5000);
        }
    };

    // --- 3. LOGIC RAP THEO NHẠC ---
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
                if(lines[currentIndex]) lines[currentIndex].classList.add('active');
                const offset = currentIndex * 26; 
                if (rapInner) rapInner.style.transform = `translateY(-${offset}px)`;
                lastIndex = currentIndex;
            }

            if (currentTime >= 18.0 && !finalSceneTriggered) {
                triggerFinalScene();
            }
        });

        audio.addEventListener('ended', () => {
            if (!finalSceneTriggered) triggerFinalScene();
        });
    };

    // --- 4. CẢNH MỞ ĐẦU (KÉO RÈM) ---
    const stopPoint = Math.max((window.innerWidth / 2) - 175, 50);
    setTimeout(() => { 
        if (characterContainer) characterContainer.style.left = stopPoint + "px"; 
    }, 500);

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
            [audio, finalMusic].forEach(m => {
                if(m) { m.play().then(() => { m.pause(); }).catch(e => {}); }
            });

            if (ctaText) ctaText.style.display = 'none';
            clickableGift.classList.add('gift-fly-shake');
            createConfetti();

            setTimeout(() => {
                if (finalGift) finalGift.classList.add('show-final-gift');
                document.querySelectorAll('.char-wrapper').forEach(w => w.classList.add('active-jumping'));
                document.querySelectorAll('.old-bubble').forEach(b => b.style.display = 'block');
                
                setTimeout(() => {
                    if (singerContainer) singerContainer.classList.add('singer-arrive');
                    if (frame) frame.classList.add('shifted');
                    if (audio) {
                        audio.play().then(() => startRapping()).catch(e => console.log("Cần tương tác để phát nhạc"));
                    }
                }, 3000); 
            }, 700);
        });
    }

    // --- 6. HÀM KÍCH HOẠT CẢNH KẾT THÚC (FINAL SCENE) ---
    function triggerFinalScene() {
        if (finalSceneTriggered) return; 
        finalSceneTriggered = true;

        if (audio) audio.pause();

        // Chuyển nhân vật ra Stage để không bị ẩn theo Frame
        if (stage) {
            if (friend1) stage.appendChild(friend1);
            if (friend2) stage.appendChild(friend2);
            if (bdayContainer) stage.appendChild(bdayContainer);
        }

        document.body.classList.add('final-scene-active');

        // Các nhân vật phụ nhảy trước
        [characterContainer, singerContainer, friend1, friend2].forEach(c => {
            if(c) {
                c.classList.remove('fly-away', 'singer-arrive');
                c.classList.add('active-jumping');
            }
        });

        // THỨ TỰ XUẤT HIỆN CẢNH KẾT
        setTimeout(() => {
            if (bdayContainer) {
                // BƯỚC 1: Nhân vật chính bay lên (run-up)
                bdayContainer.classList.add('run-up');
                
                // BƯỚC 2: Chờ bay lên xong (1.5s) mới hiện thoại chính
                setTimeout(() => {
                    if (bdayBubble) bdayBubble.style.display = 'block';

                    // BƯỚC 3: Đợi 2.5s để đọc thoại, sau đó hiện Yeahhh, Đổi nền, và Nhảy mạnh
                    setTimeout(() => {
                        // Hiện Yeahhh!
                        document.querySelectorAll('.yeah-bubble').forEach(b => b.style.display = 'block');
                        
                        // Chèn hình nền background vào Stage
                        if (stage) {
                            stage.classList.add('final-background');
                        }

                        // Phát nhạc kết thúc ngay lúc Yeahhh hiện
                        if (finalMusic) {
                            finalMusic.play().catch(e => console.log("Lỗi nhạc kết: ", e));
                        }

                        // Nhân vật chính bắt đầu nhún nhảy cực mạnh 
                        bdayContainer.classList.remove('run-up');
                        bdayContainer.style.animation = ''; // Fix lỗi không nhún được
                        bdayContainer.offsetHeight; // Force reflow
                        bdayContainer.classList.add('active-jumping-main');

                        // ==============================================
                        // KỊCH BẢN MỚI: 5 GIÂY SAU KHI NHẠC PHÁT
                        // ==============================================
                        setTimeout(() => {
                            // 1. Tắt từ từ các ô thoại cũ (cố tình chừa lại class .final-dialog-bubble để không ẩn nhầm thoại mới)
                            document.querySelectorAll('.speech-bubble:not(.final-dialog-bubble), .yeah-bubble').forEach(bubble => {
                                bubble.style.transition = 'opacity 0.5s ease';
                                bubble.style.opacity = '0'; // Làm mờ trước
                                setTimeout(() => bubble.style.display = 'none', 500); // Sau đó tắt hẳn
                            });

                            // 2. Hội bạn dạt hết sang trái và XẾP THÀNH HÀNG DỌC bằng JS Inline Style
                            const sideCharacters = [friend1, friend2, singerContainer, characterContainer];
                            // Chia tọa độ chiều dọc (bottom) từ trên xuống dưới
                            const bottomPositions = ['75%', '50%', '25%', '0%']; 
                            
                            sideCharacters.forEach((char, index) => {
                                if(char) {
                                    char.style.setProperty('left', '0%', 'important'); // Ép tất cả sát lề trái
                                    char.style.setProperty('right', 'auto', 'important'); // Xóa neo lề phải
                                    char.style.setProperty('top', 'auto', 'important'); // Xóa neo lề trên
                                    char.style.setProperty('bottom', bottomPositions[index], 'important'); // Dàn dọc
                                    char.style.setProperty('transition', 'all 2s ease-in-out', 'important');
                                    
                                    // Thu nhỏ hội bạn lại (0.6) và neo ở góc trái dưới để xếp vừa màn hình
                                    char.style.setProperty('transform', 'scale(0.6)', 'important'); 
                                    char.style.setProperty('transform-origin', 'bottom left', 'important'); 
                                    char.style.setProperty('opacity', '1', 'important');
                                }
                            });

                            // 3. Nhân vật chính lùi nhẹ sang trái (40%), Người yêu bay vào từ phải (60%)
                            bdayContainer.style.setProperty('left', '40%', 'important');
                            bdayContainer.style.setProperty('transition', 'left 2s cubic-bezier(0.25, 1, 0.5, 1)', 'important');

                            const loverContainer = document.getElementById('lover-container');
                            if(loverContainer) {
                                loverContainer.classList.add('lover-arrive');
                                loverContainer.classList.add('lover-jumping');
                            }

                            // 4. Đợi 2 giây cho người yêu bay đến nơi rồi mới bắn Tim
                            setTimeout(() => {
                                const heartEffect = document.getElementById('heart-effect');
                                if(heartEffect) heartEffect.classList.add('show-heart');
                            }, 2000); 

                            // 5. Đợi 3 giây (kể từ lúc NY xuất phát) thì hiện thoại mới
                            setTimeout(() => {
                                const bdayFinalBubble = document.getElementById('bday-final-bubble');
                                const loverBubble = document.getElementById('lover-bubble');
                                
                                if(bdayFinalBubble) bdayFinalBubble.classList.add('show-dialog');
                                if(loverBubble) loverBubble.classList.add('show-dialog');
                            }, 3000); 

                        }, 5000); // Hẹn giờ 5 giây

                    }, 2500); 

                }, 1500); 
            }
        }, 500);
    }
};