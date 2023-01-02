const $timer = document.querySelector('#timer');
const $score = document.querySelector('#score');
const $life = document.querySelector('#life');
const $game = document.querySelector('#game');
const $start = document.querySelector('#start');
const $$cells = document.querySelectorAll('.cell');

const holes = [0, 0, 0, 0, 0, 0, 0, 0, 0]; //1차원 배열로
let started = false;
let score = 0;
let time;
let life;
let timerId;
let tickId;
$start.addEventListener('click', () => {
	if (started) return; // 이미 시작했으면 무시
	started = true;
	console.log('시작');
	life = 3;
	$life.textContent = life;
	time = 30;
	timerId = setInterval(() => {
		time = (time * 10 - 1) / 10; // time -= 0.1 로 해줄 수 도 있지만 컴퓨터는 소수점 계산시 문제가 있기에 이와같은 식으로 처리
		$timer.textContent = time;
		if (time === 0) {
			clearInterval(timerId);
			clearInterval(tickId);
			setTimeout(() => {
				alert(`게임 오버! 점수는 ${score}점`);
				score = 0;
				$score.textContent = score;
				life = 0;
				$life.textContent = life;
				started = false;
			}, 50);
		}
	}, 100);
	tickId = setInterval(tick, 1000);
	tick();
});

let gopherPercent = 0.3;
let bombPercent = 0.5;
//두더지, 폭탄이 1초간격으로 나왔다가 들어갔다 하게 하는 함수
function tick() {
	holes.forEach((hole, index) => {
		//holes 배열안에 값이 있으면 두더지가 보이는 상황이므로 이때는 타이머를 추가하지 않는다
		if (hole) return; //무언가 일어나고 있으면 return, 이 코드로 인해서 setTimeout이 2초에 한번 실행됨
		const randomValue = Math.random();
		if (randomValue < gopherPercent) {
			const $gopher = $$cells[index].querySelector('.gopher');
			//타이머가 등록되어 있으면 0이 아닌 값이 배열에 기록되고, 타이머가 없으면 0이 들어있으므로 각칸에 두더지가 있는지 없는지 구분할 수 있다
			holes[index] = setTimeout(() => {
				// 1초 뒤에 사라짐
				$gopher.classList.add('hidden');
				holes[index] = 0;
			}, 1000);
			$gopher.classList.remove('hidden');
		} else if (randomValue < bombPercent) {
			const $bombs = $$cells[index].querySelector('.bomb');
			holes[index] = setTimeout(() => {
				// 1초 뒤에 사라짐
				$bombs.classList.add('hidden');
				holes[index] = 0;
			}, 1000);
			$bombs.classList.remove('hidden');
		}
	});
}

$$cells.forEach(($cell, index) => {
	$cell.querySelector('.gopher').addEventListener('click', (event) => {
		if (!event.target.classList.contains('dead')) {
			score += 1;
			$score.textContent = score;
		}
		event.target.classList.add('dead');
		event.target.classList.add('hidden');
		//두더지가 올라오는 중에 때리면 즉시 내려가야 하기 때문에 기존 1초 뒤에 사라지는 타이머는 제거해야 함
		clearTimeout(holes[index]); //기존 내려가는 타이머 제거
		setTimeout(() => {
			holes[index] = 0;
			event.target.classList.remove('dead');
		}, 1000);
	});
	$cell.querySelector('.bomb').addEventListener('click', (event) => {
		if (!event.target.classList.contains('boom')) {
			life -= 1;
			$life.textContent = life;
		}
		event.target.classList.add('boom');
		event.target.classList.add('hidden');
		clearTimeout(holes[index]);
		setTimeout(() => {
			holes[index] = 0;
			event.target.classList.remove('boom');
		}, 1000);
		if (life === 0) {
			clearInterval(timerId);
			clearInterval(tickId);
			setTimeout(() => {
				alert(`게임 오버! 점수는 ${score}점`);
				score = 0;
				$score.textContent = score;
				life = 0;
				$life.textContent = life;
				started = false;
			}, 50);
		}
	});
});
