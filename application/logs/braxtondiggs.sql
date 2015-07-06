-- phpMyAdmin SQL Dump
-- version 4.0.6
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Mar 16, 2014 at 06:59 PM
-- Server version: 5.5.33
-- PHP Version: 5.5.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `cymbitco_braxtondiggs`
--

-- --------------------------------------------------------

--
-- Table structure for table `news`
--

CREATE TABLE `news` (
  `id` int(7) NOT NULL AUTO_INCREMENT,
  `title` varchar(64) NOT NULL,
  `text` text NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `slug` varchar(64) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Dumping data for table `news`
--

INSERT INTO `news` (`id`, `title`, `text`, `status`, `date`, `slug`) VALUES
(1, 'BraxtonDiggs.com gets a new make over', '<p>The old site design was starting to show its age so it was time to update the site. Look out for new and cool(er) features.</p>', 1, '2011-11-21 22:55:16', 'braxtondiggscom-gets-a-new-make-over'),
(2, 'BraxtonDiggs.com is now opened...', '<p>My online portfolio is available to everybody on the World Wide Web! I have been unusually busy, but I will I have more content on my site, once I it''s uploaded and edited. Hold tight?</p>', 1, '2010-05-03 21:55:02', 'braxtondiggscom-is-now-opened'),
(3, 'CodeIgniter takes over', '<p>I spent the last couple of days converting this flat HTML site into a fast and dynamic PHP Framework machine. <A href="http://ellislab.com/codeigniter">CodeIgniter</a> allows web developers like myself create website extremely fast and easily. It took me no time to convert the site over and now I can spend less time managing the site and more time updating it with glorious content. :-)</p>\n\n<h2>What is CodeIgniter?</h2>\n<p>CodeIgniter is a powerful PHP framework with a very small footprint, built for PHP coders who need a simple and elegant toolkit to create full-featured web applications. If you''re a developer who lives in the real world of shared hosting accounts and clients with deadlines, and if you''re tired of ponderously large and thoroughly undocumented frameworks, then CodeIgniter might be a good fit.</p>\n\n<p>What I enjoyed the most about this process is the <a href="http://getsparks.org/">Sparks</a>. Sparks is a package management system for Codeigniter that will allow you install high-quality libraries into your applications instantly. Check out this video here on using sparks:</p>\n<p><iframe width="560" height="315" src="http://www.youtube.com/embed/S1tnV2uX0-Q" frameborder="0" allowfullscreen></iframe></p>', 1, '2013-01-30 22:53:58', 'codeigniter-takes-over'),
(4, 'I got a mention...', '<p>So my company <a href="http://navigationarts.com">NavigationArts</a> wrote a small tutorial of some of the work I have done in the past. This code that was recently featured on my company''s website pertains to CQ5. One of the clients whom I was working with has a request for a character limit on one their text areas.</p>\n<p>Check out the <a href="http://blog.navigationarts.com/modifying-an-extjs-authoring-interface-in-cq5/">article here</a></p>', 1, '2013-02-06 16:55:21', 'I-got-a-mention');

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` int(7) NOT NULL AUTO_INCREMENT,
  `title` varchar(64) NOT NULL,
  `url` varchar(128) NOT NULL,
  `image` varchar(256) NOT NULL,
  `text` text NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `start_date` date NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=7 ;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `title`, `url`, `image`, `text`, `status`, `start_date`, `date`) VALUES
(1, 'Onederground Dot Com', 'http://onederground.com', 'images/sites/onederground.jpg', '<p>Your #1 source for new DMV music and developments! The site was built around Wordpress Blog/CMS.</p>', -1, '0000-00-00', '2014-03-14 15:12:33'),
(2, 'Dreamweaver-esque Editor', 'http://dev.cymbit.com/playground/native/', 'images/sites/na.jpg', '<p></p>', -1, '0000-00-00', '2014-03-14 15:12:17'),
(3, 'Xatu HTML5 WYSIWYG Editor', 'http://dev.cymbit.com/playground/xatu/', 'images/projects/xatu.jpg', '<p>Xatu is a full featured HTML5 editor much like TinyMCE or CKEditor, but with a different usage paradigm. It expects that an entire page is something that can be editable and uses the HTML5 <a href="https://developer.mozilla.org/en/HTML/Content_Editable">contentEditable</a> features on block elements, instead of iframes, which allows for CSS to be applied in ways that most other editors can''t handle.</p>', 2, '2013-07-23', '2014-03-14 20:43:54'),
(4, 'My Maryland', 'http://mymaryland.net', 'images/projects/mymaryland.jpg', '<p>MyMaryland connects Maryland residents with their elected officials in democracy''s first ongoing open forum. The site is built around Drupal. I developed the landing/coming soon page using HTML5, CSS3, jQuery and AJAX. The site isn''t entirely complete yet, check back later for more updates.</p>', 3, '2013-09-11', '2014-03-14 20:22:45'),
(5, 'Marker Drop', 'http://cymbit.com/maps', 'images/projects/markerdrop.jpg', '<p>Marker Drop is the best online social utility to share and discover unique photos across the world. Find out what is happening around you right now! The entire site has been designed and developed by myself. The site encases HTML5, jQuery, Google Maps API front-end and PHP &amp; MySQL back-end.</p>', 3, '2012-11-26', '2014-03-14 20:34:43'),
(6, 'Cymbit CMS', 'http://cymbit.com', 'images/projects/cymbitcms.jpg', '<p>CymbitCMS is a FREE hosted content management system that''s actually easy to use, fast to setup and doesn''t require programming skills. The entire site &amp; CMS application has been designed and developed by myself. The site encases HTML5, jQuery/AJAX front-end and PHP &amp; MySQL back-end.</p>\r\n', 2, '2013-01-31', '2014-03-14 20:23:05');

-- --------------------------------------------------------

--
-- Table structure for table `tutorials`
--

CREATE TABLE `tutorials` (
  `id` int(7) NOT NULL AUTO_INCREMENT,
  `title` varchar(64) NOT NULL,
  `image` varchar(128) NOT NULL,
  `intro_text` tinytext NOT NULL,
  `text` text NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `slug` varchar(64) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `tutorials`
--

INSERT INTO `tutorials` (`id`, `title`, `image`, `intro_text`, `text`, `status`, `date`, `slug`) VALUES
(1, 'jQuery Textbox Ghost Effect', 'images/thumbs/textbox_ghost.jpg', '<p>The jQuery ghost effect is just a simple placeholder that places text inside your text field/text area and removes the text once the user has placed focus on the field. Simple enough right?</p>', ' <p><a href="../tutorials/demo/ghost_effect/" target="_blank">Click Here</a> to view a live demo</p>\r\n      <h3>The Javascript</h3>\r\n      <pre class="highlight javascript">\r\n$(function() {\r\n	$(''.ghost'').each(function(index) {// Adds the Ghost effect on textbox\r\n    	if ($(this).val() === "" || $(this).val() === $(this).attr("title")) {\r\n        	$(this).attr("value", $(this).attr("title")).css({"color": "#999"});\r\n        }\r\n    });\r\n    $(''.ghost'').on("focusin", function() {\r\n    	if ($(this).val() === $(this).attr("title")) {\r\n        	$(this).val("").css({"color": "#000000"});//Clear text and return normal color\r\n        }\r\n    }).focusout(function() {\r\n    	if ($(this).val() === "") {//Nothing has changed\r\n        	$(this).val($(this).attr("title")).css({"color": "#999"});//return back to ghost state\r\n        }\r\n    });\r\n});\r\n</pre>\r\n<h3>The HTML</h3>\r\n<pre class="highlight html">\r\n&lt;input type="text" class="ghost" id="textfield" title="Ghost Text..." />\r\n</pre>', 1, '2013-02-25 21:13:53', 'jquery-textbox-ghost-effect'),
(2, 'jQuery File Tree Demo', 'images/thumbs/file_tree.jpg', '<p>jQuery File tree is a configurable, AJAX file browser plugin for jQuery. You can create a customized, fully interactive file tree with as little as one line of Javascript code.</p>', '<p>Feel free to view the source code of this page to see how the file tree is being implemted. - <a href="../download/ftpTree.zip" target="_blank">Download source code here.</a><br />jQuery File tree is a configurable, AJAX file browser plugin for jQuery. You can create a customized, fully interactive file tree with as little as one line of Javascript code.</p>\r\n    <p><a href="../tutorials/demo/file_tree/" target="_blank">Click Here</a> to view a live demo</p>\r\n      <h3>index.php</h3>\r\n      <pre class="highlight html">\r\n			.example {\r\n				float: left;\r\n				margin: 15px;\r\n			}\r\n			.demo {\r\n				width: 200px;\r\n				height: 400px;\r\n				border-top: solid 1px #BBB;\r\n				border-left: solid 1px #BBB;\r\n				border-bottom: solid 1px #FFF;\r\n				border-right: solid 1px #FFF;\r\n				background: #FFF;\r\n				overflow: scroll;\r\n				padding: 5px;\r\n			}\r\n		&lt;/style> \r\n		&lt;link href="jqueryFileTree.css" rel="stylesheet" type="text/css" media="screen" />\r\n		&lt;script src="jquery.js" type="text/javascript">&lt;/script>\r\n		&lt;script src="jqueryFileTree.js" type="text/javascript">&lt;/script>\r\n		&lt;script src="jquery.easing.js" type="text/javascript">&lt;/script>\r\n		&lt;script type="text/javascript">\r\n			$(document).ready( function() 	{\r\n				$(''#fileTreeDemo_1'').fileTree({\r\n					root: ''/'', script: ''jqueryFileTree.php'' }, function(file) {\r\n                    	alert(file);\r\n                    });\r\n			});\r\n		&lt;/script>\r\n	&lt;/head>\r\n	&lt;body>\r\n		&lt;div class="example"> \r\n			&lt;div id="fileTreeDemo_1" class="demo">&lt;/div>\r\n		&lt;/div>\r\n      </pre>\r\n <h3>jqueryFileTree.php</h3>    \r\n <pre class="highlight php">\r\n&lt;?php\r\n/*\r\n	** jQuery File Tree PHP/FTP Connector\r\n	** Braxton Diggs\r\n	** Cymbit CMS (http://cymbit.com/)\r\n	** 17 Feb. 2010\r\n*/\r\n\r\n$SiteError="false";\r\n// set up a connection or die\r\n$conn_id = @ftp_connect($_GET[''Server'']) or $SiteError="true";\r\n\r\n// try to login\r\nif (@ftp_login($conn_id, $_GET[''Username''], $_GET[''Password''])) {\r\n\r\n// turn passive mode on\r\nftp_pasv($conn_id, true);\r\n\r\n$_POST[''dir''] = urldecode($_POST[''dir'']);\r\n$ftp_nlist = @ftp_nlist($conn_id, $_POST[''dir'']); \r\n\r\nsort($ftp_nlist);\r\necho "&lt;ul class=\\"jqueryFileTree\\" style=\\"display: none;\\">";\r\nforeach ($ftp_nlist as $folder) {\r\n\r\n//1. Size is ''-1'' => directory\r\n  if (@ftp_size($conn_id, $_POST[''dir''].$folder) == ''-1'' && $folder !== "." && $folder !== "..") {\r\n//output as [ directory ]\r\n      echo "&lt;li class=\\"directory collapsed\\">&lt;a href=\\"$folder\\" rel=\\"" .$_POST[''dir'']. htmlentities($folder) . "/\\">" . htmlentities($folder) . "&lt;/a>&lt;/li>";\r\n  }\r\n}\r\nforeach ($ftp_nlist as $file) {\r\n\r\n//2. Size is not ''-1'' => file\r\n  if (!(@ftp_size($conn_id, $_POST[''dir''].$file) == ''-1'')) {\r\n\r\n//output as file\r\n		 $ext = preg_replace(''/^.*\\./'', '''', $file);\r\n      echo "&lt;li class=\\"file ext_$ext\\">&lt;a href=\\"" . htmlentities($file) . "\\" rel=\\"" .$_POST[''dir'']. htmlentities($file) . "\\">" . htmlentities($file) . "&lt;/a>&lt;/li>";\r\n  }\r\n}\r\n\r\n echo "&lt;/ul>";\r\n } else {\r\nif($SiteError=="false") {\r\n	echo "Incorrect login info.";\r\n}else{\r\necho ''&lt;p>&lt;strong>Connection Refused&lt;/strong>&lt;/p>\r\n&lt;p>The site would not let us connect&lt;br />\r\nThe site &lt;i>''.$_GET[''Server''].''&lt;/i> may have moved, been deleted or have inappropriate permissions.&lt;/p>'';\r\n}}\r\n//make sure you close connection\r\nftp_close($conn_id);\r\n?>\r\n</pre>', 1, '2013-02-25 21:14:00', 'jquery-file-tree-demo'),
(3, 'Perfect PHP Pagination', 'images/thumbs/php_pagination.jpg', '<p>Did you know that PHP has the ability to dynamically create images? I have tapped into these resources to bring you a unique pagination solution. I''ve always been disgruntled with the current offerings, so I offer an outside the box solution.</p>', '<p>Did you know that PHP has the ability to dynamically create images? I have tapped into these resources to bring you a revolutionary Pagination. I''ve always been disgruntled with the current offerings, so I offer an improved solution. Click to <a href="../download/Pagination.zip" target="_blank">download the source code!</a></p>\r\n      <p><a href="../tutorials/demo/php_pagination/" target="_blank">Click Here</a> to view a live demo</p>\r\n      <h3>JavaScript Snippet</h3>\r\n<pre class="highlight javascript">\r\n&lt;script type="text/javascript">\r\n	//Javascript - Calls the dynamic PHP image generator\r\n	function mouseFunction(img, type){document.getElementById(img).src ="image.php?cp="+img+"&id="+type;}\r\n&lt;/script>\r\n</pre>\r\n  <h3>index.php</h3>\r\n<pre class="highlight php">\r\n&lt;?php\r\n	$default = $_GET[''dt''];\r\n	if (!$default) $default = 1;\r\n	//Set Total number of pages - Default is 5\r\n	$totalpgs = 5;$currentpage = 1;$prevpg = $default-1;\r\n	echo "&lt;table border=\\"0\\">&lt;tr>";\r\n	if ($default != 1) {\r\n		echo ''&lt;td>&lt;a href="index.php?dt=''.$prevpg.''" onmouseover="mouseFunction(\\''-1\\'', \\''over\\'')" onmouseout="mouseFunction(\\''-1\\'', \\''out\\'')">&lt;img border="0" src="image.php?cp=-1" id="-1" />&lt;/a>&lt;/td>'';\r\n	}\r\n	for ($i = 1; $i <= $totalpgs; $i++) {\r\n		if ($currentpage == $default) {\r\n			echo''&lt;td>&lt;img src="image.php?cp=''.$currentpage.''&ty=selected" />&lt;/td>'';\r\n			$nxtpg = $currentpage+1;\r\n		}else{\r\n			echo ''&lt;td>va href="index.php?dt=''.$currentpage.''" onmouseover="mouseFunction(\\''''.$currentpage.''\\'', \\''over\\'')" onmouseout="mouseFunction(\\''''.$currentpage.''\\'', \\''out\\'')">&lt;img border="0" src="image.php?cp=''.$currentpage.''" id="''.$currentpage.''" />&lt;/a>&lt;/td>'';\r\n		}\r\n		$currentpage++;\r\n	}\r\n	if ($currentpage !== $nxtpg) {\r\n		echo ''&lt;td>&lt;a href="index.php?dt=''.$nxtpg.''" onmouseover="mouseFunction(\\''0\\'', \\''over\\'')" onmouseout="mouseFunction(\\''0\\'', \\''out\\'')">&lt;img border="0" src="image.php?cp=0" id="0" />&lt;/a>&lt;/td>'';\r\n	}\r\necho "&lt;/tr>&lt;/table>";\r\n?>\r\n</pre>\r\n<h3>image.php</h3>\r\n<pre class="highlight php">\r\n&lt;?php\r\n//Get passed values from main page\r\n$value = $_GET[''cp''];\r\n$type = $_GET[''id''];\r\n\r\n//Adjusts image size to fit ''Prev'' and ''Next'' Tabs\r\nif ($value == 0 || $value == -1) {$width = 50;}else{$width = 20;}\r\n\r\n$my_img = imagecreate($width, 25);\r\n//Adds RBG color to the diffrent types of images\r\n//Default is everything that isn''t selected or hovered\r\nswitch ($type) {\r\n	case "over":\r\n		$background = imagecolorallocate( $my_img, 0, 89, 179 );\r\n		$text_color = imagecolorallocate( $my_img, 0, 0, 0 );\r\n		$border_color = imagecolorallocate($my_img, 0, 0, 0);\r\n		break;\r\n	case "selected":\r\n		$background = imagecolorallocate( $my_img, 209, 209, 209 );\r\n		$text_color = imagecolorallocate( $my_img, 0, 0, 0 );	\r\n		$border_color = imagecolorallocate($my_img, 168, 168, 168);\r\n	default:\r\n		$background = imagecolorallocate( $my_img, 255, 255, 255 );\r\n		$text_color = imagecolorallocate( $my_img, 50, 50, 255 );\r\n		$border_color = imagecolorallocate($my_img, 168, 168, 168);\r\n}\r\n\r\n//Adds text to the image based on imported value, variable $value\r\nswitch ($value) {\r\n	case -1:\r\n		imagestring( $my_img, 3, 6, 6, "< Prev", $text_color );\r\n		break;\r\n	case 0:\r\n		imagestring( $my_img, 3, 6, 6, "Next >", $text_color );\r\n		break;\r\n	default:\r\n		imagestring( $my_img, 4, 6, 5, $value, $text_color );\r\n}\r\n\r\n//Finishes up createing the image \r\nimagesetthickness ( $my_img, 2 );\r\nimagerectangle($my_img, -1, 0, $width, 24, $border_color);\r\nheader( "Content-type: image/png" );\r\nimagepng( $my_img );\r\nimagecolordeallocate( $text_color );\r\nimagecolordeallocate( $background );\r\nimagedestroy( $my_img );\r\n?></pre>', 1, '2013-02-25 21:14:07', 'perfect-php-pagination');
