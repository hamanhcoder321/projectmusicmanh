const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const PLAYER_STORAGE = 'Manh_Coder'
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE)) || {},
    manhs: [
        {
            name: '3 1 0 7',
            singer: 'W/n',
            path: '/assets/music/manhs/3107LofiVersion-WnNauDuongg-6943942.mp3',
            image: './assets/img/download.jpg'
        },
        {
            name: '3 1 0 7 - 2',
            singer: 'W/n',
            path: '/assets/music/manhs/31072Lofi-LittleLOVE-7710136.mp3',
            image: './assets/img/ab67616d0000b2732cdddff8045e2c384093cef1.jpg'
        },
        {
            name: 'Già cùng nhau là được',
            singer: 'TungTea',
            path: 'assets/music/manhs/GiaCungNhauLaDuoc-TeaPC-5743181.mp3',
            image: './assets/img/download (1).jpg'
        },
        {
            name: 'Một đời',
            singer: '14 Casper, Bon Nghiêm',
            path: 'assets/music/manhs/MotDoi-14CasperBonNghiem-8776989.mp3',
            image: './assets/img/download (2).jpg'
        },
        {
            name: 'sao anh chưa về',
            singer: 'lyly',
            path: 'assets/music/manhs/nnjsg93kv0.mp3',
            image: './assets/img/download (3).jpg'
        },
        {
            name: '24H',
            singer: 'LyLy',
            path: '/assets/music/manhs/24H-LylyMagazine-5766707.mp3',
            image: './assets/img/439f8b9d834adfe6b2b3cfa01bdb5355.jpg'
        }
        // Thêm các bài hát khác tương tự như trên
    ],
    setConfig: function(key, value){
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE, JSON.stringify(this.config))
    },
    render: function() {
        const htmls = this.manhs.map((manh, index) => {
            return `
            <div class="manh ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb" 
                    style="background-image: url('${manh.image}');"></div>
                <div class="body">
                    <h3 class="title">${manh.name}</h3>
                    <p class="author">${manh.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playlist.innerHTML = htmls.join('')
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentManh', {
            get: function(){
                return this.manhs[this.currentIndex]
            }
        })
    },
    handleEvents: function(){
        const _this = this
        const cdWidth = cd.offsetWidth
        // xử lý cd quay/dừng
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ],{
            duration: 10000, // 10giay
            iterations: Infinity
        })
        cdThumbAnimate.pause()
        // xử lý zoom to/ nhỏ đĩa CD
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }
        // xử lý khi người dùng click vào bài hát
        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause()
            }else{
                audio.play()
            }
        }
        // khi manh play
        audio.onplay = function(){
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        // khi manh pause
        audio.onpause = function(){
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }
        // khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }
        // xử lý khi tua bài hát
        progress.onchange = function(e){
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }
        // khi next bài hát
        nextBtn.onclick= function(){
            if(_this.isRandom){
                _this.playRandomManh()
            }else{
                _this.nextManh()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveManh()
        }
        // khi prev bài hát
        prevBtn.onclick= function(){
            if(_this.isRandom){
                _this.playRandomManh()
            }else{
                _this.prevManh()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveManh()
        }
        // xử lý bật / tắt random Manh
        randomBtn.onclick= function(e){
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
           randomBtn.classList.toggle('active', _this.isRandom)
        }
        // xử lý phát lại bài hát manh 
        repeatBtn.onclick = function(e){
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }
        // xử lý next manh khi audio ended
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play()
            }else{
                nextBtn.click()
            }
        }
        const addSongBtn = $('.add_Song .icon');
        addSongBtn.onclick = function() {
            const newSong = {
                name: 'Bài hát mới', // Thay thế bằng tên bài hát mới
                singer: 'Ca sĩ mới', // Thay thế bằng tên ca sĩ mới
                path: '/assets/music/manhs/new-song.mp3', // Thay thế bằng đường dẫn bài hát mới
                image: './assets/img/new-song.jpg' // Thay thế bằng đường dẫn hình ảnh bài hát mới
            };
            _this.manhs.push(newSong); // Thêm bài hát vào danh sách
            _this.render(); // Render lại danh sách bài hát
            _this.scrollToActiveManh(); // Cuộn đến bài hát mới thêm
        };
        // xử lý khi click vào playlist
        playlist.onclick = function(e){
            const manhNode =  e.target.closest('.manh:not(.active)')
            const optionNode = e.target.closest('.option');

            if(manhNode || optionNode){
                // Xử lý khi click vào manh
                if(manhNode){
                    _this.currentIndex = Number(manhNode.dataset.index);
                    _this.loadCurrentManh();
                    _this.render();
                    audio.play();
                }
                // Xử lý khi click vào option
                if(optionNode && !optionNode.querySelector('.option-menu')){
                    const optionMenu = document.createElement('div');
                    optionMenu.classList.add('option-menu');
                    optionMenu.innerHTML = `
                        <ul>
                            <li class="delete-song">Xóa bài hát</li>
                        </ul>
                    `;
                    optionNode.appendChild(optionMenu);
        
                    // Xóa bài hát
                    optionMenu.querySelector('.delete-song').onclick = function() {
                        const songIndex = Number(optionNode.parentElement.dataset.index);
                        _this.manhs.splice(songIndex, 0);
                        _this.render();
                    };
                     // Xử lý sự kiện click và tạo hiệu ứng đổ bóng
                    const deleteBtn = optionMenu.querySelector('.delete-song');
                    deleteBtn.onclick = function() {
                        // Thêm lớp active để tạo hiệu ứng đổ bóng
                        deleteBtn.classList.add('active');
                        const songIndex = Number(optionNode.parentElement.dataset.index);
                        if (songIndex === _this.currentIndex) {
                            audio.pause(); // Dừng phát bài hát hiện tại
                            _this.nextManh(); // Chuyển sang bài hát tiếp theo
                            audio.play(); // Phát bài hát tiếp theo
                        }
                        // Xóa bài hát sau một khoảng thời gian ngắn để nhìn rõ hiệu ứng
                        setTimeout(function() {
                            const songIndex = Number(optionNode.parentElement.dataset.index);
                            _this.manhs.splice(songIndex, 1);
                            _this.render();
                        }, 300); // Thời gian đổ bóng là 0.3 giây

                        // Xóa lớp active sau khi đã click và bài hát bị xóa
                        setTimeout(function() {
                            deleteBtn.classList.remove('active');
                        }, 600); // Xóa lớp active sau 0.6 giây
                    }
                }
            }
        }
    },
    scrollToActiveManh: function(){
        setTimeout(() => {
            $('.manh.active').scrollIntoView({
                behavior:'smooth',
                block:'center',
            })
        }, 300)
    },
    loadCurrentManh: function(){
        heading.textContent = this.currentManh.name
        cdThumb.style.backgroundImage = `url('${this.currentManh.image}')`
        audio.src = this.currentManh.path
    },
    loadConfig:function(){
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },    
    nextManh: function(){
        this.currentIndex++
        if(this.currentIndex >= this.manhs.length){
            this.currentIndex = 0
        }
        this.loadCurrentManh()
    },
    prevManh: function(){
        this.currentIndex--
        if(this.currentIndex < 0){
            this.currentIndex = this.manhs.length - 1
        }
        this.loadCurrentManh()
    },
    playRandomManh: function(){
        let newIndex 
        do{
            newIndex = Math.floor(Math.random() * this.manhs.length)
        } while(newIndex === this.currentIndex)
            this.currentIndex = newIndex
        this.loadCurrentManh()
    },
    start: function() {
        // lấy thông tin bài hát từ local storage nếu có, nếu không thì mặc định
        this.loadConfig()
        // Định nghĩa các thuộc tính cho object
        this.defineProperties()
        // lắng nghe / xử lý các sự kiện (Dom events)
        this.handleEvents()
        // load thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentManh()
        // render lại playlist theo danh sách các bài hát
        this.render()
        
        //hiển thị trạng thái ban đầu của buttons repeat & random 
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
    }
}
app.start()

