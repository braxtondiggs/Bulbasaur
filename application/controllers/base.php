<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Base extends CI_Controller {
	public function index(){
		$this->load->model('projects_model');
		$data = array('projects' => $this->projects_model->get_projects());
		$this->load->view('home', $data);
	}
	public function email(){
		if(!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && !empty($_POST) &&strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
			require_once("../PHPMailer/class.phpmailer.php");
			$name = filter_var($_POST['name'], FILTER_SANITIZE_STRING);
			$email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
			$message = filter_var($_POST['message'], FILTER_SANITIZE_STRING);
			$date = date( 'Y-m-d H:i:s');
			$mail = new PHPMailer(); // defaults to using php "mail()"
		
			$mail->IsSendmail(); // telling the class to use SendMail transport
			$body ='<p>You have a new message from BraxtonoDiggs.com:</p><p>'.$message."</p><p>Respond to:".$name." at ".$email;
			$mail->AddReplyTo($email,$name);
			$mail->SetFrom('admin@braxtondiggs.com', 'BD Server');
			$mail->AddAddress("braxtondiggs@gmail.com", "Braxton Diggs");
		
			$mail->Subject = "BraxtonDiggs.com:".substr($message, 0, 10)."...";
			$mail->MsgHTML($body);
			$mail->Send();
		}
	}
}