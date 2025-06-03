const startBtn = document.getElementById('startBtn');
const replayBtn = document.getElementById('replayBtn');
const videoGrid = document.getElementById('videoGrid');
const actionButtons = document.getElementById('actionButtons');
const video4 = document.getElementById('video4');
const introAudio = document.getElementById('introAudio');
const videos = document.querySelectorAll('.video-item video');
const video1Audio = document.getElementById('video1Audio');
const video2Audio = document.getElementById('video2Audio');
const video3Audio = document.getElementById('video3Audio');
const video4Audio = document.getElementById('video4Audio');
const correctAudio = document.getElementById('correctAudio');

// 音频加载事件监听
[introAudio, video1Audio, video2Audio, video3Audio, video4Audio].forEach(audio => {
    audio.addEventListener('loadeddata', () => {
        console.log('音频已加载完成');
    });

    audio.addEventListener('error', (e) => {
        console.error('音频加载错误:', e);
        alert('音频加载失败，请检查音频文件路径');
    });
});

// 开始按钮点击事件
startBtn.addEventListener('click', async () => {
    try {
        console.log('开始按钮被点击');
        startBtn.style.display = 'none';
        
        // 检查音频元素是否存在
        if (!introAudio) {
            console.error('introAudio 元素不存在');
            return;
        }

        // 检查音频源是否存在
        console.log('音频元素状态:', {
            src: introAudio.src,
            currentSrc: introAudio.currentSrc,
            readyState: introAudio.readyState,
            paused: introAudio.paused,
            ended: introAudio.ended,
            error: introAudio.error
        });

        // 检查音频是否已加载
        if (introAudio.readyState === 0) {
            console.log('音频尚未加载，开始加载...');
            introAudio.load();
        }

        // 等待音频加载完成
        if (introAudio.readyState < 3) {
            console.log('等待音频加载...');
            await new Promise((resolve) => {
                introAudio.addEventListener('canplaythrough', resolve, { once: true });
            });
        }

        console.log('尝试播放音频:', introAudio.currentSrc);
        
        // 重置音频位置
        introAudio.currentTime = 0;
        
        try {
            // 设置音量
            introAudio.volume = 1.0;
            // 尝试播放
            await introAudio.play();
            console.log('音频开始播放成功');
        } catch (playError) {
            console.error('音频播放失败:', playError);
            alert('音频播放失败，请检查浏览器设置或音频文件');
            return;
        }

        introAudio.addEventListener('ended', () => {
            console.log('音频播放完成');
            videoGrid.style.display = 'grid';
            actionButtons.style.display = 'grid';
            replayBtn.style.display = 'block';
        }, { once: true });

        // 添加音频播放进度监听
        introAudio.addEventListener('timeupdate', () => {
            console.log('音频播放进度:', introAudio.currentTime);
        });

        // 添加错误监听
        introAudio.addEventListener('error', (e) => {
            console.error('音频错误:', e);
        });

    } catch (error) {
        console.error('发生错误:', error);
        alert('发生错误，请刷新页面重试');
    }
});

// 重播按钮点击事件
replayBtn.addEventListener('click', async () => {
    try {
        introAudio.currentTime = 0;
        const playPromise = introAudio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('音频重新播放');
            }).catch(error => {
                console.error('音频重播失败:', error);
                alert('音频重播失败，请检查浏览器设置');
            });
        }
    } catch (error) {
        console.error('重播错误:', error);
        alert('重播失败，请刷新页面重试');
    }
});

// 创建撒花效果
function createConfetti() {
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = Math.random() * 10 + 5 + 'px';
        confetti.style.animationDuration = Math.random() * 2 + 2 + 's';
        document.body.appendChild(confetti);
        
        // 动画结束后移除元素
        confetti.addEventListener('animationend', () => {
            confetti.remove();
        });
    }
}

