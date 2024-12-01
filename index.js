//SET UP//
const gift_ = document.getElementById('gift')
const unlock_ = document.getElementById('unlock')
const get_ = document.getElementById('get')
const warningText_ = document.getElementById('text')
const answearCont_ = document.getElementById('ansCont')
const yes_ = document.getElementById('yes')
const no_ = document.getElementById('no')
const text_ = document.getElementById('textLabel')
const text_vn = document.getElementById('textLabel_vn')
const vs_change = document.getElementById('visualChange')
const g_plc = document.getElementById('g-plc')
const e_t1 = document.getElementById('t1')
const e_t2 = document.getElementById('t2')

var sfx = {
	'hover': new Audio('sfx/hover.mp3'),
	'click': new Audio('sfx/click.mp3'),
	'failed': new Audio('sfx/failed-to-get-money.mp3'),
	'load': new Audio('sfx/loading.mp3'),
	'uh': new Audio('sfx/uh.mp3'),
	'1': new Audio('sfx/fGift.mp3'),
	'2': new Audio('sfx/sGift.mp3'),
	'3': new Audio('sfx/tGift.mp3'),
}

sfx['click'].volume = 0.5

const g1 = document.getElementById('fGift')
const g2 = document.getElementById('sGift')
const g3 = document.getElementById('tGift')

var dialogs = {
	'ask_': 'Get the gift!',
	'question_': 'Do you like this?',
	'decline_1': '..okay? howabout this?', // next gift
	'decline_2': 'ayyzaa.. this one?', // next gift
	'decline_3': 'aight aight, i guess this one you love it', // next dialog
	'decline_4': 'wtf?! fucking dumbass', // end
	'accept_': "?",
	'justkidding_': "nah 😁", // end
	'noneAnswear_': "well..candy",

	// VN VERSION
	'ask_vn': 'nhận quà đi',
	'question_vn': 'thích cài này ko?',
	'decline_1vn': 'v còn cái này???',
	'decline_2vn': '... vậy cái này?',
	'decline_3vn': 'okay.. chắc cái này đc..',
	'decline_4vn': 'wtf?? ngáo đá ha',
	'accept_vn': 'nuh uh, take my candy blud',
	'justkidding_vn': 'tiền đâu mà cho 😁',
	'noneAnswear_': 'uh, v lấy kẹo'
}

let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

//BACKGROUND

class Buble{
	constructor(){
		this.coor = []
		this.xPos = []
		this.yPos = []
		this.size = []
		this.coor_child = []
		this.curColor = []
		this.RUN = true
	}

	updateNewValue(){
		for(let i = 0; i < this.coor.length; i++){
			var y = Math.floor(Math.random() * (85 - 1 + 1)) + 2
			var x = Math.floor(Math.random() * (95 - 1 + 1)) + 1
			var size = Math.floor(Math.random() * (35 - 20 + 1)) + 20
			this.xPos.push(x)
			this.yPos.push(y)
			this.size.push(size)
		}
	}

	updateCoordinate(){
		for(let i = 1; i<=2; i++){
			const bbBox = document.querySelector(`.bublebox${i}`)
			for(let k = 0; k < 10; k++){
				const bub = bbBox.querySelector(`#bb${k+1}-cc`)
				const bub_child = bub.querySelector(`.bb${k+1}`)
				this.coor_child.push(bub_child)
				this.coor.push(bub)
				this.curColor.push(bub.style.backgroundColor)
			}
		}
	}

	popVisual(){
		for(let i = 0; i < this.coor_child.length; i++){
			var index = this.coor_child[i]
			var x = this.xPos[i]
			var y = this.yPos[i]
			var size = Math.floor(Math.random() * (25 - 15 + 1)) + 10

			index.style.transition = 'all 1s'
			index.style.width = `${size + 20}px`
			index.style.height = `${size + 20}px`
			index.style.opacity = '0'
		}
		setTimeout(()=>{
			this.resetVisual()
		}, 1500)
	}

