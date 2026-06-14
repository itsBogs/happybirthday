$(window).load(function(){
	$('.loading').fadeOut('fast');
	$('.container').fadeIn('fast');
});
$('document').ready(function(){
		var vw;
		function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
			var words = text.split(' ');
			var line = '';

			for (var n = 0; n < words.length; n++) {
				var testLine = line + words[n] + ' ';
				var metrics = ctx.measureText(testLine);

				if (metrics.width > maxWidth && n > 0) {
					ctx.fillText(line.trim(), x, y);
					line = words[n] + ' ';
					y += lineHeight;
				}
				else {
					line = testLine;
				}
			}

			ctx.fillText(line.trim(), x, y);
		}

		function drawCircleImage(ctx, img, x, y, size) {
			var scale = Math.max(size / img.width, size / img.height);
			var sourceWidth = size / scale;
			var sourceHeight = size / scale;
			var sourceX = (img.width - sourceWidth) / 2;
			var sourceY = (img.height - sourceHeight) / 2;

			ctx.save();
			ctx.beginPath();
			ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
			ctx.clip();
			ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, x, y, size, size);
			ctx.restore();
		}

		function drawCoverImage(ctx, img, x, y, width, height) {
			var scale = Math.max(width / img.width, height / img.height);
			var sourceWidth = width / scale;
			var sourceHeight = height / scale;
			var sourceX = (img.width - sourceWidth) / 2;
			var sourceY = (img.height - sourceHeight) / 2;

			ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
		}

		function fillRoundedRect(ctx, x, y, width, height, radius) {
			ctx.beginPath();
			ctx.moveTo(x + radius, y);
			ctx.lineTo(x + width - radius, y);
			ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
			ctx.lineTo(x + width, y + height - radius);
			ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
			ctx.lineTo(x + radius, y + height);
			ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
			ctx.lineTo(x, y + radius);
			ctx.quadraticCurveTo(x, y, x + radius, y);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();
		}

		function drawStoryCard(img) {
		// Create canvas
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		var width = 1080;
		var height = 1920;

		canvas.width = width;
		canvas.height = height;

		// Soft pastel background gradient
		var bgGrad = ctx.createLinearGradient(0, 0, 0, height);
		bgGrad.addColorStop(0, '#fff9f0');
		bgGrad.addColorStop(1, '#ffefd5');
		ctx.fillStyle = bgGrad;
		ctx.fillRect(0, 0, width, height);

		// Outer gold border
		ctx.strokeStyle = '#b08a58';
		ctx.lineWidth = 8;
		ctx.strokeRect(40, 40, width - 80, height - 80);

		// Inner subtle border
		ctx.strokeStyle = '#d8c7aa';
		ctx.lineWidth = 2;
		ctx.strokeRect(56, 56, width - 112, height - 112);

		// Photo area with white frame
		ctx.fillStyle = '#ffffff';
		ctx.fillRect(76, 76, width - 152, 1300);

		// Draw the photo (20px white padding)
		var photoX = 96, photoY = 96, photoW = width - 192, photoH = 1260;
		ctx.fillStyle = '#ffffff';
		ctx.fillRect(photoX - 12, photoY - 12, photoW + 24, photoH + 24);
		drawCoverImage(ctx, img, photoX, photoY, photoW, photoH);

		// Add subtle confetti circles for a festive feel
		var confettiColors = ['#ff8a80', '#ffab40', '#ffd740', '#c6ff00', '#69f0ae'];
		for (var i = 0; i < 120; i++) {
			var radius = Math.random() * 5 + 3;
			var cx = Math.random() * (width - 120) + 60;
			var cy = Math.random() * (height - 400) + 150;
			ctx.beginPath();
			ctx.arc(cx, cy, radius, 0, Math.PI * 2);
			ctx.fillStyle = confettiColors[Math.floor(Math.random() * confettiColors.length)];
			ctx.fill();
		}

		// Gold divider line below the photo
		ctx.fillStyle = '#b08a58';
		ctx.fillRect(width / 2 - 80, 1380, 160, 5);

		// "Happy Birthday" text
		ctx.textAlign = 'center';
		ctx.fillStyle = '#3d2f20';
		ctx.font = '400 108px Georgia, Times New Roman, serif';
		ctx.fillText('Happy Birthday', width / 2, 1520);

		// Name text
		ctx.fillStyle = '#231f20';
		ctx.font = '700 152px Arial, sans-serif';
		ctx.fillText('Martina', width / 2, 1700);

		// Footer banner with "greet by your friends"
		var footerHeight = 100;
		ctx.fillStyle = '#b08a58';
		ctx.fillRect(0, height - footerHeight, width, footerHeight);
		ctx.fillStyle = '#ffffff';
		ctx.font = '500 36px Signika, Arial, sans-serif';
		ctx.textAlign = 'center';
		ctx.fillText('greet by your friends', width / 2, height - footerHeight / 2 + 12);

		return canvas;
	}

		function showFinalCard() {
			$('.message').fadeOut('slow', function(){
				$('.final-card-section').fadeIn('slow');
			});
		}

		$('#view_card').click(function(){
			// Hide the button itself
			$(this).hide();
			// Open the full-screen card overlay
			$('#card-overlay').addClass('card-overlay-open');
			$('.card-overlay-inner').css('opacity', 0).delay(100).animate({ opacity: 1 }, 600);
			// Scroll overlay to top
			$('#card-overlay').scrollTop(0);
		});

		$('#card-overlay-close').click(function(){
			$('#card-overlay').removeClass('card-overlay-open');
			$('#view_card').show();
		});

		$(document).on('click', '#overlay_save_card', function(){
			var button = $(this);
			var img = new Image();

			button.prop('disabled', true).text('Preparing...');
			img.onload = function() {
				var canvas = drawStoryCard(img);
				var link = document.createElement('a');
				link.download = 'happy-birthday-martina-myday.png';
				link.href = canvas.toDataURL('image/png');
				link.click();
				button.prop('disabled', false).text('Save for My Day');
			};
			img.onerror = function() {
				img.onerror = null;
				img.src = 'mar1.jpg';
			};
			img.src = 'lastpic.jpg';
		});

		function arrangeBirthdayBalloons(speed) {
			var width = $(window).width();
			var spacing = 100;
			var balloonWidth = 100;
			var top = 240;

			if (width <= 480) {
				spacing = 45;
				balloonWidth = 58;
				top = 170;
			}
			else if (width <= 767) {
				spacing = 62;
				balloonWidth = 58;
				top = 200;
			}

			vw = (width - balloonWidth) / 2;
			$('#b11').animate({top:top, left: vw-(spacing*3)},speed);
			$('#b22').animate({top:top, left: vw-(spacing*2)},speed);
			$('#b33').animate({top:top, left: vw-spacing},speed);
			$('#b44').animate({top:top, left: vw},speed);
			$('#b55').animate({top:top, left: vw+spacing},speed);
			$('#b66').animate({top:top, left: vw+(spacing*2)},speed);
			$('#b77').animate({top:top, left: vw+(spacing*3)},speed);
		}

		$(window).resize(function(){
			$('#b1,#b2,#b3,#b4,#b5,#b6,#b7,#b11,#b22,#b33,#b44,#b55,#b66,#b77').stop();
			arrangeBirthdayBalloons(500);
		});

	$('#turn_on').click(function(){
		$('#bulb_yellow').addClass('bulb-glow-yellow');
		$('#bulb_red').addClass('bulb-glow-red');
		$('#bulb_blue').addClass('bulb-glow-blue');
		$('#bulb_green').addClass('bulb-glow-green');
		$('#bulb_pink').addClass('bulb-glow-pink');
		$('#bulb_orange').addClass('bulb-glow-orange');
		$('body').addClass('peach');
		$(this).fadeOut('slow').delay(5000).promise().done(function(){
			$('.friend-gallery').fadeIn('slow', function(){
				$('.friend-photo-card').addClass('photo-pop');
			});
			setTimeout(function(){
				$('#play').fadeIn('slow');
			}, 2500);
		});
	});
	$('#play').click(function(){
		var audio = $('.song')[0];
        audio.play();
		$('.friend-gallery').fadeOut('slow');
		$('.music-groove-gallery').fadeIn('slow', function(){
			$(this).addClass('groove-start');
		});
        $('#bulb_yellow').addClass('bulb-glow-yellow-after');
		$('#bulb_red').addClass('bulb-glow-red-after');
		$('#bulb_blue').addClass('bulb-glow-blue-after');
		$('#bulb_green').addClass('bulb-glow-green-after');
		$('#bulb_pink').addClass('bulb-glow-pink-after');
		$('#bulb_orange').addClass('bulb-glow-orange-after');
		$('body').css('backgroud-color','#FFF');
		$('body').addClass('peach-after');
		$(this).fadeOut('slow').delay(10000).promise().done(function(){
			$('.music-groove-gallery').fadeOut('slow', function(){
				$(this).removeClass('groove-start');
				$('#bannar_coming').fadeIn('slow');
			});
		});
	});

	$('#bannar_coming').click(function(){
		$('.bannar').addClass('bannar-come');
		$(this).fadeOut('slow').delay(6000).promise().done(function(){
			$('#balloons_flying').fadeIn('slow');
		});
	});

	function loopOne() {
		var randleft = 1000*Math.random();
		var randtop = 500*Math.random();
		$('#b1').animate({left:randleft,bottom:randtop},10000,function(){
			loopOne();
		});
	}
	function loopTwo() {
		var randleft = 1000*Math.random();
		var randtop = 500*Math.random();
		$('#b2').animate({left:randleft,bottom:randtop},10000,function(){
			loopTwo();
		});
	}
	function loopThree() {
		var randleft = 1000*Math.random();
		var randtop = 500*Math.random();
		$('#b3').animate({left:randleft,bottom:randtop},10000,function(){
			loopThree();
		});
	}
	function loopFour() {
		var randleft = 1000*Math.random();
		var randtop = 500*Math.random();
		$('#b4').animate({left:randleft,bottom:randtop},10000,function(){
			loopFour();
		});
	}
	function loopFive() {
		var randleft = 1000*Math.random();
		var randtop = 500*Math.random();
		$('#b5').animate({left:randleft,bottom:randtop},10000,function(){
			loopFive();
		});
	}

	function loopSix() {
		var randleft = 1000*Math.random();
		var randtop = 500*Math.random();
		$('#b6').animate({left:randleft,bottom:randtop},10000,function(){
			loopSix();
		});
	}
	function loopSeven() {
		var randleft = 1000*Math.random();
		var randtop = 500*Math.random();
		$('#b7').animate({left:randleft,bottom:randtop},10000,function(){
			loopSeven();
		});
	}

	$('#balloons_flying').click(function(){
		$('.balloon-border').animate({top:-500},8000);
		$('#b1,#b4,#b5,#b7').addClass('balloons-rotate-behaviour-one');
		$('#b2,#b3,#b6').addClass('balloons-rotate-behaviour-two');
		// $('#b3').addClass('balloons-rotate-behaviour-two');
		// $('#b4').addClass('balloons-rotate-behaviour-one');
		// $('#b5').addClass('balloons-rotate-behaviour-one');
		// $('#b6').addClass('balloons-rotate-behaviour-two');
		// $('#b7').addClass('balloons-rotate-behaviour-one');
		loopOne();
		loopTwo();
		loopThree();
		loopFour();
		loopFive();
		loopSix();
		loopSeven();
		
		$(this).fadeOut('slow').delay(5000).promise().done(function(){
			$('#cake_fadein').fadeIn('slow');
		});
	});	

	$('#cake_fadein').click(function(){
		$('.cake').fadeIn('slow');
		$(this).fadeOut('slow').delay(3000).promise().done(function(){
			$('#light_candle').fadeIn('slow');
		});
	});

	$('#light_candle').click(function(){
		$('.fuego').fadeIn('slow');
		$(this).fadeOut('slow').promise().done(function(){
			$('#wish_message').fadeIn('slow');
		});
	});

		
	$('#wish_message').click(function(){
		$('#b1,#b2,#b3,#b4,#b5,#b6,#b7').stop();
		$('#b1').attr('id','b11');
		$('#b2').attr('id','b22')
		$('#b3').attr('id','b33')
		$('#b4').attr('id','b44')
		$('#b5').attr('id','b55')
		$('#b6').attr('id','b66')
		$('#b7').attr('id','b77')
		arrangeBirthdayBalloons(500);
		$('.balloons').css('opacity','0.9');
		$('.balloons h2').fadeIn(3000);
		$('.birthday-circle-gallery').fadeIn('slow', function(){
			$('.birthday-circles').addClass('circle-pop');
		});
		$(this).fadeOut('slow').delay(3000).promise().done(function(){
			$('#story').fadeIn('slow');
		});
	});
	
	$('#story').click(function(){
		$(this).fadeOut('slow');
		$('body').addClass('story-open');
		$('.cake-cover').addClass('story-cake-away');
		$('.birthday-circle-gallery').fadeOut('slow');
		$('.birthday-main-photo').fadeIn('slow', function(){
			$('.main-birthday-card').addClass('main-photo-pop');
		});
		$('.cake').fadeOut('fast').promise().done(function(){
			$('.message').fadeIn('slow');
		});
		
		var i;

		function msgLoop (i) {
			var totalMessages = $('.message p').length;

			$(".message p:nth-child("+i+")").fadeOut('slow').delay(800).promise().done(function(){
				i=i+1;
				$(".message p:nth-child("+i+")").fadeIn('slow').delay(1000).promise().done(function(){
					if(i >= totalMessages){
						$(".message p:nth-child("+i+")").delay(1200).fadeOut('slow').promise().done(function () {
							showFinalCard();
						});
					}
					else{
						msgLoop(i);
					}
				});
			});
			// body...
		}
		
		msgLoop(0);
		
	});
});




//alert('hello');
