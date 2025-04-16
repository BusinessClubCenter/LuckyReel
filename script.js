document.addEventListener('DOMContentLoaded', () => {
  const reel = document.querySelector('.reel');
  const reelContainer = document.querySelector('.reel-container');
  const startButton = document.querySelector('.start-btn');

  const totalNumbers = 1500;
  const loopCount = 3;
  const visibleCount = 3;
  const centerOffset = Math.floor(visibleCount / 2);

  function getCardWrapperHeight() {
    const temp = document.createElement('div');
    temp.className = 'card-wrapper';
    temp.style.visibility = 'hidden';

    const card = document.createElement('div');
    card.className = 'card';
    card.textContent = '0000';
    temp.appendChild(card);
    reel.appendChild(temp);

    const height = temp.offsetHeight;
    reel.removeChild(temp);
    return height;
  }

  const wrapperHeight = getCardWrapperHeight();

  for (let l = 0; l < loopCount; l++) {
    for (let i = 1; i <= totalNumbers; i++) {
      const wrapper = document.createElement('div');
      wrapper.className = 'card-wrapper';

      const card = document.createElement('div');
      card.className = 'card';
      card.textContent = i;

      wrapper.appendChild(card);
      reel.appendChild(wrapper);
    }
  }

  reelContainer.style.height = wrapperHeight * visibleCount + 'px';

  let currentIndex = Math.floor(Math.random() * totalNumbers);
  reelContainer.scrollTop = (currentIndex + totalNumbers) * wrapperHeight;

  let spinning = false;

  function spinTo(index) {
    const startScroll = reelContainer.scrollTop;
    const endScroll = (index + totalNumbers) * wrapperHeight;
    const distance = endScroll - startScroll;
    const duration = 7000;
    const startTime = performance.now();

    // Удалить все .highlight перед стартом
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(card => card.classList.remove('highlight'));

    function animate(time) {
      const elapsed = time - startTime;
      const t = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      reelContainer.scrollTop = startScroll + distance * ease;

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        currentIndex = index % totalNumbers;
        reelContainer.scrollTop = (currentIndex + totalNumbers) * wrapperHeight;
        spinning = false;

        // Подсветка центральной карточки
        const wrappers = document.querySelectorAll('.card-wrapper');
        const centerIndex = currentIndex + totalNumbers * 1 + centerOffset;
        const centerWrapper = wrappers[centerIndex];
        if (centerWrapper) {
          const card = centerWrapper.querySelector('.card');
          if (card) {
            card.classList.add('highlight');
          }
        }
      }
    }

    requestAnimationFrame(animate);
  }

  startButton.addEventListener('click', () => {
    if (spinning) return;
    spinning = true;

    const target = Math.floor(Math.random() * totalNumbers);
    spinTo(target);
  });
});