	runVisual(){
		this.updateNewValue()
		for(let v = 0; v < this.coor.length; v++){
			var index = this.coor[v]
			var cIndex = this.coor_child[v]
			var x = this.xPos[v]
			var y = this.yPos[v]
			var size = this.size[v]

			index.style.transitionProperty = 'top'

			index.style.left = `${x}%`
			index.style.top = `${y}%`
			cIndex.style.width = `${size}px`
			cIndex.style.height = `${size}px`
		}
	}

	resetVisual(){
		this.xPos.length = 0
		this.yPos.length = 0
		this.size.length = 0
		for(let v = 0; v < this.coor.length; v++){
			var index = this.coor_child[v]
			var pIndex = this.coor[v]
			var color = this.curColor[v]
			var y = '100'
			var size = '10'

			pIndex.style.transitionProperty = 'none'

			for(let k = 1; k <= 10; k++){
				var x = `${k}0`
				index.style.opacity = '1'
				index.style.backgroundColor = color
				pIndex.style.left = `${x}%`
				pIndex.style.top = `${y}%`
				index.style.width = `${size}px`
				index.style.height = `${size}px`
			}
		}
	}
}

//OTHER
var opened = false
var steps = 0
var onclick_debounce = false
var accepted = false
var gift_c = ''
var isG1 = true
var isG2 = false
var isG3 = false
var BB = new Buble()

const changeDialog = (required, language, item)=>{
	item.style.opacity = '0'
	setTimeout(()=>{
		item.innerHTML = `${dialogs[`${required}${language}`]}`
	}, 250)
	setTimeout(()=>{
		item.style.opacity = '1'
	}, 500)
}

const changeItem_visual = ()=>{
	vs_change.style.width = '100%'
	vs_change.style.rotate = '360deg'
	setTimeout(()=>{
		vs_change.style.width = '0'
		vs_change.style.rotate = '0deg'
	}, 2000)
}

const show_Gift = (numberOfGift)=>{
	setTimeout(()=>{
		try{
			sfx[String(numberOfGift)].play()
		}catch(er){
			console.log('Unavailble sfx')
		}
	}, 2000)
	if(numberOfGift == 1){
		// the pine tree
		g1.style.opacity = '1'

		isG1 = true
		isG2 = false
		isG3 = false
	}
	if(numberOfGift == 2){
		// turkey chicken
		g1.style.opacity = '0'
		g2.style.opacity = '1'

		isG1 = false
		isG2 = true
		isG3 = false
	}
	if(numberOfGift == 3){
		// money
		g2.style.opacity = '0'
		g3.style.opacity = '1'

		isG1 = false
		isG2 = false
		isG3 = true
	}
}

const submit = (step, ans)=>{
	if(!onclick_debounce){
		onclick_debounce = true
		changeDialog(ans, '', text_)// EN
		changeDialog(ans, 'vn', text_vn)
		sfx['click'].play()
		setTimeout(()=>{
			onclick_debounce = false
		}, 2000)
	}
}