// 处理按钮点击事件
async function handleAction(action) {
    const buttons = document.querySelectorAll('.action-btn');
    
    if (action === 'wash') {
        // 正确答案
        const button = event.target;
        button.classList.add('correct');
        buttons.forEach(btn => btn.disabled = true); // 正确答案后禁用所有按钮
        
        // 创建撒花效果
        createConfetti();
        
        // 播放正确音频
        try {
            console.log('尝试播放正确音频');
            if (!correctAudio) {
                console.error('correctAudio元素不存在');
                return;
            }

            // 检查音频状态
            console.log('音频元素状态:', {
                src: correctAudio.src,
                currentSrc: correctAudio.currentSrc,
                readyState: correctAudio.readyState,
                paused: correctAudio.paused,
                ended: correctAudio.ended,
                error: correctAudio.error
            });

            // 停止其他音频
            [introAudio, video1Audio, video2Audio, video3Audio, video4Audio].forEach(audio => {
                audio.pause();
                audio.currentTime = 0;
            });

            // 确保音频已加载
            if (correctAudio.readyState === 0) {
                console.log('音频尚未加载，开始加载...');
                correctAudio.load();
            }

            // 等待音频加载完成
            if (correctAudio.readyState < 3) {
                console.log('等待音频加载...');
                await new Promise((resolve) => {
                    correctAudio.addEventListener('canplaythrough', resolve, { once: true });
                });
            }

            correctAudio.currentTime = 0; // 重置音频位置
            correctAudio.volume = 1.0; // 设置音量

            // 添加音频事件监听
            correctAudio.addEventListener('playing', () => {
                console.log('音频开始播放');
            });

            correctAudio.addEventListener('ended', () => {
                console.log('音频播放完成');
            });

            correctAudio.addEventListener('error', (e) => {
                console.error('音频错误:', e);
            });

            await correctAudio.play();
            console.log('正确音频播放成功');

            // 显示第四个视频
            video4.style.display = 'block';
            video4.classList.add('show');
            // 确保视频加载完成后播放
            video4.addEventListener('loadeddata', () => {
                video4.play().catch(error => {
                    console.error('视频播放失败:', error);
                });
            }, { once: true });
            // 如果视频已经加载完成，直接播放
            if (video4.readyState >= 3) {
                video4.play().catch(error => {
                    console.error('视频播放失败:', error);
                });
            }
        } catch (error) {
            console.error('音频播放失败:', error);
            alert('音频播放失败，请检查浏览器设置');
        }
    } else {
        // 错误答案
        const button = event.target;
        button.classList.add('wrong');
        
        // 播放错误音频
        try {
            video4Audio.currentTime = 0; // 重置音频位置
            await video4Audio.play();
        } catch (error) {
            console.error('音频播放失败:', error);
        }

        // 2秒后只重置当前按钮状态
        setTimeout(() => {
            button.classList.remove('wrong');
            button.disabled = false; // 只重置当前按钮
        }, 2000);
    }
}

// 为每个视频添加鼠标悬停事件
videos.forEach((video, index) => {
    const videoItem = video.parentElement;
    const audioElement = [video1Audio, video2Audio, video3Audio][index];
    
    videoItem.addEventListener('mouseenter', async () => {
        try {
            console.log('尝试播放视频:', video.src);
            await video.play();
            console.log('视频播放成功');
            
            // 播放对应的音频
            try {
                audioElement.currentTime = 0; // 重置音频位置
                await audioElement.play();
                console.log('音频播放成功');
            } catch (audioError) {
                console.error('音频播放失败:', audioError);
            }
        } catch (error) {
            console.error('视频播放失败:', error);
            video.load();
            try {
                await video.play();
                console.log('视频重新加载后播放成功');
            } catch (retryError) {
                console.error('视频重新加载后仍然无法播放:', retryError);
            }
        }
    });
    
    videoItem.addEventListener('mouseleave', () => {
        video.pause();
        video.currentTime = 0;
        // 停止音频播放
        audioElement.pause();
        audioElement.currentTime = 0;
    });

    // 添加视频加载事件监听
    video.addEventListener('loadeddata', () => {
        console.log('视频加载完成:', video.src);
    });

    video.addEventListener('error', (e) => {
        console.error('视频加载错误:', video.src, e);
    });
});

// 页面加载完成后预加载音频
window.addEventListener('load', () => {
    [introAudio, video1Audio, video2Audio, video3Audio, video4Audio].forEach(audio => audio.load());
});
