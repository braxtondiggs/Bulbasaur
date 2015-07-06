<!DOCTYPE html>
	<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
	<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
	<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
	<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<title>Online Portfolio &raquo; Braxton Diggs</title>
		<meta name="description" content="" /
		<link rel="icon" href="<?= base_url('favicon.ico') ?>" type="image/x-icon">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="stylesheet" href="<?= base_url('css/vendor/bootstrap.min.css') ?>">
		<link rel="stylesheet" href="<?= base_url('css/vendor/normalize.css') ?>">
		<link rel="stylesheet" href="<?= base_url('css/style.css') ?>">
		<script src="<?= base_url('js/vendor/modernizr-2.6.2-respond-1.1.0.min.js')?>"></script> 
	</head>
	<body>
		<!--[if lt IE 8]>
			<p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
		<![endif]-->
		<div class="braxton">               
			<header role="banner" class="navbar navbar-inverse bs-docs-nav css-animate menu navbar-fixed-top">
			    <div class="navbar-header">
			      <button data-target=".bs-navbar-collapse" data-toggle="collapse" type="button" class="navbar-toggle">
				<span class="sr-only">Toggle navigation</span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
			      </button>
			    </div>
			    <nav role="navigation" class="collapse navbar-collapse bs-navbar-collapse">
			      <div class="menu-holder" align="center">
				    <ul class="nav navbar-nav navigation">
				<li class="scroll_animated_item" data-slide="1">
				  <a href="#slide1" class="scroll">HOME</a>
				</li>
				<li class="scroll_animated_item" data-slide="2">
				  <a href="#slide2" class="scroll">ABOUT</a>
				</li>
				<li class="scroll_animated_item" data-slide="3">
				  <a href="#work" class="scroll">THE WORK</a>
				</li>
				<li class="scroll_animated_item" data-slide="4">
				  <a href="#slide4" class="scroll">CONTACT</a>
				</li>
			      </ul>
			      
			      </div>
			      
			    </nav>
			</header>
			<section class="slide" id="slide1" data-slide="1" data-stellar-background-ratio="0.5">
				<div class="row margin0">
					<div class="home-img">
						<div class="logo-holder">
							<div class="logo top" align="center">
								<span class="logo-blue">B</span>
								<div class="name">Braxton</div>
							</div>
						</div>
					
						<h1 class="fade-in">Front end developer.</h1>        
						<h2 class="bottomTotop"><span class="blue">Think creatively.</span> Create continuously.</h2>      
					</div>
				</div>
			</section>
			<section class="slide" id="slide2" data-slide="2" data-stellar-background-ratio="0.5">
				<div class="hello-box">
					  <div class="square">
						<div class="pic"></div>
					  </div>
					<h1 class="second hello">Hello!<br> I'm Braxton Diggs.</h1>        
					<h3>I'm a <?= (date('n') < 7)?((date('Y')-1988) -1):(date('Y')-1988);?> year old Web/Graphic Designer based in Silver Spring, Maryland, specializing in User Interface/Experience and Development. I build clean, appealing, and functional interfaces which comply with the latest and greatest web standards.</h3>
				</div>
   
				<section id="experience" class="scroll-section experience block">
					<div class="container" style="overflow: hidden;">
						<h1 class="exp">Experience</h1>
						<ul class="timeline">
							<li>
								<ul>
									<li class="timeline-item highlight">
										<!--Images require class="timeline-item-photo", to float right add right class="timeline-item-photo right"-->
										<span class="exp-logo-holder"><img alt="" class="timeline-item-photo img-bg-primary" src="<?= base_url('images/logos/tahzoo.png')?>" style="margin:31px 0 0 9px"></span>	  
				
										<h4 class="timeline-item-date">Front-End Developer</h4>
										<h5 class="timeline-item-role">Tahzoo (Washington, D.C.)</h5>
										<h6>September 2014 <span class="grey"> &#8211; Present <!--(<?// floor($months/12) ?>0 years <?// $months ?>10 months)--></span></h6>
							
									</li>
									<li class="timeline-item right">
										<!--Images require class="timeline-item-photo", to float right add right class="timeline-item-photo right"-->
										<span class="exp-logo-holder"><img alt="" class="timeline-item-photo img-bg-primary" src="<?= base_url('images/logos/paste_group.png')?>" style="margin:31px 0 0 9px"></span>	  
				
										<h4 class="timeline-item-date">Senior Web Developer</h4>
										<h5 class="timeline-item-role">PasteGroup LLC (Washington, D.C.)</h5>
										<h6>June 2013 <span class="grey"> &#8211; September 2014 (1 Year)</span></h6>
							
									</li>
									<li class="timeline-item">
										<!--Images require class="timeline-item-photo", to float right add right class="timeline-item-photo right"-->
										<span class="exp-logo-holder float-right"><img src="<?= base_url('images/logos/navigation_arts.png')?>" style="margin:37px 0 0 15px" alt=""></span>
										<h4 class="timeline-item-date">CQ5 Developer</h4>
										<h5 class="timeline-item-role">Navigation Arts (McLean, VA)</h5>
										<h6>July 2010 <span class="grey"> &#8211; July 2013 (3 Years)</span></h6>
									</li>
				
									<li class="timeline-item right">
										<!--Images require class="timeline-item-photo", to float right add right class="timeline-item-photo right"-->
										<span class="exp-logo-holder"><img style="margin:40px 0 0 11px" alt="timeline photo" src="<?= base_url('images/logos/GDI.png')?>"></span>
										<h4 class="timeline-item-date">PHP Developer</h4>
										<h5 class="timeline-item-role">GDI (Baltimore, MD)</h5>
										<h6>February 2009<span class="grey"> &#8211; February 2010 (1 Year)</span></h6>
									</li>
						
									<li class="timeline-item">
										<!--Images require class="timeline-item-photo", to float right add right class="timeline-item-photo right"-->
										<span class="exp-logo-holder float-right"><img style="margin:33px 0 0 14px" alt="timeline photo" class="timeline-item-photo" src="<?= base_url('images/logos/liberty_tax_service.png')?>"></span>
										<h4 class="timeline-item-date">.NET Developer</h4>
										<h5 class="timeline-item-role">Liberty Tax Service (Virginia Beach, VA)</h5>
										<h6>May 2008<span class="grey"> &#8211; May 2010 (2 Years)</span></h6>
									</li>
								
								</ul>
							</li>
						</ul>
						<div align="center" class="download-cv"><a class="btn btn-large btn-primary btn-square" href="resume/braxton-resume.pdf" target="_blank"><i class="icon-download-alt"></i> Download Resume</a></div>
					</div>
				</section>   
   
			</section>
			<section class="scroll-section work" id="work">
				<div class="container padding0">
					<h1 class="works">Working Projects</h1>
					<!--Featured item-->
					<ul id="work-list">
						<?php $i=0;foreach ($projects as $project) {
							if ((integer)$project->status >= 0) {
								switch ((integer)$project->status) {
									case 1:
										$color = "green";
										$status = "In-Progress";
									break;
									case 2:
										$color = "yellow";
										$status = "Paused Indefinitely";
									break;
									case 3:
										$color = "red";
										$status = "Retired";
									break;
									default:
										$color = "N/A";
										$status = "N/A";
									break;
								}
								?>
						<li id="list-item<?= $project->id?>" class="<?=($i%2==0)?"":"right"?>">
							<div class="col-md-5-custom">
								<a href="<?= $project->url ?>">
									<img src="<?= $project->image?>" alt="" />
									<span class="click">Click To View</span>
								</a>
							</div>
							<div class="list-content col-md-7-custom">
								<h4><?= $project->title ?> &#8211; <span class="<?= $color ?>">(<?= $status ?>)</span></h4>
								<?= $project->text ?>
								<span class="work-date">Last Update: <?= date('M j, Y', strtotime($project->start_date)) ?></span>
							</div>
								
						</li>
						<?php $i++;}} ?>
					</ul>
				</div>
			</section>
			<section class="slide scroll-section work block" id="slide4" data-slide="4" data-stellar-background-ratio="0.5">
				<div id="map-container">
					<img src="images/braxton-contact.jpg" alt="" />
				</div>
				<div id="contact-container">
					<div class="contact-split" style="margin:160px 50px 0 100px;width:300px;display:inline-block;">
						<h1 class="thanks">Contact Me</h1>
						<form id="contact-form" role="form">
							<div class="form-group">
								<label for="name">Name:</label>
								<input type="text" class="form-control" id="name" name="name" tabindex="1" placeholder="Your Name">
							</div>
							<div class="form-group">
								<label for="email">Email:</label>
								<input type="email" class="form-control" id="email" name="email" tabindex="2" placeholder="name@email.com">
							</div>
							<div class="form-group">
								<label for="message">Message:</label>
								<textarea class="form-control" id="message" name="message" rows="6" tabindex="3" placeholder="Add a brief message..."></textarea>
							</div>
							<button type="submit" class="btn btn-default pull-right">Submit</button>
						</form>
						<div id="confirmation">
							<h4>Message successfully sent.</h4>
							<p>I will responded to your email as soon as possible.</p>
						</div>
					</div>
					<div class="split split-right" style="padding-right:25px;">
						<h3>Thanks for Visiting</h3>
						<p class="grey">I would love to hear what you think. Drop me a line, whether it is praise or criticism, a question, a suggestion, or just a hello. I am currently available for new projects, so if you have a request go ahead and send it!</p>
						<h3 style="margin-top:75px;">Freelance & Other Contact</h3>
						<p class="grey">If you'd like to contact me directly, please email me at <a href="mailto:braxtondiggs@gmail.com">braxtondiggs@gmail.com</a>. I can provide phone number and more information if the situation warrants.</p>
						
						<div class="logo-holder logo-holder2">
							<div class="logo" align="center">
								<span class="logo-blue">B</span>
							</div>
						</div>
					</div>
				</div>
			</section>
			<footer>
				<div id="social">
					<a href="https://www.facebook.com/BiggDiggz" target="_blank" title="Facebook">
						<img src="images/socialmedia/Facebook.png" alt="" />
					</a>
					<a href="https://github.com/braxtondiggs" target="_blank" title="Github">
						<img src="images/socialmedia/Github.png" alt="" style="width: 53px;margin: 0 15px;"/>
					</a>
					<a href="http://instagram.com/biggdiggz" target="_blank" title="Instagram">
						<img src="images/socialmedia/Instagram.png" alt="" />
					</a>
					<a href="http://www.linkedin.com/pub/braxton-diggs/43/b59/643" target="_blank" title="Linked In">
						<img src="images/socialmedia/Linkedin.png" alt="" />
					</a>
					<a href="mailto:braxtondiggs@gmail.com" target="_blank" title="Email">
						<img src="images/socialmedia/Email.png" alt="" />
					</a>
					<a href="http://google.com/+BraxtonDiggs" target="_blank" title="Google+">
						<img src="images/socialmedia/Google.png" alt="" />
					</a>
					
				</div>
				<p style="margin-bottom:15px;">Powered By: <a href="http://ellislab.com/codeigniter" target="_blank">CodeIginiter</a></p>
			</footer>
		</div>
		<script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js"></script>
		<script>window.jQuery || document.write('<script src="<?= base_url('js/vendor/jquery-2.1.0.min.js') ?>"><\/script>')</script>
		<script src="js/main.js"></script>
		<script>
			(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
			(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
			m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
			})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
		      
			ga('create', 'UA-27550048-1', 'braxtondiggs.com');
			ga('send', 'pageview');
		      
		</script>
	</body>
</html>