const unlocked_ = ()=>{
	if(!opened){
		steps++
		opened = true
		unlock_.style.opacity = '1'
		unlock_.style.rotate = '0deg'

		warningText_.style.left = '50%'

		sfx['click'].play()

		for(let i = 1; i<5; i++){
			var vs = document.getElementById(`vs${i}`)
			if(i == 1){
				vs.style.width = '200px'
				vs.style.height = '200px'
				vs.style.rotate = `${360+180}deg`
				vs.style.opacity = '1'
			}else if(i == 2){
				vs.style.width = '175px'
				vs.style.height = '175px'
				vs.style.rotate = '-135deg'
				vs.style.opacity = '1'
			}else if(i == 3){
				vs.style.width = '175px'
				vs.style.height = '175px'
				vs.style.opacity = '1'
				vs.style.rotate = `-${360+180}deg`
			}else if(i == 4){
				vs.style.opacity = '1'
				vs.style.width = '150px'
				vs.style.height = '150px'
				vs.style.rotate = '135deg'
			}
		}

		setTimeout(()=>{
			warningText_.style.top = '125%'
			unlock_.style.transition = 'all 2s'
			unlock_.style.opacity = '0'
			if(isMobile){
				unlock_.style.width = '100vw'
			}else{
				unlock_.style.width = '600px'
			}
			for(let i = 1; i<5; i++){
				var vs = document.getElementById(`vs${i}`)
				if(i == 1){
					vs.style.width = '300px'
					vs.style.height = '300px'
					vs.style.rotate = `0deg`
					vs.style.opacity = '1'
				}else if(i == 2){
					vs.style.width = '275px'
					vs.style.height = '275px'
					vs.style.rotate = `-${360+180+45}deg`
					vs.style.opacity = '1'
				}else if(i == 3){
					vs.style.width = '0px'
					vs.style.height = '0px'
					vs.style.opacity = '0'
					vs.style.rotate = `-360deg`
				}else if(i == 4){
					vs.style.opacity = '0'
					vs.style.width = '0px'
					vs.style.height = '0px'
					vs.style.rotate = '360deg'
				}
			}

			setTimeout(()=>{
				for(let i = 1; i<5; i++){
					var vs = document.getElementById(`vs${i}`)
					if(i == 1){
						vs.style.width = '50px'
						vs.style.height = '50px'
						vs.style.rotate = `-360deg`
						vs.style.opacity = '0'
					}else if(i == 2){
						vs.style.width = '45px'
						vs.style.height = '45px'
						vs.style.rotate = `-${360+180+45+360+45}deg`
						vs.style.opacity = '0'
					}
				}
			}, 2000)
		}, 2000)

		get_.style.transform = 'translateY(250px)'
		setTimeout(()=>{
			sfx['load'].play()
			gift_.style.opacity = '0'
			changeItem_visual()
			setTimeout(()=>{
				show_Gift(steps)
			}, 1000)
			setTimeout(()=>{
				answearCont_.style.top = '50%'
				changeDialog('question_', '', text_)
				changeDialog('question_', 'vn', text_vn)
			}, 2000)
		}, 2500)
	}
}

const endScreen = ()=>{
	document.getElementById('btn-container').style.zIndex = '14'
	setTimeout(()=>{
		for(let i = 1; i<7; i++){
			const vs_s = document.getElementById(`vs-g${i}`)
			vs_s.style.height = '100vh'
		}
		sfx['1'].play()
		setTimeout(()=>{
			g_plc.style.opacity = '1'
		}, 1250)
		setTimeout(()=>{
			setTimeout(()=>{sfx['load'].play()}, 1250)
			setTimeout(()=>{
				if(isMobile){
					g_plc.style.width = '375px'
				}else{
					g_plc.style.width = '400px'
				}
			}, 750)
			e_t1.childNodes[0].style.left = '0px'
			e_t2.childNodes[0].style.right = '0px'
		}, 2500)
	}, 4000)
}

BB.updateCoordinate()
run()

setInterval(run, 1650+1650);

function run(){
	if(BB.RUN){
		BB.runVisual()
		setTimeout(()=>{
			BB.popVisual()
		},1650)
	}
}


get_.addEventListener('mouseover', function(){if(!isMobile){sfx['hover'].play()}})
no_.addEventListener('mouseover', function(){if(!isMobile){sfx['hover'].play()}})
yes_.addEventListener('mouseover', function(){if(!isMobile){sfx['hover'].play()}})

get_.addEventListener('click', unlocked_)

yes_.addEventListener('click', ()=>{
	if(!accepted && !onclick_debounce){
		if(isG1){
			gift_c = 'gifts/f.png'
		}else if(isG2){
			gift_c = 'gifts/s.png'
		}else if(isG3){
			gift_c = 'gifts/t.png'
		}

		g_plc.src = gift_c

		if(steps >= 3){
			submit(steps, 'justkidding_')
			sfx['failed'].play()
		}else{
			submit(steps, 'accept_')
		}
		accepted = true
		BB.RUN = false
		endScreen()
	}
})

no_.addEventListener('click', ()=>{
	if(steps >= 3){
		sfx['uh'].play()
		gift_c = 'gifts/t.png'
		g_plc.src = gift_c
		endScreen()
		BB.RUN = false
	}
	if(!accepted && !onclick_debounce){
		steps++
		submit(steps, `decline_${steps}`)
		if(steps<=3){
			changeItem_visual()
		}else if(steps >= 3){
			accepted = true
		}
		setTimeout(()=>{
			show_Gift(steps)
		}, 1000)
	}
})