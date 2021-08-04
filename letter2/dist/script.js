const { to, set, timeline, registerPlugin } = gsap

registerPlugin(ScrollTrigger)

const phoneElem = document.querySelector('#phone')
const timeElem = phoneElem.querySelector('.time')
const contentElem = phoneElem.querySelector('.content')
const articles = contentElem.querySelectorAll('article')

setTime(timeElem)
setInterval(() => setTime(timeElem), 5000)

articles.forEach((article, index) => {
    roll(contentElem, article, articles, index)
})

contentElem.addEventListener('scroll', e => {
    if(contentElem.scrollTop > 2550) {
        contentElem.scrollTop = 2550
    }
})

function roll(content, article, articles, index) {
    let animation = timeline().to(article, {
        '--clip': `${article.offsetHeight + 112}px`,
        '--compact-s': 1,
        '--compact-o': 1,
        duration: 1,
        delay: .05,
        ease: 'none'
    }).to(article, {
        '--border-radius-h': '180px',
        '--border-radius-v': '20px',
        repeat: 1,
        yoyo: true,
        duration: .15,
        onStart() {
            article.style.overflow = 'hidden'
        },
        onComplete() {
            article.style.overflow = 'visible'
        }
    }, 0).to(article, {
        '--article-r': getComputedStyle(article).getPropertyValue('--to-article-r'),
        '--article-x': getComputedStyle(article).getPropertyValue('--to-article-x'),
        '--article-y': getComputedStyle(article).getPropertyValue('--to-article-y'),
        duration: .15
    })

    if(index === 0) {
        animation.to(phoneElem, {
            '--headline-y': '-28px',
            duration: .3
        }, 1.05)
    }

    if(index === 1) {
        animation.to(articles[index - 1], {
            '--article-y': '-64px',
            '--article-r': '-2deg',
            duration: .15
        }, 1.08)
    }

    if(index === 2) {
        animation.to(articles[index - 2], {
            '--article-y': '-70px',
            duration: .15
        }, 1.14)
        animation.to(articles[index - 1], {
            '--article-y': '-42px',
            '--article-r': '-2deg',
            duration: .15
        }, 1.08)
    }

    if(index === articles.length - 1) {
        animation.to(phoneElem, {
            '--empty-mask': '0%',
            duration: .3
        })
    }

    return ScrollTrigger.create({
        animation,
        trigger: article,
        scroller: content,
        scrub: true,
        start: `top top+=184`,
        end: `bottom top+=112`
    })
}

function setTime(elem) {
    elem.textContent = new Date().toLocaleTimeString('en-US', {
        hour12: false,
        hour: 'numeric',
        minute: 'numeric',
    })
}

// Keep same progress after resize (Thanks to https://codepen.io/ZachSaucier)
const progressST = ScrollTrigger.create({
    scroller: contentElem,
    start: 0,
    end: 2550
})

let oldProgress

ScrollTrigger.addEventListener('refreshInit', () => {
    oldProgress = progressST.progress
    contentElem.scrollTop = 0
})

ScrollTrigger.addEventListener('refresh', () => {
    progressST.scroll(oldProgress * 2550)
})